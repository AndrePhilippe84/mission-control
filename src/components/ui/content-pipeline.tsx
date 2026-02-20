import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { 
  Video, 
  FileText, 
  Image as ImageIcon, 
  CheckCircle2, 
  Clock,
  Play,
  Upload,
  Plus,
  Search,
  MoreHorizontal,
  ArrowRight,
  Calendar,
  Sparkles,
  Mic,
  Clapperboard
} from 'lucide-react';

export type ContentStage = 
  | 'idea' 
  | 'research' 
  | 'script' 
  | 'thumbnail' 
  | 'filming' 
  | 'editing' 
  | 'scheduled' 
  | 'published';

export type ContentType = 'video' | 'thread' | 'article' | 'podcast' | 'newsletter';

export interface ContentItem {
  id: string;
  title: string;
  description?: string;
  type: ContentType;
  stage: ContentStage;
  platform: string; // youtube, twitter, linkedin, etc.
  createdAt: Date;
  targetPublishDate?: Date;
  publishedAt?: Date;
  script?: string;
  thumbnailUrl?: string;
  tags: string[];
  assignedTo: 'human' | 'agent' | 'collaborative';
  metrics?: {
    views?: number;
    likes?: number;
    comments?: number;
    shares?: number;
  };
  notes?: string;
}

interface ContentPipelineProps {
  className?: string;
  items?: ContentItem[];
  onCreateItem?: (item: Partial<ContentItem>) => void;
  onUpdateStage?: (itemId: string, stage: ContentStage) => void;
}

// Mock content items
const mockContentItems: ContentItem[] = [
  {
    id: 'content-001',
    title: 'How I Built a $300k ARR App Solo',
    type: 'video',
    stage: 'published',
    platform: 'YouTube',
    createdAt: new Date('2026-02-15'),
    publishedAt: new Date('2026-02-18'),
    tags: ['indiehacker', 'saas', 'bootstrapping'],
    assignedTo: 'collaborative',
    metrics: { views: 125000, likes: 4200, comments: 224 },
  },
  {
    id: 'content-002',
    title: 'OpenClaw Mission Control Setup Guide',
    description: 'Complete guide on setting up Mission Control dashboard',
    type: 'article',
    stage: 'script',
    platform: 'Twitter/X',
    createdAt: new Date('2026-02-19'),
    script: 'The single most powerful way to upgrade your OpenClaw...',
    tags: ['openclaw', 'ai', 'tutorial'],
    assignedTo: 'agent',
  },
  {
    id: 'content-003',
    title: 'NeoBank Card Issuing Deep Dive',
    description: 'Analysis of Lithic vs alternatives for card issuing',
    type: 'video',
    stage: 'idea',
    platform: 'YouTube',
    createdAt: new Date('2026-02-20'),
    tags: ['fintech', 'neobank', 'lithic'],
    assignedTo: 'agent',
  },
  {
    id: 'content-004',
    title: 'BMAD Development Methodology',
    description: 'How we use 22 AI agents to build products',
    type: 'thread',
    stage: 'thumbnail',
    platform: 'Twitter/X',
    createdAt: new Date('2026-02-18'),
    script: 'We built a 22-agent AI team using BMAD methodology...',
    thumbnailUrl: '/thumbnails/bmad-thread.png',
    tags: ['bmad', 'ai-agents', 'development'],
    assignedTo: 'agent',
  },
  {
    id: 'content-005',
    title: 'Sound Money Bank Launch Announcement',
    description: 'Official launch of the NeoBank project',
    type: 'video',
    stage: 'scheduled',
    platform: 'YouTube',
    createdAt: new Date('2026-02-20'),
    targetPublishDate: new Date('2026-02-28'),
    script: 'Today I\'m excited to announce the launch of Sound Money Bank...',
    thumbnailUrl: '/thumbnails/smb-launch.png',
    tags: ['launch', 'neobank', 'fintech'],
    assignedTo: 'collaborative',
  },
  {
    id: 'content-006',
    title: 'Multi-Provider LLM Strategy',
    description: 'How we use GLM-5, Claude, Gemini, Kimi, and OpenAI',
    type: 'article',
    stage: 'editing',
    platform: 'LinkedIn',
    createdAt: new Date('2026-02-19'),
    script: 'Why limit yourself to one LLM provider when you can use the best of each?...',
    tags: ['llm', 'ai-strategy', 'cost-optimization'],
    assignedTo: 'agent',
  },
];

