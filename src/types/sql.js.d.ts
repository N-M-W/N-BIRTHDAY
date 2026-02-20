declare module "sql.js" {
  interface Database {
    run(sql: string, params?: any[]): Database;
    exec(sql: string, params?: any[]): { columns: string[]; values: any[][] }[];
    export(): Uint8Array;
    close(): void;
    getRowsModified(): number;
    prepare(sql: string): Statement;
  }

  interface Statement {
    bind(params?: any[]): boolean;
    step(): boolean;
    getAsObject(params?: any): Record<string, any>;
    get(params?: any[]): any[];
    free(): boolean;
    reset(): void;
  }

  interface SqlJsStatic {
    Database: new (data?: ArrayLike<number> | Buffer | null) => Database;
  }

  interface InitSqlJsOptions {
    wasmBinary?: ArrayLike<number> | Buffer;
    locateFile?: (filename: string) => string;
  }

  export default function initSqlJs(options?: InitSqlJsOptions): Promise<SqlJsStatic>;
  export { Database };
}
