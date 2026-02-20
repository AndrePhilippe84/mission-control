import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { 
  Brain, 
  FileText, 
  Search, 
  Calendar,
  Clock,
  ChevronRight,
  Star,
  Tag,
  Hash,
  FileJson,
  ScrollText,
  BookOpen
} from 'lucide-react';

export type MemoryType = 'daily' | 'long_term' | 'project' | 'decision' | 'learning';

export interface MemoryEntry {
  id: string;
  title: string;
  content: string;
  type: MemoryType;
  date: Date;
  tags: string[];
  isPinned?: boolean;
  summary?: string;
  relatedMemories?: string[];
  category?: string;
}

interface MemoryViewProps {
  className?: string;
  memories?: MemoryEntry[];
  onSearch?: (query: string) => void;
}

// Mock memories based on actual project structure
const mockMemories: MemoryEntry[] = [
  {
    id: 'mem-001',
    title: 'Dashboard v1.1.0 Release',
    content: 'Successfully deployed Dashboard v1.1.0 with ClawControl features including Metric Cards, Workflow Visualization, Package System, and Governance Gates. Build size: 136 kB.',
    type: 'project',
    date: new Date('2026-02-20'),
    tags: ['dashboard', 'release', 'clawcontrol'],
    isPinned: true,
    summary: 'Major dashboard release with 4 new features',
    category: 'Development',
  },
  {
    id: 'mem-002',
    title: 'Daily Log - Feb 20, 2026',
    content: 'Implemented Team Hierarchy, Work Orders, and Audit Trail components. Multi-provider LLM system operational with GLM-5, Claude, Gemini, Kimi, and OpenAI.',
    type: 'daily',
    date: new Date('2026-02-20'),
    tags: ['daily-log', 'llm', 'dashboard'],
    category: 'Daily',
  },
  {
    id: 'mem-003',
    title: 'Sound Money Bank - Phase 1 Complete',
    content: 'Completed market research, business strategy, and financial modeling for NeoBank project. Delaware LLC structure confirmed viable with Lithic card issuing.',
    type: 'project',
    date: new Date('2026-02-19'),
    tags: ['sound-money-bank', 'neobank', 'fintech'],
    isPinned: true,
    summary: 'NeoBank project ready for Phase 2 development',
    category: 'Projects',
  },
  {
    id: 'mem-004',
    title: 'Multi-Provider LLM Strategy Decision',
    content: 'Decision to use hybrid architecture: GLM-5 for cost-effective tasks, Claude 4.6 for code review, Kimi for orchestration, Gemini for general tasks.',
    type: 'decision',
    date: new Date('2026-02-20'),
    tags: ['llm', 'strategy', 'cost-optimization'],
    category: 'Decisions',
  },
  {
    id: 'mem-005',
    title: 'YouTube Summarizer Agent Created',
    content: 'Created specialized agent for processing YouTube videos in background using sessions_spawn. Saves summaries to summaries/ directory.',
    type: 'learning',
    date: new Date('2026-02-20'),
    tags: ['agent', 'youtube', 'video-processing'],
    category: 'Agents',
  },
  {
    id: 'mem-006',
    title: 'Zero Error Protocol Implementation',
    content: 'Implemented protocol to reduce hallucinations: verify sources, re-derive math, label uncertainty, self-correct. Based on Jayden\'s Cognitive Infrastructure.',
    type: 'learning',
    date: new Date('2026-02-19'),
    tags: ['protocol', 'reliability', 'best-practices'],
    isPinned: true,
    summary: 'Critical protocol for accurate responses',
    category: 'Protocols',
  },
  {
    id: 'mem-007',
    title: 'OpenClaw Security Update 2026.2.19',
    content: 'Successfully updated OpenClaw to 2026.2.19-2 with 40+ security fixes. Implemented 3 cron jobs: Session Cleanup, Security Audit, Silent Backup.',
    type: 'project',
    date: new Date('2026-02-19'),
    tags: ['security', 'maintenance', 'openclaw'],
    category: 'Infrastructure',
  },
  {
    id: 'mem-008',
    title: 'BMAD Methodology Learned',
    content: 'Breakthrough Method for Agile AI Driven Development: 12 agents across 4 phases (Planning, Readiness, Execution, Launch).',
    type: 'learning',
    date: new Date('2026-02-18'),
    tags: ['bmad', 'methodology', 'development'],
    category: 'Methodology',
  },
  {
    id: 'mem-009',
    title: 'Token Security Pattern',
    content: 'Established pattern: temporary tokens with 1-hour expiration for Vercel deployments. Immediate revocation after use.',
    type: 'learning',
    date: new Date('2026-02-20'),
    tags: ['security', 'tokens', 'best-practices'],
    category: 'Security',
  },
  {
    id: 'mem-010',
    title: 'Daily Log - Feb 19, 2026',
    content: 'Created 10 Core agents for Mission Control. Set up partner VPS with Cloudflare Tunnel. Configured Google Workspace APIs.',
    type: 'daily',
    date: new Date('2026-02-19'),
    tags: ['daily-log', 'agents', 'infrastructure'],
    category: 'Daily',
  },
  {
    id: 'mem-011',
    title: 'Lithic Card Issuing Research',
    content: 'Confirmed Lithic IS viable with Delaware LLC. Cardholders can be international including Colombia. No US residency required for business.',
    type: 'decision',
    date: new Date('2026-02-18'),
    tags: ['lithic', 'neobank', 'compliance'],
    category: 'Research',
  },
  {
    id: 'mem-012',
    title: 'Long-term: AI Team Architecture',
    content: 'Vision for 22-agent system: 10 Core (Mission Control) + 12 BMAD (Dev Studio). Hub and spoke model with transversal capabilities.',
    type: 'long_term',
    date: new Date('2026-02-15'),
    tags: ['architecture', 'vision', 'agents'],
    isPinned: true,
    summary: 'Core architecture decision for AI team',
    category: 'Architecture',
  },
];

