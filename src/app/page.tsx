'use client'

import React, { useState } from 'react'
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Shield, 
  BarChart3,
  Cpu,
  Code,
  Menu,
  X,
  ChevronRight,
  Activity,
  Target,
  Wallet,
  Layers
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { 
  MetricCard, 
  AgentStatusCard, 
  TaskCompletionCard, 
  BMADPhaseCard,
  CostTrackerCard,
  MetricsGrid 
} from '@/components/ui/metric-card'
import { BMADWorkflowVisualization } from '@/components/ui/workflow-visualization'
import { SecretsVault } from '@/components/secrets'

const navigation = [
  { name: 'Mission Control', icon: LayoutDashboard, id: 'mission-control' },
  { name: 'Dev Studio', icon: Code, id: 'dev-studio' },
  { name: 'Agents', icon: Cpu, id: 'agents' },
  { name: 'Metrics', icon: BarChart3, id: 'metrics' },
  { name: 'Secrets Vault', icon: Shield, id: 'secrets' },
  { name: 'Team', icon: Users, id: 'team' },
  { name: 'Settings', icon: Settings, id: 'settings' },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('mission-control')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const renderContent = () => {
    switch (activeTab) {
      case 'mission-control':
        return <MissionControlView />
      case 'dev-studio':
        return <DevStudioView />
      case 'agents':
        return <AgentsView />
      case 'metrics':
        return <MetricsView />
      case 'secrets':
        return <SecretsVault />
      case 'team':
        return <TeamView />
      case 'settings':
        return <SettingsView />
      default:
        return <MissionControlView />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-slate-900 text-white transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">
              AI
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <h1 className="font-bold text-sm whitespace-nowrap">Andre Philippe</h1>
                <p className="text-xs text-slate-400 whitespace-nowrap">AI Team</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm whitespace-nowrap">{item.name}</span>}
              </button>
            )
          })}
        </nav>

        {/* Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-4 border-t border-slate-800 text-slate-400 hover:text-white"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {navigation.find(n => n.id === activeTab)?.name || 'Dashboard'}
            </h2>
            <p className="text-sm text-gray-500">
              {activeTab === 'mission-control' && 'Strategic overview and key metrics'}
              {activeTab === 'dev-studio' && 'Development workflows and BMAD agents'}
              {activeTab === 'agents' && 'Manage your 22 AI agents'}
              {activeTab === 'metrics' && 'Performance and cost analytics'}
              {activeTab === 'secrets' && 'Secure API key management'}
              {activeTab === 'team' && 'Team management and settings'}
              {activeTab === 'settings' && 'System configuration'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              System Online
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

// View Components
function MissionControlView() {
  return (
    <div className="space-y-6">
      {/* New Metric Cards */}
      <MetricsGrid columns={4}>
        <AgentStatusCard 
          activeAgents={22} 
          totalAgents={22} 
          trend={{ direction: 'up', value: '+2 this week' }}
        />
        <TaskCompletionCard 
          completed={156} 
          total={200}
          trend={{ direction: 'up', value: '+23 today' }}
        />
        <BMADPhaseCard 
          currentPhase={3} 
          totalPhases={4}
          phaseName="Execution"
        />
        <CostTrackerCard 
          todayCost={12.45} 
          budget={50.00}
        />
      </MetricsGrid>

      {/* Active Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Active Projects</CardTitle>
          <CardDescription>Current projects in development</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ProjectCard 
              name="Sound Money Bank" 
              status="In Progress" 
              progress={65}
              agents={12}
              phase="Fase 2: BMAD Development"
            />
            <ProjectCard 
              name="Dashboard Infrastructure" 
              status="Active" 
              progress={80}
              agents={4}
              phase="Deployment Phase"
            />
            <ProjectCard 
              name="AI Team Architecture" 
              status="Active" 
              progress={95}
              agents={6}
              phase="Optimization"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button>Start New Project</Button>
            <Button variant="outline">View Agent Status</Button>
            <Button variant="outline">Cost Report</Button>
            <Button variant="outline">System Health</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ProjectCard({ name, status, progress, agents, phase }: {
  name: string
  status: string
  progress: number
  agents: number
  phase: string
}) {
  const statusColors: Record<string, string> = {
    'In Progress': 'bg-blue-100 text-blue-800',
    'Active': 'bg-green-100 text-green-800',
    'Planning': 'bg-yellow-100 text-yellow-800',
  }

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-gray-900">{name}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100'}`}>
            {status}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">{phase}</p>
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
          <span>{agents} agents assigned</span>
          <span>•</span>
          <span>{progress}% complete</span>
        </div>
      </div>
      <div className="w-32">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <Button variant="ghost" size="sm" className="ml-4">
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}

function DevStudioView() {
  return (
    <div className="space-y-6">
      {/* New BMAD Workflow Visualization */}
      <BMADWorkflowVisualization currentPhase={3} />
      
      <Card>
        <CardHeader>
          <CardTitle>BMAD Agents Overview</CardTitle>
          <CardDescription>12 specialized development agents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">6</div>
              <div className="text-sm text-blue-800">Planning Agents</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">1</div>
              <div className="text-sm text-green-800">Readiness Agent</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">12</div>
              <div className="text-sm text-purple-800">Execution Agents</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Active Stories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">No active stories in current sprint</p>
            <Button className="mt-4" variant="outline">Create New Story</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agent Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Code Review</span>
                <span className="text-green-600">98% success</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Story Creation</span>
                <span className="text-green-600">95% success</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>QA Testing</span>
                <span className="text-yellow-600">87% success</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function AgentsView() {
  const agents = {
    core: [
      { name: 'Chief of Staff', provider: 'Kimi', status: 'Active', tasks: 45 },
      { name: 'Strategic Planner', provider: 'OpenAI', status: 'Active', tasks: 23 },
      { name: 'Financial Controller', provider: 'OpenAI', status: 'Active', tasks: 18 },
      { name: 'Tech Lead', provider: 'Claude', status: 'Active', tasks: 67 },
    ],
    bmad: [
      { name: 'Product Owner', provider: 'GLM-5', status: 'Active', tasks: 34 },
      { name: 'Business Analyst', provider: 'GLM-5', status: 'Active', tasks: 28 },
      { name: 'Code Review', provider: 'Claude', status: 'Active', tasks: 156 },
      { name: 'QA Tester', provider: 'GLM-5', status: 'Active', tasks: 89 },
    ]
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Core Agents (10)</CardTitle>
          <CardDescription>Strategic and organizational agents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.core.map((agent) => (
              <AgentCard key={agent.name} {...agent} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>BMAD Agents (12)</CardTitle>
          <CardDescription>Development workflow agents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.bmad.map((agent) => (
              <AgentCard key={agent.name} {...agent} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AgentCard({ name, provider, status, tasks }: {
  name: string
  provider: string
  status: string
  tasks: number
}) {
  const providerColors: Record<string, string> = {
    'Kimi': 'bg-purple-100 text-purple-800',
    'OpenAI': 'bg-green-100 text-green-800',
    'Claude': 'bg-orange-100 text-orange-800',
    'GLM-5': 'bg-blue-100 text-blue-800',
  }

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <div>
        <h4 className="font-semibold">{name}</h4>
        <div className="flex items-center gap-2 mt-1">
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${providerColors[provider] || 'bg-gray-100'}`}>
            {provider}
          </span>
          <span className="text-sm text-gray-500">{tasks} tasks</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-sm text-gray-600">{status}</span>
      </div>
    </div>
  )
}

function MetricsView() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cost Analysis</CardTitle>
          <CardDescription>API usage and cost breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Today</span>
              <span className="text-xl font-bold">$12.45</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">This Week</span>
              <span className="text-xl font-bold">$87.32</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">This Month</span>
              <span className="text-xl font-bold">$342.18</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Provider Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>GLM-5</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 w-[45%]" />
                  </div>
                  <span className="text-sm text-gray-600">45%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Claude 3.7</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-600 w-[25%]" />
                  </div>
                  <span className="text-sm text-gray-600">25%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>OpenAI o1</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-600 w-[20%]" />
                  </div>
                  <span className="text-sm text-gray-600">20%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Kimi K2.5</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 w-[10%]" />
                  </div>
                  <span className="text-sm text-gray-600">10%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Code Generation</span>
                <span className="font-medium">156 tasks</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Code Review</span>
                <span className="font-medium">89 tasks</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Documentation</span>
                <span className="font-medium">45 tasks</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Analysis</span>
                <span className="font-medium">34 tasks</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function TeamView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Management</CardTitle>
        <CardDescription>Coming soon - Team collaboration features</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500">Team management features will be available in the next update.</p>
      </CardContent>
    </Card>
  )
}

function SettingsView() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>Configure your dashboard preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Auto-refresh Dashboard</h4>
                <p className="text-sm text-gray-500">Update metrics every 30 seconds</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Email Notifications</h4>
                <p className="text-sm text-gray-500">Receive alerts for important events</p>
              </div>
              <input type="checkbox" className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Dark Mode</h4>
                <p className="text-sm text-gray-500">Toggle between light and dark theme</p>
              </div>
              <input type="checkbox" className="w-5 h-5" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Version Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Dashboard Version</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Last Updated</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Environment</span>
              <span className="font-medium">Production</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
