import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  FileText,
  Search,
  FileSpreadsheet,
  FileImage,
  File,
  Users,
  Clock
} from "lucide-react";

const Shared = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock shared documents data
  const sharedDocuments = [
    {
      id: "DOC-001",
      name: "Q1 2025 Financial Report.pdf",
      type: "PDF",
      size: "2.4 MB",
      folder: "Finance",
      owner: "John Doe",
      ownerAvatar: "JD",
      sharedAt: "2025-03-20 10:15 AM",
      sharedWith: [
        { name: "Sarah Wilson", avatar: "SW" },
        { name: "Robert Johnson", avatar: "RJ" },
        { name: "Emily Davis", avatar: "ED" },
        { name: "David Clark", avatar: "DC" }
      ],
      permissions: "view"
    },
    {
      id: "DOC-002",
      name: "Marketing Strategy 2025.docx",
      type: "DOCX",
      size: "1.8 MB",
      folder: "Marketing",
      owner: "Emily Davis",
      ownerAvatar: "ED",
      sharedAt: "2025-03-18 02:30 PM",
      sharedWith: [
        { name: "John Doe", avatar: "JD" },
        { name: "Sarah Wilson", avatar: "SW" }
      ],
      permissions: "edit"
    },
    {
      id: "DOC-003",
      name: "Product Roadmap.xlsx",
      type: "XLSX",
      size: "3.6 MB",
      folder: "Product",
      owner: "Robert Johnson",
      ownerAvatar: "RJ",
      sharedAt: "2025-03-15 11:45 AM",
      sharedWith: [
        { name: "John Doe", avatar: "JD" },
        { name: "Emily Davis", avatar: "ED" },
        { name: "David Clark", avatar: "DC" }
      ],
      permissions: "edit"
    },
    {
      id: "DOC-005",
      name: "Company Logo Files.zip",
      type: "ZIP",
      size: "8.2 MB",
      folder: "Brand Assets",
      owner: "Michael Brown",
      ownerAvatar: "MB",
      sharedAt: "2025-03-10 04:10 PM",
      sharedWith: [
        { name: "Emily Davis", avatar: "ED" },
        { name: "Sarah Wilson", avatar: "SW" }
      ],
      permissions: "view"
    },
    {
      id: "DOC-006",
      name: "Employee Handbook 2025.pdf",
      type: "PDF",
      size: "4.5 MB",
      folder: "HR",
      owner: "Sarah Wilson",
      ownerAvatar: "SW",
      sharedAt: "2025-03-05 01:30 PM",
      sharedWith: [
        { name: "John Doe", avatar: "JD" },
        { name: "Emily Davis", avatar: "ED" },
        { name: "Robert Johnson", avatar: "RJ" },
        { name: "David Clark", avatar: "DC" },
        { name: "Michael Brown", avatar: "MB" }
      ],
      permissions: "view"
    }
  ];

  // Filter documents based on search term
  const filteredDocuments = sharedDocuments.filter((document) =>
    document.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    document.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    document.folder.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // File type icon mapping
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return <FileText className="h-6 w-6 text-red-500" />;
      case 'DOCX':
        return <FileText className="h-6 w-6 text-blue-500" />;
      case 'XLSX':
        return <FileSpreadsheet className="h-6 w-6 text-green-500" />;
      case 'ZIP':
        return <File className="h-6 w-6 text-amber-500" />;
      case 'JPG':
      case 'PNG':
        return <FileImage className="h-6 w-6 text-purple-500" />;
      default:
        return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  // Get permission badge color
  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case 'edit':
        return "bg-green-100 text-green-800";
      case 'view':
        return "bg-blue-100 text-blue-800";
      case 'comment':
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Shared Documents</h1>
        <p className="text-muted-foreground">
          Files shared with you by other users and files you've shared
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Shared with Me</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">From 6 collaborators</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Shared by Me</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">With 12 collaborators</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Updates in the last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search shared documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button>
          <Users className="mr-2 h-4 w-4" />
          Share New Document
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shared with Me</CardTitle>
          <CardDescription>
            Documents shared with you by other users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((document) => (
                <div key={document.id} className="py-4 flex items-center gap-4">
                  {getFileIcon(document.type)}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{document.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getPermissionColor(document.permissions)}`}>
                        {document.permissions}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Avatar className="h-4 w-4">
                          <AvatarFallback className="text-[10px]">{document.ownerAvatar}</AvatarFallback>
                        </Avatar>
                        <span>Shared by {document.owner}</span>
                      </div>
                      <span className="opacity-50">•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{document.sharedAt}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {document.sharedWith.slice(0, 3).map((user, index) => (
                        <Avatar key={index} className="h-6 w-6 border-2 border-background">
                          <AvatarFallback>{user.avatar}</AvatarFallback>
                        </Avatar>
                      ))}
                      {document.sharedWith.length > 3 && (
                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                          +{document.sharedWith.length - 3}
                        </div>
                      )}
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-muted-foreground">
                No shared documents found matching your search.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shared by Me</CardTitle>
          <CardDescription>
            Documents you've shared with others
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {filteredDocuments.slice(0, 3).map((document) => (
              <div key={`shared-by-me-${document.id}`} className="py-4 flex items-center gap-4">
                {getFileIcon(document.type)}
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{document.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <span>{document.folder}</span>
                    <span className="opacity-50">•</span>
                    <span>{document.size}</span>
                    <span className="opacity-50">•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Shared {document.sharedAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {document.sharedWith.slice(0, 3).map((user, index) => (
                      <Avatar key={index} className="h-6 w-6 border-2 border-background">
                        <AvatarFallback>{user.avatar}</AvatarFallback>
                      </Avatar>
                    ))}
                    {document.sharedWith.length > 3 && (
                      <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                        +{document.sharedWith.length - 3}
                      </div>
                    )}
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Shared;
