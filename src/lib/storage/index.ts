import { localFileStorage } from "./local";
import type { FileStorage } from "./types";

export function getFileStorage(): FileStorage {
  const driver = process.env.FILE_STORAGE_DRIVER ?? "local";

  switch (driver) {
    case "local":
      return localFileStorage;
    default:
      // Production facility documents should use an S3-compatible driver here.
      // The local driver writes files under ./uploads and is not served publicly.
      return localFileStorage;
  }
}

export function buildStorageKey(parts: string[]) {
  const stamp = Date.now();
  return [...parts.map(sanitize), String(stamp)].join("/");
}

function sanitize(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]+/g, "-");
}
