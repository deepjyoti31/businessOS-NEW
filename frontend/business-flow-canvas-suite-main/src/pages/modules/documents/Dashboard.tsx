import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  FolderOpen,
  Search,
  Upload,
  Users,
  Clock,
  Star,
  File,
  FileSpreadsheet,
  FileImage,
  Share2,
  FileCog,
  FileCheck,
  FileSearch
} from "lucide-react";

const DocumentsDashboard = () => {
  // Sample document data
  const recentDocuments = [
    {
      id: "doc-1",
      name: "Q2 2025 Business Plan.docx",
      type: "document",
      icon: <FileText className="h-4 w-4" />,
      modified: "2025-04-25T14:32:00Z",
      modifiedBy: {
        name: "Alex Morgan",
        avatar: "AM"
      },
      shared: 4
    },
    {
      id: "doc-2",
      name: "Financial Forecast 2025-2026.xlsx",
      type: "spreadsheet",
      icon: <FileSpreadsheet className="h-4 w-4" />,
      modified: "2025-04-24T09:15:00Z",
      modifiedBy: {
        name: "Jamie Chen",
        avatar: "JC"
      },
      shared: 8
    },
    {
      id: "doc-3",
      name: "Brand Guidelines v3.pdf",
      type: "pdf",
      icon: <FileText className="h-4 w-4 text-red-500" />, // Changed from FilePdf to FileText with red color
      modified: "2025-04-23T16:45:00Z",
      modifiedBy: {
        name: "Taylor Reed",
        avatar: "TR"
      },
      shared: 12
    },
    {
      id: "doc-4",
      name: "Product Launch Presentation.pptx",
      type: "presentation",
      icon: <FileText className="h-4 w-4" />,
      modified: "2025-04-22T11:20:00Z",
      modifiedBy: {
        name: "Jordan Smith",
        avatar: "JS"
      },
      shared: 6
    },
    {
      id: "doc-5",
      name: "Office Redesign Plans.jpg",
      type: "image",
      icon: <FileImage className="h-4 w-4" />,
      modified: "2025-04-21T15:10:00Z",
      modifiedBy: {
        name: "Casey Wong",
        avatar: "CW"
      },
      shared: 3
    }
  ];

  const documentModules = [
    {
      title: "All Files",
      description: "Browse and manage all documents",
      icon: <FolderOpen className="h-8 w-8 text-blue-500" />,
      href: "/dashboard/documents/all-files",
      stats: "256 documents",
    },
    {
      title: "AI Document Analysis",
      description: "Extract insights from documents",
      icon: <FileSearch className="h-8 w-8 text-purple-500" />,
      href: "/dashboard/documents/analysis",
      stats: "AI processing available",
    },
    {
      title: "Templates",
      description: "Document templates library",
      icon: <FileCheck className="h-8 w-8 text-emerald-500" />,
      href: "/dashboard/documents/templates",
      stats: "18 templates available",
    },
    {
      title: "Workflows",
      description: "Document approval workflows",
      icon: <FileCog className="h-8 w-8 text-amber-500" />,
      href: "/dashboard/documents/workflows",
      stats: "3 active workflows",
    },
    {
      title: "Shared",
      description: "Documents shared with you and by you",
      icon: <Share2 className="h-8 w-8 text-indigo-500" />,
      href: "/dashboard/documents/shared",
      stats: "12 shared documents",
    },
    {
      title: "Archive",
      description: "Long-term document storage",
      icon: <File className="h-8 w-8 text-stone-500" />,
      href: "/dashboard/documents/archive",
      stats: "187 archived items",
    },
  ];

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    } else {
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    }
  };

  const getDocTypeColor = (type: string) => {
    const typeColors: Record<string, string> = {
      document: "bg-blue-100 text-blue-800",
      spreadsheet: "bg-green-100 text-green-800",
      pdf: "bg-red-100 text-red-800",
      presentation: "bg-amber-100 text-amber-800",
      image: "bg-purple-100 text-purple-800"
    };

    return typeColors[type] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Documents</h1>
        <p className="text-muted-foreground">
          Manage, store, and collaborate on documents
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-auto sm:min-w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button className="flex gap-1.5">
            <Upload className="h-4 w-4" />
            <span>Upload</span>
          </Button>
          <Button variant="outline" className="flex gap-1.5">
            <FolderOpen className="h-4 w-4" />
            <span>New Folder</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recent Documents</TabsTrigger>
          <TabsTrigger value="ai">AI Features</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
        </TabsList>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recently Modified</CardTitle>
              <CardDescription>Documents updated in the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDocuments.map(doc => (
                  <div key={doc.id} className="flex items-center gap-4 p-3 rounded-md hover:bg-muted/50 transition-colors">
                    <div className="p-2 bg-muted rounded">
                      {doc.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{doc.name}</p>
                        <Badge variant="outline" className={`${getDocTypeColor(doc.type)} text-xs`}>{doc.type}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3" />
                        <span>Modified {getRelativeTime(doc.modified)}</span>
                        <span className="opacity-50">•</span>
                        <div className="flex items-center gap-1">
                          <Avatar className="h-4 w-4">
                            <AvatarFallback className="text-[10px]">{doc.modifiedBy.avatar}</AvatarFallback>
                          </Avatar>
                          <span>{doc.modifiedBy.name}</span>
                        </div>
                        {doc.shared > 0 && (
                          <>
                            <span className="opacity-50">•</span>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>Shared with {doc.shared} {doc.shared === 1 ? 'person' : 'people'}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Open</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>AI Document Processing</CardTitle>
                <CardDescription>Harness AI to enhance document workflows</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-md bg-muted/50 flex gap-4">
                  <div className="h-12 w-12 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Document Summarization</h3>
                    <p className="text-sm text-muted-foreground mt-1">AI can automatically generate concise summaries from long documents.</p>
                    <Button variant="link" className="p-0 h-auto mt-1">Try it now</Button>
                  </div>
                </div>

                <div className="p-4 border rounded-md bg-muted/50 flex gap-4">
                  <div className="h-12 w-12 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                    <FileSearch className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Content Extraction</h3>
                    <p className="text-sm text-muted-foreground mt-1">Extract specific information like dates, names, and key facts from documents.</p>
                    <Button variant="link" className="p-0 h-auto mt-1">Try it now</Button>
                  </div>
                </div>

                <div className="p-4 border rounded-md bg-muted/50 flex gap-4">
                  <div className="h-12 w-12 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                    <FileCog className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Document Generation</h3>
                    <p className="text-sm text-muted-foreground mt-1">Create standardized documents from templates using AI assistance.</p>
                    <Button variant="link" className="p-0 h-auto mt-1">Try it now</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Recent AI Insights</CardTitle>
                <CardDescription>AI-generated analysis from your documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4 text-red-500" /> {/* Changed from FilePdf to FileText with red color */}
                    From: Q1 2025 Financial Report.pdf
                  </h3>
                  <p className="text-sm mt-2">Key metrics show a 12% increase in revenue compared to Q4 2024, with operating expenses remaining stable. The AI detected three potential discrepancies in the expense allocations that may require review.</p>
                  <div className="flex justify-end mt-2">
                    <Button variant="outline" size="sm">View Full Analysis</Button>
                  </div>
                </div>

                <div className="p-4 border rounded-md">
                  <h3 className="font-medium text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    From: Product Roadmap 2025.docx
                  </h3>
                  <p className="text-sm mt-2">The AI has created a structured timeline from your roadmap document, identifying 8 key milestones and 3 potential resource conflicts in Q3 and Q4.</p>
                  <div className="flex justify-end mt-2">
                    <Button variant="outline" size="sm">View Timeline</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="storage">
          <Card>
            <CardHeader>
              <CardTitle>Storage Overview</CardTitle>
              <CardDescription>Document storage usage and organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Storage Usage</span>
                  <span>8.2 GB / 15 GB (54.7%)</span>
                </div>
                <Progress value={54.7} className="h-2" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">Storage by File Type</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <FileText className="h-4 w-4 text-red-500" /> {/* Changed from FilePdf to FileText with red color */}
                        PDF Documents
                      </span>
                      <span className="font-medium">3.4 GB</span>
                    </div>
                    <Progress value={41} className="h-1.5 bg-red-100" />

                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <FileImage className="h-4 w-4 text-purple-500" />
                        Images
                      </span>
                      <span className="font-medium">2.2 GB</span>
                    </div>
                    <Progress value={27} className="h-1.5 bg-purple-100" />

                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <FileText className="h-4 w-4 text-blue-500" />
                        Documents
                      </span>
                      <span className="font-medium">1.5 GB</span>
                    </div>
                    <Progress value={18} className="h-1.5 bg-blue-100" />

                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <FileSpreadsheet className="h-4 w-4 text-green-500" />
                        Spreadsheets
                      </span>
                      <span className="font-medium">0.8 GB</span>
                    </div>
                    <Progress value={10} className="h-1.5 bg-green-100" />

                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <File className="h-4 w-4 text-gray-500" />
                        Other Files
                      </span>
                      <span className="font-medium">0.3 GB</span>
                    </div>
                    <Progress value={4} className="h-1.5 bg-gray-100" />
                  </div>
                </div>

                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">AI Storage Recommendations</h3>
                  <div className="space-y-3 text-sm">
                    <p>• 1.2 GB of duplicate files detected that can be safely removed</p>
                    <p>• 2.3 GB of files haven't been accessed in over 12 months</p>
                    <p>• 845 MB of large media files could be compressed</p>
                    <Button size="sm" className="mt-2">Optimize Storage</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documentModules.map((module) => (
          <Link key={module.href} to={module.href} className="block">
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  {module.icon}
                </div>
                <CardTitle className="mt-2">{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium text-muted-foreground">
                  {module.stats}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document AI Assistant</CardTitle>
          <CardDescription>
            Get help with document management and processing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            Our AI assistant can help you manage and extract value from your documents. Try asking about:
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">Summarize document</Button>
            <Button variant="outline" size="sm">Extract data from PDF</Button>
            <Button variant="outline" size="sm">Create contract from template</Button>
            <Button variant="outline" size="sm">Find similar documents</Button>
          </div>
          <div className="relative">
            <Input
              type="text"
              placeholder="Ask the Document AI assistant..."
              className="w-full pr-24"
            />
            <Button className="absolute right-1 top-1">
              Ask
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsDashboard;
