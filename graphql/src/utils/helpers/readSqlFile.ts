import fs from "fs";

export const readSqlFile = (filepath: string) =>
  fs
    .readFileSync(filepath)
    .toString()
    .replace(/\r?\n|\r/g, "");
