import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Repeat, 
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Bot,
  User
} from 'lucide-react';

export type CalendarEventType = 'cron' | 'meeting' | 'deadline' | 'reminder' | 'task';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  type: CalendarEventType;
  startTime: Date;
  endTime?: Date;
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    daysOfWeek?: number[]; // 0 = Sunday
  };
  assignee: {
    name: string;
    type: 'human' | 'agent';
  };
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  category?: string;
  color?: string;
}

interface CalendarViewProps {
  className?: string;
  events?: CalendarEvent[];
  onCreateEvent?: (event: Partial<CalendarEvent>) => void;
  onUpdateEvent?: (eventId: string, updates: Partial<CalendarEvent>) => void;
}

// Mock events based on actual cron jobs and scheduled tasks
const mockCalendarEvents: CalendarEvent[] = [
  {
    id: 'cal-001',
    title: 'Daily Security Audit',
    description: 'Automated security audit: firewall, fail2ban, SSH, ports',
    type: 'cron',
    startTime: new Date(new Date().setHours(8, 0, 0, 0)),
    recurring: { frequency: 'daily', interval: 1 },
    assignee: { name: 'System', type: 'agent' },
    status: 'scheduled',
    category: 'Maintenance',
    color: 'blue',
  },
  {
    id: 'cal-002',
    title: 'Silent Backup',
    description: 'Incremental backup of workspace',
    type: 'cron',
    startTime: new Date(new Date().setHours(2, 0, 0, 0)),
    recurring: { frequency: 'daily', interval: 1 },
    assignee: { name: 'System', type: 'agent' },
    status: 'scheduled',
    category: 'Backup',
    color: 'green',
  },
  {
    id: 'cal-003',
    title: 'Session Cleanup',
    description: 'Remove old session files to improve performance',
    type: 'cron',
    startTime: new Date(new Date().setHours(3, 0, 0, 0)),
    recurring: { frequency: 'daily', interval: 3 },
    assignee: { name: 'System', type: 'agent' },
    status: 'scheduled',
    category: 'Maintenance',
    color: 'purple',
  },
  {
    id: 'cal-004',
    title: 'Weekly Memory Review',
    description: 'Review daily logs and update MEMORY.md',
    type: 'cron',
    startTime: new Date(new Date().setHours(21, 0, 0, 0)),
    recurring: { frequency: 'weekly', interval: 1, daysOfWeek: [0] }, // Sunday
    assignee: { name: 'Chief of Staff', type: 'agent' },
    status: 'scheduled',
    category: 'Memory',
    color: 'orange',
  },
  {
    id: 'cal-005',
    title: 'Sound Money Bank - PRD Review',
    description: 'Review Product Requirements Document',
    type: 'meeting',
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
    assignee: { name: 'Product Owner', type: 'agent' },
    status: 'scheduled',
    category: 'BMAD',
    color: 'pink',
  },
  {
    id: 'cal-006',
    title: 'Dashboard v1.3.0 Deadline',
    description: 'Complete remaining features',
    type: 'deadline',
    startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    assignee: { name: 'Operations Lead', type: 'agent' },
    status: 'scheduled',
    category: 'Development',
    color: 'red',
  },
  {
    id: 'cal-007',
    title: 'Content: NeoBank Video Publish',
    description: 'Publish YouTube video about card issuing',
    type: 'task',
    startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    assignee: { name: 'Andre Philippe', type: 'human' },
    status: 'scheduled',
    category: 'Content',
    color: 'cyan',
  },
  {
    id: 'cal-008',
    title: 'Monthly Cost Review',
    description: 'Review LLM API costs and optimize',
    type: 'cron',
    startTime: new Date(new Date().setDate(1)), // 1st of month
    recurring: { frequency: 'monthly', interval: 1 },
    assignee: { name: 'Financial Controller', type: 'agent' },
    status: 'scheduled',
    category: 'Finance',
    color: 'yellow',
  },
];

