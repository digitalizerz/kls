import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import type { FileStorage } from "./types";

const root = path.resolve(process.cwd(), "uploads");

function resolveInsideRoot(key: string) {
  const filePath = path.resolve(root, key);
  if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
    throw new Error("Invalid storage path.");
  }
  return filePath;
}

export const localFileStorage: FileStorage = {
  async put({ key, bytes }) {
    const filePath = resolveInsideRoot(key);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, bytes);
    return { key };
  },
  async get(key) {
    return readFile(resolveInsideRoot(key));
  },
  async delete(key) {
    await unlink(resolveInsideRoot(key));
  },
};
