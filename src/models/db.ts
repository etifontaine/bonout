import { readFile } from "fs/promises";
import { resolve } from "path";
import type { BoDB } from "../types";

export async function getDB(): Promise<BoDB> {
  const DB = await readFile(
    resolve("./src/models/db.json")
  );
  return JSON.parse(DB.toString());
}
