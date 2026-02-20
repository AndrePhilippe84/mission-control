import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Package, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  FileJson,
  Archive,
  ChevronRight,
  Shield
} from 'lucide-react';

export interface PackageManifest {
  id: string;
  name: string;
  version: string;
  description?: string;
  kind: 'agent_template' | 'agent_team' | 'workflow' | 'team_with_workflows' | 'full_config';
  createdAt: Date;
  size: string;
  contents: {
    agentTemplates?: number;
    workflows?: number;
    teams?: number;
    secrets?: boolean;
  };
}

interface PackageSystemProps {
  className?: string;
  onExport?: (manifest: PackageManifest) => void;
  onImport?: (file: File) => void;
}

// Mock packages for demo
const mockPackages: PackageManifest[] = [
  {
    id: 'pkg-001',
    name: 'Sound Money Bank - Initial Setup',
    version: '1.0.0',
    description: 'Complete agent configuration for NeoBank project',
    kind: 'team_with_workflows',
    createdAt: new Date('2026-02-20'),
    size: '245 KB',
    contents: {
      agentTemplates: 22,
      workflows: 4,
      teams: 1,
      secrets: false,
    },
  },
  {
    id: 'pkg-002',
    name: 'BMAD Core Workflows',
    version: '2.1.0',
    description: 'Standard BMAD development workflows',
    kind: 'workflow',
    createdAt: new Date('2026-02-18'),
    size: '89 KB',
    contents: {
      workflows: 4,
    },
  },
  {
    id: 'pkg-003',
    name: 'Financial Analyst Team',
    version: '1.2.0',
    kind: 'agent_team',
    createdAt: new Date('2026-02-15'),
    size: '156 KB',
    contents: {
      agentTemplates: 5,
      teams: 1,
    },
  },
];