const typeIcons: Record<CalendarEventType, React.ReactNode> = {
  cron: <Repeat className="w-4 h-4" />,
  meeting: <CalendarIcon className="w-4 h-4" />,
  deadline: <AlertCircle className="w-4 h-4" />,
  reminder: <Clock className="w-4 h-4" />,
  task: <CheckCircle2 className="w-4 h-4" />,
};

const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  green: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  pink: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  red: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  yellow: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
};

export function CalendarView({ 
  className, 
  events = mockCalendarEvents,
  onCreateEvent,
  onUpdateEvent,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getWeekDays = () => {
    const days = [];
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getEventsForHour = (date: Date, hour: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate.toDateString() === date.toDateString() && 
             eventDate.getHours() === hour;
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric',
      ...(viewMode !== 'month' && { day: 'numeric' })
    });
  };

  const stats = {
    total: events.length,
    cron: events.filter(e => e.type === 'cron').length,
    today: events.filter(e => {
      const eventDate = new Date(e.startTime);
      return eventDate.toDateString() === new Date().toDateString();
    }).length,
    upcoming: events.filter(e => new Date(e.startTime) > new Date()).length,
  };

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50" />);
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();

      days.push(
        <div 
          key={day} 
          className={cn(
            "h-24 border border-gray-200 p-2 overflow-hidden",
            isToday && "bg-blue-50 border-blue-300"
          )}
        >
          <div className={cn(
            "text-sm font-medium mb-1",
            isToday && "text-blue-600"
          )}>
            {day}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 3).map(event => {
              const colors = colorClasses[event.color || 'blue'];
              return (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className={cn(
                    "text-xs px-1.5 py-0.5 rounded truncate cursor-pointer",
                    colors.bg,
                    colors.text
                  )}
                >
                  {event.title}
                </div>
              );
            })}
            {dayEvents.length > 3 && (
              <div className="text-xs text-gray-500 pl-1">
                +{dayEvents.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-px bg-gray-300 border border-gray-300">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-gray-100 p-2 text-center text-sm font-medium">
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays();
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-8 bg-gray-100">
          <div className="p-2 text-sm font-medium text-center">Time</div>
          {weekDays.map((day, i) => (
            <div 
              key={i} 
              className={cn(
                "p-2 text-center",
                day.toDateString() === new Date().toDateString() && "bg-blue-100"
              )}
            >
              <div className="text-sm font-medium">
                {day.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className="text-xs text-gray-500">
                {day.getDate()}
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-8 divide-x divide-gray-200">
          {hours.map(hour => (
            <React.Fragment key={hour}>
              <div className="p-2 text-xs text-gray-500 border-b text-center">
                {hour.toString().padStart(2, '0')}:00
              </div>
              {weekDays.map((day, dayIndex) => {
                const hourEvents = getEventsForHour(day, hour);
                return (
                  <div 
                    key={`${hour}-${dayIndex}`} 
                    className="h-16 border-b relative"
                  >
                    {hourEvents.map(event => {
                      const colors = colorClasses[event.color || 'blue'];
                      return (
                        <div
                          key={event.id}
                          onClick={() => setSelectedEvent(event)}
                          className={cn(
                            "absolute inset-x-1 top-1 p-1 rounded text-xs cursor-pointer overflow-hidden",
                            colors.bg,
                            colors.text,
                            colors.border,
                            "border"
                          )}
                        >
                          {typeIcons[event.type]}
                          <span className="ml-1 truncate">{event.title}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const isToday = currentDate.toDateString() === new Date().toDateString();

    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className={cn(
          "p-3 text-center border-b",
          isToday ? "bg-blue-100" : "bg-gray-100"
        )}>
          <div className="font-medium">
            {currentDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
        <div className="divide-y">
          {hours.map(hour => {
            const hourEvents = getEventsForHour(currentDate, hour);
            return (
              <div key={hour} className="flex">
                <div className="w-20 p-2 text-xs text-gray-500 text-right border-r">
                  {hour.toString().padStart(2, '0')}:00
                </div>
                <div className="flex-1 p-2 min-h-[60px]">
                  {hourEvents.map(event => {
                    const colors = colorClasses[event.color || 'blue'];
                    return (
                      <div
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className={cn(
                          "p-2 rounded text-sm cursor-pointer mb-1",
                          colors.bg,
                          colors.text,
                          colors.border,
                          "border"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {typeIcons[event.type]}
                          <span className="font-medium">{event.title}</span>
                          {event.recurring && <Repeat className="w-3 h-3" />}
                        </div>
                        {event.description && (
                          <p className="text-xs mt-1 opacity-80">{event.description}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderUpcomingList = () => {
    const upcomingEvents = events
      .filter(e => new Date(e.startTime) >= new Date())
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .slice(0, 5);

    return (
      <Card className="mt-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {upcomingEvents.map(event => {
              const colors = colorClasses[event.color || 'blue'];
              return (
                <div 
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                >
                  <div className={cn("p-2 rounded-lg", colors.bg, colors.text)}>
                    {typeIcons[event.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{event.title}</div>
                    <div className="text-xs text-gray-500">
                      {event.startTime.toLocaleString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {event.assignee.type === 'agent' ? (
                      <Bot className="w-3 h-3 mr-1" />
                    ) : (
                      <User className="w-3 h-3 mr-1" />
                    )}
                    {event.assignee.name}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        <div className="p-3 bg-gray-50 rounded-lg text-center">
          <div className="text-xl font-bold">{stats.total}</div>
          <div className="text-xs text-gray-500">Total Events</div>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg text-center">
          <div className="text-xl font-bold text-blue-600">{stats.cron}</div>
          <div className="text-xs text-blue-700">Cron Jobs</div>
        </div>
        <div className="p-3 bg-green-50 rounded-lg text-center">
          <div className="text-xl font-bold text-green-600">{stats.today}</div>
          <div className="text-xs text-green-700">Today</div>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg text-center">
          <div className="text-xl font-bold text-purple-600">{stats.upcoming}</div>
          <div className="text-xs text-purple-700">Upcoming</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="font-medium min-w-[150px] text-center">
            {formatDate(currentDate)}
          </span>
          <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setCurrentDate(new Date())}
            className="ml-2"
          >
            Today
          </Button>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {(['day', 'week', 'month'] as const).map(mode => (
            <Button
              key={mode}
              size="sm"
              variant={viewMode === mode ? 'default' : 'ghost'}
              onClick={() => setViewMode(mode)}
              className="h-7 text-xs capitalize"
            >
              {mode}
            </Button>
          ))}
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === 'month' && renderMonthView()}
      {viewMode === 'week' && renderWeekView()}
      {viewMode === 'day' && renderDayView()}

      {/* Upcoming List */}
      {renderUpcomingList()}

      {/* Event Detail Dialog would go here */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
             onClick={() => setSelectedEvent(null)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
               onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className={cn("p-3 rounded-lg",
                colorClasses[selectedEvent.color || 'blue'].bg,
                colorClasses[selectedEvent.color || 'blue'].text
              )}>
                {typeIcons[selectedEvent.type]}
              </div>
              <div>
                <h3 className="font-bold">{selectedEvent.title}</h3>
                <p className="text-sm text-gray-500">
                  {selectedEvent.startTime.toLocaleString()}
                </p>
              </div>
            </div>
            {selectedEvent.description && (
              <p className="text-sm text-gray-600 mb-4">{selectedEvent.description}</p>
            )}
            <div className="flex gap-2 text-sm">
              <Badge variant="outline">{selectedEvent.category}</Badge>
              <Badge variant="outline">
                {selectedEvent.assignee.name}
                {selectedEvent.assignee.type === 'agent' && ' (AI)'}
              </Badge>
              {selectedEvent.recurring && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Repeat className="w-3 h-3" />
                  {selectedEvent.recurring.frequency}
                </Badge>
              )}
            </div>
            <Button 
              className="w-full mt-4" 
              onClick={() => setSelectedEvent(null)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
