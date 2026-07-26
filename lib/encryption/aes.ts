import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const KEY = crypto
  .createHash("sha256")
  .update(process.env.ENCRYPTION_KEY || "")
  .digest();

export function encryptBuffer(buffer: Buffer) {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

  const encrypted = Buffer.concat([
    cipher.update(buffer),
    cipher.final(),
  ]);

  return {
    iv,
    encrypted,
  };
}

export function decryptBuffer(
  encrypted: Buffer,
  iv: Buffer
) {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    KEY,
    iv
  );

  return Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
}