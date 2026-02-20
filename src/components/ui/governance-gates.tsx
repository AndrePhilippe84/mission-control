import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Shield, 
  CheckCircle2, 
  AlertTriangle, 
  Lock,
  Unlock,
  Clock,
  User,
  AlertCircle
} from 'lucide-react';

export interface GovernanceRule {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  requiresApproval: boolean;
  confirmationType: 'none' | 'click' | 'type_confirm' | 'multi_approval';
  confirmationText?: string;
  approvers?: string[];
  cooldownMinutes?: number;
}

export interface PendingApproval {
  id: string;
  action: string;
  description: string;
  requestedBy: string;
  requestedAt: Date;
  severity: GovernanceRule['severity'];
  rule: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface GovernanceGatesProps {
  className?: string;
  rules?: GovernanceRule[];
  pendingApprovals?: PendingApproval[];
  onRequestApproval?: (action: string, description: string) => void;
  onApprove?: (approvalId: string) => void;
  onReject?: (approvalId: string) => void;
}

// Mock data
const mockRules: GovernanceRule[] = [
  {
    id: 'rule-001',
    name: 'Delete API Keys',
    description: 'Deleting secrets from the vault requires confirmation',
    severity: 'high',
    requiresApproval: true,
    confirmationType: 'type_confirm',
    confirmationText: 'DELETE SECRETS',
  },
  {
    id: 'rule-002',
    name: 'Deploy to Production',
    description: 'Production deployments require explicit approval',
    severity: 'critical',
    requiresApproval: true,
    confirmationType: 'multi_approval',
    approvers: ['chief-of-staff', 'tech-lead'],
    cooldownMinutes: 30,
  },
  {
    id: 'rule-003',
    name: 'Modify Agent Config',
    description: 'Changes to agent configurations are logged',
    severity: 'medium',
    requiresApproval: false,
    confirmationType: 'click',
  },
  {
    id: 'rule-004',
    name: 'Execute Costly Operations',
    description: 'Operations costing >$10 require approval',
    severity: 'high',
    requiresApproval: true,
    confirmationType: 'type_confirm',
    confirmationText: 'APPROVE COST',
  },
];

const mockApprovals: PendingApproval[] = [
  {
    id: 'app-001',
    action: 'Deploy Sound Money Bank to Production',
    description: 'Deploying complete BMAD workflow to production environment',
    requestedBy: 'Chief of Staff',
    requestedAt: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
    severity: 'critical',
    rule: 'Deploy to Production',
    status: 'pending',
  },
];

export function GovernanceGates({ 
  className, 
  rules = mockRules,
  pendingApprovals = mockApprovals,
  onRequestApproval,
  onApprove,
  onReject,
}: GovernanceGatesProps) {
  const [selectedRule, setSelectedRule] = useState<GovernanceRule | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [actionPending, setActionPending] = useState<string | null>(null);

  const severityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800',
  };

  const handleRequestAction = (action: string, description: string, rule: GovernanceRule) => {
    if (rule.requiresApproval) {
      setActionPending(action);
      setSelectedRule(rule);
      setShowConfirmation(true);
    } else {
      onRequestApproval?.(action, description);
    }
  };

