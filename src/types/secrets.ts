/**
 * Types for Secrets Vault - Updated with Model Selection
 * Andre Philippe AI Team
 */

export type SecretProvider = 
  | 'openai'
  | 'anthropic' 
  | 'glm'
  | 'moonshot'
  | 'google'
  | 'azure'
  | 'custom';

export interface Secret {
  id: string;
  name: string;
  value: string; // Encrypted value
  provider: SecretProvider;
  defaultModel: string; // Default model for this provider
  customEndpoint?: string; // Optional custom endpoint
  description?: string;
  createdAt: Date;
  lastUsed?: Date;
  usageCount: number;
}

export interface SecretMetadata {
  id: string;
  name: string;
  provider: SecretProvider;
  defaultModel: string;
  customEndpoint?: string;
  description?: string;
  createdAt: Date;
  lastUsed?: Date;
  usageCount: number;
  maskedValue: string;
}

export interface VaultState {
  isUnlocked: boolean;
  secrets: Secret[];
  masterPasswordHash?: string;
}

export interface UseSecretsReturn {
  secrets: SecretMetadata[];
  isUnlocked: boolean;
  isLoading: boolean;
  addSecret: (name: string, value: string, provider: SecretProvider, defaultModel: string, customEndpoint?: string, description?: string) => void;
  getSecret: (id: string) => string | null;
  deleteSecret: (id: string) => void;
  updateSecret: (id: string, updates: Partial<Secret>) => void;
  unlock: (password: string) => boolean;
  lock: () => void;
  setupVault: (password: string) => void;
  hasVault: boolean;
}

// Models available for each provider - UPDATED with working Claude models
export const PROVIDER_MODELS: Record<SecretProvider, string[]> = {
  openai: [
    'gpt-4o-2024-08-06',
    'gpt-4o',
    'o1-2024-12-17',
    'o1',
    'o3-mini',
    'gpt-4-turbo',
    'gpt-3.5-turbo',
  ],
  anthropic: [
    'claude-opus-4-6',  // Latest working model
    'claude-3-5-sonnet-20240620',  // Stable version
    'claude-3-opus-20240229',      // Maximum capability
    'claude-3-sonnet-20240229',    // Balance
    'claude-3-haiku-20240307',     // Fast & economical
  ],
  glm: [
    'glm-5',
    'glm-4',
    'glm-4v',
    'glm-4-flash',
    'embedding-2',
  ],
  moonshot: [
    'kimi-k2.5',
    'kimi-k2',
    'kimi-k1.5',
  ],
  google: [
    'gemini-2.0-flash',
    'gemini-2.0-pro',
    'gemini-1.5-pro',
    'gemini-1.5-flash',
  ],
  azure: [
    'gpt-4o',
    'gpt-4',
    'gpt-35-turbo',
  ],
  custom: [
    'custom-model',
  ],
};

export const PROVIDER_CONFIG: Record<SecretProvider, {
  label: string;
  icon: string;
  color: string;
  placeholder: string;
  defaultEndpoint: string;
}> = {
  openai: {
    label: 'OpenAI',
    icon: '🤖',
    color: '#10A37F',
    placeholder: 'sk-...',
    defaultEndpoint: 'https://api.openai.com/v1',
  },
  anthropic: {
    label: 'Anthropic',
    icon: '🧠',
    color: '#D97757',
    placeholder: 'sk-ant-...',
    defaultEndpoint: 'https://api.anthropic.com/v1',
  },
  glm: {
    label: 'Zhipu AI (GLM)',
    icon: '🇨🇳',
    color: '#1890FF',
    placeholder: '...',
    defaultEndpoint: 'https://open.bigmodel.cn/api/paas/v4',
  },
  moonshot: {
    label: 'Moonshot (Kimi)',
    icon: '🌙',
    color: '#6B4F9B',
    placeholder: '...',
    defaultEndpoint: 'https://api.moonshot.cn/v1',
  },
  google: {
    label: 'Google AI',
    icon: '🔍',
    color: '#4285F4',
    placeholder: '...',
    defaultEndpoint: 'https://generativelanguage.googleapis.com/v1beta',
  },
  azure: {
    label: 'Azure OpenAI',
    icon: '☁️',
    color: '#0078D4',
    placeholder: '...',
    defaultEndpoint: 'https://{your-resource}.openai.azure.com/openai/deployments/{deployment-id}',
  },
  custom: {
    label: 'Custom',
    icon: '🔧',
    color: '#6B7280',
    placeholder: '...',
    defaultEndpoint: 'https://api.example.com/v1',
  },
};

// Get default model for a provider
export function getDefaultModel(provider: SecretProvider): string {
  return PROVIDER_MODELS[provider][0];
}

/**
 * Mask secret for display (show only last 4 chars)
 */
export function maskSecret(secret: string): string {
  if (secret.length <= 8) return '•'.repeat(secret.length);
  return '•'.repeat(secret.length - 4) + secret.slice(-4);
}
