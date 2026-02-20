/**
 * React Hook for Secrets Vault
 * Andre Philippe AI Team
 * 
 * Manages encrypted secrets in localStorage
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  Secret, 
  SecretMetadata, 
  SecretProvider, 
  UseSecretsReturn,
  getDefaultModel,
  maskSecret
} from '@/types/secrets';
import { 
  encrypt, 
  decrypt, 
  hashPassword, 
  verifyPassword,
  generateId,
} from '@/lib/crypto';

const VAULT_KEY = 'ai-team-secrets-vault';
const MASTER_HASH_KEY = 'ai-team-master-hash';

export function useSecrets(): UseSecretsReturn {
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [masterPassword, setMasterPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasVault, setHasVault] = useState(false);

  // Check if vault exists on mount
  useEffect(() => {
    const vaultData = localStorage.getItem(VAULT_KEY);
    const masterHash = localStorage.getItem(MASTER_HASH_KEY);
    setHasVault(!!vaultData && !!masterHash);
    setIsLoading(false);
  }, []);

  // Load secrets when unlocked
  const loadSecrets = useCallback((password: string) => {
    try {
      const vaultData = localStorage.getItem(VAULT_KEY);
      if (!vaultData) return [];
      
      const decrypted = decrypt(vaultData, password);
      return JSON.parse(decrypted) as Secret[];
    } catch (error) {
      console.error('Failed to load secrets:', error);
      return null;
    }
  }, []);

  // Save secrets to localStorage
  const saveSecrets = useCallback((newSecrets: Secret[], password: string) => {
    try {
      const encrypted = encrypt(JSON.stringify(newSecrets), password);
      localStorage.setItem(VAULT_KEY, encrypted);
      return true;
    } catch (error) {
      console.error('Failed to save secrets:', error);
      return false;
    }
  }, []);

  // Setup new vault
  const setupVault = useCallback((password: string) => {
    const hash = hashPassword(password);
    localStorage.setItem(MASTER_HASH_KEY, hash);
    saveSecrets([], password);
    setMasterPassword(password);
    setSecrets([]);
    setIsUnlocked(true);
    setHasVault(true);
  }, [saveSecrets]);

  // Unlock vault
  const unlock = useCallback((password: string): boolean => {
    const masterHash = localStorage.getItem(MASTER_HASH_KEY);
    if (!masterHash) return false;

    if (!verifyPassword(password, masterHash)) {
      return false;
    }

    const loaded = loadSecrets(password);
    if (loaded === null) return false;

    setMasterPassword(password);
    setSecrets(loaded);
    setIsUnlocked(true);
    return true;
  }, [loadSecrets]);

  // Lock vault
  const lock = useCallback(() => {
    setMasterPassword('');
    setSecrets([]);
    setIsUnlocked(false);
  }, []);

  // Add new secret
  const addSecret = useCallback((
    name: string, 
    value: string, 
    provider: SecretProvider,
    defaultModel: string,
    customEndpoint?: string,
    description?: string
  ) => {
    if (!isUnlocked || !masterPassword) return;

    const newSecret: Secret = {
      id: generateId(),
      name,
      value: encrypt(value, masterPassword),
      provider,
      defaultModel: defaultModel || getDefaultModel(provider),
      customEndpoint,
      description,
      createdAt: new Date(),
      usageCount: 0,
    };

    const updated = [...secrets, newSecret];
    if (saveSecrets(updated, masterPassword)) {
      setSecrets(updated);
    }
  }, [isUnlocked, masterPassword, secrets, saveSecrets]);

  // Get secret value (decrypted)
  const getSecret = useCallback((id: string): string | null => {
    if (!isUnlocked || !masterPassword) return null;

    const secret = secrets.find(s => s.id === id);
    if (!secret) return null;

    try {
      const decrypted = decrypt(secret.value, masterPassword);
      
      // Update usage stats
      const updated = secrets.map(s => 
        s.id === id 
          ? { ...s, usageCount: s.usageCount + 1, lastUsed: new Date() }
          : s
      );
      saveSecrets(updated, masterPassword);
      setSecrets(updated);
      
      return decrypted;
    } catch (error) {
      console.error('Failed to decrypt secret:', error);
      return null;
    }
  }, [isUnlocked, masterPassword, secrets, saveSecrets]);

  // Delete secret
  const deleteSecret = useCallback((id: string) => {
    if (!isUnlocked || !masterPassword) return;

    const updated = secrets.filter(s => s.id !== id);
    if (saveSecrets(updated, masterPassword)) {
      setSecrets(updated);
    }
  }, [isUnlocked, masterPassword, secrets, saveSecrets]);

  // Update secret
  const updateSecret = useCallback((id: string, updates: Partial<Secret>) => {
    if (!isUnlocked || !masterPassword) return;

    const updated = secrets.map(s => {
      if (s.id !== id) return s;
      
      // If value is being updated, encrypt it
      const newValue = updates.value 
        ? encrypt(updates.value, masterPassword)
        : s.value;
        
      return { ...s, ...updates, value: newValue };
    });
    
    if (saveSecrets(updated, masterPassword)) {
      setSecrets(updated);
    }
  }, [isUnlocked, masterPassword, secrets, saveSecrets]);

  // Get metadata (without decrypting values)
  const secretsMetadata: SecretMetadata[] = secrets.map(s => ({
    id: s.id,
    name: s.name,
    provider: s.provider,
    defaultModel: s.defaultModel,
    customEndpoint: s.customEndpoint,
    description: s.description,
    createdAt: s.createdAt,
    lastUsed: s.lastUsed,
    usageCount: s.usageCount,
    maskedValue: maskSecret(decrypt(s.value, masterPassword)),
  }));

  return {
    secrets: secretsMetadata,
    isUnlocked,
    isLoading,
    addSecret,
    getSecret,
    deleteSecret,
    updateSecret,
    unlock,
    lock,
    setupVault,
    hasVault,
  };
}
