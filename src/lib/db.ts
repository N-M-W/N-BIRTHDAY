import initSqlJs, { Database as SqlJsDatabase } from "sql.js";
import path from "path";
import fs from "fs";

const DB_PATH = path.join(process.cwd(), "data", "gifts.db");

let db: SqlJsDatabase | null = null;
let sqlReady: Promise<void> | null = null;

function saveDb() {
  if (db) {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const data = db.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
  }
}

async function initDb(): Promise<SqlJsDatabase> {
  if (db) return db;

  const wasmPath = path.join(
    process.cwd(),
    "node_modules",
    "sql.js",
    "dist",
    "sql-wasm.wasm"
  );
  const wasmBinary = fs.readFileSync(wasmPath);
  const SQL = await initSqlJs({ wasmBinary });

  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // Create table if not exists
  db.run(`
    CREATE TABLE IF NOT EXISTS claims (
      gift_id TEXT PRIMARY KEY,
      claimed_by TEXT NOT NULL,
      claimed_at TEXT DEFAULT (datetime('now'))
    )
  `);
  saveDb();

  return db;
}

function getDbReady(): Promise<SqlJsDatabase> {
  if (!sqlReady) {
    sqlReady = initDb().then(() => {});
  }
  return sqlReady.then(() => db!);
}

export interface ClaimRow {
  gift_id: string;
  claimed_by: string;
  claimed_at: string;
}

export async function getAllClaims(): Promise<Record<string, string>> {
  const db = await getDbReady();
  const results = db.exec("SELECT gift_id, claimed_by FROM claims");
  const claims: Record<string, string> = {};
  if (results.length > 0) {
    for (const row of results[0].values) {
      claims[row[0] as string] = row[1] as string;
    }
  }
  return claims;
}

export async function claimGift(giftId: string, name: string): Promise<boolean> {
  const db = await getDbReady();
  try {
    db.run("INSERT INTO claims (gift_id, claimed_by) VALUES (?, ?)", [giftId, name]);
    saveDb();
    return true;
  } catch {
    // Already claimed (PRIMARY KEY conflict)
    return false;
  }
}

export async function unclaimGift(giftId: string): Promise<boolean> {
  const db = await getDbReady();
  const before = db.getRowsModified();
  db.run("DELETE FROM claims WHERE gift_id = ?", [giftId]);
  const after = db.getRowsModified();
  saveDb();
  return after > 0;
}
