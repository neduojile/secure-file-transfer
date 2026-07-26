import crypto from "crypto";

/**
 * Calculate the SHA-256 hash of a buffer.
 *
 * @param buffer The file buffer.
 * @returns SHA-256 hash as a hexadecimal string.
 */
export function calculateSHA256(buffer: Buffer): string {
  return crypto
    .createHash("sha256")
    .update(buffer)
    .digest("hex");
}