const typeIcons: Record<MemoryType, React.ReactNode> = {
  daily: <Calendar className="w-4 h-4" />,
  long_term: <Brain className="w-4 h-4" />,
  project: <FileJson className="w-4 h-4" />,
  decision: <Star className="w-4 h-4" />,
  learning: <BookOpen className="w-4 h-4" />,
};

const typeColors: Record<MemoryType, { bg: string; text: string; border: string }> = {
  daily: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  long_term: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  project: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  decision: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  learning: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
};

export function MemoryView({ 
  className, 
  memories = mockMemories,
  onSearch,
}: MemoryViewProps) {
  const [selectedMemory, setSelectedMemory] = useState<MemoryEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<MemoryType | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get all unique tags
  const allTags = Array.from(new Set(memories.flatMap(m => m.tags))).sort();

  // Get all unique categories
  const allCategories = Array.from(new Set(memories.map(m => m.category))).filter(Boolean).sort();

  const filteredMemories = memories.filter(memory => {
    const matchesSearch = searchQuery === '' || 
      memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || memory.type === typeFilter;
    const matchesTag = !selectedTag || memory.tags.includes(selectedTag);
    
    return matchesSearch && matchesType && matchesTag;
  });

  // Sort: pinned first, then by date (newest first)
  const sortedMemories = filteredMemories.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.date.getTime() - a.date.getTime();
  });

  const stats = {
    total: memories.length,
    pinned: memories.filter(m => m.isPinned).length,
    daily: memories.filter(m => m.type === 'daily').length,
    projects: memories.filter(m => m.type === 'project').length,
    decisions: memories.filter(m => m.type === 'decision').length,
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() ? 
        <mark key={i} className="bg-yellow-200">{part}</mark> : part
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Stats */}
      <div className="grid grid-cols-5 gap-2">
        <div className="p-3 bg-gray-50 rounded-lg text-center">
          <div className="text-xl font-bold">{stats.total}</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
        <div className="p-3 bg-yellow-50 rounded-lg text-center">
          <div className="text-xl font-bold text-yellow-600">{stats.pinned}</div>
          <div className="text-xs text-yellow-700">Pinned</div>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg text-center">
          <div className="text-xl font-bold text-blue-600">{stats.daily}</div>
          <div className="text-xs text-blue-700">Daily Logs</div>
        </div>
        <div className="p-3 bg-green-50 rounded-lg text-center">
          <div className="text-xl font-bold text-green-600">{stats.projects}</div>
          <div className="text-xs text-green-700">Projects</div>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg text-center">
          <div className="text-xl font-bold text-purple-600">{stats.decisions}</div>
          <div className="text-xs text-purple-700">Decisions</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search memories..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              onSearch?.(e.target.value);
            }}
            className="pl-9"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as MemoryType | 'all')}
            className="px-3 py-1.5 border rounded-lg text-sm"
          >
            <option value="all">All Types</option>
            <option value="daily">Daily Logs</option>
            <option value="long_term">Long-term</option>
            <option value="project">Projects</option>
            <option value="decision">Decisions</option>
            <option value="learning">Learning</option>
          </select>
          
          {selectedTag && (
            <Badge 
              variant="secondary"
              className="cursor-pointer"
              onClick={() => setSelectedTag(null)}
            >
              #{selectedTag} ×
            </Badge>
          )}
          
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 ml-auto">
            <Button
              size="sm"
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              onClick={() => setViewMode('grid')}
              className="h-7 text-xs"
            >
              Grid
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              onClick={() => setViewMode('list')}
              className="h-7 text-xs"
            >
              List
            </Button>
          </div>
        </div>

        {/* Popular Tags */}
        <div className="flex flex-wrap gap-1">
          <span className="text-xs text-gray-500 mr-2">Popular tags:</span>
          {allTags.slice(0, 8).map(tag => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? 'default' : 'outline'}
              className="text-xs cursor-pointer"
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            >
              #{tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Memories Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sortedMemories.map((memory) => {
            const colors = typeColors[memory.type];
            return (
              <div
                key={memory.id}
                onClick={() => setSelectedMemory(memory)}
                className={cn(
                  "p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md",
                  memory.isPinned && "border-yellow-300 bg-yellow-50/30",
                  !memory.isPinned && "border-gray-200 hover:border-gray-300"
                )}
              >
                <div className="flex items-start gap-2 mb-2">
                  <div className={cn("p-1.5 rounded", colors.bg, colors.text)}>
                    {typeIcons[memory.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-2">
                      {memory.isPinned && <Star className="w-3 h-3 inline text-yellow-500 mr-1" />}
                      {searchQuery ? highlightText(memory.title, searchQuery) : memory.title}
                    </h4>
                  </div>
                </div>
                
                {memory.summary && (
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {memory.summary}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-1 mb-2">
                  {memory.tags.slice(0, 3).map(tag => (
                    <span 
                      key={tag} 
                      className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded text-gray-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {memory.date.toLocaleDateString()}
                  </span>
                  {memory.category && (
                    <Badge variant="outline" className="text-[10px]">
                      {memory.category}
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {sortedMemories.map((memory) => {
                const colors = typeColors[memory.type];
                return (
                  <div
                    key={memory.id}
                    onClick={() => setSelectedMemory(memory)}
                    className="p-4 hover:bg-gray-50 cursor-pointer flex items-start gap-3"
                  >
                    <div className={cn("p-2 rounded-lg", colors.bg, colors.text)}>
                      {typeIcons[memory.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {memory.isPinned && <Star className="w-4 h-4 text-yellow-500" />}
                        <h4 className="font-medium">
                          {searchQuery ? highlightText(memory.title, searchQuery) : memory.title}
                        </h4>
                        <Badge className={cn("text-xs", colors.bg, colors.text, "border-0")}>
                          {memory.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      {memory.summary && (
                        <p className="text-sm text-gray-600 line-clamp-1 mb-1">
                          {memory.summary}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {searchQuery ? highlightText(memory.content, searchQuery) : memory.content}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {memory.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                        <span className="text-xs text-gray-400 ml-auto">
                          {memory.date.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Memory Detail Dialog */}
      <Dialog open={!!selectedMemory} onOpenChange={() => setSelectedMemory(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              {selectedMemory && (
                <div className={cn("p-2 rounded-lg",
                  typeColors[selectedMemory.type].bg,
                  typeColors[selectedMemory.type].text
                )}>
                  {typeIcons[selectedMemory.type]}
                </div>
              )}
              <div>
                <DialogTitle className="flex items-center gap-2">
                  {selectedMemory?.isPinned && <Star className="w-5 h-5 text-yellow-500" />}
                  {selectedMemory?.title}
                </DialogTitle>
                <DialogDescription>
                  {selectedMemory?.date.toLocaleString()}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedMemory && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge className={cn(
                  typeColors[selectedMemory.type].bg,
                  typeColors[selectedMemory.type].text
                )}>
                  {selectedMemory.type.replace('_', ' ')}
                </Badge>
                {selectedMemory.category && (
                  <Badge variant="outline">{selectedMemory.category}</Badge>
                )}
                {selectedMemory.isPinned && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Star className="w-3 h-3 mr-1" />
                    Pinned
                  </Badge>
                )}
              </div>

              <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
                {selectedMemory.content}
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Tags</div>
                <div className="flex flex-wrap gap-2">
                  {selectedMemory.tags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      <Hash className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {selectedMemory.relatedMemories && selectedMemory.relatedMemories.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2">Related Memories</div>
                  <div className="space-y-1">
                    {selectedMemory.relatedMemories.map(id => {
                      const related = memories.find(m => m.id === id);
                      return related ? (
                        <div 
                          key={id}
                          onClick={() => setSelectedMemory(related)}
                          className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 text-sm"
                        >
                          {related.title}
                        </div>
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
