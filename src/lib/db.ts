import path from "path";
import fs from "fs";

// On Vercel serverless, the project root is read-only; use /tmp for persistence
// within the same function instance. Locally, use data/ in the project root.
const isVercel = !!process.env.VERCEL;
const DATA_DIR = isVercel ? "/tmp" : path.join(process.cwd(), "data");
const CLAIMS_FILE = path.join(DATA_DIR, "claims.json");

type ClaimsMap = Record<string, string>;

function readClaims(): ClaimsMap {
  try {
    if (fs.existsSync(CLAIMS_FILE)) {
      const raw = fs.readFileSync(CLAIMS_FILE, "utf-8");
      return JSON.parse(raw) as ClaimsMap;
    }
  } catch {
    // If the file is corrupt, start fresh
  }
  return {};
}

function writeClaims(claims: ClaimsMap): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(CLAIMS_FILE, JSON.stringify(claims, null, 2), "utf-8");
}

export interface ClaimRow {
  gift_id: string;
  claimed_by: string;
}

export async function getAllClaims(): Promise<ClaimsMap> {
  return readClaims();
}

export async function claimGift(giftId: string, name: string): Promise<boolean> {
  const claims = readClaims();
  if (claims[giftId]) {
    // Already claimed
    return false;
  }
  claims[giftId] = name;
  writeClaims(claims);
  return true;
}

export async function unclaimGift(giftId: string): Promise<boolean> {
  const claims = readClaims();
  if (!claims[giftId]) {
    return false;
  }
  delete claims[giftId];
  writeClaims(claims);
  return true;
}
