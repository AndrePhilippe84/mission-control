import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { 
  Users, 
  User, 
  ChevronRight, 
  ChevronDown,
  GitBranch,
  ArrowRight,
  Shield,
  Bot,
  Search,
  Filter
} from 'lucide-react';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  type: 'human' | 'agent';
  status: 'active' | 'idle' | 'offline';
  capabilities: string[];
  reportsTo?: string;
  delegatesTo?: string[];
  avatar?: string;
  workload: number; // 0-100
  currentTask?: string;
}

interface TeamHierarchyProps {
  className?: string;
  members?: TeamMember[];
  onSelectMember?: (member: TeamMember) => void;
}

// Mock data representing the 22-agent structure
const mockTeamMembers: TeamMember[] = [
  // Mission Control - Core Team (10 agents)
  {
    id: 'chief-of-staff',
    name: 'Chief of Staff',
    role: 'Orchestrator',
    type: 'agent',
    status: 'active',
    capabilities: ['coordination', 'planning', 'delegation'],
    reportsTo: 'andre-philippe',
    delegatesTo: ['research-intelligence', 'strategic-planner', 'capital-exit', 'communications-strategist', 'financial-controller', 'legal-advisor', 'operations-lead', 'talent-acquisition', 'tech-architect'],
    workload: 75,
    currentTask: 'Coordinating Sound Money Bank project',
  },
  {
    id: 'andre-philippe',
    name: 'Andre Philippe',
    role: 'Founder & CEO',
    type: 'human',
    status: 'active',
    capabilities: ['decision-making', 'vision', 'leadership'],
    workload: 60,
    currentTask: 'Strategic planning',
  },
  {
    id: 'research-intelligence',
    name: 'Research Intelligence',
    role: 'Research Lead',
    type: 'agent',
    status: 'active',
    capabilities: ['market-research', 'competitive-analysis', 'data-synthesis'],
    reportsTo: 'chief-of-staff',
    workload: 85,
    currentTask: 'NeoBank market analysis',
  },
  {
    id: 'strategic-planner',
    name: 'Strategic Planner',
    role: 'Strategy Lead',
    type: 'agent',
    status: 'active',
    capabilities: ['business-strategy', 'roadmapping', 'okrs'],
    reportsTo: 'chief-of-staff',
    workload: 70,
    currentTask: 'BMAD workflow optimization',
  },
  {
    id: 'capital-exit',
    name: 'Capital Exit',
    role: 'Finance Lead',
    type: 'agent',
    status: 'idle',
    capabilities: ['fundraising', 'investor-relations', 'financial-modeling'],
    reportsTo: 'chief-of-staff',
    workload: 30,
    currentTask: 'Preparing Series A materials',
  },
  {
    id: 'communications-strategist',
    name: 'Communications Strategist',
    role: 'Comms Lead',
    type: 'agent',
    status: 'active',
    capabilities: ['messaging', 'brand-strategy', 'stakeholder-comms'],
    reportsTo: 'chief-of-staff',
    workload: 55,
    currentTask: 'Investor update deck',
  },
  {
    id: 'financial-controller',
    name: 'Financial Controller',
    role: 'Finance Ops',
    type: 'agent',
    status: 'active',
    capabilities: ['budgeting', 'forecasting', 'reporting'],
    reportsTo: 'chief-of-staff',
    workload: 45,
    currentTask: 'Monthly financial report',
  },
  {
    id: 'legal-advisor',
    name: 'Legal Advisor',
    role: 'Legal Lead',
    type: 'agent',
    status: 'idle',
    capabilities: ['compliance', 'contracts', 'risk-assessment'],
    reportsTo: 'chief-of-staff',
    workload: 25,
    currentTask: 'Delaware LLC compliance review',
  },
  {
    id: 'operations-lead',
    name: 'Operations Lead',
    role: 'Ops Lead',
    type: 'agent',
    status: 'active',
    capabilities: ['process-optimization', 'automation', 'tools'],
    reportsTo: 'chief-of-staff',
    workload: 65,
    currentTask: 'Dashboard feature implementation',
  },
  {
    id: 'talent-acquisition',
    name: 'Talent Acquisition',
    role: 'Recruiting',
    type: 'agent',
    status: 'idle',
    capabilities: ['sourcing', 'interviewing', 'onboarding'],
    reportsTo: 'chief-of-staff',
    workload: 20,
    currentTask: 'Partner VPS coordinator search',
  },
  {
    id: 'tech-architect',
    name: 'Tech Architect',
    role: 'Tech Lead',
    type: 'agent',
    status: 'active',
    capabilities: ['system-design', 'architecture', 'tech-stack'],
    reportsTo: 'chief-of-staff',
    workload: 80,
    currentTask: 'Multi-provider LLM integration',
  },
  // Dev Studio - BMAD Team (12 agents)
  {
    id: 'product-owner',
    name: 'Product Owner',
    role: 'Product Lead',
    type: 'agent',
    status: 'idle',
    capabilities: ['product-strategy', 'roadmap', 'prioritization'],
    reportsTo: 'chief-of-staff',
    delegatesTo: ['business-analyst', 'architect', 'ux-designer', 'scrum-master'],
    workload: 10,
    currentTask: 'Waiting for project trigger',
  },
  {
    id: 'business-analyst',
    name: 'Business Analyst',
    role: 'BA',
    type: 'agent',
    status: 'idle',
    capabilities: ['requirements', 'documentation', 'analysis'],
    reportsTo: 'product-owner',
    workload: 0,
  },
  {
    id: 'architect',
    name: 'Solution Architect',
    role: 'Architect',
    type: 'agent',
    status: 'idle',
    capabilities: ['architecture', 'design', 'patterns'],
    reportsTo: 'product-owner',
    workload: 0,
  },
  {
    id: 'ux-designer',
    name: 'UX Designer',
    role: 'UX Lead',
    type: 'agent',
    status: 'idle',
    capabilities: ['design', 'prototyping', 'user-research'],
    reportsTo: 'product-owner',
    workload: 0,
  },
  {
    id: 'scrum-master',
    name: 'Scrum Master',
    role: 'Agile Lead',
    type: 'agent',
    status: 'idle',
    capabilities: ['agile', 'sprints', 'facilitation'],
    reportsTo: 'product-owner',
    workload: 0,
  },
  {
    id: 'readiness-check',
    name: 'Readiness Check',
    role: 'QA Lead',
    type: 'agent',
    status: 'idle',
    capabilities: ['quality-assurance', 'readiness', 'gating'],
    reportsTo: 'product-owner',
    workload: 0,
  },
  {
    id: 'create-story',
    name: 'Story Creator',
    role: 'Dev Lead',
    type: 'agent',
    status: 'idle',
    capabilities: ['story-writing', 'technical-specs'],
    reportsTo: 'product-owner',
    workload: 0,
  },
  {
    id: 'dev-story',
    name: 'Developer',
    role: 'Developer',
    type: 'agent',
    status: 'idle',
    capabilities: ['coding', 'implementation', 'testing'],
    reportsTo: 'product-owner',
    workload: 0,
  },
  {
    id: 'code-review',
    name: 'Code Reviewer',
    role: 'Senior Dev',
    type: 'agent',
    status: 'idle',
    capabilities: ['code-review', 'best-practices', 'security'],
    reportsTo: 'product-owner',
    workload: 0,
  },
  {
    id: 'ux-review',
    name: 'UX Reviewer',
    role: 'UX QA',
    type: 'agent',
    status: 'idle',
    capabilities: ['ux-validation', 'accessibility', 'design-review'],
    reportsTo: 'product-owner',
    workload: 0,
  },
  {
    id: 'qa-tester',
    name: 'QA Tester',
    role: 'QA',
    type: 'agent',
    status: 'idle',
    capabilities: ['testing', 'automation', 'bug-tracking'],
    reportsTo: 'product-owner',
    workload: 0,
  },
  {
    id: 'retrospective',
    name: 'Retrospective Lead',
    role: 'Agile Coach',
    type: 'agent',
    status: 'idle',
    capabilities: ['retrospectives', 'continuous-improvement'],
    reportsTo: 'product-owner',
    workload: 0,
  },
];

