import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, Wallet, AlertTriangle, CheckCircle2, ExternalLink, Server } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProviderBalance {
  providerId: string;
  providerName: string;
  balance: number;
  currency: string;
  status: 'active' | 'depleted' | 'error' | 'no_key' | 'unknown';
  errorMessage?: string;
  lastUpdated: string;
}

interface BalanceApiResponse {
  status: string;
  timestamp: string;
  providers: ProviderBalance[];
}

interface ProviderBalanceCardProps {
  className?: string;
  apiUrl?: string;
}

// Default API URL - can be overridden via props or env
const DEFAULT_API_URL = 'http://localhost:8080/api/balances';

const providerColors: Record<string, { bg: string; text: string; border: string }> = {
  anthropic: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  openai: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  gemini: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  zhipu: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  moonshot: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
};

const providerUrls: Record<string, string> = {
  anthropic: 'https://console.anthropic.com/settings/billing',
  openai: 'https://platform.openai.com/account/billing/overview',
  gemini: 'https://console.cloud.google.com/billing',
  zhipu: 'https://open.bigmodel.cn/usercenter/personal',
  moonshot: 'https://platform.moonshot.cn/console/billing',
};

export function ProviderBalanceCard({ className, apiUrl }: ProviderBalanceCardProps) {
  const [balances, setBalances] = useState<ProviderBalance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [apiStatus, setApiStatus] = useState<'connected' | 'error' | 'loading'>('loading');

  const fetchBalances = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(apiUrl || DEFAULT_API_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data: BalanceApiResponse = await response.json();
      
      if (data.status === 'success') {
        setBalances(data.providers);
        setApiStatus('connected');
        setLastRefresh(new Date());
      } else {
        throw new Error(data.status);
      }
    } catch (err) {
      console.error('Failed to fetch balances:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to balance API');
      setApiStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch on mount and every 30 minutes
  useEffect(() => {
    fetchBalances();
    
    const interval = setInterval(fetchBalances, 30 * 60 * 1000); // 30 minutes
    
    return () => clearInterval(interval);
  }, [apiUrl]);

  const getTotalUSD = () => {
    return balances
      .filter(b => b.currency === 'USD' && b.status === 'active')
      .reduce((sum, b) => sum + b.balance, 0);
  };

  const getLowBalanceProviders = () => {
    return balances.filter(b => b.status === 'active' && b.balance < 10);
  };

  const getDepletedProviders = () => {
    return balances.filter(b => b.status === 'depleted' || b.status === 'error');
  };

  const lowBalanceProviders = getLowBalanceProviders();
  const depletedProviders = getDepletedProviders();
  const hasIssues = lowBalanceProviders.length > 0 || depletedProviders.length > 0;

  // Show connection error
  if (apiStatus === 'error' && balances.length === 0) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-red-500" />
            <CardTitle>Provider Balances</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Cannot connect to Balance API</p>
                <p className="text-sm">{error}</p>
                <p className="text-sm mt-2">
                  Make sure the balance API is running on your VPS:
                </p>
                <code className="text-xs bg-gray-100 p-2 rounded block">
                  curl http://localhost:8080/api/health
                </code>
              </div>
            </AlertDescription>
          </Alert>
          <Button 
            variant="outline" 
            className="mt-4 w-full"
            onClick={fetchBalances}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry Connection
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-blue-500" />
            <CardTitle>Provider Balances</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {apiStatus === 'connected' && (
              <span className="flex items-center gap-1 text-xs text-green-600">
                <CheckCircle2 className="w-3 h-3" />
                Live
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchBalances}
              disabled={isLoading}
            >
              <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            </Button>
          </div>
        </div>
        <CardDescription>
          Real-time API credits from VPS backend
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Alerts */}
        {hasIssues && (
          <Alert variant={depletedProviders.length > 0 ? "destructive" : "default"}>
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              {depletedProviders.length > 0 && (
                <span className="font-medium">
                  {depletedProviders.length} provider(s) depleted. 
                </span>
              )}
              {lowBalanceProviders.length > 0 && (
                <span>
                  {lowBalanceProviders.length} provider(s) running low (&lt;$10).
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-green-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">
              ${getTotalUSD().toFixed(2)}
            </div>
            <div className="text-xs text-green-700">USD Balance</div>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">
              {balances.filter(b => b.status === 'active').length}
            </div>
            <div className="text-xs text-blue-700">Active</div>
          </div>
          <div className="p-3 bg-red-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-600">
              {balances.filter(b => b.status !== 'active').length}
            </div>
            <div className="text-xs text-red-700">Issues</div>
          </div>
        </div>

        {/* Provider List */}
        {balances.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Server className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No balance data available</p>
            <p className="text-sm">Waiting for first fetch...</p>
          </div>
        ) : (
          <div className="space-y-2">
            {balances.map((provider) => {
              const colors = providerColors[provider.providerId] || providerColors.anthropic;
              const isLow = provider.status === 'active' && provider.balance < 10;
              
              return (
                <div
                  key={provider.providerId}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border",
                    colors.bg,
                    colors.border,
                    isLow && "border-yellow-400 ring-1 ring-yellow-400"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("w-2 h-2 rounded-full", 
                      provider.status === 'active' 
                        ? isLow ? "bg-yellow-500" : "bg-green-500"
                        : "bg-red-500"
                    )} />
                    <div>
                      <div className="font-medium text-sm">{provider.providerName}</div>
                      <div className="text-xs text-gray-500">
                        {provider.status === 'active' && isLow && (
                          <span className="text-yellow-600 font-medium">Low Balance • </span>
                        )}
                        {provider.errorMessage ? (
                          <span className="text-red-500">{provider.errorMessage}</span>
                        ) : (
                          <span>Updated {new Date(provider.lastUpdated).toLocaleTimeString()}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className={cn("font-bold", 
                        provider.status === 'active'
                          ? isLow ? "text-yellow-600" : colors.text
                          : "text-red-600"
                      )}>
                        {provider.currency === 'CNY' ? '¥' : '$'}
                        {provider.balance.toFixed(2)}
                        <span className="text-xs font-normal ml-1">{provider.currency}</span>
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {provider.status === 'active' && isLow ? 'Recharge Soon' : provider.status}
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => window.open(providerUrls[provider.providerId], '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
          <span>Last refresh: {lastRefresh.toLocaleTimeString()}</span>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-green-500" />
            <span>Auto-refresh every 30 min</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
