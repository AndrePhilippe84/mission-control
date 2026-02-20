import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  description?: string;
  status: 'completed' | 'in-progress' | 'pending' | 'blocked';
  agent?: string;
  estimatedTime?: string;
}

interface WorkflowVisualizationProps {
  steps: WorkflowStep[];
  currentStepId?: string;
  className?: string;
  title?: string;
}

const statusConfig = {
  'completed': {
    icon: CheckCircle2,
    color: 'text-green-500',
    bgColor: 'bg-green-500',
    borderColor: 'border-green-500',
    label: 'Completed',
  },
  'in-progress': {
    icon: Clock,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500',
    borderColor: 'border-blue-500',
    label: 'In Progress',
  },
  'pending': {
    icon: Circle,
    color: 'text-gray-400',
    bgColor: 'bg-gray-400',
    borderColor: 'border-gray-300',
    label: 'Pending',
  },
  'blocked': {
    icon: AlertCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-500',
    borderColor: 'border-red-500',
    label: 'Blocked',
  },
};

export function WorkflowVisualization({
  steps,
  currentStepId,
  className,
  title = "Workflow Pipeline",
}: WorkflowVisualizationProps) {
  const currentIndex = steps.findIndex(step => step.id === currentStepId);

  return (
    <div className={cn("bg-card rounded-lg border p-6", className)}>
      {title && (
        <h3 className="text-lg font-semibold mb-6">{title}</h3>
      )}
      
      <div className="relative">
        {/* Progress line */}
        <div className="absolute left-[19px] top-8 bottom-8 w-0.5 bg-muted" />
        
        {/* Completed progress */}
        {currentIndex > 0 && (
          <div 
            className="absolute left-[19px] top-8 w-0.5 bg-blue-500 transition-all duration-500"
            style={{ 
              height: `${(currentIndex / (steps.length - 1)) * 100}%`,
              maxHeight: 'calc(100% - 64px)'
            }}
          />
        )}

        <div className="space-y-4">
          {steps.map((step, index) => {
            const config = statusConfig[step.status];
            const Icon = config.icon;
            const isCurrent = step.id === currentStepId;
            const isPast = index < currentIndex;
            
            return (
              <div 
                key={step.id}
                className={cn(
                  "relative flex gap-4 p-4 rounded-lg transition-all duration-300",
                  isCurrent && "bg-blue-500/5 border border-blue-200",
                  step.status === 'blocked' && "bg-red-500/5 border border-red-200"
                )}
              >
                {/* Status icon */}
                <div className="relative z-10 flex-shrink-0">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 bg-background",
                    config.borderColor,
                    isCurrent && "ring-4 ring-blue-500/20"
                  )}>
                    <Icon className={cn("w-5 h-5", config.color)} />
                  </div>
                  
                  {/* Step number badge */}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-muted text-xs flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={cn(
                      "font-medium",
                      isCurrent && "text-blue-600"
                    )}>
                      {step.name}
                    </h4>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full bg-opacity-10",
                      config.bgColor,
                      config.color
                    )}>
                      {config.label}
                    </span>
                  </div>
                  
                  {step.description && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {step.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {step.agent && (
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        Agent: {step.agent}
                      </span>
                    )}
                    {step.estimatedTime && (
                      <span>⏱️ {step.estimatedTime}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Pre-configured BMAD Workflow Visualization
export function BMADWorkflowVisualization({
  currentPhase = 1,
  className,
}: {
  currentPhase?: number;
  className?: string;
}) {
  const bmadSteps: WorkflowStep[] = [
    {
      id: 'planning',
      name: 'Phase 1: Planning',
      description: 'Product Owner, Business Analyst, Architect, UX Designer, Scrum Master, Readiness Check',
      status: currentPhase > 1 ? 'completed' : currentPhase === 1 ? 'in-progress' : 'pending',
      agent: 'Product Owner',
      estimatedTime: '2-3 days',
    },
    {
      id: 'readiness',
      name: 'Phase 2: Readiness Check',
      description: 'Validar que todo está listo para desarrollo',
      status: currentPhase > 2 ? 'completed' : currentPhase === 2 ? 'in-progress' : 'pending',
      agent: 'Readiness Check',
      estimatedTime: '1 day',
    },
    {
      id: 'execution',
      name: 'Phase 3: Execution',
      description: 'Create Story, Dev Story, Code Review, UX Review, QA Tester, Retrospective',
      status: currentPhase > 3 ? 'completed' : currentPhase === 3 ? 'in-progress' : 'pending',
      agent: 'Dev Team',
      estimatedTime: '1-2 weeks',
    },
    {
      id: 'launch',
      name: 'Phase 4: Launch',
      description: 'Communications Strategist, Capital Raising',
      status: currentPhase > 4 ? 'completed' : currentPhase === 4 ? 'in-progress' : 'pending',
      agent: 'Communications',
      estimatedTime: '2-3 days',
    },
  ];

  return (
    <WorkflowVisualization
      steps={bmadSteps}
      currentStepId={bmadSteps[currentPhase - 1]?.id}
      title="BMAD Workflow Pipeline"
      className={className}
    />
  );
}

// Horizontal workflow for compact views
interface HorizontalWorkflowProps {
  steps: { id: string; name: string; status: WorkflowStep['status'] }[];
  currentStepId?: string;
  className?: string;
}

export function HorizontalWorkflow({
  steps,
  currentStepId,
  className,
}: HorizontalWorkflowProps) {
  const currentIndex = steps.findIndex(step => step.id === currentStepId);
  const progress = ((currentIndex + 1) / steps.length) * 100;

  return (
    <div className={cn("w-full", className)}>
      {/* Progress bar */}
      <div className="relative h-2 bg-muted rounded-full mb-4">
        <div 
          className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Steps */}
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const config = statusConfig[step.status];
          const isCurrent = step.id === currentStepId;
          
          return (
            <div 
              key={step.id}
              className={cn(
                "flex flex-col items-center text-center",
                "flex-1",
                index === 0 && "items-start",
                index === steps.length - 1 && "items-end"
              )}
            >
              <div className={cn(
                "w-3 h-3 rounded-full mb-2",
                config.bgColor,
                isCurrent && "ring-4 ring-blue-500/20"
              )} />
              <span className={cn(
                "text-xs font-medium",
                isCurrent ? "text-blue-600" : "text-muted-foreground"
              )}>
                {step.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
