/**
 * Secrets Vault Component
 * Andre Philippe AI Team - Dashboard
 * 
 * Secure storage for API keys and sensitive data
 */

import React, { useState } from 'react';
import { useSecrets } from '@/hooks/useSecrets';
import { SecretProvider, PROVIDER_CONFIG, PROVIDER_MODELS, getDefaultModel } from '@/types/secrets';
import { 
  Lock, 
  Unlock, 
  Key, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff,
  Shield,
  AlertCircle,
  Check,
  Copy
} from 'lucide-react';
import { Button, Input, Label, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from '@/components/ui';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select } from '@/components/ui/select';
import { useToast } from '@/components/ui/sonner';

export function SecretsVault() {
  const {
    secrets,
    isUnlocked,
    isLoading,
    addSecret,
    getSecret,
    deleteSecret,
    unlock,
    lock,
    setupVault,
    hasVault,
  } = useSecrets();

  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSetupMode, setIsSetupMode] = useState(false);
  
  // New secret form
  const [newSecretName, setNewSecretName] = useState('');
  const [newSecretValue, setNewSecretValue] = useState('');
  const [newSecretProvider, setNewSecretProvider] = useState<SecretProvider>('openai');
  const [newSecretDefaultModel, setNewSecretDefaultModel] = useState<string>(getDefaultModel('openai'));
  const [newSecretCustomEndpoint, setNewSecretCustomEndpoint] = useState('');
  const [newSecretDescription, setNewSecretDescription] = useState('');
  const [showNewSecretValue, setShowNewSecretValue] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [showCustomEndpoint, setShowCustomEndpoint] = useState(false);

  const handleUnlock = () => {
    if (!password) {
      toast('Please enter a password');
      return;
    }
    
    const success = unlock(password);
    if (success) {
      toast('Vault unlocked successfully');
      setPassword('');
    } else {
      toast('Incorrect password');
    }
  };

  const handleSetup = () => {
    if (!password) {
      toast('Please enter a password');
      return;
    }
    
    if (password !== confirmPassword) {
      toast('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      toast('Password must be at least 8 characters');
      return;
    }
    
    setupVault(password);
    toast('Vault created successfully');
    setPassword('');
    setConfirmPassword('');
    setIsSetupMode(false);
  };

  const handleAddSecret = () => {
    if (!newSecretName || !newSecretValue) {
      toast('Name and value are required');
      return;
    }
    
    const endpoint = showCustomEndpoint && newSecretCustomEndpoint 
      ? newSecretCustomEndpoint 
      : undefined;
    
    addSecret(
      newSecretName, 
      newSecretValue, 
      newSecretProvider, 
      newSecretDefaultModel,
      endpoint,
      newSecretDescription
    );
    toast('Secret added successfully');
    
    // Reset form
    setNewSecretName('');
    setNewSecretValue('');
    setNewSecretProvider('openai');
    setNewSecretDefaultModel(getDefaultModel('openai'));
    setNewSecretCustomEndpoint('');
    setNewSecretDescription('');
    setShowCustomEndpoint(false);
    setIsAddDialogOpen(false);
  };

  const handleCopySecret = (id: string) => {
    const value = getSecret(id);
    if (value) {
      navigator.clipboard.writeText(value);
      toast('Copied to clipboard');
    }
  };

  const handleDeleteSecret = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteSecret(id);
      toast('Secret deleted');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </CardContent>
      </Card>
    );
  }

  // Setup mode (first time)
  if (!hasVault && !isSetupMode) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            Secrets Vault
          </CardTitle>
          <CardDescription>
            Create a secure vault to store your API keys and sensitive data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">🔐 Secure Local Storage</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• AES-256 encryption</li>
              <li>• Master password protection</li>
              <li>• Never leaves your browser</li>
              <li>• No server logs or training data</li>
            </ul>
          </div>
          <Button onClick={() => setIsSetupMode(true)} className="w-full">
            <Lock className="w-4 h-4 mr-2" />
            Create Vault
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Setup form
  if (!hasVault && isSetupMode) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create Your Vault</CardTitle>
          <CardDescription>
            Set a strong master password to encrypt your secrets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Master Password</Label>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a strong password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="showPassword" className="text-sm">Show password</Label>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSetup} className="flex-1">
              <Check className="w-4 h-4 mr-2" />
              Create Vault
            </Button>
            <Button variant="outline" onClick={() => setIsSetupMode(false)}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Locked state
  if (!isUnlocked) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-6 h-6 text-amber-600" />
            Vault Locked
          </CardTitle>
          <CardDescription>
            Enter your master password to access your secrets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="unlockPassword">Master Password</Label>
            <Input
              id="unlockPassword"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
              placeholder="Enter your master password"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showUnlockPassword"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="showUnlockPassword" className="text-sm">Show password</Label>
          </div>
          <Button onClick={handleUnlock} className="w-full">
            <Unlock className="w-4 h-4 mr-2" />
            Unlock Vault
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Unlocked - Main interface
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Unlock className="w-6 h-6 text-green-600" />
            Secrets Vault
          </CardTitle>
          <Button variant="outline" size="sm" onClick={lock}>
            <Lock className="w-4 h-4 mr-2" />
            Lock
          </Button>
        </div>
        <CardDescription>
          {secrets.length} secret{secrets.length !== 1 ? 's' : ''} stored securely
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Secret Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Secret
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Secret</DialogTitle>
              <DialogDescription>
                Store an API key or sensitive value securely
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="secretName">Name</Label>
                <Input
                  id="secretName"
                  value={newSecretName}
                  onChange={(e) => setNewSecretName(e.target.value)}
                  placeholder="e.g., OpenAI Production Key"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secretProvider">Provider</Label>
                <Select
                  id="secretProvider"
                  value={newSecretProvider}
                  onChange={(e) => {
                    const provider = e.target.value as SecretProvider;
                    setNewSecretProvider(provider);
                    setNewSecretDefaultModel(getDefaultModel(provider));
                  }}
                >
                  {Object.entries(PROVIDER_CONFIG).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.icon} {config.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secretDefaultModel">Default Model</Label>
                <Select
                  id="secretDefaultModel"
                  value={newSecretDefaultModel}
                  onChange={(e) => setNewSecretDefaultModel(e.target.value)}
                >
                  {PROVIDER_MODELS[newSecretProvider].map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </Select>
                <p className="text-xs text-gray-500">
                  Default: {PROVIDER_CONFIG[newSecretProvider].defaultEndpoint}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showCustomEndpoint"
                  checked={showCustomEndpoint}
                  onChange={(e) => setShowCustomEndpoint(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="showCustomEndpoint" className="text-sm">Use custom endpoint</Label>
              </div>
              {showCustomEndpoint && (
                <div className="space-y-2">
                  <Label htmlFor="secretCustomEndpoint">Custom Endpoint (optional)</Label>
                  <Input
                    id="secretCustomEndpoint"
                    value={newSecretCustomEndpoint}
                    onChange={(e) => setNewSecretCustomEndpoint(e.target.value)}
                    placeholder={PROVIDER_CONFIG[newSecretProvider].defaultEndpoint}
                  />
                  <p className="text-xs text-gray-500">
                    Leave empty to use default endpoint
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="secretValue">Value</Label>
                <div className="relative">
                  <Input
                    id="secretValue"
                    type={showNewSecretValue ? 'text' : 'password'}
                    value={newSecretValue}
                    onChange={(e) => setNewSecretValue(e.target.value)}
                    placeholder={PROVIDER_CONFIG[newSecretProvider].placeholder}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewSecretValue(!showNewSecretValue)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewSecretValue ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secretDescription">Description (optional)</Label>
                <Input
                  id="secretDescription"
                  value={newSecretDescription}
                  onChange={(e) => setNewSecretDescription(e.target.value)}
                  placeholder="e.g., Main production key for GPT-4"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSecret}>
                <Lock className="w-4 h-4 mr-2" />
                Encrypt & Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Secrets List */}
        {secrets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Key className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No secrets stored yet</p>
            <p className="text-sm">Add your first API key above</p>
          </div>
        ) : (
          <div className="space-y-2">
            {secrets.map((secret) => {
              const config = PROVIDER_CONFIG[secret.provider];
              return (
                <Card key={secret.id} className="border-l-4" style={{ borderLeftColor: config.color }}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{config.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{secret.name}</h4>
                            <Badge variant="secondary" style={{ backgroundColor: config.color + '20', color: config.color }}>
                              {config.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">{secret.maskedValue}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              Model: {secret.defaultModel}
                            </Badge>
                            {secret.customEndpoint && (
                              <Badge variant="outline" className="text-xs text-amber-600">
                                Custom Endpoint
                              </Badge>
                            )}
                          </div>
                          {secret.description && (
                            <p className="text-xs text-gray-400 mt-1">{secret.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopySecret(secret.id)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteSecret(secret.id, secret.name)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-400">
                      Used {secret.usageCount} time{secret.usageCount !== 1 ? 's' : ''}
                      {secret.lastUsed && ` • Last used ${new Date(secret.lastUsed).toLocaleDateString()}`}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Security Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <strong>Security Note:</strong> Your secrets are encrypted with your master password and stored locally in your browser. 
            They never leave your device or are sent to any server. Remember your password - it cannot be recovered!
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