export function PackageSystem({ className, onExport, onImport }: PackageSystemProps) {
  const [packages, setPackages] = useState<PackageManifest[]>(mockPackages);
  const [selectedPackage, setSelectedPackage] = useState<PackageManifest | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [importStage, setImportStage] = useState<'analyze' | 'review' | 'deploy'>('analyze');

  const handleExport = (type: PackageManifest['kind']) => {
    const newPackage: PackageManifest = {
      id: `pkg-${Date.now()}`,
      name: `Export ${type} - ${new Date().toLocaleDateString()}`,
      version: '1.0.0',
      kind: type,
      createdAt: new Date(),
      size: '0 KB',
      contents: {
        agentTemplates: type === 'agent_team' || type === 'team_with_workflows' || type === 'full_config' ? 22 : 0,
        workflows: type === 'workflow' || type === 'team_with_workflows' || type === 'full_config' ? 4 : 0,
        teams: type === 'agent_team' || type === 'team_with_workflows' || type === 'full_config' ? 1 : 0,
        secrets: type === 'full_config',
      },
    };
    
    onExport?.(newPackage);
    setShowExportDialog(false);
  };

  const handleImport = (file: File) => {
    // Simulate import process
    setImportStage('analyze');
    setTimeout(() => setImportStage('review'), 1000);
  };

  const getKindIcon = (kind: PackageManifest['kind']) => {
    switch (kind) {
      case 'agent_template':
        return <Package className="w-4 h-4" />;
      case 'agent_team':
        return <Shield className="w-4 h-4" />;
      case 'workflow':
        return <FileJson className="w-4 h-4" />;
      case 'team_with_workflows':
        return <Archive className="w-4 h-4" />;
      case 'full_config':
        return <CheckCircle2 className="w-4 h-4" />;
    }
  };

  const getKindColor = (kind: PackageManifest['kind']) => {
    switch (kind) {
      case 'agent_template':
        return 'bg-blue-100 text-blue-800';
      case 'agent_team':
        return 'bg-purple-100 text-purple-800';
      case 'workflow':
        return 'bg-green-100 text-green-800';
      case 'team_with_workflows':
        return 'bg-orange-100 text-orange-800';
      case 'full_config':
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header Actions */}
      <div className="flex gap-3">
        <Button onClick={() => setShowExportDialog(true)} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Package
        </Button>
        <Button onClick={() => setShowImportDialog(true)}>
          <Upload className="w-4 h-4 mr-2" />
          Import Package
        </Button>
      </div>

      {/* Packages List */}
      <Card>
        <CardHeader>
          <CardTitle>Saved Packages</CardTitle>
          <CardDescription>Export and import agent configurations, workflows, and teams</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg)}
                className={cn(
                  "flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors",
                  "hover:bg-gray-50",
                  selectedPackage?.id === pkg.id && "border-blue-500 bg-blue-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg", getKindColor(pkg.kind))}>
                    {getKindIcon(pkg.kind)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{pkg.name}</h4>
                      <Badge variant="secondary">v{pkg.version}</Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      {pkg.description || `${pkg.kind.replace('_', ' ')} package`}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      <span>{pkg.size}</span>
                      <span>•</span>
                      <span>{pkg.createdAt.toLocaleDateString()}</span>
                      {pkg.contents.agentTemplates ? (
                        <>
                          <span>•</span>
                          <span>{pkg.contents.agentTemplates} agents</span>
                        </>
                      ) : null}
                      {pkg.contents.workflows ? (
                        <>
                          <span>•</span>
                          <span>{pkg.contents.workflows} workflows</span>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Configuration</DialogTitle>
            <DialogDescription>
              Create a portable package of your current setup
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <Button
              onClick={() => handleExport('agent_team')}
              variant="outline"
              className="w-full justify-start h-auto py-4"
            >
              <Shield className="w-5 h-5 mr-3 text-purple-500" />
              <div className="text-left">
                <div className="font-medium">Agent Team</div>
                <div className="text-sm text-gray-500">Export all 22 agent templates and team configuration</div>
              </div>
            </Button>
            <Button
              onClick={() => handleExport('workflow')}
              variant="outline"
              className="w-full justify-start h-auto py-4"
            >
              <FileJson className="w-5 h-5 mr-3 text-green-500" />
              <div className="text-left">
                <div className="font-medium">BMAD Workflows</div>
                <div className="text-sm text-gray-500">Export the 4-phase BMAD workflow definitions</div>
              </div>
            </Button>
            <Button
              onClick={() => handleExport('team_with_workflows')}
              variant="outline"
              className="w-full justify-start h-auto py-4"
            >
              <Archive className="w-5 h-5 mr-3 text-orange-500" />
              <div className="text-left">
                <div className="font-medium">Complete Setup</div>
                <div className="text-sm text-gray-500">Export everything: agents, workflows, and teams</div>
              </div>
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Package</DialogTitle>
            <DialogDescription>
              Import a .clawpack.zip file to restore or share configurations
            </DialogDescription>
          </DialogHeader>
          
          {importStage === 'analyze' && (
            <div className="py-8 text-center">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-sm text-gray-500 mb-4">
                  Drag and drop your .clawpack.zip file here
                </p>
                <input
                  type="file"
                  accept=".zip"
                  onChange={(e) => e.target.files?.[0] && handleImport(e.target.files[0])}
                  className="hidden"
                  id="package-upload"
                />
                <label htmlFor="package-upload">
                  <Button variant="outline" type="button">Select File</Button>
                </label>
              </div>
            </div>
          )}

          {importStage === 'review' && (
            <div className="py-4">
              <div className="flex items-center gap-3 mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <div className="text-sm">
                  <span className="font-medium">Review before deploy:</span>
                  {' '}This will overwrite existing configurations
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span>Package Type</span>
                  <Badge>team_with_workflows</Badge>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Agent Templates</span>
                  <span className="font-medium">22</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Workflows</span>
                  <span className="font-medium">4</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Size</span>
                  <span className="font-medium">245 KB</span>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              Cancel
            </Button>
            {importStage === 'review' && (
              <Button onClick={() => setShowImportDialog(false)}>
                Deploy Package
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