  const handleConfirm = () => {
    if (selectedRule?.confirmationType === 'type_confirm') {
      if (confirmationText !== selectedRule.confirmationText) {
        return; // Don't proceed if text doesn't match
      }
    }
    
    onRequestApproval?.(actionPending || '', '');
    setShowConfirmation(false);
    setConfirmationText('');
    setActionPending(null);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Pending Approvals */}
      {pendingApprovals.length > 0 && (
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <CardTitle>Pending Approvals</CardTitle>
              <Badge variant="secondary" className="bg-orange-100">
                {pendingApprovals.length}
              </Badge>
            </div>
            <CardDescription>
              Actions waiting for governance approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingApprovals.map((approval) => (
                <div
                  key={approval.id}
                  className="flex items-center justify-between p-4 bg-white border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{approval.action}</h4>
                      <Badge className={severityColors[approval.severity]}>
                        {approval.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      {approval.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {approval.requestedBy}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {Math.floor((Date.now() - approval.requestedAt.getTime()) / 60000)}m ago
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onReject?.(approval.id)}
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onApprove?.(approval.id)}
                    >
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Governance Rules */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-500" />
            <CardTitle>Governance Rules</CardTitle>
          </div>
          <CardDescription>
            Security controls and approval workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{rule.name}</h4>
                    <Badge className={severityColors[rule.severity]}>
                      {rule.severity}
                    </Badge>
                    {rule.requiresApproval && (
                      <Badge variant="outline" className="text-orange-600 border-orange-200">
                        <Lock className="w-3 h-3 mr-1" />
                        Approval Required
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {rule.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span>Confirmation: {rule.confirmationType.replace('_', ' ')}</span>
                    {rule.cooldownMinutes && (
                      <>
                        <span>•</span>
                        <span>Cooldown: {rule.cooldownMinutes}min</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {rule.requiresApproval ? (
                    <Lock className="w-5 h-5 text-orange-500" />
                  ) : (
                    <Unlock className="w-5 h-5 text-green-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <div className="flex-1">
                <span className="font-medium">Deploy approved</span>
                <span className="text-gray-500"> - Sound Money Bank to staging</span>
              </div>
              <span className="text-xs text-gray-400">2h ago</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <AlertCircle className="w-4 h-4 text-orange-500" />
              <div className="flex-1">
                <span className="font-medium">High-cost operation</span>
                <span className="text-gray-500"> - Code review with Claude Opus ($8.50)</span>
              </div>
              <span className="text-xs text-gray-400">4h ago</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Lock className="w-4 h-4 text-blue-500" />
              <div className="flex-1">
                <span className="font-medium">Secret deleted</span>
                <span className="text-gray-500"> - Old API key removed from vault</span>
              </div>
              <span className="text-xs text-gray-400">1d ago</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <DialogTitle>Governance Approval Required</DialogTitle>
            </div>
            <DialogDescription>
              This action requires explicit confirmation
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg mb-4">
              <p className="font-medium text-orange-900">{actionPending}</p>
              <p className="text-sm text-orange-700 mt-1">
                Rule: {selectedRule?.name}
              </p>
            </div>

            {selectedRule?.confirmationType === 'type_confirm' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Type "{selectedRule.confirmationText}" to confirm:
                </label>
                <Input
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  placeholder={selectedRule.confirmationText}
                />
                {confirmationText && confirmationText !== selectedRule.confirmationText && (
                  <p className="text-sm text-red-500">
                    Text doesn't match. Please type exactly: {selectedRule.confirmationText}
                  </p>
                )}
              </div>
            )}

            {selectedRule?.confirmationType === 'multi_approval' && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  This action requires approval from:
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedRule.approvers?.map((approver) => (
                    <Badge key={approver} variant="secondary">
                      <User className="w-3 h-3 mr-1" />
                      {approver}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-orange-600 mt-2">
                  A request has been sent to approvers.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={selectedRule?.confirmationType === 'type_confirm' && confirmationText !== selectedRule.confirmationText}
            >
              Confirm Action
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Simplified button wrapper that triggers governance checks
interface ProtectedActionButtonProps {
  action: string;
  description?: string;
  ruleId: string;
  severity?: GovernanceRule['severity'];
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'destructive';
  className?: string;
}

export function ProtectedActionButton({
  action,
  description,
  ruleId,
  severity = 'medium',
  onClick,
  children,
  variant = 'default',
  className,
}: ProtectedActionButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const requiredText = 'CONFIRM';

  const handleClick = () => {
    if (severity === 'critical' || severity === 'high') {
      setShowConfirm(true);
    } else {
      onClick?.();
    }
  };

  const handleConfirm = () => {
    if (confirmationText === requiredText) {
      onClick?.();
      setShowConfirm(false);
      setConfirmationText('');
    }
  };

  return (
    <>
      <Button
        variant={variant}
        className={cn(className)}
        onClick={handleClick}
      >
        {(severity === 'critical' || severity === 'high') && (
          <Shield className="w-4 h-4 mr-2" />
        )}
        {children}
      </Button>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Confirm Action
            </DialogTitle>
            <DialogDescription>
              {description || `Are you sure you want to ${action}?`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg mb-4">
              <p className="text-sm font-medium text-orange-900">Action: {action}</p>
              <Badge className={severity === 'critical' ? 'bg-red-100 text-red-800 mt-2' : 'bg-orange-100 text-orange-800 mt-2'}>
                {severity.toUpperCase()} SEVERITY
              </Badge>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Type "{requiredText}" to proceed:
              </label>
              <Input
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder={requiredText}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={confirmationText !== requiredText}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
