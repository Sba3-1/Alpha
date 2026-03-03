import crypto from 'crypto';
import { ENV } from './_core/env';

/**
 * Encryption system for secure bot token storage
 * Uses AES-256-GCM for authenticated encryption
 */

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // 128 bits
const AUTH_TAG_LENGTH = 16; // 128 bits

/**
 * Derive a consistent encryption key from the JWT_SECRET
 */
function getEncryptionKey(): Buffer {
  const secret = ENV.cookieSecret || 'default-secret-key';
  // Use SHA-256 to derive a consistent 32-byte key from the secret
  return crypto.createHash('sha256').update(secret).digest();
}

/**
 * Encrypt a bot token
 * @param token - The plaintext bot token
 * @returns Base64-encoded encrypted token with IV and auth tag
 */
export function encryptToken(token: string): string {
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(token, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    // Combine: IV (hex) + authTag (hex) + encrypted (hex)
    const combined = iv.toString('hex') + authTag.toString('hex') + encrypted;
    
    // Return as base64 for safe storage
    return Buffer.from(combined, 'hex').toString('base64');
  } catch (error) {
    console.error('[Encryption] Failed to encrypt token:', error);
    throw new Error('Token encryption failed');
  }
}

/**
 * Decrypt a bot token
 * @param encryptedToken - Base64-encoded encrypted token
 * @returns The plaintext bot token
 */
export function decryptToken(encryptedToken: string): string {
  try {
    const key = getEncryptionKey();
    
    // Decode from base64
    const combined = Buffer.from(encryptedToken, 'base64').toString('hex');
    
    // Extract components
    const iv = Buffer.from(combined.slice(0, IV_LENGTH * 2), 'hex');
    const authTag = Buffer.from(combined.slice(IV_LENGTH * 2, IV_LENGTH * 2 + AUTH_TAG_LENGTH * 2), 'hex');
    const encrypted = combined.slice(IV_LENGTH * 2 + AUTH_TAG_LENGTH * 2);
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('[Encryption] Failed to decrypt token:', error);
    throw new Error('Token decryption failed');
  }
}

/**
 * Verify that an encrypted token can be decrypted (integrity check)
 * @param encryptedToken - Base64-encoded encrypted token
 * @returns true if token can be decrypted successfully
 */
export function verifyEncryptedToken(encryptedToken: string): boolean {
  try {
    decryptToken(encryptedToken);
    return true;
  } catch {
    return false;
  }
}
