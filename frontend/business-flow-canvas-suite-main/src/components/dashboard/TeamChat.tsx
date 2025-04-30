
import { useState, useEffect, useRef } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, 
  Send,
  Paperclip,
  User,
  Users,
  Search,
  PlusCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
}

interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

interface ChatThread {
  id: string;
  name: string;
  isGroup: boolean;
  participants: ChatUser[];
  messages: ChatMessage[];
  lastActivity: Date;
}

const TeamChat = () => {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Mock data
  const [currentUser] = useState<ChatUser>({
    id: "user1",
    name: "Current User",
    avatar: "/avatar-placeholder.png",
    isOnline: true
  });
  
  const [users] = useState<ChatUser[]>([
    {
      id: "user2",
      name: "Jane Smith",
      avatar: "/avatar-placeholder.png",
      isOnline: true,
      lastSeen: new Date()
    },
    {
      id: "user3",
      name: "Michael Brown",
      avatar: "/avatar-placeholder.png",
      isOnline: false,
      lastSeen: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
    },
    {
      id: "user4",
      name: "Sarah Johnson",
      avatar: "/avatar-placeholder.png",
      isOnline: true,
      lastSeen: new Date()
    },
    {
      id: "user5",
      name: "David Wilson",
      avatar: "/avatar-placeholder.png",
      isOnline: false,
      lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
    }
  ]);
  
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([
    {
      id: "chat1",
      name: "Team General",
      isGroup: true,
      participants: [currentUser, ...users],
      messages: [
        {
          id: "msg1",
          senderId: "user2",
          content: "Hi everyone! How's the project coming along?",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          isRead: true
        },
        {
          id: "msg2",
          senderId: "user3",
          content: "Making good progress on the backend API. Should be ready for testing by tomorrow.",
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          isRead: true
        },
        {
          id: "msg3",
          senderId: "user1",
          content: "That's great news! I'll schedule a review session for Thursday.",
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          isRead: true
        }
      ],
      lastActivity: new Date(Date.now() - 1000 * 60 * 30)
    },
    {
      id: "chat2",
      name: "Marketing Team",
      isGroup: true,
      participants: [currentUser, users[0], users[3]],
      messages: [
        {
          id: "msg4",
          senderId: "user4",
          content: "Can we discuss the new campaign ideas tomorrow?",
          timestamp: new Date(Date.now() - 1000 * 60 * 120),
          isRead: false
        },
        {
          id: "msg5",
          senderId: "user1",
          content: "Sure, how about 10am?",
          timestamp: new Date(Date.now() - 1000 * 60 * 110),
          isRead: true
        }
      ],
      lastActivity: new Date(Date.now() - 1000 * 60 * 110)
    },
    {
      id: "chat3",
      name: "Jane Smith",
      isGroup: false,
      participants: [currentUser, users[0]],
      messages: [
        {
          id: "msg6",
          senderId: "user2",
          content: "Did you review the design mockups?",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
          isRead: true
        },
        {
          id: "msg7",
          senderId: "user1",
          content: "Yes, they look great! Just a few minor tweaks needed.",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
          isRead: true
        }
      ],
      lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2.5)
    }
  ]);
  
  useEffect(() => {
    scrollToBottom();
  }, [activeChat, chatThreads]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!newMessage.trim() || !activeChat) return;
    
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      content: newMessage.trim(),
      timestamp: new Date(),
      isRead: true
    };
    
    setChatThreads(threads => 
      threads.map(thread => 
        thread.id === activeChat
          ? {
              ...thread,
              messages: [...thread.messages, newMsg],
              lastActivity: new Date()
            }
          : thread
      )
    );
    
    setNewMessage("");
    toast("Message sent");
  };
  
  const filteredChats = chatThreads.filter(chat => {
    if (!searchTerm) return true;
    
    // Check if chat name contains search term
    if (chat.name.toLowerCase().includes(searchTerm.toLowerCase())) return true;
    
    // Check if any participant name contains search term
    return chat.participants.some(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  const activeChatData = chatThreads.find(chat => chat.id === activeChat);
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  const startNewChat = () => {
    toast("New chat started", { 
      description: "You can now select participants to start a conversation" 
    });
    // In a real app, this would open a dialog to select users
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full">
      {/* Chat List */}
      <Card className="md:col-span-1 flex flex-col h-full">
        <CardHeader className="px-4 py-3 space-y-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Team Chat</CardTitle>
            <Button variant="ghost" size="sm" onClick={startNewChat}>
              <PlusCircle size={16} />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search chats..." 
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        
        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1 p-2">
            {filteredChats.map((chat) => {
              const unreadCount = chat.messages.filter(m => !m.isRead && m.senderId !== currentUser.id).length;
              const lastMessage = chat.messages[chat.messages.length - 1];
              
              return (
                <Button
                  key={chat.id}
                  variant={activeChat === chat.id ? "secondary" : "ghost"}
                  className="w-full justify-start px-2 min-h-14 h-auto py-2"
                  onClick={() => setActiveChat(chat.id)}
                >
                  <div className="flex items-center w-full">
                    {chat.isGroup ? (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                        <Users size={16} />
                      </div>
                    ) : (
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarImage 
                          src={chat.participants.find(p => p.id !== currentUser.id)?.avatar} 
                          alt={chat.name} 
                        />
                        <AvatarFallback>{getInitials(chat.name)}</AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className="ml-3 flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{chat.name}</p>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(chat.lastActivity)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                          {lastMessage?.content || "No messages yet"}
                        </p>
                        {unreadCount > 0 && (
                          <Badge className="ml-2">{unreadCount}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </Card>
      
      {/* Chat Area */}
      <Card className="md:col-span-3 flex flex-col h-full">
        {activeChatData ? (
          <>
            <CardHeader className="px-6 py-3 border-b">
              <div className="flex items-center">
                {activeChatData.isGroup ? (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted mr-2">
                    <Users size={16} />
                  </div>
                ) : (
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage 
                      src={activeChatData.participants.find(p => p.id !== currentUser.id)?.avatar} 
                    />
                    <AvatarFallback>
                      {getInitials(activeChatData.participants.find(p => p.id !== currentUser.id)?.name || "")}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div>
                  <CardTitle className="text-base">{activeChatData.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {activeChatData.isGroup 
                      ? `${activeChatData.participants.length} members` 
                      : activeChatData.participants.find(p => p.id !== currentUser.id)?.isOnline 
                        ? "Online" 
                        : "Offline"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {activeChatData.messages.map((msg) => {
                  const isCurrentUser = msg.senderId === currentUser.id;
                  const sender = activeChatData.participants.find(p => p.id === msg.senderId);
                  
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex ${isCurrentUser ? "flex-row-reverse" : ""} gap-2 max-w-[80%]`}>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={sender?.avatar} />
                          <AvatarFallback>{getInitials(sender?.name || "")}</AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <div className={`flex items-center gap-2 ${isCurrentUser ? "justify-end" : ""}`}>
                            <span className="text-sm font-medium">{sender?.name}</span>
                            <span className="text-xs text-muted-foreground">{formatTime(msg.timestamp)}</span>
                          </div>
                          
                          <div className={cn(
                            "mt-1 rounded-lg p-3",
                            isCurrentUser 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted"
                          )}>
                            <p className="text-sm">{msg.content}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            <CardFooter className="border-t p-3">
              <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
                <Button type="button" variant="outline" size="icon">
                  <Paperclip size={16} />
                </Button>
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button type="submit" disabled={!newMessage.trim()}>
                  <Send size={16} className="mr-2" />
                  Send
                </Button>
              </form>
            </CardFooter>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No chat selected</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Select a chat from the sidebar or start a new conversation
              </p>
              <Button className="mt-4" onClick={startNewChat}>
                <PlusCircle size={16} className="mr-2" />
                Start New Chat
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default TeamChat;
