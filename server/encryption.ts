import crypto from "crypto";

// Use a strong key from environment or generate one
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString("hex");
const ALGORITHM = "aes-256-cbc";

/**
 * Encrypt a Discord bot token
 */
export function encryptToken(token: string): string {
  try {
    const iv = crypto.randomBytes(16);
    const key = Buffer.from(ENCRYPTION_KEY, "hex");
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(token, "utf-8", "hex");
    encrypted += cipher.final("hex");

    // Return IV + encrypted token
    return iv.toString("hex") + ":" + encrypted;
  } catch (error) {
    console.error("[Encryption] Failed to encrypt token:", error);
    throw new Error("Failed to encrypt token");
  }
}

/**
 * Decrypt a Discord bot token
 */
export function decryptToken(encryptedData: string): string {
  try {
    const parts = encryptedData.split(":");
    if (parts.length !== 2) {
      throw new Error("Invalid encrypted data format");
    }

    const iv = Buffer.from(parts[0], "hex");
    const encrypted = parts[1];
    const key = Buffer.from(ENCRYPTION_KEY, "hex");

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf-8");
    decrypted += decipher.final("utf-8");

    return decrypted;
  } catch (error) {
    console.error("[Encryption] Failed to decrypt token:", error);
    throw new Error("Failed to decrypt token");
  }
}

/**
 * Mask a token for display (show only first and last 4 characters)
 */
export function maskToken(token: string): string {
  if (token.length <= 8) {
    return "****";
  }
  return token.substring(0, 4) + "****" + token.substring(token.length - 4);
}
