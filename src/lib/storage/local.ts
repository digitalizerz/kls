import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import type { FileStorage } from "./types";

const root = path.join(process.cwd(), "uploads");

export const localFileStorage: FileStorage = {
  async put({ key, bytes }) {
    const filePath = path.join(root, key);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, bytes);
    return { key };
  },
  async get(key) {
    return readFile(path.join(root, key));
  },
  async delete(key) {
    await unlink(path.join(root, key));
  },
};
