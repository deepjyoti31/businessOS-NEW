
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { 
  Calendar,
  User,
  FileText,
  MessageSquare,
  Clock,
  MoreHorizontal,
  FileEdit,
  UserPlus,
  Settings,
  CheckCircle,
  Bell,
} from "lucide-react";

interface ActivityUser {
  id: string;
  name: string;
  avatar?: string;
}

type ActivityType = 'login' | 'document' | 'message' | 'task' | 'user' | 'setting';

interface ActivityItem {
  id: string;
  user: ActivityUser;
  type: ActivityType;
  action: string;
  target?: string;
  timestamp: Date;
  module?: string;
}

const UserActivity = () => {
  const [filter, setFilter] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("week");
  
  // Mock data
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: "act1",
      user: {
        id: "user1",
        name: "John Doe",
        avatar: "/avatar-placeholder.png"
      },
      type: "login",
      action: "logged in",
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    },
    {
      id: "act2",
      user: {
        id: "user2",
        name: "Jane Smith",
        avatar: "/avatar-placeholder.png"
      },
      type: "document",
      action: "created document",
      target: "Q3 Marketing Plan",
      timestamp: new Date(Date.now() - 1000 * 60 * 35), // 35 minutes ago
      module: "Documents"
    },
    {
      id: "act3",
      user: {
        id: "user3",
        name: "Michael Brown",
        avatar: "/avatar-placeholder.png"
      },
      type: "task",
      action: "completed task",
      target: "Update user documentation",
      timestamp: new Date(Date.now() - 1000 * 60 * 55), // 55 minutes ago
      module: "Tasks"
    },
    {
      id: "act4",
      user: {
        id: "user4",
        name: "Sarah Johnson",
        avatar: "/avatar-placeholder.png"
      },
      type: "message",
      action: "sent message in",
      target: "Team General",
      timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
      module: "Chat"
    },
    {
      id: "act5",
      user: {
        id: "user2",
        name: "Jane Smith",
        avatar: "/avatar-placeholder.png"
      },
      type: "user",
      action: "added new team member",
      target: "David Wilson",
      timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
      module: "Team"
    },
    {
      id: "act6",
      user: {
        id: "user1",
        name: "John Doe",
        avatar: "/avatar-placeholder.png"
      },
      type: "document",
      action: "edited document",
      target: "Project Proposal",
      timestamp: new Date(Date.now() - 1000 * 60 * 240), // 4 hours ago
      module: "Documents"
    },
    {
      id: "act7",
      user: {
        id: "user3",
        name: "Michael Brown",
        avatar: "/avatar-placeholder.png"
      },
      type: "setting",
      action: "updated settings in",
      target: "Notification Preferences",
      timestamp: new Date(Date.now() - 1000 * 60 * 300), // 5 hours ago
      module: "Settings"
    },
    {
      id: "act8",
      user: {
        id: "user4",
        name: "Sarah Johnson",
        avatar: "/avatar-placeholder.png"
      },
      type: "task",
      action: "created task",
      target: "Review Q2 performance metrics",
      timestamp: new Date(Date.now() - 1000 * 60 * 360), // 6 hours ago
      module: "Tasks"
    },
    {
      id: "act9",
      user: {
        id: "user2",
        name: "Jane Smith",
        avatar: "/avatar-placeholder.png"
      },
      type: "login",
      action: "logged in",
      timestamp: new Date(Date.now() - 1000 * 60 * 420), // 7 hours ago
    },
    {
      id: "act10",
      user: {
        id: "user5",
        name: "David Wilson",
        avatar: "/avatar-placeholder.png"
      },
      type: "message",
      action: "sent message in",
      target: "Marketing Team",
      timestamp: new Date(Date.now() - 1000 * 60 * 480), // 8 hours ago
      module: "Chat"
    }
  ]);
  
  // Apply filters
  const filteredActivities = activities.filter(activity => {
    // Type filter
    if (filter !== "all" && activity.type !== filter) {
      return false;
    }
    
    // Time range filter
    const now = new Date();
    let cutoff = new Date();
    
    switch (timeRange) {
      case "day":
        cutoff.setHours(now.getHours() - 24);
        break;
      case "week":
        cutoff.setDate(now.getDate() - 7);
        break;
      case "month":
        cutoff.setMonth(now.getMonth() - 1);
        break;
      case "year":
        cutoff.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    return activity.timestamp >= cutoff;
  });
  
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) {
      return "Just now";
    } else if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffMinutes < 1440) { // less than a day
      const hours = Math.floor(diffMinutes / 60);
      return `${hours}h ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case "login":
        return <User size={16} />;
      case "document":
        return <FileText size={16} />;
      case "message":
        return <MessageSquare size={16} />;
      case "task":
        return <CheckCircle size={16} />;
      case "user":
        return <UserPlus size={16} />;
      case "setting":
        return <Settings size={16} />;
      default:
        return <Bell size={16} />;
    }
  };
  
  const getActivityBadge = (type: ActivityType) => {
    switch (type) {
      case "login":
        return (
          <div className="bg-blue-100 p-2 rounded-md">
            <User size={16} className="text-blue-600" />
          </div>
        );
      case "document":
        return (
          <div className="bg-amber-100 p-2 rounded-md">
            <FileText size={16} className="text-amber-600" />
          </div>
        );
      case "message":
        return (
          <div className="bg-green-100 p-2 rounded-md">
            <MessageSquare size={16} className="text-green-600" />
          </div>
        );
      case "task":
        return (
          <div className="bg-purple-100 p-2 rounded-md">
            <CheckCircle size={16} className="text-purple-600" />
          </div>
        );
      case "user":
        return (
          <div className="bg-cyan-100 p-2 rounded-md">
            <UserPlus size={16} className="text-cyan-600" />
          </div>
        );
      case "setting":
        return (
          <div className="bg-rose-100 p-2 rounded-md">
            <Settings size={16} className="text-rose-600" />
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 p-2 rounded-md">
            <Bell size={16} className="text-gray-600" />
          </div>
        );
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">User Activity</h1>
        <p className="text-muted-foreground">
          Track and monitor team members' actions across the platform
        </p>
      </div>
      
      <Card>
        <CardHeader className="pb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Recent Activities</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="login">Logins</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
                <SelectItem value="message">Messages</SelectItem>
                <SelectItem value="task">Tasks</SelectItem>
                <SelectItem value="user">Users</SelectItem>
                <SelectItem value="setting">Settings</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            {filteredActivities.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No activities found</h3>
                <p className="text-sm text-muted-foreground max-w-sm text-center mt-2">
                  There are no activities matching your current filters. Try changing your filter settings or check back later.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4">
                    {getActivityBadge(activity.type)}
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-1">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={activity.user.avatar} />
                          <AvatarFallback>{getInitials(activity.user.name)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{activity.user.name}</span>
                      </div>
                      <p className="text-sm">
                        {activity.action}
                        {activity.target && (
                          <span className="font-medium"> {activity.target}</span>
                        )}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock size={12} />
                        <span>{formatTime(activity.timestamp)}</span>
                        
                        {activity.module && (
                          <Badge variant="outline" className="ml-1 text-[10px] px-1 py-0">
                            {activity.module}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <MoreHorizontal size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button variant="outline">
          <FileEdit size={16} className="mr-2" />
          Export Activity Log
        </Button>
      </div>
    </div>
  );
};

export default UserActivity;
