
import { useState, useEffect } from "react";
import { Bell, Check, X, Settings, MessageSquare, Calendar, FileText, Users, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'general' | 'task' | 'message' | 'calendar' | 'report' | 'sale';
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [settings, setSettings] = useState({
    emailEnabled: true,
    inAppEnabled: true,
    taskNotifications: true,
    messageNotifications: true,
    calendarNotifications: true,
    reportNotifications: true,
    salesNotifications: true,
  });

  // Load mock notifications
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: "1",
        title: "New Task Assigned",
        message: "You have been assigned a new task: Update quarterly reports",
        time: "10 minutes ago",
        read: false,
        type: "task"
      },
      {
        id: "2",
        title: "Team Meeting",
        message: "Reminder: Team meeting starts in 30 minutes",
        time: "30 minutes ago",
        read: false,
        type: "calendar"
      },
      {
        id: "3",
        title: "Report Generated",
        message: "Q2 Financial Report has been generated and is ready for review",
        time: "1 hour ago",
        read: false,
        type: "report"
      },
      {
        id: "4",
        title: "New Message",
        message: "Jane Smith commented on Project Alpha proposal",
        time: "2 hours ago",
        read: true,
        type: "message"
      },
      {
        id: "5",
        title: "Deal Closed",
        message: "New deal with Acme Corp has been closed: $24,500",
        time: "Yesterday",
        read: true,
        type: "sale"
      }
    ];
    
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    setUnreadCount(0);
    toast.success("All notifications marked as read");
  };

  const removeNotification = (id: string) => {
    const notification = notifications.find(n => n.id === id);
    setNotifications(notifications.filter(notification => notification.id !== id));
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <div className="bg-blue-100 p-2 rounded-full"><Check size={14} className="text-blue-600" /></div>;
      case 'message':
        return <div className="bg-purple-100 p-2 rounded-full"><MessageSquare size={14} className="text-purple-600" /></div>;
      case 'calendar':
        return <div className="bg-green-100 p-2 rounded-full"><Calendar size={14} className="text-green-600" /></div>;
      case 'report':
        return <div className="bg-amber-100 p-2 rounded-full"><FileText size={14} className="text-amber-600" /></div>;
      case 'sale':
        return <div className="bg-red-100 p-2 rounded-full"><ShoppingCart size={14} className="text-red-600" /></div>;
      default:
        return <div className="bg-gray-100 p-2 rounded-full"><Bell size={14} className="text-gray-600" /></div>;
    }
  };

  const toggleSetting = (setting: keyof typeof settings) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting]
    });
    toast.success(`Notification setting updated`);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Tabs defaultValue="all">
          <div className="flex items-center justify-between p-3 border-b">
            <h3 className="font-medium text-sm">Notifications</h3>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-7"
                onClick={markAllAsRead}
              >
                Mark all read
              </Button>
            </div>
          </div>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="p-0">
            <ScrollArea className="h-[300px]">
              {notifications.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No notifications
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-3 flex gap-3 items-start hover:bg-muted/50 transition-colors ${!notification.read ? 'bg-muted/30' : ''}`}
                    >
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0" onClick={() => markAsRead(notification.id)}>
                        <p className={`text-sm font-medium line-clamp-1 ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.time}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 opacity-50 hover:opacity-100"
                        onClick={() => removeNotification(notification.id)}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="settings" className="p-4 space-y-4">
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Delivery Methods</h4>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm">Email Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch 
                  checked={settings.emailEnabled}
                  onCheckedChange={() => toggleSetting('emailEnabled')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm">In-App Notifications</p>
                  <p className="text-xs text-muted-foreground">Show notifications within the app</p>
                </div>
                <Switch 
                  checked={settings.inAppEnabled}
                  onCheckedChange={() => toggleSetting('inAppEnabled')}
                />
              </div>
              <h4 className="text-sm font-medium pt-2">Notification Types</h4>
              <div className="flex items-center justify-between">
                <p className="text-sm">Tasks & Assignments</p>
                <Switch 
                  checked={settings.taskNotifications}
                  onCheckedChange={() => toggleSetting('taskNotifications')}
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm">Messages & Comments</p>
                <Switch 
                  checked={settings.messageNotifications}
                  onCheckedChange={() => toggleSetting('messageNotifications')}
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm">Calendar Events</p>
                <Switch 
                  checked={settings.calendarNotifications}
                  onCheckedChange={() => toggleSetting('calendarNotifications')}
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm">Reports & Analytics</p>
                <Switch 
                  checked={settings.reportNotifications}
                  onCheckedChange={() => toggleSetting('reportNotifications')}
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm">Sales & Deals</p>
                <Switch 
                  checked={settings.salesNotifications}
                  onCheckedChange={() => toggleSetting('salesNotifications')}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
