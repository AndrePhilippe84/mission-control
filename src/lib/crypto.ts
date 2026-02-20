/**
 * Crypto Utilities for Secrets Vault
 * Andre Philippe AI Team - Dashboard Security
 * 
 * Uses AES-256 encryption with user-provided master password
 */

import CryptoJS from 'crypto-js';

const SALT_KEY = 'ai-team-secrets-salt-v1';

/**
 * Derive encryption key from master password
 */
export function deriveKey(password: string): string {
  // Use PBKDF2-like approach with multiple iterations
  let key = password + SALT_KEY;
  for (let i = 0; i < 1000; i++) {
    key = CryptoJS.SHA256(key).toString();
  }
  return key;
}

/**
 * Encrypt text using AES-256-CBC
 * Stores IV + ciphertext together for proper decryption
 */
export function encrypt(text: string, password: string): string {
  try {
    const key = deriveKey(password);
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(text, key, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      iv: iv,
    });
    // Store IV + ciphertext together (format: base64(iv):ciphertext)
    const result = iv.toString(CryptoJS.enc.Base64) + ':' + encrypted.toString();
    return result;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt secret');
  }
}

/**
 * Decrypt text using AES-256-CBC
 * Supports new format (IV:ciphertext) and legacy format
 */
export function decrypt(ciphertext: string, password: string): string {
  try {
    const key = deriveKey(password);
    
    // Check if using new format (IV:ciphertext)
    const parts = ciphertext.split(':');
    if (parts.length === 2) {
      // New format with IV
      const iv = CryptoJS.enc.Base64.parse(parts[0]);
      const encrypted = parts[1];
      
      const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
        iv: iv,
      });
      return decrypted.toString(CryptoJS.enc.Utf8);
    } else {
      // Legacy format (backward compatibility)
      const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      return decrypted.toString(CryptoJS.enc.Utf8);
    }
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt secret - wrong password?');
  }
}

/**
 * Hash password for verification (not for encryption)
 */
export function hashPassword(password: string): string {
  return CryptoJS.SHA256(password + SALT_KEY).toString();
}

/**
 * Verify password against hash
 */
export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

/**
 * Generate secure random ID
 * Uses crypto.randomUUID() when available, fallback for older browsers
 */
export function generateId(): string {
  // Use modern crypto.randomUUID if available
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback for older browsers (Safari < 15.4, IE)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
