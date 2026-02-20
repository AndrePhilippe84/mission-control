import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { 
  History, 
  Search, 
  Filter,
  User,
  Bot,
  Shield,
  Lock,
  Unlock,
  FileJson,
  Package,
  Settings,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

export type AuditActionType = 
  | 'agent_created' | 'agent_updated' | 'agent_deleted'
  | 'secret_accessed' | 'secret_created' | 'secret_deleted' | 'secret_rotated'
  | 'package_imported' | 'package_exported'
  | 'workflow_executed' | 'workflow_created' | 'workflow_updated'
  | 'governance_approved' | 'governance_rejected' | 'governance_requested'
  | 'deployment' | 'config_change' | 'login' | 'logout' | 'permission_change';

export type AuditSeverity = 'info' | 'low' | 'medium' | 'high' | 'critical';

export interface AuditEntry {
  id: string;
  timestamp: Date;
  actor: {
    id: string;
    name: string;
    type: 'human' | 'agent' | 'system';
  };
  action: AuditActionType;
  severity: AuditSeverity;
  target: {
    type: string;
    id: string;
    name: string;
  };
  description: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  sessionId?: string;
  approvedBy?: string;
  changes?: {
    field: string;
    oldValue?: string;
    newValue: string;
  }[];
}

interface AuditTrailProps {
  className?: string;
  entries?: AuditEntry[];
  maxHeight?: string;
}

// Mock audit entries
const mockAuditEntries: AuditEntry[] = [
  {
    id: 'AUD-001',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 min ago
    actor: { id: 'operations-lead', name: 'Operations Lead', type: 'agent' },
    action: 'deployment',
    severity: 'medium',
    target: { type: 'dashboard', id: 'andre-ai-dashboards', name: 'Dashboard v1.1.0' },
    description: 'Deployed Dashboard v1.1.0 to Vercel production',
    metadata: { version: '1.1.0', environment: 'production' },
    ipAddress: '45.63.12.34',
  },
  {
    id: 'AUD-002',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    actor: { id: 'operations-lead', name: 'Operations Lead', type: 'agent' },
    action: 'package_exported',
    severity: 'info',
    target: { type: 'package', id: 'pkg-smb-001', name: 'Sound Money Bank Setup' },
    description: 'Exported complete agent team configuration',
    metadata: { agents: 22, workflows: 4 },
  },
  {
    id: 'AUD-003',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    actor: { id: 'chief-of-staff', name: 'Chief of Staff', type: 'agent' },
    action: 'governance_approved',
    severity: 'high',
    target: { type: 'deployment', id: 'deploy-smb', name: 'Sound Money Bank Staging' },
    description: 'Approved deployment to staging environment',
    approvedBy: 'andre-philippe',
    metadata: { approvers: ['chief-of-staff'], required: 1 },
  },
  {
    id: 'AUD-004',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    actor: { id: 'tech-architect', name: 'Tech Architect', type: 'agent' },
    action: 'secret_created',
    severity: 'high',
    target: { type: 'secret', id: 'sec-claude', name: 'Claude API Key' },
    description: 'Created new API key for Anthropic Claude',
    ipAddress: '45.63.12.34',
    metadata: { masked: true },
  },
  {
    id: 'AUD-005',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    actor: { id: 'operations-lead', name: 'Operations Lead', type: 'agent' },
    action: 'agent_created',
    severity: 'info',
    target: { type: 'agent', id: 'youtube-summarizer', name: 'YouTube Summarizer' },
    description: 'Created new specialized agent for video processing',
    metadata: { capabilities: ['video-analysis', 'summarization'] },
  },
  {
    id: 'AUD-006',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    actor: { id: 'chief-of-staff', name: 'Chief of Staff', type: 'agent' },
    action: 'workflow_executed',
    severity: 'medium',
    target: { type: 'workflow', id: 'bmad-phase-1', name: 'BMAD Phase 1: Planning' },
    description: 'Completed Phase 1 for Sound Money Bank project',
    metadata: { agents_executed: 5, duration_minutes: 240 },
  },
  {
    id: 'AUD-007',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    actor: { id: 'andre-philippe', name: 'Andre Philippe', type: 'human' },
    action: 'config_change',
    severity: 'medium',
    target: { type: 'system', id: 'multi-provider', name: 'Multi-Provider Config' },
    description: 'Updated LLM provider routing configuration',
    changes: [
      { field: 'default_model', oldValue: 'kimi-k2.5', newValue: 'claude-sonnet-4-6' },
      { field: 'cost_limit', oldValue: '50', newValue: '100' },
    ],
  },
  {
    id: 'AUD-008',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    actor: { id: 'system', name: 'System', type: 'system' },
    action: 'secret_rotated',
    severity: 'critical',
    target: { type: 'secret', id: 'sec-vercel', name: 'Vercel Token' },
    description: 'Automatic rotation of expired deployment token',
    metadata: { reason: 'expired', auto_rotated: true },
  },
  {
    id: 'AUD-009',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
    actor: { id: 'legal-advisor', name: 'Legal Advisor', type: 'agent' },
    action: 'permission_change',
    severity: 'high',
    target: { type: 'agent', id: 'product-owner', name: 'Product Owner' },
    description: 'Granted deployment permissions to Product Owner for Dev Studio',
    changes: [
      { field: 'permissions', newValue: 'deploy:staging, deploy:dev' },
    ],
  },
  {
    id: 'AUD-010',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 168), // 7 days ago
    actor: { id: 'research-intelligence', name: 'Research Intelligence', type: 'agent' },
    action: 'package_imported',
    severity: 'info',
    target: { type: 'package', id: 'pkg-market-data', name: 'Market Research Data' },
    description: 'Imported market research dataset for NeoBank analysis',
    metadata: { records: 15000, sources: 8 },
  },
  {
    id: 'AUD-011',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
    actor: { id: 'system', name: 'System', type: 'system' },
    action: 'login',
    severity: 'info',
    target: { type: 'session', id: 'session-001', name: 'Dashboard Session' },
    description: 'User login from new device',
    ipAddress: '45.63.12.34',
    metadata: { user_agent: 'Chrome/120.0', location: 'Bogota, CO' },
  },
  {
    id: 'AUD-012',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12), // 12 days ago
    actor: { id: 'operations-lead', name: 'Operations Lead', type: 'agent' },
    action: 'workflow_created',
    severity: 'info',
    target: { type: 'workflow', id: 'wf-bmad', name: 'BMAD Standard Workflow' },
    description: 'Created standard BMAD development workflow template',
    metadata: { phases: 4, total_agents: 12 },
  },
];