const stages: { id: ContentStage; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'idea', label: 'Idea', icon: <Sparkles className="w-4 h-4" />, color: 'bg-gray-100' },
  { id: 'research', label: 'Research', icon: <Search className="w-4 h-4" />, color: 'bg-blue-50' },
  { id: 'script', label: 'Script', icon: <FileText className="w-4 h-4" />, color: 'bg-purple-50' },
  { id: 'thumbnail', label: 'Thumbnail', icon: <ImageIcon className="w-4 h-4" />, color: 'bg-pink-50' },
  { id: 'filming', label: 'Filming', icon: <Clapperboard className="w-4 h-4" />, color: 'bg-orange-50' },
  { id: 'editing', label: 'Editing', icon: <Mic className="w-4 h-4" />, color: 'bg-yellow-50' },
  { id: 'scheduled', label: 'Scheduled', icon: <Calendar className="w-4 h-4" />, color: 'bg-green-50' },
  { id: 'published', label: 'Published', icon: <CheckCircle2 className="w-4 h-4" />, color: 'bg-emerald-50' },
];

const contentTypeIcons: Record<ContentType, React.ReactNode> = {
  video: <Video className="w-4 h-4" />,
  thread: <FileText className="w-4 h-4" />,
  article: <FileText className="w-4 h-4" />,
  podcast: <Mic className="w-4 h-4" />,
  newsletter: <FileText className="w-4 h-4" />,
};

