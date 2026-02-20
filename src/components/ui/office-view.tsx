import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Monitor, 
  Coffee,
  Zap,
  User,
  Bot,
  Activity,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Briefcase,
  Cpu,
  Code,
  Palette,
  FileText,
  BarChart3,
  Shield,
  Settings
} from 'lucide-react';

export type AgentStatus = 'working' | 'idle' | 'meeting' | 'break' | 'offline';
export type AgentRole = 'developer' | 'designer' | 'manager' | 'analyst' | 'specialist';

export interface OfficeAgent {
  id: string;
  name: string;
  role: AgentRole;
  status: AgentStatus;
  avatar: string;
  deskPosition: { x: number; y: number }; // Grid position
  currentTask?: string;
  taskProgress?: number; // 0-100
  lastActive: Date;
  team: 'mission-control' | 'dev-studio';
  specialty: string;
  efficiency: number; // 0-100
}

interface OfficeViewProps {
  className?: string;
  agents?: OfficeAgent[];
  onSelectAgent?: (agent: OfficeAgent) => void;
}

// Generate avatar URL with initials
const getAvatarUrl = (name: string, isAgent: boolean = true) => {
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const bgColor = isAgent ? '3B82F6' : '8B5CF6';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bgColor}&color=fff&size=128`;
};

// Mock office agents - 22 total matching our structure
const mockOfficeAgents: OfficeAgent[] = [
  // Mission Control - Core Team (10 agents)
  {
    id: 'chief-of-staff',
    name: 'Chief of Staff',
    role: 'manager',
    status: 'working',
    avatar: getAvatarUrl('Chief of Staff'),
    deskPosition: { x: 2, y: 0 },
    currentTask: 'Coordinating Sound Money Bank project',
    taskProgress: 75,
    lastActive: new Date(),
    team: 'mission-control',
    specialty: 'Orchestration',
    efficiency: 95,
  },
  {
    id: 'research-intelligence',
    name: 'Research Intelligence',
    role: 'analyst',
    status: 'working',
    avatar: getAvatarUrl('Research'),
    deskPosition: { x: 0, y: 1 },
    currentTask: 'NeoBank market analysis',
    taskProgress: 85,
    lastActive: new Date(),
    team: 'mission-control',
    specialty: 'Market Research',
    efficiency: 92,
  },
  {
    id: 'strategic-planner',
    name: 'Strategic Planner',
    role: 'manager',
    status: 'working',
    avatar: getAvatarUrl('Strategic'),
    deskPosition: { x: 1, y: 1 },
    currentTask: 'BMAD workflow optimization',
    taskProgress: 70,
    lastActive: new Date(),
    team: 'mission-control',
    specialty: 'Strategy',
    efficiency: 88,
  },
  {
    id: 'capital-exit',
    name: 'Capital Exit',
    role: 'analyst',
    status: 'idle',
    avatar: getAvatarUrl('Capital'),
    deskPosition: { x: 2, y: 1 },
    currentTask: 'Preparing Series A materials',
    taskProgress: 30,
    lastActive: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
    team: 'mission-control',
    specialty: 'Fundraising',
    efficiency: 85,
  },
  {
    id: 'communications',
    name: 'Communications',
    role: 'specialist',
    status: 'working',
    avatar: getAvatarUrl('Comms'),
    deskPosition: { x: 3, y: 1 },
    currentTask: 'Investor update deck',
    taskProgress: 55,
    lastActive: new Date(),
    team: 'mission-control',
    specialty: 'Messaging',
    efficiency: 90,
  },
  {
    id: 'financial-controller',
    name: 'Financial Controller',
    role: 'analyst',
    status: 'working',
    avatar: getAvatarUrl('Finance'),
    deskPosition: { x: 4, y: 1 },
    currentTask: 'Monthly financial report',
    taskProgress: 45,
    lastActive: new Date(),
    team: 'mission-control',
    specialty: 'Budgeting',
    efficiency: 87,
  },
  {
    id: 'legal-advisor',
    name: 'Legal Advisor',
    role: 'specialist',
    status: 'idle',
    avatar: getAvatarUrl('Legal'),
    deskPosition: { x: 0, y: 2 },
    currentTask: 'Delaware LLC compliance review',
    taskProgress: 25,
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    team: 'mission-control',
    specialty: 'Compliance',
    efficiency: 82,
  },
  {
    id: 'operations-lead',
    name: 'Operations Lead',
    role: 'manager',
    status: 'working',
    avatar: getAvatarUrl('Operations'),
    deskPosition: { x: 1, y: 2 },
    currentTask: 'Dashboard feature implementation',
    taskProgress: 90,
    lastActive: new Date(),
    team: 'mission-control',
    specialty: 'Process Optimization',
    efficiency: 94,
  },
  {
    id: 'talent-acquisition',
    name: 'Talent Acquisition',
    role: 'specialist',
    status: 'idle',
    avatar: getAvatarUrl('Talent'),
    deskPosition: { x: 2, y: 2 },
    currentTask: 'Partner VPS coordinator search',
    taskProgress: 20,
    lastActive: new Date(Date.now() - 4 * 60 * 60 * 1000),
    team: 'mission-control',
    specialty: 'Recruiting',
    efficiency: 80,
  },
  {
    id: 'tech-architect',
    name: 'Tech Architect',
    role: 'developer',
    status: 'working',
    avatar: getAvatarUrl('Architect'),
    deskPosition: { x: 3, y: 2 },
    currentTask: 'Multi-provider LLM integration',
    taskProgress: 80,
    lastActive: new Date(),
    team: 'mission-control',
    specialty: 'System Design',
    efficiency: 96,
  },
  // Dev Studio - BMAD Team (12 agents)
  {
    id: 'product-owner',
    name: 'Product Owner',
    role: 'manager',
    status: 'idle',
    avatar: getAvatarUrl('Product'),
    deskPosition: { x: 0, y: 4 },
    currentTask: 'Waiting for project trigger',
    taskProgress: 10,
    lastActive: new Date(Date.now() - 6 * 60 * 60 * 1000),
    team: 'dev-studio',
    specialty: 'Product Strategy',
    efficiency: 88,
  },
  {
    id: 'business-analyst',
    name: 'Business Analyst',
    role: 'analyst',
    status: 'idle',
    avatar: getAvatarUrl('BA'),
    deskPosition: { x: 1, y: 4 },
    currentTask: 'Available for assignment',
    taskProgress: 0,
    lastActive: new Date(Date.now() - 8 * 60 * 60 * 1000),
    team: 'dev-studio',
    specialty: 'Requirements',
    efficiency: 85,
  },
  {
    id: 'architect',
    name: 'Solution Architect',
    role: 'developer',
    status: 'idle',
    avatar: getAvatarUrl('Solution'),
    deskPosition: { x: 2, y: 4 },
    currentTask: 'Available for assignment',
    taskProgress: 0,
    lastActive: new Date(Date.now() - 8 * 60 * 60 * 1000),
    team: 'dev-studio',
    specialty: 'Architecture',
    efficiency: 92,
  },
  {
    id: 'ux-designer',
    name: 'UX Designer',
    role: 'designer',
    status: 'idle',
    avatar: getAvatarUrl('UX'),
    deskPosition: { x: 3, y: 4 },
    currentTask: 'Available for assignment',
    taskProgress: 0,
    lastActive: new Date(Date.now() - 8 * 60 * 60 * 1000),
    team: 'dev-studio',
    specialty: 'Design',
    efficiency: 90,
  },
  {
    id: 'scrum-master',
    name: 'Scrum Master',
    role: 'manager',
    status: 'idle',
    avatar: getAvatarUrl('Scrum'),
    deskPosition: { x: 4, y: 4 },
    currentTask: 'Available for assignment',
    taskProgress: 0,
    lastActive: new Date(Date.now() - 8 * 60 * 60 * 1000),
    team: 'dev-studio',
    specialty: 'Agile',
    efficiency: 87,
  },
  {
    id: 'readiness-check',
    name: 'Readiness Check',
    role: 'specialist',
    status: 'idle',
    avatar: getAvatarUrl('Readiness'),
    deskPosition: { x: 0, y: 5 },
    currentTask: 'Available for assignment',
    taskProgress: 0,
    lastActive: new Date(Date.now() - 8 * 60 * 60 * 1000),
    team: 'dev-studio',
    specialty: 'QA',
    efficiency: 89,
  },
  {
    id: 'story-creator',
    name: 'Story Creator',
    role: 'developer',
    status: 'idle',
    avatar: getAvatarUrl('Story'),
    deskPosition: { x: 1, y: 5 },
    currentTask: 'Available for assignment',
    taskProgress: 0,
    lastActive: new Date(Date.now() - 8 * 60 * 60 * 1000),
    team: 'dev-studio',
    specialty: 'Story Writing',
    efficiency: 86,
  },
  {
    id: 'developer',
    name: 'Developer',
    role: 'developer',
    status: 'idle',
    avatar: getAvatarUrl('Dev'),
    deskPosition: { x: 2, y: 5 },
    currentTask: 'Available for assignment',
    taskProgress: 0,
    lastActive: new Date(Date.now() - 8 * 60 * 60 * 1000),
    team: 'dev-studio',
    specialty: 'Coding',
    efficiency: 91,
  },
  {
    id: 'code-reviewer',
    name: 'Code Reviewer',
    role: 'developer',
    status: 'idle',
    avatar: getAvatarUrl('Reviewer'),
    deskPosition: { x: 3, y: 5 },
    currentTask: 'Available for assignment',
    taskProgress: 0,
    lastActive: new Date(Date.now() - 8 * 60 * 60 * 1000),
    team: 'dev-studio',
    specialty: 'Code Review',
    efficiency: 93,
  },
  {
    id: 'ux-reviewer',
    name: 'UX Reviewer',
    role: 'designer',
    status: 'idle',
    avatar: getAvatarUrl('UXR'),
    deskPosition: { x: 4, y: 5 },
    currentTask: 'Available for assignment',
    taskProgress: 0,
    lastActive: new Date(Date.now() - 8 * 60 * 60 * 1000),
    team: 'dev-studio',
    specialty: 'UX Validation',
    efficiency: 88,
  },
  {
    id: 'qa-tester',
    name: 'QA Tester',
    role: 'specialist',
    status: 'idle',
    avatar: getAvatarUrl('QA'),
    deskPosition: { x: 0, y: 6 },
    currentTask: 'Available for assignment',
    taskProgress: 0,
    lastActive: new Date(Date.now() - 8 * 60 * 60 * 1000),
    team: 'dev-studio',
    specialty: 'Testing',
    efficiency: 87,
  },
  {
    id: 'retrospective',
    name: 'Retrospective Lead',
    role: 'manager',
    status: 'idle',
    avatar: getAvatarUrl('Retro'),
    deskPosition: { x: 1, y: 6 },
    currentTask: 'Available for assignment',
    taskProgress: 0,
    lastActive: new Date(Date.now() - 8 * 60 * 60 * 1000),
    team: 'dev-studio',
    specialty: 'Continuous Improvement',
    efficiency: 85,
  },
];

const statusConfig: Record<AgentStatus, { color: string; bgColor: string; icon: React.ReactNode; label: string }> = {
  working: { 
    color: 'text-green-600', 
    bgColor: 'bg-green-100', 
    icon: <Zap className="w-3 h-3" />,
    label: 'Working'
  },
  idle: { 
    color: 'text-gray-500', 
    bgColor: 'bg-gray-100', 
    icon: <Coffee className="w-3 h-3" />,
    label: 'Idle'
  },
  meeting: { 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-100', 
    icon: <MessageSquare className="w-3 h-3" />,
    label: 'In Meeting'
  },
  break: { 
    color: 'text-orange-600', 
    bgColor: 'bg-orange-100', 
    icon: <Coffee className="w-3 h-3" />,
    label: 'On Break'
  },
  offline: { 
    color: 'text-red-600', 
    bgColor: 'bg-red-100', 
    icon: <AlertCircle className="w-3 h-3" />,
    label: 'Offline'
  },
};

const roleIcons: Record<AgentRole, React.ReactNode> = {
  developer: <Code className="w-4 h-4" />,
  designer: <Palette className="w-4 h-4" />,
  manager: <Briefcase className="w-4 h-4" />,
  analyst: <BarChart3 className="w-4 h-4" />,
  specialist: <Settings className="w-4 h-4" />,
};

export function OfficeView({ 
  className, 
  agents = mockOfficeAgents,
  onSelectAgent,
}: OfficeViewProps) {
  const [selectedAgent, setSelectedAgent] = useState<OfficeAgent | null>(null);
  const [viewMode, setViewMode] = useState<'office' | 'list'>('office');
  const [teamFilter, setTeamFilter] = useState<'all' | 'mission-control' | 'dev-studio'>('all');
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);

  const filteredAgents = agents.filter(agent => 
    teamFilter === 'all' || agent.team === teamFilter
  );

  const missionControlAgents = filteredAgents.filter(a => a.team === 'mission-control');
  const devStudioAgents = filteredAgents.filter(a => a.team === 'dev-studio');

  const stats = {
    total: agents.length,
    working: agents.filter(a => a.status === 'working').length,
    idle: agents.filter(a => a.status === 'idle').length,
    avgEfficiency: Math.round(agents.reduce((acc, a) => acc + a.efficiency, 0) / agents.length),
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update agent statuses for animation effect
      // In real implementation, this would come from actual agent activity
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const renderOfficeGrid = () => {
    const maxX = Math.max(...agents.map(a => a.deskPosition.x));
    const maxY = Math.max(...agents.map(a => a.deskPosition.y));

    return (
      <div className="relative bg-gray-100 rounded-xl p-6 overflow-x-auto">
        {/* Office Floor */}
        <div className="relative min-w-[600px]">
          {/* Mission Control Area */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-800">Mission Control</h3>
              <Badge variant="secondary">{missionControlAgents.length} agents</Badge>
            </div>
            <div 
              className="grid gap-4 p-4 bg-blue-50/50 rounded-lg border-2 border-blue-200"
              style={{ 
                gridTemplateColumns: `repeat(${Math.max(5, maxX + 1)}, minmax(120px, 1fr))`,
              }}
            >
              {missionControlAgents.map(agent => renderAgentDesk(agent))}
            </div>
          </div>

          {/* Dev Studio Area */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Code className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-gray-800">Dev Studio</h3>
              <Badge variant="secondary">{devStudioAgents.length} agents</Badge>
            </div>
            <div 
              className="grid gap-4 p-4 bg-purple-50/50 rounded-lg border-2 border-purple-200"
              style={{ 
                gridTemplateColumns: `repeat(${Math.max(5, maxX + 1)}, minmax(120px, 1fr))`,
              }}
            >
              {devStudioAgents.map(agent => renderAgentDesk(agent))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAgentDesk = (agent: OfficeAgent) => {
    const status = statusConfig[agent.status];
    const isHovered = hoveredAgent === agent.id;

    return (
      <div
        key={agent.id}
        className={cn(
          "relative p-3 rounded-lg border-2 transition-all duration-300 cursor-pointer",
          agent.status === 'working' ? "bg-white border-green-300 shadow-lg" :
          agent.status === 'idle' ? "bg-gray-50 border-gray-200" :
          "bg-white border-gray-300",
          isHovered && "scale-105 z-10"
        )}
        style={{ gridColumn: agent.deskPosition.x + 1, gridRow: agent.deskPosition.y + 1 }}
        onClick={() => {
          setSelectedAgent(agent);
          onSelectAgent?.(agent);
        }}
        onMouseEnter={() => setHoveredAgent(agent.id)}
        onMouseLeave={() => setHoveredAgent(null)}
      >
        {/* Desk Header */}
        <div className="flex items-center justify-between mb-2">
          <div className={cn("p-1.5 rounded-full", status.bgColor)}>
            {status.icon}
          </div>
          <div className="flex items-center gap-1">
            {roleIcons[agent.role]}
          </div>
        </div>

        {/* Avatar */}
        <div className="flex justify-center mb-2">
          <div className="relative">
            <img 
              src={agent.avatar} 
              alt={agent.name}
              className={cn(
                "w-16 h-16 rounded-full border-4 transition-all",
                agent.status === 'working' ? "border-green-400 animate-pulse" :
                agent.status === 'idle' ? "border-gray-300 grayscale" :
                "border-gray-300"
              )}
            />
            <div className={cn(
              "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center",
              agent.team === 'mission-control' ? "bg-blue-500" : "bg-purple-500"
            )}>
              <Bot className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>

        {/* Agent Info */}
        <div className="text-center">
          <h4 className="font-medium text-sm truncate">{agent.name}</h4>
          <p className="text-xs text-gray-500 truncate">{agent.specialty}</p>
        </div>

        {/* Status Badge */}
        <div className="mt-2 flex justify-center">
          <Badge 
            variant="secondary" 
            className={cn("text-xs", status.bgColor, status.color)}
          >
            {status.label}
          </Badge>
        </div>

        {/* Task Progress */}
        {agent.status === 'working' && agent.taskProgress !== undefined && (
          <div className="mt-2">
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${agent.taskProgress}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-500 text-center mt-1 truncate">
              {agent.currentTask}
            </p>
          </div>
        )}

        {/* Efficiency Score */}
        <div className="mt-2 flex items-center justify-center gap-1">
          <Activity className="w-3 h-3 text-gray-400" />
          <span className={cn(
            "text-xs font-medium",
            agent.efficiency >= 90 ? "text-green-600" :
            agent.efficiency >= 80 ? "text-yellow-600" :
            "text-red-600"
          )}>
            {agent.efficiency}%
          </span>
        </div>
      </div>
    );
  };

  const renderListView = () => (
    <div className="space-y-2">
      {filteredAgents.map(agent => {
        const status = statusConfig[agent.status];
        return (
          <div
            key={agent.id}
            onClick={() => setSelectedAgent(agent)}
            className="flex items-center gap-3 p-3 bg-white border rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <img src={agent.avatar} alt={agent.name} className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{agent.name}</h4>
                <Badge className={cn("text-xs", status.bgColor, status.color)}>
                  {status.label}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">{agent.currentTask || 'No active task'}</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">{agent.efficiency}%</div>
              <div className="text-xs text-gray-400">efficiency</div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="p-3 bg-gray-50 rounded-lg text-center">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-xs text-gray-500">Total Agents</div>
        </div>
        <div className="p-3 bg-green-50 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{stats.working}</div>
          <div className="text-xs text-green-700">Working</div>
        </div>
        <div className="p-3 bg-gray-100 rounded-lg text-center">
          <div className="text-2xl font-bold text-gray-600">{stats.idle}</div>
          <div className="text-xs text-gray-700">Idle</div>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.avgEfficiency}%</div>
          <div className="text-xs text-blue-700">Avg Efficiency</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value as typeof teamFilter)}
            className="px-3 py-1.5 border rounded-lg text-sm"
          >
            <option value="all">All Teams</option>
            <option value="mission-control">Mission Control</option>
            <option value="dev-studio">Dev Studio</option>
          </select>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <Button
            size="sm"
            variant={viewMode === 'office' ? 'default' : 'ghost'}
            onClick={() => setViewMode('office')}
            className="h-8"
          >
            <Monitor className="w-4 h-4 mr-1" />
            Office
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            onClick={() => setViewMode('list')}
            className="h-8"
          >
            <User className="w-4 h-4 mr-1" />
            List
          </Button>
        </div>
      </div>

      {/* View */}
      {viewMode === 'office' ? renderOfficeGrid() : renderListView()}

      {/* Agent Detail Dialog */}
      {selectedAgent && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedAgent(null)}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-4">
              <img 
                src={selectedAgent.avatar} 
                alt={selectedAgent.name}
                className="w-20 h-20 rounded-full border-4 border-blue-500"
              />
              <div>
                <h3 className="text-xl font-bold">{selectedAgent.name}</h3>
                <p className="text-gray-500">{selectedAgent.specialty}</p>
                <Badge className={cn("mt-1", statusConfig[selectedAgent.status].bgColor, statusConfig[selectedAgent.status].color)}>
                  {statusConfig[selectedAgent.status].label}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Current Task</div>
                <div className="font-medium">{selectedAgent.currentTask || 'No active task'}</div>
                {selectedAgent.taskProgress !== undefined && selectedAgent.taskProgress > 0 && (
                  <div className="mt-2">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500"
                        style={{ width: `${selectedAgent.taskProgress}%` }}
                      />
                    </div>
                    <div className="text-right text-sm text-gray-500 mt-1">
                      {selectedAgent.taskProgress}% complete
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedAgent.efficiency}%
                  </div>
                  <div className="text-xs text-gray-500">Efficiency</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {selectedAgent.team === 'mission-control' ? 'Core' : 'BMAD'}
                  </div>
                  <div className="text-xs text-gray-500">Team</div>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Role</div>
                <div className="flex items-center gap-2 mt-1">
                  {roleIcons[selectedAgent.role]}
                  <span className="font-medium capitalize">{selectedAgent.role}</span>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Last Active</div>
                <div className="font-medium">
                  {selectedAgent.lastActive.toLocaleTimeString()}
                </div>
              </div>
            </div>

            <Button 
              className="w-full mt-4" 
              onClick={() => setSelectedAgent(null)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
