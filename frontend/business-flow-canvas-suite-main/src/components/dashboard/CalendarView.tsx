
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type EventType = 'meeting' | 'task' | 'reminder' | 'holiday';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  type: EventType;
  module?: string;
  time?: string;
}

interface TaskItem {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  status: 'pending' | 'inProgress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
}

const CalendarView = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [month, setMonth] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Team Meeting',
      description: 'Weekly team status update',
      date: new Date(2025, 3, 28, 10, 0),
      type: 'meeting',
      module: 'Projects',
      time: '10:00 AM'
    },
    {
      id: '2',
      title: 'Client Presentation',
      description: 'Present quarterly results to Client XYZ',
      date: new Date(2025, 3, 30, 14, 0),
      type: 'meeting',
      module: 'Sales',
      time: '2:00 PM'
    },
    {
      id: '3',
      title: 'Project Deadline',
      description: 'Submit final deliverables for Project Alpha',
      date: new Date(2025, 4, 5),
      type: 'task',
      module: 'Projects'
    },
    {
      id: '4',
      title: 'Budget Review',
      description: 'Review Q2 budget with finance team',
      date: new Date(2025, 4, 10, 11, 0),
      type: 'meeting',
      module: 'Finance',
      time: '11:00 AM'
    }
  ]);
  
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: '1',
      title: 'Complete quarterly report',
      description: 'Finalize the Q2 financial summary',
      dueDate: new Date(2025, 3, 30),
      status: 'inProgress',
      priority: 'high',
      assignee: 'John Doe'
    },
    {
      id: '2',
      title: 'Update product roadmap',
      description: 'Incorporate feedback from the sales team',
      dueDate: new Date(2025, 4, 5),
      status: 'pending',
      priority: 'medium',
      assignee: 'Jane Smith'
    },
    {
      id: '3',
      title: 'Review marketing campaign',
      description: 'Analyze results from recent email campaign',
      dueDate: new Date(2025, 3, 28),
      status: 'pending',
      priority: 'low',
      assignee: 'John Doe'
    }
  ]);
  
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: '',
    description: '',
    date: new Date(),
    type: 'meeting',
    module: 'Projects',
    time: '09:00'
  });
  
  const [newTask, setNewTask] = useState<Partial<TaskItem>>({
    title: '',
    description: '',
    dueDate: new Date(),
    status: 'pending',
    priority: 'medium',
    assignee: 'John Doe'
  });

  const selectedDateEvents = events.filter(event => 
    event.date.getFullYear() === date.getFullYear() && 
    event.date.getMonth() === date.getMonth() && 
    event.date.getDate() === date.getDate()
  );

  const upcomingTasks = tasks
    .filter(task => task.status !== 'completed')
    .sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.getTime() - b.dueDate.getTime();
    })
    .slice(0, 5);

  const handlePrevMonth = () => {
    setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1));
  };

  const handleAddEvent = () => {
    if (!newEvent.title) {
      toast.error("Event title is required");
      return;
    }
    
    const eventToAdd: CalendarEvent = {
      id: `event-${Date.now()}`,
      title: newEvent.title || '',
      description: newEvent.description,
      date: newEvent.date || new Date(),
      type: newEvent.type as EventType || 'meeting',
      module: newEvent.module,
      time: newEvent.time
    };
    
    setEvents([...events, eventToAdd]);
    toast.success("Event added successfully");
    
    // Reset form
    setNewEvent({
      title: '',
      description: '',
      date: new Date(),
      type: 'meeting',
      module: 'Projects',
      time: '09:00'
    });
  };

  const handleAddTask = () => {
    if (!newTask.title) {
      toast.error("Task title is required");
      return;
    }
    
    const taskToAdd: TaskItem = {
      id: `task-${Date.now()}`,
      title: newTask.title || '',
      description: newTask.description,
      dueDate: newTask.dueDate,
      status: newTask.status as 'pending' | 'inProgress' | 'completed' || 'pending',
      priority: newTask.priority as 'low' | 'medium' | 'high' || 'medium',
      assignee: newTask.assignee
    };
    
    setTasks([...tasks, taskToAdd]);
    toast.success("Task added successfully");
    
    // Reset form
    setNewTask({
      title: '',
      description: '',
      dueDate: new Date(),
      status: 'pending',
      priority: 'medium',
      assignee: 'John Doe'
    });
  };

  // Function to determine if a date has events
  const hasEvents = (day: Date) => {
    return events.some(event => 
      event.date.getFullYear() === day.getFullYear() && 
      event.date.getMonth() === day.getMonth() && 
      event.date.getDate() === day.getDate()
    );
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-amber-100 text-amber-800',
    high: 'bg-red-100 text-red-800'
  };

  const eventTypeIcons = {
    meeting: <div className="h-2 w-2 rounded-full bg-blue-500"></div>,
    task: <div className="h-2 w-2 rounded-full bg-green-500"></div>,
    reminder: <div className="h-2 w-2 rounded-full bg-amber-500"></div>,
    holiday: <div className="h-2 w-2 rounded-full bg-red-500"></div>
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Calendar Column */}
      <Card className="col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl">Calendar</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={handlePrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="font-medium">
              {month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
            <Button variant="outline" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            month={month}
            onMonthChange={setMonth}
            className="rounded-md border"
            modifiersStyles={{
              selected: {
                backgroundColor: 'var(--primary)',
                color: 'white'
              }
            }}
            modifiers={{
              hasEvents: (day) => hasEvents(day)
            }}
            classNames={{
              day_today: "bg-muted text-muted-foreground",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              day: cn(
                "relative h-9 w-9 p-0 font-normal",
                "[&.hasEvents]::after:absolute [&.hasEvents]::after:content-[''] [&.hasEvents]::after:w-1 [&.hasEvents]::after:h-1 [&.hasEvents]::after:bg-primary [&.hasEvents]::after:rounded-full [&.hasEvents]::after:bottom-1 [&.hasEvents]::after:left-1/2 [&.hasEvents]::after:-translate-x-1/2"
              )
            }}
          />
          
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">
                {date.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Event
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Event</DialogTitle>
                    <DialogDescription>
                      Create a new event or appointment on your calendar
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="event-title" className="text-right">
                        Title
                      </Label>
                      <Input
                        id="event-title"
                        value={newEvent.title || ''}
                        onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="event-description" className="text-right">
                        Description
                      </Label>
                      <Textarea
                        id="event-description"
                        value={newEvent.description || ''}
                        onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                        className="col-span-3"
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="event-date" className="text-right">
                        Date
                      </Label>
                      <div className="col-span-3 flex items-center">
                        <Input
                          id="event-date"
                          type="date"
                          value={newEvent.date ? newEvent.date.toISOString().substring(0, 10) : ''}
                          onChange={(e) => {
                            const selectedDate = new Date(e.target.value);
                            setNewEvent({...newEvent, date: selectedDate});
                          }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="event-time" className="text-right">
                        Time
                      </Label>
                      <Input
                        id="event-time"
                        type="time"
                        value={newEvent.time || ''}
                        onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="event-type" className="text-right">
                        Type
                      </Label>
                      <Select
                        value={newEvent.type || 'meeting'}
                        onValueChange={(value) => setNewEvent({...newEvent, type: value as EventType})}
                      >
                        <SelectTrigger id="event-type" className="col-span-3">
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="meeting">Meeting</SelectItem>
                          <SelectItem value="task">Task</SelectItem>
                          <SelectItem value="reminder">Reminder</SelectItem>
                          <SelectItem value="holiday">Holiday</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="event-module" className="text-right">
                        Module
                      </Label>
                      <Select
                        value={newEvent.module || 'Projects'}
                        onValueChange={(value) => setNewEvent({...newEvent, module: value})}
                      >
                        <SelectTrigger id="event-module" className="col-span-3">
                          <SelectValue placeholder="Select module" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Projects">Projects</SelectItem>
                          <SelectItem value="Sales">Sales</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="HR">Human Resources</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" onClick={handleAddEvent}>
                      Add Event
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {selectedDateEvents.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No events scheduled for this day
              </div>
            ) : (
              <div className="space-y-2">
                {selectedDateEvents.map((event) => (
                  <div 
                    key={event.id}
                    className="p-3 border rounded-md flex gap-3"
                  >
                    <div className="mt-1">
                      {eventTypeIcons[event.type]}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      {event.description && (
                        <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        {event.time && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            {event.time}
                          </div>
                        )}
                        {event.module && (
                          <div className="text-xs bg-muted px-2 py-0.5 rounded">
                            {event.module}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Tasks Column */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Tasks</span>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Task</DialogTitle>
                  <DialogDescription>
                    Create a new task or assignment
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="task-title" className="text-right">
                      Title
                    </Label>
                    <Input
                      id="task-title"
                      value={newTask.title || ''}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="task-description" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id="task-description"
                      value={newTask.description || ''}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      className="col-span-3"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="task-date" className="text-right">
                      Due Date
                    </Label>
                    <Input
                      id="task-date"
                      type="date"
                      value={newTask.dueDate ? newTask.dueDate.toISOString().substring(0, 10) : ''}
                      onChange={(e) => {
                        const selectedDate = new Date(e.target.value);
                        setNewTask({...newTask, dueDate: selectedDate});
                      }}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="task-priority" className="text-right">
                      Priority
                    </Label>
                    <Select
                      value={newTask.priority || 'medium'}
                      onValueChange={(value) => setNewTask({
                        ...newTask, 
                        priority: value as 'low' | 'medium' | 'high'
                      })}
                    >
                      <SelectTrigger id="task-priority" className="col-span-3">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="task-status" className="text-right">
                      Status
                    </Label>
                    <Select
                      value={newTask.status || 'pending'}
                      onValueChange={(value) => setNewTask({
                        ...newTask, 
                        status: value as 'pending' | 'inProgress' | 'completed'
                      })}
                    >
                      <SelectTrigger id="task-status" className="col-span-3">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="inProgress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="task-assignee" className="text-right">
                      Assignee
                    </Label>
                    <Input
                      id="task-assignee"
                      value={newTask.assignee || ''}
                      onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" onClick={handleAddTask}>
                    Add Task
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardTitle>
          <CardDescription>
            Upcoming tasks & assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingTasks.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No upcoming tasks
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="border rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <div className={`text-xs px-2 py-0.5 rounded ${priorityColors[task.priority]}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </div>
                    {task.status === 'inProgress' && (
                      <div className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        In Progress
                      </div>
                    )}
                  </div>
                  <h4 className="font-medium text-sm mt-2">{task.title}</h4>
                  {task.description && (
                    <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs text-muted-foreground">
                      {task.dueDate && (
                        <span className="flex items-center">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          {task.dueDate.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      )}
                    </div>
                    {task.assignee && (
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px]">
                        {task.assignee.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" size="sm" className="w-full">
              View All Tasks
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarView;
