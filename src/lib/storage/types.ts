export type StoredFile = {
  key: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
};

export interface FileStorage {
  put(input: {
    key: string;
    bytes: Buffer;
    mimeType: string;
  }): Promise<{ key: string }>;
  get(key: string): Promise<Buffer>;
  delete(key: string): Promise<void>;
}
