
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { 
  Save,
  Share2,
  Download,
  Copy,
  FileText,
  History,
  Users,
  MoreHorizontal,
  Bold,
  Italic,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link
} from "lucide-react";

interface User {
  id: string;
  name: string;
  avatar?: string;
}

interface DocumentVersion {
  id: string;
  createdAt: Date;
  createdBy: User;
  content: string;
}

const DocumentEditor = () => {
  const [documentTitle, setDocumentTitle] = useState("Untitled Document");
  const [documentContent, setDocumentContent] = useState("");
  const [isEditing, setIsEditing] = useState(true);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  
  // Mock data
  const [currentUser] = useState<User>({
    id: "user1",
    name: "John Doe",
    avatar: "/avatar-placeholder.png"
  });
  
  const [collaborators] = useState<User[]>([
    {
      id: "user2",
      name: "Jane Smith",
      avatar: "/avatar-placeholder.png"
    },
    {
      id: "user3",
      name: "Michael Brown",
      avatar: "/avatar-placeholder.png"
    }
  ]);
  
  const [versions] = useState<DocumentVersion[]>([
    {
      id: "v1",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      createdBy: {
        id: "user1",
        name: "John Doe",
        avatar: "/avatar-placeholder.png"
      },
      content: "Initial document draft."
    },
    {
      id: "v2",
      createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      createdBy: {
        id: "user2",
        name: "Jane Smith",
        avatar: "/avatar-placeholder.png"
      },
      content: "Added introduction section and outlined key points."
    }
  ]);
  
  const handleSave = () => {
    toast.success("Document saved successfully");
    setIsEditing(false);
  };
  
  const handleShare = () => {
    toast("Document sharing options", {
      description: "Choose how you want to share this document"
    });
  };
  
  const handleDownload = () => {
    toast.success("Document downloaded");
  };
  
  const handleCopy = () => {
    toast.success("Document link copied to clipboard");
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  const formatToolbar = () => {
    // This is a simplified toolbar - in a real implementation this would apply formatting to the content
    toast("Formatting applied", { description: "This is a simplified implementation" });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Document Editor</h1>
        <p className="text-muted-foreground">
          Create and collaborate on documents with your team
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between px-6">
            <div className="flex-1">
              <Input 
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                className="border-0 p-0 text-xl font-semibold focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Untitled Document"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2 overflow-hidden">
                <Avatar className="h-8 w-8 border-2 border-background">
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
                </Avatar>
                {collaborators.map((user) => (
                  <Avatar key={user.id} className="h-8 w-8 border-2 border-background">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              
              <Button variant="ghost" size="icon" onClick={() => setShowVersionHistory(!showVersionHistory)}>
                <History size={16} />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleSave}>
                    <Save size={14} className="mr-2" />
                    Save
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShare}>
                    <Share2 size={14} className="mr-2" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownload}>
                    <Download size={14} className="mr-2" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCopy}>
                    <Copy size={14} className="mr-2" />
                    Copy Link
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="border-t border-b py-2 mb-4">
              <div className="flex flex-wrap items-center gap-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={formatToolbar}>
                  <Bold size={16} />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={formatToolbar}>
                  <Italic size={16} />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={formatToolbar}>
                  <List size={16} />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={formatToolbar}>
                  <ListOrdered size={16} />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={formatToolbar}>
                  <AlignLeft size={16} />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={formatToolbar}>
                  <AlignCenter size={16} />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={formatToolbar}>
                  <AlignRight size={16} />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={formatToolbar}>
                  <Link size={16} />
                </Button>
              </div>
            </div>
            
            <Textarea
              value={documentContent}
              onChange={(e) => setDocumentContent(e.target.value)}
              placeholder="Start typing your document content here..."
              className="min-h-[400px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </CardContent>
        </Card>
        
        {showVersionHistory && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Version History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {versions.map((version) => (
                  <div key={version.id} className="flex items-start gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={version.createdBy.avatar} />
                      <AvatarFallback>{getInitials(version.createdBy.name)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{version.createdBy.name}</p>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(version.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {version.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline">
          <FileText size={16} className="mr-2" />
          New Document
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave}>
            <Save size={16} className="mr-2" />
            Save
          </Button>
          <Button onClick={handleShare}>
            <Share2 size={16} className="mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;
