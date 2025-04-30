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
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { 
  Users, 
  MessageSquare, 
  FileText, 
  Share2, 
  Plus,
  Clock,
  UserPlus,
  MoreHorizontal,
  Send,
  Paperclip
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  isOnline?: boolean;
}

interface Message {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

interface Conversation {
  id: string;
  participants: TeamMember[];
  messages: Message[];
  lastActivity: Date;
}

interface SharedDocument {
  id: string;
  name: string;
  type: string;
  owner: string;
  lastModified: Date;
  sharedWith: TeamMember[];
  size: string;
}

const TeamCollaboration = () => {
  const [activeTab, setActiveTab] = useState("messaging");
  const [activeConversation, setActiveConversation] = useState<string | null>("team-general");
  const [newMessageText, setNewMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock data for team members
  const teamMembers: TeamMember[] = [
    { id: "1", name: "John Doe", role: "Product Manager", avatar: "/avatar-placeholder.png", isOnline: true },
    { id: "2", name: "Jane Smith", role: "UX Designer", avatar: "/avatar-placeholder.png", isOnline: true },
    { id: "3", name: "Michael Brown", role: "Developer", avatar: "/avatar-placeholder.png", isOnline: false },
    { id: "4", name: "Sarah Johnson", role: "Marketing Specialist", avatar: "/avatar-placeholder.png", isOnline: true },
    { id: "5", name: "David Wilson", role: "Content Writer", avatar: "/avatar-placeholder.png", isOnline: false },
  ];
  
  // Mock data for conversations
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "team-general",
      participants: teamMembers,
      messages: [
        {
          id: "msg-1",
          userId: "1",
          content: "Hey team, let's discuss the upcoming release.",
          timestamp: new Date(2025, 3, 27, 9, 30),
          isRead: true
        },
        {
          id: "msg-2",
          userId: "2",
          content: "I've finalized the designs for the new dashboard. Would love your feedback!",
          timestamp: new Date(2025, 3, 27, 9, 45),
          isRead: true
        },
        {
          id: "msg-3",
          userId: "3",
          content: "The backend APIs are ready for testing. Let me know if you encounter any issues.",
          timestamp: new Date(2025, 3, 27, 10, 15),
          isRead: true
        },
        {
          id: "msg-4",
          userId: "4",
          content: "We should prepare some marketing materials for the release. I'll start working on it.",
          timestamp: new Date(2025, 3, 27, 11, 0),
          isRead: true
        }
      ],
      lastActivity: new Date(2025, 3, 27, 11, 0)
    },
    {
      id: "design-team",
      participants: teamMembers.filter(m => m.id === "1" || m.id === "2"),
      messages: [
        {
          id: "dm-1",
          userId: "1",
          content: "Jane, can you share the latest design mockups?",
          timestamp: new Date(2025, 3, 27, 14, 30),
          isRead: true
        },
        {
          id: "dm-2",
          userId: "2",
          content: "Sure! I've uploaded them to the shared drive. Let me know what you think.",
          timestamp: new Date(2025, 3, 27, 14, 35),
          isRead: false
        }
      ],
      lastActivity: new Date(2025, 3, 27, 14, 35)
    },
    {
      id: "dev-updates",
      participants: teamMembers.filter(m => m.id === "1" || m.id === "3"),
      messages: [
        {
          id: "du-1",
          userId: "3",
          content: "The new feature implementation is going well. Should be ready for testing by tomorrow.",
          timestamp: new Date(2025, 3, 26, 16, 45),
          isRead: true
        },
        {
          id: "du-2",
          userId: "1",
          content: "Great! Let's schedule a review session once it's ready.",
          timestamp: new Date(2025, 3, 26, 17, 0),
          isRead: true
        }
      ],
      lastActivity: new Date(2025, 3, 26, 17, 0)
    }
  ]);
  
  // Mock data for shared documents
  const [sharedDocuments, setSharedDocuments] = useState<SharedDocument[]>([
    {
      id: "doc-1",
      name: "Project Roadmap",
      type: "spreadsheet",
      owner: "John Doe",
      lastModified: new Date(2025, 3, 25),
      sharedWith: teamMembers,
      size: "2.4 MB"
    },
    {
      id: "doc-2",
      name: "Design Assets",
      type: "folder",
      owner: "Jane Smith",
      lastModified: new Date(2025, 3, 27),
      sharedWith: teamMembers,
      size: "156 MB"
    },
    {
      id: "doc-3",
      name: "Q2 Marketing Plan",
      type: "document",
      owner: "Sarah Johnson",
      lastModified: new Date(2025, 3, 20),
      sharedWith: teamMembers.filter(m => m.id !== "3"),
      size: "3.7 MB"
    },
    {
      id: "doc-4",
      name: "Technical Specifications",
      type: "document",
      owner: "Michael Brown",
      lastModified: new Date(2025, 3, 18),
      sharedWith: teamMembers.filter(m => m.id === "1" || m.id === "3"),
      size: "1.2 MB"
    },
    {
      id: "doc-5",
      name: "Content Strategy",
      type: "presentation",
      owner: "David Wilson",
      lastModified: new Date(2025, 3, 15),
      sharedWith: teamMembers,
      size: "8.5 MB"
    }
  ]);

  const activeConversationData = conversations.find(c => c.id === activeConversation) || null;
  
  const handleSendMessage = () => {
    if (!newMessageText.trim() || !activeConversation) return;
    
    const newMessage: Message = {
      id: `new-msg-${Date.now()}`,
      userId: "1", // Current user's ID
      content: newMessageText,
      timestamp: new Date(),
      isRead: true
    };
    
    setConversations(conversations.map(convo => {
      if (convo.id === activeConversation) {
        return {
          ...convo,
          messages: [...convo.messages, newMessage],
          lastActivity: new Date()
        };
      }
      return convo;
    }));
    
    setNewMessageText("");
  };

  const filteredConversations = conversations.filter(convo => {
    if (!searchTerm) return true;
    
    // Check if conversation name contains search term
    const convoName = convo.id.replace(/-/g, ' ');
    if (convoName.toLowerCase().includes(searchTerm.toLowerCase())) return true;
    
    // Check if any participant name contains search term
    return convo.participants.some(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleCreateConversation = () => {
    toast.success("New conversation created", {
      description: "You can now start messaging with selected team members"
    });
    
    // In a real app, this would create a new conversation
  };

  const handleShareDocument = () => {
    toast.success("Document shared successfully", {
      description: "Team members will receive a notification"
    });
    
    // In a real app, this would share the document
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
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

  const renderFileIcon = (type: string) => {
    switch (type) {
      case 'spreadsheet':
        return (
          <div className="bg-green-100 p-2 rounded-md">
            <FileText size={16} className="text-green-600" />
          </div>
        );
      case 'document':
        return (
          <div className="bg-blue-100 p-2 rounded-md">
            <FileText size={16} className="text-blue-600" />
          </div>
        );
      case 'presentation':
        return (
          <div className="bg-amber-100 p-2 rounded-md">
            <FileText size={16} className="text-amber-600" />
          </div>
        );
      case 'folder':
        return (
          <div className="bg-purple-100 p-2 rounded-md">
            <FileText size={16} className="text-purple-600" />
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 p-2 rounded-md">
            <FileText size={16} className="text-gray-600" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold mb-1">Team Collaboration</h1>
        <p className="text-muted-foreground">
          Work together with your team and share resources
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="messaging" className="flex items-center gap-2">
            <MessageSquare size={16} />
            <span>Messaging</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText size={16} />
            <span>Documents</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users size={16} />
            <span>Team</span>
          </TabsTrigger>
        </TabsList>

        {/* Messaging Tab */}
        <TabsContent value="messaging">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Conversations List */}
            <Card className="md:col-span-1">
              <CardHeader className="px-4 py-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Conversations</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Plus size={16} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>New Conversation</DialogTitle>
                        <DialogDescription>
                          Start a new conversation with team members.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="py-4">
                        <Label className="mb-2 block">Add Participants</Label>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {teamMembers.map((member) => (
                            <Badge
                              key={member.id}
                              variant="outline"
                              className="flex items-center gap-1 py-1"
                            >
                              <Avatar className="h-5 w-5 mr-1">
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                              </Avatar>
                              {member.name}
                            </Badge>
                          ))}
                          <Badge
                            variant="outline"
                            className="bg-muted cursor-pointer"
                          >
                            <Plus size={12} className="mr-1" />
                            Add More
                          </Badge>
                        </div>
                        
                        <Label className="mb-2 block">Conversation Name</Label>
                        <Input placeholder="e.g., Project Alpha Team" />
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline">Cancel</Button>
                        <Button onClick={handleCreateConversation}>Create Conversation</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="mt-2">
                  <Input 
                    placeholder="Search conversations..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent className="px-2 pb-2">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-1 p-2">
                    {filteredConversations.map((convo) => {
                      const unreadCount = convo.messages.filter(m => !m.isRead).length;
                      const lastMessage = convo.messages[convo.messages.length - 1];
                      const convoName = convo.id.replace(/-/g, ' ');
                      
                      // For direct messages, show the other person's name
                      const displayName = 
                        convo.participants.length === 2
                          ? convo.participants.find(p => p.id !== "1")?.name || convoName
                          : convoName;
                      
                      return (
                        <Button
                          key={convo.id}
                          variant={activeConversation === convo.id ? "secondary" : "ghost"}
                          className={`w-full justify-start px-2 ${
                            activeConversation === convo.id ? "" : "hover:bg-muted/50"
                          } min-h-[3.5rem] h-auto py-2`}
                          onClick={() => setActiveConversation(convo.id)}
                        >
                          <div className="flex items-center w-full">
                            {convo.participants.length > 2 ? (
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                                <Users size={16} />
                              </div>
                            ) : (
                              <Avatar className="h-10 w-10 shrink-0">
                                <AvatarImage 
                                  src={convo.participants.find(p => p.id !== "1")?.avatar} 
                                  alt={displayName}
                                />
                                <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
                              </Avatar>
                            )}
                            
                            <div className="ml-3 flex-1 overflow-hidden">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium capitalize">
                                  {displayName}
                                </p>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(convo.lastActivity)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between mt-0.5">
                                <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                                  {lastMessage ? lastMessage.content : "No messages yet"}
                                </p>
                                {unreadCount > 0 && (
                                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-business-600 text-[10px] font-medium text-white">
                                    {unreadCount}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
            
            {/* Chat Area */}
            <Card className="md:col-span-2">
              {activeConversationData ? (
                <>
                  <CardHeader className="px-6 py-3 flex flex-row items-center justify-between">
                    <div className="flex items-center">
                      {activeConversationData.participants.length > 2 ? (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted mr-2">
                          <Users size={16} />
                        </div>
                      ) : (
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage 
                            src={activeConversationData.participants.find(p => p.id !== "1")?.avatar} 
                          />
                          <AvatarFallback>
                            {getInitials(activeConversationData.participants.find(p => p.id !== "1")?.name || "")}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div>
                        <CardTitle className="text-base capitalize">
                          {activeConversationData.id.replace(/-/g, ' ')}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {activeConversationData.participants.length} participants
                        </CardDescription>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <UserPlus size={14} className="mr-2" />
                          Add participant
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText size={14} className="mr-2" />
                          Share document
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users size={14} className="mr-2" />
                          View participants
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  
                  <CardContent className="p-0">
                    <ScrollArea className="h-[380px] px-6 py-4">
                      <div className="space-y-4">
                        {activeConversationData.messages.map((message) => {
                          const sender = teamMembers.find(m => m.id === message.userId);
                          const isCurrentUser = message.userId === "1";
                          
                          return (
                            <div 
                              key={message.id}
                              className={`flex ${isCurrentUser ? "justify-end" : ""}`}
                            >
                              <div className={`flex ${isCurrentUser ? "flex-row-reverse" : ""} items-start gap-2 max-w-[80%]`}>
                                <Avatar className="h-8 w-8 mt-1">
                                  <AvatarImage src={sender?.avatar} />
                                  <AvatarFallback>{getInitials(sender?.name || "")}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className={`flex items-center gap-2 ${isCurrentUser ? "flex-row-reverse" : ""}`}>
                                    <span className="text-sm font-medium">{sender?.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {formatTime(message.timestamp)}
                                    </span>
                                  </div>
                                  <div className={`mt-1 rounded-lg p-3 ${
                                    isCurrentUser
                                      ? "bg-business-100 text-business-900"
                                      : "bg-muted"
                                  }`}>
                                    <p className="text-sm">{message.content}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </CardContent>
                  
                  <CardFooter className="p-3 border-t">
                    <div className="flex items-center gap-2 w-full">
                      <Button variant="outline" size="icon" className="shrink-0">
                        <Paperclip size={16} />
                      </Button>
                      <Input 
                        placeholder="Type your message..."
                        value={newMessageText}
                        onChange={(e) => setNewMessageText(e.target.value)}
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button onClick={handleSendMessage} className="shrink-0">
                        <Send size={16} className="mr-2" />
                        Send
                      </Button>
                    </div>
                  </CardFooter>
                </>
              ) : (
                <div className="flex items-center justify-center h-[480px]">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No Conversation Selected</h3>
                    <p className="text-muted-foreground mt-1">
                      Choose a conversation or start a new one
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader className="px-6 py-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle>Shared Documents</CardTitle>
                <CardDescription>
                  Access and collaborate on shared files
                </CardDescription>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Share2 size={16} className="mr-2" />
                    Share Document
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Share a Document</DialogTitle>
                    <DialogDescription>
                      Upload or select a document to share with your team.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="py-4">
                    <Label className="mb-2 block">Document Name</Label>
                    <Input placeholder="Enter document name" />
                    
                    <div className="mt-4">
                      <Label className="mb-2 block">Upload File</Label>
                      <div className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-muted/50">
                        <FileText size={32} className="mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">Drag and drop files here</p>
                        <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Label className="mb-2 block">Share With</Label>
                      <div className="flex flex-wrap gap-2">
                        {teamMembers.map((member) => (
                          <Badge
                            key={member.id}
                            variant="outline"
                            className="flex items-center gap-1 py-1"
                          >
                            <Avatar className="h-5 w-5 mr-1">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                            </Avatar>
                            {member.name}
                          </Badge>
                        ))}
                        <Badge
                          variant="outline"
                          className="bg-muted cursor-pointer"
                        >
                          <Plus size={12} className="mr-1" />
                          Add More
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Label className="mb-2 block">Access Level</Label>
                      <Input placeholder="View & Comment" />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={handleShareDocument}>Share Document</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input placeholder="Search documents..." />
                
                <div className="rounded-md border">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-12 px-4 text-left font-medium">Name</th>
                        <th className="h-12 px-4 text-left font-medium">Owner</th>
                        <th className="h-12 px-4 text-left font-medium">Last Modified</th>
                        <th className="h-12 px-4 text-left font-medium">Size</th>
                        <th className="h-12 px-4 text-left font-medium">Shared With</th>
                        <th className="h-12 px-4 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sharedDocuments.map((doc) => (
                        <tr key={doc.id} className="border-b">
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-3">
                              {renderFileIcon(doc.type)}
                              <span>{doc.name}</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle">{doc.owner}</td>
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-1">
                              <Clock size={14} className="text-muted-foreground" />
                              <span>{doc.lastModified.toLocaleDateString()}</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle">{doc.size}</td>
                          <td className="p-4 align-middle">
                            <div className="flex -space-x-2 overflow-hidden">
                              {doc.sharedWith.slice(0, 3).map((user, i) => (
                                <Avatar key={i} className="h-6 w-6 border-2 border-background">
                                  <AvatarImage src={user.avatar} />
                                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                </Avatar>
                              ))}
                              {doc.sharedWith.length > 3 && (
                                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px]">
                                  +{doc.sharedWith.length - 3}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal size={16} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map((member) => (
              <Card key={member.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center">
                      <Badge 
                        variant="outline" 
                        className={`mr-2 ${
                          member.isOnline 
                            ? "bg-green-100 text-green-800 hover:bg-green-100" 
                            : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                        }`}
                      >
                        {member.isOnline ? "Online" : "Offline"}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <MessageSquare size={14} className="mr-2" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 size={14} className="mr-2" />
                            Share Document
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users size={14} className="mr-2" />
                            View Profile
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <MessageSquare size={14} className="mr-2" />
                      Message
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Share2 size={14} className="mr-2" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface LabelProps {
  className?: string;
  htmlFor?: string;
  children: React.ReactNode;
}

const Label = ({ className, htmlFor, children }: LabelProps) => (
  <label
    htmlFor={htmlFor}
    className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
  >
    {children}
  </label>
);

export default TeamCollaboration;
