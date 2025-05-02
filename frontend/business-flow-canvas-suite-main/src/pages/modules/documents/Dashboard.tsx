import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { documentService } from "@/services/documentServiceInstances";
import { supabaseAIDocumentService } from "@/services/SupabaseAIDocumentService";
import { FileMetadata } from "@/services/supabaseStorageService";
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
  FileSearch,
  Loader2,
  Diff
} from "lucide-react";

const DocumentsDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [documentCounts, setDocumentCounts] = useState({
    allFiles: 0,
    processed: 0,
    templates: 0,
    workflows: 0,
    shared: 0,
    archived: 0
  });
  const [processedDocuments, setProcessedDocuments] = useState<FileMetadata[]>([]);
  const [storageData, setStorageData] = useState({
    totalSize: 0,
    maxSize: 1024 * 1024 * 1024, // 1 GB default
    usagePercentage: 0,
    fileTypes: {
      pdf: { size: 0, count: 0, percentage: 0 },
      image: { size: 0, count: 0, percentage: 0 },
      document: { size: 0, count: 0, percentage: 0 },
      spreadsheet: { size: 0, count: 0, percentage: 0 },
      other: { size: 0, count: 0, percentage: 0 }
    }
  });
  const { toast } = useToast();

  // Load document counts and processed documents
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Get all files
        const allFiles = await documentService.getAllFiles();

        // Get shared documents
        const sharedWithMe = await documentService.getSharedWithMe();

        // Count documents by type
        const counts = {
          allFiles: allFiles.filter(file => !file.isFolder).length,
          processed: allFiles.filter(file => !file.isFolder && file.processing_status === 'completed').length,
          templates: 0, // No real templates yet
          workflows: 0, // No real workflows yet
          shared: sharedWithMe.length,
          archived: allFiles.filter(file => file.isArchived).length
        };

        // Calculate storage data
        const files = allFiles.filter(file => !file.isFolder);
        const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);
        const maxSize = 1024 * 1024 * 1024; // 1 GB (can be adjusted)
        const usagePercentage = (totalSize / maxSize) * 100;

        // Initialize file type counters
        const fileTypes = {
          pdf: { size: 0, count: 0, percentage: 0 },
          image: { size: 0, count: 0, percentage: 0 },
          document: { size: 0, count: 0, percentage: 0 },
          spreadsheet: { size: 0, count: 0, percentage: 0 },
          other: { size: 0, count: 0, percentage: 0 }
        };

        // Calculate size by file type
        files.forEach(file => {
          const type = file.type?.toLowerCase() || '';
          const size = file.size || 0;

          if (type.includes('pdf')) {
            fileTypes.pdf.size += size;
            fileTypes.pdf.count++;
          } else if (type.includes('image') || type.includes('jpg') || type.includes('png') || type.includes('jpeg') || type.includes('gif')) {
            fileTypes.image.size += size;
            fileTypes.image.count++;
          } else if (type.includes('doc') || type.includes('txt') || type.includes('rtf')) {
            fileTypes.document.size += size;
            fileTypes.document.count++;
          } else if (type.includes('xls') || type.includes('csv') || type.includes('sheet')) {
            fileTypes.spreadsheet.size += size;
            fileTypes.spreadsheet.count++;
          } else {
            fileTypes.other.size += size;
            fileTypes.other.count++;
          }
        });

        // Calculate percentages
        if (totalSize > 0) {
          Object.keys(fileTypes).forEach(key => {
            fileTypes[key as keyof typeof fileTypes].percentage =
              (fileTypes[key as keyof typeof fileTypes].size / totalSize) * 100;
          });
        }

        setStorageData({
          totalSize,
          maxSize,
          usagePercentage: Math.min(usagePercentage, 100), // Cap at 100%
          fileTypes
        });

        setDocumentCounts(counts);

        // Get processed documents for AI insights - only 2 most recent ones
        const processedDocs = allFiles
          .filter(file => !file.isFolder && file.processing_status === 'completed')
          .sort((a, b) => {
            // Sort by processed_at date (most recent first)
            const dateA = a.processed_at ? new Date(a.processed_at).getTime() : 0;
            const dateB = b.processed_at ? new Date(b.processed_at).getTime() : 0;
            return dateB - dateA;
          })
          .slice(0, 2);

        // Fetch additional metadata for each processed document
        const docsWithMetadata = await Promise.all(
          processedDocs.map(async (doc) => {
            try {
              const metadata = await supabaseAIDocumentService.getDocumentMetadata(doc.id);
              return {
                ...doc,
                summary: metadata?.summary || 'No summary available',
                entities: metadata?.entities || null,
                topics: metadata?.topics || null,
                sentiment: metadata?.sentiment || null
              };
            } catch (error) {
              console.error(`Error fetching metadata for document ${doc.id}:`, error);
              return doc;
            }
          })
        );

        setProcessedDocuments(docsWithMetadata);
      } catch (error) {
        console.error('Error loading document data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load document data',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

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
      stats: isLoading
        ? <span className="flex items-center"><Loader2 className="h-3 w-3 mr-2 animate-spin" /> Loading...</span>
        : `${documentCounts.allFiles} document${documentCounts.allFiles !== 1 ? 's' : ''}`,
    },
    {
      title: "AI Document Analysis",
      description: "Extract insights from documents",
      icon: <FileSearch className="h-8 w-8 text-purple-500" />,
      href: "/dashboard/documents/analysis",
      stats: isLoading
        ? <span className="flex items-center"><Loader2 className="h-3 w-3 mr-2 animate-spin" /> Loading...</span>
        : documentCounts.processed > 0
          ? `${documentCounts.processed} processed document${documentCounts.processed !== 1 ? 's' : ''}`
          : "AI processing available",
    },
    {
      title: "Document Comparison",
      description: "Compare documents semantically",
      icon: <Diff className="h-8 w-8 text-indigo-500" />,
      href: "/dashboard/documents/compare",
      stats: isLoading
        ? <span className="flex items-center"><Loader2 className="h-3 w-3 mr-2 animate-spin" /> Loading...</span>
        : documentCounts.processed > 1
          ? "Compare processed documents"
          : "Process documents to compare",
    },
    {
      title: "Templates",
      description: "Document templates library",
      icon: <FileCheck className="h-8 w-8 text-emerald-500" />,
      href: "/dashboard/documents/templates",
      stats: isLoading
        ? <span className="flex items-center"><Loader2 className="h-3 w-3 mr-2 animate-spin" /> Loading...</span>
        : documentCounts.templates > 0
          ? `${documentCounts.templates} template${documentCounts.templates !== 1 ? 's' : ''} available`
          : "Templates coming soon",
    },
    {
      title: "Workflows",
      description: "Document approval workflows",
      icon: <FileCog className="h-8 w-8 text-amber-500" />,
      href: "/dashboard/documents/workflows",
      stats: isLoading
        ? <span className="flex items-center"><Loader2 className="h-3 w-3 mr-2 animate-spin" /> Loading...</span>
        : documentCounts.workflows > 0
          ? `${documentCounts.workflows} active workflow${documentCounts.workflows !== 1 ? 's' : ''}`
          : "No active workflows",
    },
    {
      title: "Shared",
      description: "Documents shared with you and by you",
      icon: <Share2 className="h-8 w-8 text-indigo-500" />,
      href: "/dashboard/documents/shared",
      stats: isLoading
        ? <span className="flex items-center"><Loader2 className="h-3 w-3 mr-2 animate-spin" /> Loading...</span>
        : `${documentCounts.shared} shared document${documentCounts.shared !== 1 ? 's' : ''}`,
    },
    {
      title: "Archive",
      description: "Long-term document storage",
      icon: <File className="h-8 w-8 text-stone-500" />,
      href: "/dashboard/documents/archive",
      stats: isLoading
        ? <span className="flex items-center"><Loader2 className="h-3 w-3 mr-2 animate-spin" /> Loading...</span>
        : `${documentCounts.archived} archived item${documentCounts.archived !== 1 ? 's' : ''}`,
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

  // Format file size to human-readable format
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Documents</h1>
        <p className="text-muted-foreground mb-6">
          Manage, store, and collaborate on documents
        </p>

        {/* Document modules grid moved to top as requested */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
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
      </div>

      {/* Search and buttons removed as requested */}

      <Tabs defaultValue="ai" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ai">AI Features</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
        </TabsList>

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
                    <Link to="/dashboard/documents/analysis"><Button variant="link" className="p-0 h-auto mt-1">Try it now</Button></Link>
                  </div>
                </div>

                <div className="p-4 border rounded-md bg-muted/50 flex gap-4">
                  <div className="h-12 w-12 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                    <FileSearch className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Content Extraction</h3>
                    <p className="text-sm text-muted-foreground mt-1">Extract specific information like dates, names, and key facts from documents.</p>
                    <Link to="/dashboard/documents/analysis"><Button variant="link" className="p-0 h-auto mt-1">Try it now</Button></Link>
                  </div>
                </div>

                <div className="p-4 border rounded-md bg-muted/50 flex gap-4">
                  <div className="h-12 w-12 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                    <FileCog className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Document Generation</h3>
                    <p className="text-sm text-muted-foreground mt-1">Create standardized documents from templates using AI assistance.</p>
                    <Link to="/dashboard/documents/analysis"><Button variant="link" className="p-0 h-auto mt-1">Try it now</Button></Link>
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
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : processedDocuments.length > 0 ? (
                  processedDocuments.map((doc) => (
                    <div key={doc.id} className="p-4 border rounded-md">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-sm flex items-center gap-2">
                          <FileText className={`h-4 w-4 ${doc.type?.toLowerCase().includes('pdf') ? 'text-red-500' : 'text-blue-500'}`} />
                          {doc.name}
                        </h3>
                        <Badge variant={doc.sentiment?.overall === 'positive' ? 'success' : doc.sentiment?.overall === 'negative' ? 'destructive' : 'secondary'}>
                          {doc.sentiment?.overall ? doc.sentiment.overall.charAt(0).toUpperCase() + doc.sentiment.overall.slice(1) : 'Neutral'}
                        </Badge>
                      </div>

                      <div className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>Processed: {doc.processed_at ? new Date(doc.processed_at).toLocaleString() : 'Unknown'}</span>
                      </div>

                      <p className="text-sm mt-2">
                        {doc.summary?.substring(0, 150).replace(/^\*\*Summary:\*\*\s*/i, '')}
                        {doc.summary && doc.summary.length > 150 ? '...' : ''}
                      </p>

                      {doc.entities && (
                        <div className="mt-2">
                          <div className="text-xs font-medium mb-1">Key Entities:</div>
                          <div className="flex flex-wrap gap-1">
                            {doc.entities.key_terms?.slice(0, 3).map((term, i) => (
                              <Badge key={i} variant="outline" className="text-xs">{term}</Badge>
                            ))}
                            {doc.entities.organizations?.slice(0, 2).map((org, i) => (
                              <Badge key={i} variant="outline" className="bg-blue-50 text-xs">{org}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end mt-3">
                        <Link to={`/dashboard/documents/file/${doc.id}`}>
                          <Button variant="outline" size="sm">View Document</Button>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 border rounded-md">
                    <p className="text-sm text-center text-muted-foreground">
                      No processed documents found. Process documents in the AI Document Analysis page to see insights here.
                    </p>
                    <div className="flex justify-center mt-4">
                      <Link to="/dashboard/documents/analysis">
                        <Button variant="outline" size="sm">Go to AI Document Analysis</Button>
                      </Link>
                    </div>
                  </div>
                )}
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
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Storage Usage</span>
                      <span>{formatFileSize(storageData.totalSize)} / {formatFileSize(storageData.maxSize)} ({storageData.usagePercentage.toFixed(1)}%)</span>
                    </div>
                    <Progress value={storageData.usagePercentage} className="h-2" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium mb-2">Storage by File Type</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <FileText className="h-4 w-4 text-red-500" />
                            PDF Documents ({storageData.fileTypes.pdf.count})
                          </span>
                          <span className="font-medium">{formatFileSize(storageData.fileTypes.pdf.size)}</span>
                        </div>
                        <Progress value={storageData.fileTypes.pdf.percentage} className="h-1.5 bg-red-100" />

                        <div className="flex justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <FileImage className="h-4 w-4 text-purple-500" />
                            Images ({storageData.fileTypes.image.count})
                          </span>
                          <span className="font-medium">{formatFileSize(storageData.fileTypes.image.size)}</span>
                        </div>
                        <Progress value={storageData.fileTypes.image.percentage} className="h-1.5 bg-purple-100" />

                        <div className="flex justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <FileText className="h-4 w-4 text-blue-500" />
                            Documents ({storageData.fileTypes.document.count})
                          </span>
                          <span className="font-medium">{formatFileSize(storageData.fileTypes.document.size)}</span>
                        </div>
                        <Progress value={storageData.fileTypes.document.percentage} className="h-1.5 bg-blue-100" />

                        <div className="flex justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <FileSpreadsheet className="h-4 w-4 text-green-500" />
                            Spreadsheets ({storageData.fileTypes.spreadsheet.count})
                          </span>
                          <span className="font-medium">{formatFileSize(storageData.fileTypes.spreadsheet.size)}</span>
                        </div>
                        <Progress value={storageData.fileTypes.spreadsheet.percentage} className="h-1.5 bg-green-100" />

                        <div className="flex justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <File className="h-4 w-4 text-gray-500" />
                            Other Files ({storageData.fileTypes.other.count})
                          </span>
                          <span className="font-medium">{formatFileSize(storageData.fileTypes.other.size)}</span>
                        </div>
                        <Progress value={storageData.fileTypes.other.percentage} className="h-1.5 bg-gray-100" />
                      </div>
                    </div>

                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium mb-2">Storage Statistics</h3>
                      <div className="space-y-3 text-sm">
                        <p>• Total files: {documentCounts.allFiles}</p>
                        <p>• Average file size: {documentCounts.allFiles > 0 ? formatFileSize(storageData.totalSize / documentCounts.allFiles) : '0 Bytes'}</p>
                        <p>• Largest file type: {
                          Object.entries(storageData.fileTypes)
                            .sort((a, b) => b[1].size - a[1].size)[0]?.[0].charAt(0).toUpperCase() +
                            Object.entries(storageData.fileTypes)
                            .sort((a, b) => b[1].size - a[1].size)[0]?.[0].slice(1) || 'None'
                        }</p>
                        <Link to="/dashboard/documents/all-files">
                          <Button size="sm" className="mt-2">Manage Files</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Document modules grid moved to top of page */}

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
