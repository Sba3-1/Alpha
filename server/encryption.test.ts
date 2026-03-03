import { describe, it, expect } from 'vitest';
import { encryptToken, decryptToken, verifyEncryptedToken } from './encryption';

describe('Encryption System', () => {
  it('should encrypt and decrypt a token correctly', () => {
    const originalToken = 'MTk4NzY1NDMyMDk4Nzc2NTQzMjA5ODc3NjU0MzIwOTg3Nzc2NTQzMjA5ODc3';
    
    const encrypted = encryptToken(originalToken);
    expect(encrypted).toBeDefined();
    expect(typeof encrypted).toBe('string');
    expect(encrypted).not.toBe(originalToken);
    
    const decrypted = decryptToken(encrypted);
    expect(decrypted).toBe(originalToken);
  });

  it('should produce different encrypted outputs for the same token', () => {
    const token = 'test-bot-token-12345';
    
    const encrypted1 = encryptToken(token);
    const encrypted2 = encryptToken(token);
    
    // Due to random IV, encrypted outputs should be different
    expect(encrypted1).not.toBe(encrypted2);
    
    // But both should decrypt to the same value
    expect(decryptToken(encrypted1)).toBe(token);
    expect(decryptToken(encrypted2)).toBe(token);
  });

  it('should handle long tokens correctly', () => {
    const longToken = 'a'.repeat(1000);
    
    const encrypted = encryptToken(longToken);
    const decrypted = decryptToken(encrypted);
    
    expect(decrypted).toBe(longToken);
  });

  it('should verify encrypted tokens correctly', () => {
    const token = 'valid-bot-token';
    const encrypted = encryptToken(token);
    
    expect(verifyEncryptedToken(encrypted)).toBe(true);
  });

  it('should fail verification for corrupted encrypted tokens', () => {
    const token = 'valid-bot-token';
    const encrypted = encryptToken(token);
    
    // Corrupt the encrypted token
    const corrupted = encrypted.slice(0, -5) + 'xxxxx';
    
    expect(verifyEncryptedToken(corrupted)).toBe(false);
  });

  it('should fail decryption for invalid base64', () => {
    expect(() => {
      decryptToken('not-valid-base64!!!');
    }).toThrow();
  });

  it('should handle special characters in tokens', () => {
    const specialToken = 'token-with-!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    const encrypted = encryptToken(specialToken);
    const decrypted = decryptToken(encrypted);
    
    expect(decrypted).toBe(specialToken);
  });

  it('should handle empty string tokens', () => {
    const emptyToken = '';
    
    const encrypted = encryptToken(emptyToken);
    const decrypted = decryptToken(encrypted);
    
    expect(decrypted).toBe(emptyToken);
  });
});