export function TeamHierarchy({ className, members = mockTeamMembers, onSelectMember }: TeamHierarchyProps) {
  const [expandedMembers, setExpandedMembers] = useState<Set<string>>(new Set(['chief-of-staff', 'andre-philippe', 'product-owner']));
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree');

  const toggleExpanded = (memberId: string) => {
    const newExpanded = new Set(expandedMembers);
    if (newExpanded.has(memberId)) {
      newExpanded.delete(memberId);
    } else {
      newExpanded.add(memberId);
    }
    setExpandedMembers(newExpanded);
  };

  const getDirectReports = (memberId: string) => {
    return members.filter(m => m.reportsTo === memberId);
  };

  const getStatusColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'idle':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-400';
    }
  };

  const getWorkloadColor = (workload: number) => {
    if (workload < 30) return 'text-green-600';
    if (workload < 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.capabilities.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderTreeNode = (member: TeamMember, level: number = 0) => {
    const directReports = getDirectReports(member.id);
    const isExpanded = expandedMembers.has(member.id);
    const hasReports = directReports.length > 0;

    return (
      <div key={member.id} className="select-none">
        <div
          className={cn(
            "flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-colors",
            "hover:bg-gray-100",
            selectedMember?.id === member.id && "bg-blue-50 border border-blue-200"
          )}
          style={{ paddingLeft: `${12 + level * 24}px` }}
          onClick={() => {
            setSelectedMember(member);
            onSelectMember?.(member);
          }}
        >
          {hasReports ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(member.id);
              }}
              className="p-1 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>
          ) : (
            <div className="w-6" />
          )}

          <div className="relative">
            {member.type === 'agent' ? (
              <Bot className="w-5 h-5 text-blue-500" />
            ) : (
              <User className="w-5 h-5 text-purple-500" />
            )}
            <div className={cn("absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white", getStatusColor(member.status))} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm truncate">{member.name}</span>
              {member.type === 'agent' && (
                <Badge variant="secondary" className="text-xs">AI</Badge>
              )}
            </div>
            <div className="text-xs text-gray-500 truncate">{member.role}</div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className={cn("text-xs font-medium", getWorkloadColor(member.workload))}>
                {member.workload}%
              </div>
              <div className="text-[10px] text-gray-400">load</div>
            </div>
          </div>
        </div>

        {isExpanded && hasReports && (
          <div>
            {directReports.map(report => renderTreeNode(report, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const rootMembers = members.filter(m => !m.reportsTo);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <Button
            size="sm"
            variant={viewMode === 'tree' ? 'default' : 'ghost'}
            onClick={() => setViewMode('tree')}
            className="h-8"
          >
            <GitBranch className="w-4 h-4 mr-1" />
            Tree
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            onClick={() => setViewMode('list')}
            className="h-8"
          >
            <Users className="w-4 h-4 mr-1" />
            List
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{members.filter(m => m.type === 'agent').length}</div>
          <div className="text-xs text-blue-800">AI Agents</div>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{members.filter(m => m.type === 'human').length}</div>
          <div className="text-xs text-purple-800">Humans</div>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{members.filter(m => m.status === 'active').length}</div>
          <div className="text-xs text-green-800">Active</div>
        </div>
        <div className="p-3 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">
            {Math.round(members.reduce((acc, m) => acc + m.workload, 0) / members.length)}%
          </div>
          <div className="text-xs text-orange-800">Avg Load</div>
        </div>
      </div>

      {/* Tree/List View */}
      <Card>
        <CardContent className="p-0">
          {viewMode === 'tree' ? (
            <div className="py-2">
              {searchQuery ? (
                filteredMembers.map(member => (
                  <div
                    key={member.id}
                    className="flex items-center gap-2 py-2 px-4 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setSelectedMember(member)}
                  >
                    {member.type === 'agent' ? (
                      <Bot className="w-5 h-5 text-blue-500" />
                    ) : (
                      <User className="w-5 h-5 text-purple-500" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-sm">{member.name}</div>
                      <div className="text-xs text-gray-500">{member.role}</div>
                    </div>
                    <Badge variant="secondary">{member.workload}%</Badge>
                  </div>
                ))
              ) : (
                rootMembers.map(member => renderTreeNode(member))
              )}
            </div>
          ) : (
            <div className="divide-y">
              {(searchQuery ? filteredMembers : members).map(member => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedMember(member)}
                >
                  <div className="relative">
                    {member.type === 'agent' ? (
                      <Bot className="w-8 h-8 text-blue-500" />
                    ) : (
                      <User className="w-8 h-8 text-purple-500" />
                    )}
                    <div className={cn("absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white", getStatusColor(member.status))} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{member.name}</span>
                      {member.type === 'agent' && <Badge variant="secondary">AI</Badge>}
                    </div>
                    <div className="text-sm text-gray-500">{member.role}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {member.capabilities.slice(0, 3).map(cap => (
                        <Badge key={cap} variant="outline" className="text-xs">
                          {cap}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={cn("text-sm font-medium", getWorkloadColor(member.workload))}>
                      {member.workload}%
                    </div>
                    <div className="text-xs text-gray-400">workload</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Member Detail Dialog */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              {selectedMember?.type === 'agent' ? (
                <Bot className="w-10 h-10 text-blue-500" />
              ) : (
                <User className="w-10 h-10 text-purple-500" />
              )}
              <div>
                <DialogTitle>{selectedMember?.name}</DialogTitle>
                <DialogDescription>{selectedMember?.role}</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedMember && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">Status</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={cn("w-2 h-2 rounded-full", getStatusColor(selectedMember.status))} />
                    <span className="font-medium capitalize">{selectedMember.status}</span>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">Workload</div>
                  <div className={cn("text-lg font-bold", getWorkloadColor(selectedMember.workload))}>
                    {selectedMember.workload}%
                  </div>
                </div>
              </div>

              {selectedMember.currentTask && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Current Task</div>
                  <div className="font-medium text-sm">{selectedMember.currentTask}</div>
                </div>
              )}

              <div>
                <div className="text-sm font-medium mb-2">Capabilities</div>
                <div className="flex flex-wrap gap-2">
                  {selectedMember.capabilities.map(cap => (
                    <Badge key={cap} variant="secondary">
                      {cap.replace('-', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>

              {selectedMember.reportsTo && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Reports to:</span>
                  <Badge variant="outline">
                    {members.find(m => m.id === selectedMember.reportsTo)?.name}
                  </Badge>
                </div>
              )}

              {selectedMember.delegatesTo && selectedMember.delegatesTo.length > 0 && (
                <div>
                  <div className="text-sm text-gray-500 mb-2">Delegates to ({selectedMember.delegatesTo.length}):</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.delegatesTo.map(delegateId => {
                      const delegate = members.find(m => m.id === delegateId);
                      return delegate ? (
                        <Badge key={delegateId} variant="outline" className="text-xs">
                          {delegate.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
