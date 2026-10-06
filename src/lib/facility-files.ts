export const MAX_FACILITY_FILE_BYTES = 50 * 1024 * 1024;

const ALLOWED = [
  { ext: "pdf", mimes: ["application/pdf"] },
  { ext: "png", mimes: ["image/png"] },
  { ext: "jpg", mimes: ["image/jpeg"] },
  { ext: "jpeg", mimes: ["image/jpeg"] },
  { ext: "webp", mimes: ["image/webp"] },
  { ext: "heic", mimes: ["image/heic", "image/heif"] },
  { ext: "heif", mimes: ["image/heif", "image/heic"] },
  { ext: "tif", mimes: ["image/tiff"] },
  { ext: "tiff", mimes: ["image/tiff"] },
] as const;

export const FACILITY_FILE_ACCEPT =
  ".pdf,.png,.jpg,.jpeg,.webp,.heic,.heif,.tif,.tiff,application/pdf,image/png,image/jpeg,image/webp,image/tiff";

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function facilityFileError(file: { name: string; size: number; type: string }) {
  if (file.size <= 0) return "Choose a file that is not empty.";
  if (file.size > MAX_FACILITY_FILE_BYTES) {
    return `${file.name} is over the 50 MB limit.`;
  }

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  const allowed = ALLOWED.find((item) => item.ext === extension);
  if (!allowed) {
    return `${file.name} must be a PDF or an image (PNG, JPEG, WEBP, HEIC, or TIFF).`;
  }

  const mime = file.type.toLowerCase();
  const mimes: readonly string[] = allowed.mimes;
  if (mime && mime !== "application/octet-stream" && !mimes.includes(mime)) {
    return `${file.name} does not match an allowed file type.`;
  }

  return null;
}
