import fs from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";

import { encryptBuffer } from "../encryption/aes";
import { calculateSHA256 } from "../hash/sha256";

export interface UploadResult {
  storedName: string;
  filePath: string;
  hash: string;
  encrypted: boolean;
  iv?: string;
}

export async function saveUploadedFile(
  fileBuffer: Buffer,
  originalName: string,
  encrypt: boolean
): Promise<UploadResult> {
  const extension = path.extname(originalName);

  const id = uuid();

  const hash = calculateSHA256(fileBuffer);

  if (encrypt) {
    const { encrypted: encryptedBuffer, iv } =
      encryptBuffer(fileBuffer);

    const storedName = `${id}.enc`;

    const filePath = path.join(
      process.cwd(),
      "uploads",
      "encrypted",
      storedName
    );

    await fs.writeFile(filePath, encryptedBuffer);

    return {
      storedName,
      filePath,
      hash,
      encrypted: true,
      iv: iv.toString("hex"),
    };
  }

  const storedName = `${id}${extension}`;

  const filePath = path.join(
    process.cwd(),
    "uploads",
    "plain",
    storedName
  );

  await fs.writeFile(filePath, fileBuffer);

  return {
    storedName,
    filePath,
    hash,
    encrypted: false,
  };
}