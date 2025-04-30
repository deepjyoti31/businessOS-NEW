import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Search,
  FileSpreadsheet,
  FileImage,
  File,
  Archive as ArchiveIcon,
  Clock,
  RotateCcw,
  Trash2
} from "lucide-react";

const Archive = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock archived documents data
  const archivedDocuments = [
    {
      id: "ARC-001",
      name: "Q4 2024 Financial Report.pdf",
      type: "PDF",
      size: "2.8 MB",
      folder: "Finance",
      owner: "John Doe",
      ownerAvatar: "JD",
      archivedBy: "Sarah Wilson",
      archivedByAvatar: "SW",
      archivedAt: "2025-01-15 10:15 AM",
      reason: "Project completed",
      tags: ["finance", "quarterly", "report", "2024"]
    },
    {
      id: "ARC-002",
      name: "Marketing Strategy 2024.docx",
      type: "DOCX",
      size: "1.5 MB",
      folder: "Marketing",
      owner: "Emily Davis",
      ownerAvatar: "ED",
      archivedBy: "Emily Davis",
      archivedByAvatar: "ED",
      archivedAt: "2025-01-10 02:30 PM",
      reason: "Outdated",
      tags: ["marketing", "strategy", "2024"]
    },
    {
      id: "ARC-003",
      name: "Product Roadmap 2024.xlsx",
      type: "XLSX",
      size: "3.2 MB",
      folder: "Product",
      owner: "Robert Johnson",
      ownerAvatar: "RJ",
      archivedBy: "David Clark",
      archivedByAvatar: "DC",
      archivedAt: "2025-01-05 11:45 AM",
      reason: "Superseded",
      tags: ["product", "roadmap", "planning", "2024"]
    },
    {
      id: "ARC-004",
      name: "Client Meeting Notes Q3.docx",
      type: "DOCX",
      size: "0.8 MB",
      folder: "Sales",
      owner: "Jane Smith",
      ownerAvatar: "JS",
      archivedBy: "Jane Smith",
      archivedByAvatar: "JS",
      archivedAt: "2024-12-27 09:20 AM",
      reason: "Project completed",
      tags: ["sales", "meeting", "notes", "2024"]
    },
    {
      id: "ARC-005",
      name: "Old Logo Files.zip",
      type: "ZIP",
      size: "7.5 MB",
      folder: "Brand Assets",
      owner: "Michael Brown",
      ownerAvatar: "MB",
      archivedBy: "Emily Davis",
      archivedByAvatar: "ED",
      archivedAt: "2024-12-15 04:10 PM",
      reason: "Outdated",
      tags: ["brand", "logo", "assets", "old"]
    },
    {
      id: "ARC-006",
      name: "Employee Handbook 2024.pdf",
      type: "PDF",
      size: "4.2 MB",
      folder: "HR",
      owner: "Sarah Wilson",
      ownerAvatar: "SW",
      archivedBy: "Sarah Wilson",
      archivedByAvatar: "SW",
      archivedAt: "2024-12-10 01:30 PM",
      reason: "Superseded",
      tags: ["hr", "handbook", "policy", "2024"]
    },
    {
      id: "ARC-007",
      name: "Office Renovation Plans.jpg",
      type: "JPG",
      size: "5.1 MB",
      folder: "Facilities",
      owner: "David Clark",
      ownerAvatar: "DC",
      archivedBy: "David Clark",
      archivedByAvatar: "DC",
      archivedAt: "2024-11-28 03:45 PM",
      reason: "Project completed",
      tags: ["facilities", "renovation", "plans"]
    },
    {
      id: "ARC-008",
      name: "Budget Forecast 2024.xlsx",
      type: "XLSX",
      size: "2.3 MB",
      folder: "Finance",
      owner: "John Doe",
      ownerAvatar: "JD",
      archivedBy: "John Doe",
      archivedByAvatar: "JD",
      archivedAt: "2024-11-15 11:20 AM",
      reason: "Outdated",
      tags: ["finance", "budget", "forecast", "2024"]
    }
  ];

  // Filter documents based on search term
  const filteredDocuments = archivedDocuments.filter((document) =>
    document.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    document.folder.toLowerCase().includes(searchTerm.toLowerCase()) ||
    document.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
    document.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Group documents by archive reason
  const documentsByReason = archivedDocuments.reduce((acc, doc) => {
    if (!acc[doc.reason]) {
      acc[doc.reason] = [];
    }
    acc[doc.reason].push(doc);
    return acc;
  }, {} as Record<string, typeof archivedDocuments>);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Archive</h1>
        <p className="text-muted-foreground">
          Long-term storage for inactive documents
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Archived</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">187</div>
            <p className="text-xs text-muted-foreground">12.4 GB of storage</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recently Archived</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">In the last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Auto-Archive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Enabled</div>
            <p className="text-xs text-muted-foreground">For documents inactive {'>'} 1 year</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-auto sm:min-w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search archived documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <ArchiveIcon className="mr-2 h-4 w-4" />
          Archive Document
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Archives</TabsTrigger>
          <TabsTrigger value="recent">Recently Archived</TabsTrigger>
          <TabsTrigger value="by-reason">By Reason</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Archived Documents</CardTitle>
              <CardDescription>
                Documents moved to long-term storage
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
                          <Badge variant="outline" className="bg-slate-100 text-slate-800 hover:bg-slate-100">
                            {document.reason}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <span>{document.folder}</span>
                          <span className="opacity-50">•</span>
                          <span>{document.size}</span>
                          <span className="opacity-50">•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Archived {document.archivedAt}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{document.archivedByAvatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex gap-1">
                          <Button variant="outline" size="icon" className="h-8 w-8">
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-muted-foreground">
                    No archived documents found matching your search.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recently Archived</CardTitle>
              <CardDescription>
                Documents archived in the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {archivedDocuments
                  .sort((a, b) => new Date(b.archivedAt).getTime() - new Date(a.archivedAt).getTime())
                  .slice(0, 5)
                  .map((document) => (
                    <div key={document.id} className="py-4 flex items-center gap-4">
                      {getFileIcon(document.type)}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{document.name}</p>
                          <Badge variant="outline" className="bg-slate-100 text-slate-800 hover:bg-slate-100">
                            {document.reason}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <span>{document.folder}</span>
                          <span className="opacity-50">•</span>
                          <span>{document.size}</span>
                          <span className="opacity-50">•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Archived {document.archivedAt}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{document.archivedByAvatar}</AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="sm">
                          <RotateCcw className="h-3.5 w-3.5 mr-1" />
                          Restore
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-reason" className="space-y-4">
          {Object.entries(documentsByReason).map(([reason, docs]) => (
            <Card key={reason}>
              <CardHeader>
                <CardTitle>{reason}</CardTitle>
                <CardDescription>
                  {docs.length} document{docs.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {docs.slice(0, 3).map((document) => (
                    <div key={document.id} className="py-3 flex items-center gap-4">
                      {getFileIcon(document.type)}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{document.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <span>{document.folder}</span>
                          <span className="opacity-50">•</span>
                          <span>Archived {document.archivedAt}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <RotateCcw className="h-3.5 w-3.5 mr-1" />
                        Restore
                      </Button>
                    </div>
                  ))}
                  {docs.length > 3 && (
                    <div className="py-3 text-center">
                      <Button variant="link">
                        View all {docs.length} documents
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Archive Policies</CardTitle>
          <CardDescription>
            Settings for document archiving and retention
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-md bg-muted/50">
            <h3 className="font-medium mb-1">Auto-Archive</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Documents inactive for more than 1 year will be automatically archived.
            </p>
            <Button variant="outline" size="sm">Configure</Button>
          </div>

          <div className="p-4 border rounded-md bg-muted/50">
            <h3 className="font-medium mb-1">Retention Policy</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Archived documents will be permanently deleted after 7 years.
            </p>
            <Button variant="outline" size="sm">Configure</Button>
          </div>

          <div className="p-4 border rounded-md bg-muted/50">
            <h3 className="font-medium mb-1">Archive Storage</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Currently using 12.4 GB of archive storage (8.2% of allocation).
            </p>
            <Button variant="outline" size="sm">Manage Storage</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Archive;