export function AuditTrail({ 
  className, 
  entries = mockAuditEntries,
  maxHeight = "400px"
}: AuditTrailProps) {
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<AuditSeverity | 'all'>('all');
  const [actorFilter, setActorFilter] = useState<'all' | 'human' | 'agent' | 'system'>('all');

  const toggleExpanded = (entryId: string) => {
    const newExpanded = new Set(expandedEntries);
    if (newExpanded.has(entryId)) {
      newExpanded.delete(entryId);
    } else {
      newExpanded.add(entryId);
    }
    setExpandedEntries(newExpanded);
  };

  const severityColors: Record<AuditSeverity, string> = {
    info: 'bg-blue-100 text-blue-800',
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800',
  };

  const severityIcons: Record<AuditSeverity, React.ReactNode> = {
    info: <Clock className="w-3 h-3" />,
    low: <CheckCircle2 className="w-3 h-3" />,
    medium: <AlertTriangle className="w-3 h-3" />,
    high: <Shield className="w-3 h-3" />,
    critical: <Lock className="w-3 h-3" />,
  };

  const actionIcons: Record<string, React.ReactNode> = {
    agent_created: <Bot className="w-4 h-4" />,
    agent_updated: <Bot className="w-4 h-4" />,
    agent_deleted: <Bot className="w-4 h-4" />,
    secret_accessed: <Lock className="w-4 h-4" />,
    secret_created: <Lock className="w-4 h-4" />,
    secret_deleted: <Unlock className="w-4 h-4" />,
    secret_rotated: <Settings className="w-4 h-4" />,
    package_imported: <Package className="w-4 h-4" />,
    package_exported: <Package className="w-4 h-4" />,
    workflow_executed: <FileJson className="w-4 h-4" />,
    workflow_created: <FileJson className="w-4 h-4" />,
    workflow_updated: <FileJson className="w-4 h-4" />,
    governance_approved: <Shield className="w-4 h-4" />,
    governance_rejected: <AlertTriangle className="w-4 h-4" />,
    governance_requested: <Shield className="w-4 h-4" />,
    deployment: <History className="w-4 h-4" />,
    config_change: <Settings className="w-4 h-4" />,
    login: <User className="w-4 h-4" />,
    logout: <User className="w-4 h-4" />,
    permission_change: <Shield className="w-4 h-4" />,
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.target.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.actor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || entry.severity === severityFilter;
    const matchesActor = actorFilter === 'all' || entry.actor.type === actorFilter;
    return matchesSearch && matchesSeverity && matchesActor;
  });

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const stats = {
    total: entries.length,
    critical: entries.filter(e => e.severity === 'critical').length,
    high: entries.filter(e => e.severity === 'high').length,
    agents: entries.filter(e => e.actor.type === 'agent').length,
    humans: entries.filter(e => e.actor.type === 'human').length,
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Stats */}
      <div className="grid grid-cols-5 gap-2">
        <div className="p-2 bg-gray-50 rounded-lg text-center">
          <div className="text-lg font-bold">{stats.total}</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
        <div className="p-2 bg-red-50 rounded-lg text-center">
          <div className="text-lg font-bold text-red-600">{stats.critical}</div>
          <div className="text-xs text-red-700">Critical</div>
        </div>
        <div className="p-2 bg-orange-50 rounded-lg text-center">
          <div className="text-lg font-bold text-orange-600">{stats.high}</div>
          <div className="text-xs text-orange-700">High</div>
        </div>
        <div className="p-2 bg-blue-50 rounded-lg text-center">
          <div className="text-lg font-bold text-blue-600">{stats.agents}</div>
          <div className="text-xs text-blue-700">By Agents</div>
        </div>
        <div className="p-2 bg-purple-50 rounded-lg text-center">
          <div className="text-lg font-bold text-purple-600">{stats.humans}</div>
          <div className="text-xs text-purple-700">By Humans</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search audit log..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value as AuditSeverity | 'all')}
          className="px-2 py-1.5 border rounded-lg text-sm h-9"
        >
          <option value="all">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
          <option value="info">Info</option>
        </select>
        <select
          value={actorFilter}
          onChange={(e) => setActorFilter(e.target.value as typeof actorFilter)}
          className="px-2 py-1.5 border rounded-lg text-sm h-9"
        >
          <option value="all">All Actors</option>
          <option value="human">Humans</option>
          <option value="agent">Agents</option>
          <option value="system">System</option>
        </select>
      </div>

      {/* Audit Log */}
      <Card>
        <CardContent className="p-0">
          <div 
            className="divide-y overflow-y-auto"
            style={{ maxHeight }}
          >
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <div
                  className="flex items-start gap-3 p-3 cursor-pointer"
                  onClick={() => toggleExpanded(entry.id)}
                >
                  <div className="mt-0.5">
                    {actionIcons[entry.action] || <History className="w-4 h-4" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-gray-400">{entry.id}</span>
                      <Badge className={cn("text-xs px-1.5 py-0", severityColors[entry.severity])}>
                        <span className="flex items-center gap-1">
                          {severityIcons[entry.severity]}
                          {entry.severity}
                        </span>
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(entry.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-sm font-medium">
                      {entry.description}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        {entry.actor.type === 'agent' ? (
                          <Bot className="w-3 h-3" />
                        ) : entry.actor.type === 'human' ? (
                          <User className="w-3 h-3" />
                        ) : (
                          <Settings className="w-3 h-3" />
                        )}
                        {entry.actor.name}
                      </span>
                      <span>→</span>
                      <span className="truncate">{entry.target.name}</span>
                    </div>
                  </div>

                  <button className="p-1 hover:bg-gray-200 rounded">
                    {expandedEntries.has(entry.id) ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>

                {/* Expanded Details */}
                {expandedEntries.has(entry.id) && (
                  <div className="px-3 pb-3 pl-12">
                    <div className="p-3 bg-gray-50 rounded-lg text-sm space-y-2">
                      {entry.ipAddress && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">IP Address:</span>
                          <span className="font-mono">{entry.ipAddress}</span>
                        </div>
                      )}
                      {entry.sessionId && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Session:</span>
                          <span className="font-mono">{entry.sessionId}</span>
                        </div>
                      )}
                      {entry.approvedBy && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Approved By:</span>
                          <span>{entry.approvedBy}</span>
                        </div>
                      )}
                      
                      {entry.changes && entry.changes.length > 0 && (
                        <div className="pt-2 border-t">
                          <div className="text-gray-500 mb-2">Changes:</div>
                          {entry.changes.map((change, idx) => (
                            <div key={idx} className="grid grid-cols-3 gap-2 py-1">
                              <span className="font-medium">{change.field}</span>
                              <span className="text-red-600 line-through truncate">
                                {change.oldValue || '(none)'}
                              </span>
                              <span className="text-green-600 truncate">
                                {change.newValue}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                        <div className="pt-2 border-t">
                          <div className="text-gray-500 mb-1">Metadata:</div>
                          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                            {JSON.stringify(entry.metadata, null, 2)}
                          </pre>
                        </div>
                      )}

                      <div className="pt-2 border-t text-xs text-gray-400">
                        {entry.timestamp.toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
