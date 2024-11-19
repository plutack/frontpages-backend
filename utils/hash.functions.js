import { createHash } from "crypto";

// convert image to data url string via link to image
export async function urlToBase64(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("failed to get image");
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer.toString("base64");
}

// get hash from data url string
export async function calculateHash(dataUrlString) {
  const hash = createHash("SHA-256");
  hash.update(dataUrlString);
  return hash.digest("hex");
}

export function compareHash(firstHash, secondHash) {
  if (firstHash === secondHash) {
    return true;
  }
  return false;
}
