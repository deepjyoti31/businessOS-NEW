
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { 
  CheckCircle,
  Clock,
  Calendar,
  MoreHorizontal,
  Plus,
  Search,
  Tag,
  User,
  Filter,
  ArrowUpDown,
  Trash
} from "lucide-react";

interface User {
  id: string;
  name: string;
  avatar?: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: Date | null;
  createdAt: Date;
  assignedTo?: User;
  tags: string[];
}

const TaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "task1",
      title: "Complete product roadmap for Q3",
      description: "Define feature priorities and release schedule for the upcoming quarter",
      status: "in-progress",
      priority: "high",
      dueDate: new Date(2025, 4, 15),
      createdAt: new Date(2025, 4, 1),
      assignedTo: {
        id: "user1",
        name: "John Doe",
        avatar: "/avatar-placeholder.png"
      },
      tags: ["Planning", "Product"]
    },
    {
      id: "task2",
      title: "Update customer onboarding flow",
      description: "Improve the user experience during initial setup and account creation",
      status: "todo",
      priority: "medium",
      dueDate: new Date(2025, 4, 20),
      createdAt: new Date(2025, 4, 3),
      assignedTo: {
        id: "user2",
        name: "Jane Smith",
        avatar: "/avatar-placeholder.png"
      },
      tags: ["UX", "Customer"]
    },
    {
      id: "task3",
      title: "Fix payment gateway integration bug",
      description: "Resolve the issue with transaction failures during checkout process",
      status: "completed",
      priority: "high",
      dueDate: new Date(2025, 4, 10),
      createdAt: new Date(2025, 4, 2),
      assignedTo: {
        id: "user3",
        name: "Michael Brown",
        avatar: "/avatar-placeholder.png"
      },
      tags: ["Bug", "Payment"]
    },
    {
      id: "task4",
      title: "Prepare monthly analytics report",
      description: "Compile key metrics and insights from the past month",
      status: "todo",
      priority: "medium",
      dueDate: new Date(2025, 4, 30),
      createdAt: new Date(2025, 4, 5),
      tags: ["Analytics", "Reporting"]
    },
    {
      id: "task5",
      title: "Update privacy policy for GDPR compliance",
      description: "Ensure our privacy policy meets the latest regulatory requirements",
      status: "todo",
      priority: "low",
      dueDate: new Date(2025, 5, 15),
      createdAt: new Date(2025, 4, 8),
      assignedTo: {
        id: "user4",
        name: "Sarah Johnson",
        avatar: "/avatar-placeholder.png"
      },
      tags: ["Legal", "Compliance"]
    }
  ]);
  
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: null,
    tags: []
  });
  
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("dueDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  
  // Filtered and sorted tasks
  const filteredTasks = tasks.filter(task => {
    // Status filter
    if (filterStatus && task.status !== filterStatus) {
      return false;
    }
    
    // Priority filter
    if (filterPriority && task.priority !== filterPriority) {
      return false;
    }
    
    // Search filter
    if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !task.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Sorting
    if (sortBy === "dueDate") {
      // Handle null due dates
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return sortOrder === "asc" ? 1 : -1;
      if (!b.dueDate) return sortOrder === "asc" ? -1 : 1;
      
      return sortOrder === "asc" 
        ? a.dueDate.getTime() - b.dueDate.getTime()
        : b.dueDate.getTime() - a.dueDate.getTime();
    }
    
    if (sortBy === "priority") {
      const priorityOrder = { low: 1, medium: 2, high: 3 };
      return sortOrder === "asc"
        ? priorityOrder[a.priority] - priorityOrder[b.priority]
        : priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    
    if (sortBy === "title") {
      return sortOrder === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }
    
    return 0;
  });
  
  const handleAddTask = () => {
    if (!newTask.title) {
      toast.error("Task title is required");
      return;
    }
    
    const task: Task = {
      id: `task-${Date.now()}`,
      title: newTask.title!,
      description: newTask.description || "",
      status: newTask.status as 'todo' | 'in-progress' | 'completed',
      priority: newTask.priority as 'low' | 'medium' | 'high',
      dueDate: newTask.dueDate,
      createdAt: new Date(),
      assignedTo: newTask.assignedTo,
      tags: newTask.tags || []
    };
    
    setTasks([...tasks, task]);
    setNewTask({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      dueDate: null,
      tags: []
    });
    
    toast.success("Task created successfully");
  };
  
  const handleUpdateTaskStatus = (taskId: string, status: 'todo' | 'in-progress' | 'completed') => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status } : task
    ));
    
    toast.success(`Task updated to ${status.replace('-', ' ')}`);
  };
  
  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast.success("Task deleted successfully");
  };
  
  const formatDate = (date: Date | null) => {
    if (!date) return "No due date";
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="default">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Task Manager</h1>
        <p className="text-muted-foreground">
          Organize, track, and manage your team's tasks
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search tasks..." 
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-1">
                <Filter size={16} />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterStatus(null)} className={!filterStatus ? "bg-muted" : ""}>
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("todo")} className={filterStatus === "todo" ? "bg-muted" : ""}>
                To Do
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("in-progress")} className={filterStatus === "in-progress" ? "bg-muted" : ""}>
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("completed")} className={filterStatus === "completed" ? "bg-muted" : ""}>
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem className="border-t" disabled>
                Priority
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterPriority(null)} className={!filterPriority ? "bg-muted" : ""}>
                All Priorities
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterPriority("high")} className={filterPriority === "high" ? "bg-muted" : ""}>
                High
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterPriority("medium")} className={filterPriority === "medium" ? "bg-muted" : ""}>
                Medium
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterPriority("low")} className={filterPriority === "low" ? "bg-muted" : ""}>
                Low
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-1">
                <ArrowUpDown size={16} />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => { setSortBy("dueDate"); setSortOrder("asc"); }} className={sortBy === "dueDate" && sortOrder === "asc" ? "bg-muted" : ""}>
                Due Date (Earliest)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortBy("dueDate"); setSortOrder("desc"); }} className={sortBy === "dueDate" && sortOrder === "desc" ? "bg-muted" : ""}>
                Due Date (Latest)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortBy("priority"); setSortOrder("desc"); }} className={sortBy === "priority" && sortOrder === "desc" ? "bg-muted" : ""}>
                Priority (Highest)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortBy("priority"); setSortOrder("asc"); }} className={sortBy === "priority" && sortOrder === "asc" ? "bg-muted" : ""}>
                Priority (Lowest)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortBy("title"); setSortOrder("asc"); }} className={sortBy === "title" && sortOrder === "asc" ? "bg-muted" : ""}>
                Title (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortBy("title"); setSortOrder("desc"); }} className={sortBy === "title" && sortOrder === "desc" ? "bg-muted" : ""}>
                Title (Z-A)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus size={16} className="mr-2" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>
                  Add a new task to your project or team
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input 
                    placeholder="Task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea 
                    placeholder="Task description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <select
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={newTask.priority}
                      onChange={(e) => setNewTask({...newTask, priority: e.target.value as any})}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Due Date</label>
                    <Input 
                      type="date"
                      onChange={(e) => {
                        const date = e.target.value ? new Date(e.target.value) : null;
                        setNewTask({...newTask, dueDate: date});
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags</label>
                  <Input 
                    placeholder="Add tags separated by commas"
                    onChange={(e) => {
                      const tags = e.target.value
                        .split(',')
                        .map(tag => tag.trim())
                        .filter(tag => tag !== '');
                      setNewTask({...newTask, tags});
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewTask({
                  title: "",
                  description: "",
                  status: "todo",
                  priority: "medium",
                  dueDate: null,
                  tags: []
                })}>
                  Cancel
                </Button>
                <Button onClick={handleAddTask}>Create Task</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {filteredTasks.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-muted p-3 mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No tasks found</h3>
              <p className="text-sm text-muted-foreground text-center mt-2 max-w-sm">
                {searchTerm || filterStatus || filterPriority 
                  ? "Try adjusting your search or filters to find what you're looking for"
                  : "Get started by creating a new task for you or your team"}
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mt-4">
                    <Plus size={16} className="mr-2" />
                    New Task
                  </Button>
                </DialogTrigger>
                <DialogContent>{/* Same dialog content as above */}</DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <Card key={task.id} className={cn(
              "transition-all hover:shadow-md", 
              task.status === "completed" ? "opacity-70" : ""
            )}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-2">
                    <Checkbox 
                      checked={task.status === "completed"}
                      onCheckedChange={(checked) => {
                        handleUpdateTaskStatus(
                          task.id, 
                          checked ? "completed" : "todo"
                        );
                      }}
                    />
                    <div>
                      <CardTitle className={cn(
                        task.status === "completed" && "line-through text-muted-foreground"
                      )}>
                        {task.title}
                      </CardTitle>
                      {task.description && (
                        <CardDescription className="mt-1">
                          {task.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleUpdateTaskStatus(task.id, "todo")}>
                        Mark as Todo
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateTaskStatus(task.id, "in-progress")}>
                        Mark as In Progress
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateTaskStatus(task.id, "completed")}>
                        Mark as Completed
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <Trash size={14} className="mr-2" />
                        Delete Task
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      <Tag size={12} />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex justify-between items-center w-full text-sm">
                  <div className="flex items-center gap-4">
                    {task.assignedTo ? (
                      <div className="flex items-center gap-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={task.assignedTo.avatar} />
                          <AvatarFallback>{getInitials(task.assignedTo.name)}</AvatarFallback>
                        </Avatar>
                        <span className="text-muted-foreground text-xs">{task.assignedTo.name}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <User size={14} />
                        <span className="text-xs">Unassigned</span>
                      </div>
                    )}
                    
                    {task.dueDate && (
                      <div className={cn(
                        "flex items-center gap-1 text-xs",
                        task.dueDate < new Date() && task.status !== "completed" 
                          ? "text-destructive" 
                          : "text-muted-foreground"
                      )}>
                        <Clock size={14} />
                        <span>{formatDate(task.dueDate)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={cn(
                        task.status === "todo" && "bg-muted text-muted-foreground",
                        task.status === "in-progress" && "bg-blue-100 text-blue-800",
                        task.status === "completed" && "bg-green-100 text-green-800"
                      )}
                    >
                      {task.status === "todo" && "Todo"}
                      {task.status === "in-progress" && "In Progress"}
                      {task.status === "completed" && "Completed"}
                    </Badge>
                    
                    {getPriorityBadge(task.priority)}
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskManager;