export function ContentPipeline({ 
  className, 
  items = mockContentItems,
  onCreateItem,
  onUpdateStage,
}: ContentPipelineProps) {
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStage, setFilterStage] = useState<ContentStage | 'all'>('all');
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStage = filterStage === 'all' || item.stage === filterStage;
    return matchesSearch && matchesStage;
  });

  const getItemsByStage = (stage: ContentStage) => {
    return filteredItems.filter(item => item.stage === stage);
  };

  const stats = {
    total: items.length,
    ideas: items.filter(i => i.stage === 'idea').length,
    inProgress: items.filter(i => ['research', 'script', 'thumbnail', 'filming', 'editing'].includes(i.stage)).length,
    scheduled: items.filter(i => i.stage === 'scheduled').length,
    published: items.filter(i => i.stage === 'published').length,
  };

  const moveToNextStage = (item: ContentItem) => {
    const stageOrder: ContentStage[] = ['idea', 'research', 'script', 'thumbnail', 'filming', 'editing', 'scheduled', 'published'];
    const currentIndex = stageOrder.indexOf(item.stage);
    if (currentIndex < stageOrder.length - 1) {
      onUpdateStage?.(item.id, stageOrder[currentIndex + 1]);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Stats */}
      <div className="grid grid-cols-5 gap-2">
        <div className="p-3 bg-gray-50 rounded-lg text-center">
          <div className="text-xl font-bold">{stats.total}</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
        <div className="p-3 bg-gray-100 rounded-lg text-center">
          <div className="text-xl font-bold text-gray-700">{stats.ideas}</div>
          <div className="text-xs text-gray-600">Ideas</div>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg text-center">
          <div className="text-xl font-bold text-blue-600">{stats.inProgress}</div>
          <div className="text-xs text-blue-700">In Progress</div>
        </div>
        <div className="p-3 bg-green-50 rounded-lg text-center">
          <div className="text-xl font-bold text-green-600">{stats.scheduled}</div>
          <div className="text-xs text-green-700">Scheduled</div>
        </div>
        <div className="p-3 bg-emerald-50 rounded-lg text-center">
          <div className="text-xl font-bold text-emerald-600">{stats.published}</div>
          <div className="text-xs text-emerald-700">Published</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <select
          value={filterStage}
          onChange={(e) => setFilterStage(e.target.value as ContentStage | 'all')}
          className="px-3 py-1.5 border rounded-lg text-sm h-9"
        >
          <option value="all">All Stages</option>
          {stages.map(s => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <Button
            size="sm"
            variant={viewMode === 'board' ? 'default' : 'ghost'}
            onClick={() => setViewMode('board')}
            className="h-7 text-xs"
          >
            Board
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
        <Button onClick={() => setShowCreateDialog(true)} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          New
        </Button>
      </div>

      {/* Board View */}
      {viewMode === 'board' && (
        <div className="overflow-x-auto">
          <div className="flex gap-3 min-w-max pb-2">
            {stages.map((stage) => {
              const stageItems = getItemsByStage(stage.id);
              return (
                <div key={stage.id} className="w-64">
                  <div className={cn("p-2 rounded-t-lg flex items-center gap-2", stage.color)}>
                    {stage.icon}
                    <span className="font-medium text-sm">{stage.label}</span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {stageItems.length}
                    </Badge>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-b-lg min-h-[200px] space-y-2">
                    {stageItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className="bg-white p-3 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-2 mb-2">
                          {contentTypeIcons[item.type]}
                          <h4 className="font-medium text-sm line-clamp-2">{item.title}</h4>
                        </div>
                        {item.description && (
                          <p className="text-xs text-gray-500 line-clamp-2 mb-2">{item.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {item.platform}
                          </Badge>
                          <Badge 
                            className={cn(
                              "text-xs",
                              item.assignedTo === 'agent' ? 'bg-blue-100 text-blue-800' :
                              item.assignedTo === 'human' ? 'bg-purple-100 text-purple-800' :
                              'bg-orange-100 text-orange-800'
                            )}
                          >
                            {item.assignedTo}
                          </Badge>
                        </div>
                        {item.targetPublishDate && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {item.targetPublishDate.toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {contentTypeIcons[item.type]}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{item.title}</h4>
                        <Badge variant="outline" className="text-xs">{item.platform}</Badge>
                        <Badge className={cn("text-xs",
                          stages.find(s => s.id === item.stage)?.color.replace('bg-', 'bg-opacity-50 bg-')
                        )}>
                          {stages.find(s => s.id === item.stage)?.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span>{item.type}</span>
                        <span>•</span>
                        <span>{item.assignedTo}</span>
                        {item.targetPublishDate && (
                          <>
                            <span>•</span>
                            <span>Target: {item.targetPublishDate.toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                    {item.metrics && (
                      <div className="text-right text-sm">
                        <div className="font-medium">{item.metrics.views?.toLocaleString()} views</div>
                        <div className="text-gray-500">{item.metrics.likes?.toLocaleString()} likes</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Item Detail Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              {selectedItem && contentTypeIcons[selectedItem.type]}
              <DialogTitle>{selectedItem?.title}</DialogTitle>
            </div>
            <DialogDescription>{selectedItem?.description}</DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="text-sm text-gray-500">Stage</div>
                  <Badge className="mt-1">
                    {stages.find(s => s.id === selectedItem.stage)?.label}
                  </Badge>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="text-sm text-gray-500">Platform</div>
                  <div className="font-medium mt-1">{selectedItem.platform}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="text-sm text-gray-500">Assigned</div>
                  <Badge 
                    className={cn("mt-1",
                      selectedItem.assignedTo === 'agent' ? 'bg-blue-100 text-blue-800' :
                      selectedItem.assignedTo === 'human' ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    )}
                  >
                    {selectedItem.assignedTo}
                  </Badge>
                </div>
              </div>

              {selectedItem.script && (
                <div>
                  <div className="text-sm font-medium mb-2">Script</div>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm whitespace-pre-wrap">
                    {selectedItem.script}
                  </div>
                </div>
              )}

              {selectedItem.thumbnailUrl && (
                <div>
                  <div className="text-sm font-medium mb-2">Thumbnail</div>
                  <div className="p-4 bg-gray-100 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                </div>
              )}

              {selectedItem.metrics && (
                <div>
                  <div className="text-sm font-medium mb-2">Performance</div>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="p-3 bg-blue-50 rounded-lg text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {selectedItem.metrics.views?.toLocaleString()}
                      </div>
                      <div className="text-xs text-blue-700">Views</div>
                    </div>
                    <div className="p-3 bg-pink-50 rounded-lg text-center">
                      <div className="text-lg font-bold text-pink-600">
                        {selectedItem.metrics.likes?.toLocaleString()}
                      </div>
                      <div className="text-xs text-pink-700">Likes</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <div className="text-lg font-bold text-green-600">
                        {selectedItem.metrics.comments?.toLocaleString()}
                      </div>
                      <div className="text-xs text-green-700">Comments</div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg text-center">
                      <div className="text-lg font-bold text-purple-600">
                        {selectedItem.metrics.shares?.toLocaleString()}
                      </div>
                      <div className="text-xs text-purple-700">Shares</div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <div className="text-sm font-medium mb-2">Tags</div>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.tags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <DialogFooter className="gap-2">
                {selectedItem.stage !== 'published' && (
                  <Button onClick={() => { moveToNextStage(selectedItem); setSelectedItem(null); }}>
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Move to {stages.find(s => {
                      const stageOrder: ContentStage[] = ['idea', 'research', 'script', 'thumbnail', 'filming', 'editing', 'scheduled', 'published'];
                      const currentIndex = stageOrder.indexOf(selectedItem.stage);
                      return s.id === stageOrder[currentIndex + 1];
                    })?.label}
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Content</DialogTitle>
            <DialogDescription>Add a new content idea to the pipeline</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input placeholder="Content title..." />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea placeholder="Brief description..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Type</label>
                <select className="w-full px-3 py-2 border rounded-lg text-sm mt-1">
                  <option value="video">Video</option>
                  <option value="thread">Thread</option>
                  <option value="article">Article</option>
                  <option value="podcast">Podcast</option>
                  <option value="newsletter">Newsletter</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Platform</label>
                <select className="w-full px-3 py-2 border rounded-lg text-sm mt-1">
                  <option value="YouTube">YouTube</option>
                  <option value="Twitter/X">Twitter/X</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Blog">Blog</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowCreateDialog(false)}>
              Create Content
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
