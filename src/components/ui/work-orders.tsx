import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { 
  ClipboardList, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  User,
  Calendar,
  MoreHorizontal,
  Filter,
  Search,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

export type WorkOrderStatus = 'pending' | 'in_progress' | 'blocked' | 'completed' | 'cancelled';
export type WorkOrderPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface WorkOrder {
  id: string;
  title: string;
  description: string;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  assignee: string;
  requester: string;
  createdAt: Date;
  dueDate?: Date;
  completedAt?: Date;
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
  project?: string;
  phase?: string;
  comments?: number;
}

interface WorkOrdersProps {
  className?: string;
  orders?: WorkOrder[];
  onCreateOrder?: (order: Partial<WorkOrder>) => void;
  onUpdateStatus?: (orderId: string, status: WorkOrderStatus) => void;
}

// Mock work orders
const mockWorkOrders: WorkOrder[] = [
  {
    id: 'WO-001',
    title: 'Implement Package System',
    description: 'Create export/import functionality for agent configurations',
    status: 'completed',
    priority: 'high',
    assignee: 'operations-lead',
    requester: 'chief-of-staff',
    createdAt: new Date('2026-02-20'),
    completedAt: new Date('2026-02-20'),
    estimatedHours: 4,
    actualHours: 3.5,
    tags: ['dashboard', 'clawcontrol', 'feature'],
    project: 'Dashboard v1.1.0',
    comments: 2,
  },
  {
    id: 'WO-002',
    title: 'Add Governance Gates',
    description: 'Implement approval workflows for critical actions',
    status: 'completed',
    priority: 'high',
    assignee: 'operations-lead',
    requester: 'chief-of-staff',
    createdAt: new Date('2026-02-20'),
    completedAt: new Date('2026-02-20'),
    estimatedHours: 3,
    actualHours: 2.5,
    tags: ['dashboard', 'clawcontrol', 'security'],
    project: 'Dashboard v1.1.0',
    comments: 1,
  },
  {
    id: 'WO-003',
    title: 'Create Team Hierarchy View',
    description: 'Visualize reportsTo/delegatesTo relationships for all 22 agents',
    status: 'in_progress',
    priority: 'medium',
    assignee: 'operations-lead',
    requester: 'chief-of-staff',
    createdAt: new Date('2026-02-20'),
    estimatedHours: 3,
    tags: ['dashboard', 'clawcontrol', 'visualization'],
    project: 'Dashboard v1.1.0',
    comments: 0,
  },
  {
    id: 'WO-004',
    title: 'Implement Work Orders System',
    description: 'Task tracking system for agent work assignment',
    status: 'in_progress',
    priority: 'medium',
    assignee: 'operations-lead',
    requester: 'chief-of-staff',
    createdAt: new Date('2026-02-20'),
    estimatedHours: 2,
    tags: ['dashboard', 'clawcontrol', 'tracking'],
    project: 'Dashboard v1.1.0',
    comments: 0,
  },
  {
    id: 'WO-005',
    title: 'Add Audit Trail',
    description: 'Operation logging for all critical dashboard actions',
    status: 'pending',
    priority: 'low',
    assignee: 'operations-lead',
    requester: 'chief-of-staff',
    createdAt: new Date('2026-02-20'),
    estimatedHours: 2,
    tags: ['dashboard', 'clawcontrol', 'logging'],
    project: 'Dashboard v1.1.0',
    comments: 0,
  },
  {
    id: 'WO-006',
    title: 'Sound Money Bank - Phase 1 Completion',
    description: 'Complete market research and business strategy documentation',
    status: 'completed',
    priority: 'high',
    assignee: 'research-intelligence',
    requester: 'chief-of-staff',
    createdAt: new Date('2026-02-18'),
    completedAt: new Date('2026-02-19'),
    estimatedHours: 16,
    actualHours: 14,
    tags: ['sound-money-bank', 'research', 'strategy'],
    project: 'Sound Money Bank',
    phase: 'Phase 1: Planning',
    comments: 5,
  },
  {
    id: 'WO-007',
    title: 'Multi-Provider LLM Integration',
    description: 'Configure GLM-5, Claude, Gemini, Kimi, and OpenAI APIs',
    status: 'completed',
    priority: 'urgent',
    assignee: 'tech-architect',
    requester: 'chief-of-staff',
    createdAt: new Date('2026-02-20'),
    completedAt: new Date('2026-02-20'),
    estimatedHours: 4,
    actualHours: 5,
    tags: ['infrastructure', 'llm', 'api'],
    project: 'Core Infrastructure',
    comments: 3,
  },
  {
    id: 'WO-008',
    title: 'Dashboard Deployment to Vercel',
    description: 'Deploy Mission Control + Dev Studio dashboard',
    status: 'completed',
    priority: 'high',
    assignee: 'tech-architect',
    requester: 'chief-of-staff',
    createdAt: new Date('2026-02-20'),
    completedAt: new Date('2026-02-20'),
    estimatedHours: 2,
    actualHours: 1.5,
    tags: ['deployment', 'vercel', 'dashboard'],
    project: 'Dashboard v1.0.0',
    comments: 2,
  },
  {
    id: 'WO-009',
    title: 'BMAD Phase 2 - Product Brief',
    description: 'Create product brief for Sound Money Bank development',
    status: 'pending',
    priority: 'high',
    assignee: 'product-owner',
    requester: 'chief-of-staff',
    createdAt: new Date('2026-02-20'),
    dueDate: new Date('2026-02-23'),
    estimatedHours: 8,
    tags: ['sound-money-bank', 'bmad', 'product'],
    project: 'Sound Money Bank',
    phase: 'Phase 2: Product Definition',
    comments: 0,
  },
  {
    id: 'WO-010',
    title: 'Lithic Card Issuing Integration Research',
    description: 'Research Lithic API for NeoBank card issuing',
    status: 'blocked',
    priority: 'medium',
    assignee: 'tech-architect',
    requester: 'chief-of-staff',
    createdAt: new Date('2026-02-19'),
    estimatedHours: 6,
    tags: ['sound-money-bank', 'lithic', 'integration'],
    project: 'Sound Money Bank',
    comments: 1,
  },
];

export function WorkOrders({ 
  className, 
  orders = mockWorkOrders,
  onCreateOrder,
  onUpdateStatus,
}: WorkOrdersProps) {
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<WorkOrderStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<WorkOrderPriority | 'all'>('all');

  const statusColors: Record<WorkOrderStatus, string> = {
    pending: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    blocked: 'bg-red-100 text-red-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-gray-100 text-gray-500',
  };

  const priorityColors: Record<WorkOrderPriority, string> = {
    low: 'bg-blue-50 text-blue-700',
    medium: 'bg-yellow-50 text-yellow-700',
    high: 'bg-orange-50 text-orange-700',
    urgent: 'bg-red-50 text-red-700',
  };

  const statusIcons: Record<WorkOrderStatus, React.ReactNode> = {
    pending: <Clock className="w-4 h-4" />,
    in_progress: <Play className="w-4 h-4" />,
    blocked: <AlertCircle className="w-4 h-4" />,
    completed: <CheckCircle2 className="w-4 h-4" />,
    cancelled: <RotateCcw className="w-4 h-4" />,
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    inProgress: orders.filter(o => o.status === 'in_progress').length,
    blocked: orders.filter(o => o.status === 'blocked').length,
    completed: orders.filter(o => o.status === 'completed').length,
    completionRate: Math.round((orders.filter(o => o.status === 'completed').length / orders.length) * 100),
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Stats */}
      <div className="grid grid-cols-6 gap-3">
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-xl font-bold">{stats.total}</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="text-xl font-bold text-blue-600">{stats.inProgress}</div>
          <div className="text-xs text-blue-700">In Progress</div>
        </div>
        <div className="p-3 bg-yellow-50 rounded-lg">
          <div className="text-xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-xs text-yellow-700">Pending</div>
        </div>
        <div className="p-3 bg-red-50 rounded-lg">
          <div className="text-xl font-bold text-red-600">{stats.blocked}</div>
          <div className="text-xs text-red-700">Blocked</div>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="text-xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-xs text-green-700">Completed</div>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg">
          <div className="text-xl font-bold text-purple-600">{stats.completionRate}%</div>
          <div className="text-xs text-purple-700">Completion</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search work orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as WorkOrderStatus | 'all')}
          className="px-3 py-2 border rounded-lg text-sm"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="blocked">Blocked</option>
          <option value="completed">Completed</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as WorkOrderPriority | 'all')}
          className="px-3 py-2 border rounded-lg text-sm"
        >
          <option value="all">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Order
        </Button>
      </div>

      {/* Work Orders List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-mono text-gray-500">{order.id}</span>
                      <h4 className="font-medium truncate">{order.title}</h4>
                      <Badge className={cn("text-xs", statusColors[order.status])}>
                        <span className="flex items-center gap-1">
                          {statusIcons[order.status]}
                          {order.status.replace('_', ' ')}
                        </span>
                      </Badge>
                      <Badge className={cn("text-xs", priorityColors[order.priority])}>
                        {order.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                      {order.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {order.assignee}
                      </span>
                      {order.project && (
                        <span className="flex items-center gap-1">
                          <ClipboardList className="w-3 h-3" />
                          {order.project}
                        </span>
                      )}
                      {order.dueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Due {order.dueDate.toLocaleDateString()}
                        </span>
                      )}
                      {order.estimatedHours && (
                        <span>
                          Est: {order.estimatedHours}h
                          {order.actualHours && ` / Actual: ${order.actualHours}h`}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {order.tags.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {order.comments ? (
                      <Badge variant="secondary" className="text-xs">
                        {order.comments} 💬
                      </Badge>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-mono text-gray-500">{selectedOrder?.id}</span>
              <Badge className={cn("text-xs", selectedOrder && statusColors[selectedOrder.status])}>
                {selectedOrder?.status.replace('_', ' ')}
              </Badge>
            </div>
            <DialogTitle>{selectedOrder?.title}</DialogTitle>
            <DialogDescription>{selectedOrder?.description}</DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">Assignee</div>
                  <div className="font-medium">{selectedOrder.assignee}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">Requester</div>
                  <div className="font-medium">{selectedOrder.requester}</div>
                </div>
              </div>

              {selectedOrder.project && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-gray-500">Project</div>
                  <div className="font-medium">{selectedOrder.project}</div>
                  {selectedOrder.phase && (
                    <div className="text-sm text-gray-600 mt-1">{selectedOrder.phase}</div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="text-sm text-gray-500">Priority</div>
                  <Badge className={cn("mt-1", priorityColors[selectedOrder.priority])}>
                    {selectedOrder.priority}
                  </Badge>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="text-sm text-gray-500">Created</div>
                  <div className="font-medium text-sm mt-1">
                    {selectedOrder.createdAt.toLocaleDateString()}
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="text-sm text-gray-500">Hours</div>
                  <div className="font-medium text-sm mt-1">
                    {selectedOrder.actualHours || '-'}/{selectedOrder.estimatedHours || '-'}h
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Tags</div>
                <div className="flex flex-wrap gap-2">
                  {selectedOrder.tags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <DialogFooter className="gap-2">
                {selectedOrder.status !== 'completed' && selectedOrder.status !== 'cancelled' && (
                  <>
                    {selectedOrder.status === 'pending' && (
                      <Button onClick={() => onUpdateStatus?.(selectedOrder.id, 'in_progress')}>
                        <Play className="w-4 h-4 mr-2" />
                        Start Work
                      </Button>
                    )}
                    {selectedOrder.status === 'in_progress' && (
                      <>
                        <Button variant="outline" onClick={() => onUpdateStatus?.(selectedOrder.id, 'blocked')}>
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Block
                        </Button>
                        <Button onClick={() => onUpdateStatus?.(selectedOrder.id, 'completed')}>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Complete
                        </Button>
                      </>
                    )}
                    {selectedOrder.status === 'blocked' && (
                      <Button onClick={() => onUpdateStatus?.(selectedOrder.id, 'in_progress')}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Unblock
                      </Button>
                    )}
                  </>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Dialog Placeholder */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Work Order</DialogTitle>
            <DialogDescription>
              Assign a new task to a team member
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500">
              This would open a form to create a new work order with title, description, 
              assignee, priority, estimated hours, and tags.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowCreateDialog(false)}>
              Create Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
