import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import {
  FileText,
  Search,
  FileSearch,
  Tag,
  BarChart3,
  Users,
  Building,
  MapPin,
  Calendar,
  Key,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  RefreshCw
} from "lucide-react";
import { supabaseDocumentService } from "@/services/SupabaseDocumentService";
import { supabaseAIDocumentService, DocumentSearchResult } from "@/services/SupabaseAIDocumentService";
import { FileMetadata } from "@/services/supabaseStorageService";

const Analysis = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [documents, setDocuments] = useState<FileMetadata[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<FileMetadata | null>(null);
  const [documentMetadata, setDocumentMetadata] = useState<any>(null);
  const [processingStatus, setProcessingStatus] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [semanticSearchResults, setSemanticSearchResults] = useState<DocumentSearchResult[]>([]);
  const [semanticSearchQuery, setSemanticSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Fetch document metadata when a document is selected
  useEffect(() => {
    if (selectedDocument) {
      fetchDocumentMetadata(selectedDocument.id);
    } else {
      setDocumentMetadata(null);
      setProcessingStatus(null);
    }
  }, [selectedDocument]);

  // Fetch documents from Supabase
  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const fetchedDocuments = await supabaseDocumentService.getAllFiles();
      setDocuments(fetchedDocuments);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast({
        title: "Error",
        description: "Failed to fetch documents. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch document metadata from Supabase
  const fetchDocumentMetadata = async (fileId: string) => {
    try {
      const status = await supabaseAIDocumentService.getProcessingStatus(fileId);
      setProcessingStatus(status);

      if (status === "completed") {
        const metadata = await supabaseAIDocumentService.getDocumentMetadata(fileId);
        setDocumentMetadata(metadata);
      } else {
        setDocumentMetadata(null);
      }
    } catch (error) {
      console.error("Error fetching document metadata:", error);
      toast({
        title: "Error",
        description: "Failed to fetch document metadata. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Process a document
  const processDocument = async (fileId: string) => {
    setIsProcessing(true);
    try {
      setProcessingStatus("processing");
      const result = await supabaseAIDocumentService.processDocument(fileId);

      if (result.success) {
        toast({
          title: "Success",
          description: "Document processed successfully.",
        });
        setProcessingStatus("completed");
        setDocumentMetadata({
          summary: result.summary,
          entities: result.entities,
          topics: result.topics,
          sentiment: result.sentiment,
          processed_at: new Date().toISOString()
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to process document. Please try again.",
          variant: "destructive"
        });
        setProcessingStatus("failed");
      }
    } catch (error) {
      console.error("Error processing document:", error);
      toast({
        title: "Error",
        description: "Failed to process document. Please try again.",
        variant: "destructive"
      });
      setProcessingStatus("failed");
    } finally {
      setIsProcessing(false);
    }
  };

  // Perform semantic search
  const performSemanticSearch = async () => {
    if (!semanticSearchQuery.trim()) {
      toast({
        title: "Error",
        description: "Please enter a search query.",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    try {
      const result = await supabaseAIDocumentService.searchDocuments(semanticSearchQuery);

      if (result.success) {
        setSemanticSearchResults(result.results);
        if (result.results.length === 0) {
          toast({
            title: "No results",
            description: "No documents found matching your query.",
          });
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to search documents. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error searching documents:", error);
      toast({
        title: "Error",
        description: "Failed to search documents. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Filter documents based on search term and exclude folders (only show files)
  const filteredDocuments = documents.filter(doc =>
    !doc.isFolder && doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get sentiment icon based on sentiment value
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <ThumbsUp className="h-5 w-5 text-green-500" />;
      case "negative":
        return <ThumbsDown className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  // Get processing status badge
  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "queued":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Queued</Badge>;
      case "processing":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Processing</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-700">Completed</Badge>;
      case "failed":
        return <Badge variant="outline" className="bg-red-50 text-red-700">Failed</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700">Not Processed</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Document Analysis</h1>
          <p className="text-muted-foreground">
            Extract insights and analyze your documents with AI
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Document List */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-md flex items-center justify-between">
              <span>Documents</span>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[500px] overflow-y-auto">
              {isLoading ? (
                <div className="p-8 flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredDocuments.length > 0 ? (
                <div className="divide-y">
                  {filteredDocuments.map((document) => (
                    <div
                      key={document.id}
                      className={`p-4 hover:bg-muted/50 flex items-center gap-4 cursor-pointer ${selectedDocument?.id === document.id ? 'bg-muted' : ''}`}
                      onClick={() => setSelectedDocument(document)}
                    >
                      <FileText className="h-8 w-8 text-blue-500" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{document.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {document.createdAt ? new Date(document.createdAt).toLocaleDateString() : 'No date'}
                          </span>
                          {(document.processing_status || document.processingStatus) &&
                            getStatusBadge(document.processing_status || document.processingStatus)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  No documents found
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Document Analysis */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedDocument ? selectedDocument.name : "Document Analysis"}
            </CardTitle>
            <CardDescription>
              {selectedDocument
                ? `AI-powered analysis and insights for ${selectedDocument.name}`
                : "Select a document to view AI-powered analysis and insights"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDocument ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span>Status:</span>
                    {getStatusBadge(processingStatus)}
                  </div>
                  <Button
                    onClick={() => processDocument(selectedDocument.id)}
                    disabled={isProcessing || processingStatus === "processing" || processingStatus === "queued"}
                    className="flex items-center gap-2"
                  >
                    {isProcessing || processingStatus === "processing" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    {processingStatus === "completed" ? "Reprocess" : "Process Document"}
                  </Button>
                </div>

                {(processingStatus === "processing" || processingStatus === "queued") && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Processing document...</span>
                      <span>This may take a few minutes</span>
                    </div>
                    <Progress value={processingStatus === "processing" ? 45 : 15} className="h-2" />
                  </div>
                )}

                {processingStatus === "completed" && documentMetadata ? (
                  <Tabs defaultValue="summary">
                    <TabsList className="grid grid-cols-4 mb-4">
                      <TabsTrigger value="summary">Summary</TabsTrigger>
                      <TabsTrigger value="entities">Entities</TabsTrigger>
                      <TabsTrigger value="topics">Topics</TabsTrigger>
                      <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
                    </TabsList>

                    <TabsContent value="summary" className="space-y-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-md flex items-center gap-2">
                            <FileSearch className="h-5 w-5 text-blue-500" />
                            Document Summary
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">{documentMetadata.summary?.replace(/^\*\*Summary:\*\*\s*/i, '')}</p>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="entities" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {documentMetadata.entities && typeof documentMetadata.entities === 'object' ? (
                          <>
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-md flex items-center gap-2">
                                  <Users className="h-5 w-5 text-blue-500" />
                                  People
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="flex flex-wrap gap-2">
                                  {documentMetadata.entities.people && Array.isArray(documentMetadata.entities.people) && documentMetadata.entities.people.length > 0 ? (
                                    documentMetadata.entities.people.map((person: string, index: number) => (
                                      <Badge key={index} variant="secondary">{person}</Badge>
                                    ))
                                  ) : (
                                    <p className="text-sm text-muted-foreground">No people detected</p>
                                  )}
                                </div>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-md flex items-center gap-2">
                                  <Building className="h-5 w-5 text-purple-500" />
                                  Organizations
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="flex flex-wrap gap-2">
                                  {documentMetadata.entities.organizations && Array.isArray(documentMetadata.entities.organizations) && documentMetadata.entities.organizations.length > 0 ? (
                                    documentMetadata.entities.organizations.map((org: string, index: number) => (
                                      <Badge key={index} variant="secondary">{org}</Badge>
                                    ))
                                  ) : (
                                    <p className="text-sm text-muted-foreground">No organizations detected</p>
                                  )}
                                </div>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-md flex items-center gap-2">
                                  <MapPin className="h-5 w-5 text-green-500" />
                                  Locations
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="flex flex-wrap gap-2">
                                  {documentMetadata.entities.locations && Array.isArray(documentMetadata.entities.locations) && documentMetadata.entities.locations.length > 0 ? (
                                    documentMetadata.entities.locations.map((location: string, index: number) => (
                                      <Badge key={index} variant="secondary">{location}</Badge>
                                    ))
                                  ) : (
                                    <p className="text-sm text-muted-foreground">No locations detected</p>
                                  )}
                                </div>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-md flex items-center gap-2">
                                  <Calendar className="h-5 w-5 text-orange-500" />
                                  Dates
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="flex flex-wrap gap-2">
                                  {documentMetadata.entities.dates && Array.isArray(documentMetadata.entities.dates) && documentMetadata.entities.dates.length > 0 ? (
                                    documentMetadata.entities.dates.map((date: string, index: number) => (
                                      <Badge key={index} variant="secondary">{date}</Badge>
                                    ))
                                  ) : (
                                    <p className="text-sm text-muted-foreground">No dates detected</p>
                                  )}
                                </div>
                              </CardContent>
                            </Card>

                            <Card className="md:col-span-2">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-md flex items-center gap-2">
                                  <Key className="h-5 w-5 text-red-500" />
                                  Key Terms
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="flex flex-wrap gap-2">
                                  {documentMetadata.entities.key_terms && Array.isArray(documentMetadata.entities.key_terms) && documentMetadata.entities.key_terms.length > 0 ? (
                                    documentMetadata.entities.key_terms.map((term: string, index: number) => (
                                      <Badge key={index} variant="secondary">{term}</Badge>
                                    ))
                                  ) : (
                                    <p className="text-sm text-muted-foreground">No key terms detected</p>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </>
                        ) : (
                          <Card className="md:col-span-2">
                            <CardContent className="py-4">
                              <p className="text-sm text-muted-foreground text-center">No entity data available</p>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="topics" className="space-y-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-md flex items-center gap-2">
                            <Tag className="h-5 w-5 text-blue-500" />
                            Document Topics
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {documentMetadata.topics && typeof documentMetadata.topics === 'object' && Object.keys(documentMetadata.topics).length > 0 ? (
                            <div className="space-y-4">
                              {Object.entries(documentMetadata.topics).map(([topic, confidence]: [string, any]) => (
                                <div key={topic} className="space-y-1">
                                  <div className="flex justify-between text-sm">
                                    <span>{topic}</span>
                                    <span className="font-medium">
                                      {typeof confidence === 'number' ? `${Math.round(confidence * 100)}%` : 'N/A'}
                                    </span>
                                  </div>
                                  <Progress
                                    value={typeof confidence === 'number' ? confidence * 100 : 0}
                                    className="h-2"
                                  />
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No topics detected</p>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="sentiment" className="space-y-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-md flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-blue-500" />
                            Sentiment Analysis
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {documentMetadata.sentiment ? (
                            <div className="space-y-4">
                              <div className="flex items-center gap-4">
                                <div className="flex-1 space-y-1">
                                  <div className="flex justify-between text-sm">
                                    <span className="flex items-center gap-2">
                                      Overall Sentiment
                                      {getSentimentIcon(documentMetadata.sentiment.overall)}
                                    </span>
                                    <span className="font-medium">{documentMetadata.sentiment.overall || 'neutral'}</span>
                                  </div>
                                  <Progress
                                    value={documentMetadata.sentiment.score !== undefined && documentMetadata.sentiment.score !== null
                                      ? 50 + (documentMetadata.sentiment.score * 50)
                                      : 50}
                                    className="h-2"
                                  />
                                </div>
                                <div className="text-center px-4 py-2 bg-muted rounded-md">
                                  <div className="text-2xl font-bold">
                                    {documentMetadata.sentiment.score !== undefined && documentMetadata.sentiment.score !== null ? (
                                      <>
                                        {documentMetadata.sentiment.score > 0 ? '+' : ''}
                                        {documentMetadata.sentiment.score.toFixed(2)}
                                      </>
                                    ) : (
                                      '0.00'
                                    )}
                                  </div>
                                  <div className="text-xs text-muted-foreground">Score</div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <h4 className="text-sm font-medium">Key Phrases</h4>
                                <div className="flex flex-wrap gap-2">
                                  {documentMetadata.sentiment.key_phrases && Array.isArray(documentMetadata.sentiment.key_phrases) && documentMetadata.sentiment.key_phrases.length > 0 ? (
                                    documentMetadata.sentiment.key_phrases.map((phrase: string, index: number) => (
                                      <Badge key={index} variant="secondary">{phrase}</Badge>
                                    ))
                                  ) : (
                                    <p className="text-sm text-muted-foreground">No key phrases detected</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No sentiment data available</p>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                ) : processingStatus === "failed" ? (
                  <div className="p-8 text-center">
                    <p className="text-red-500 mb-4">Processing failed: {documentMetadata?.error || "An error occurred during document processing."}</p>
                    <p className="text-sm text-muted-foreground mb-4">Please check that the document is accessible and try again using the button above.</p>
                  </div>
                ) : processingStatus === null && (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground mb-4">This document has not been processed yet. Use the "Process Document" button above to analyze it.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center">
                <FileSearch className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select a document to view AI-powered analysis</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Semantic Search */}
      <Card>
        <CardHeader>
          <CardTitle>Semantic Search</CardTitle>
          <CardDescription>
            Search for documents based on meaning, not just keywords
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Describe what you're looking for..."
                className="pl-10"
                value={semanticSearchQuery}
                onChange={(e) => setSemanticSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && performSemanticSearch()}
              />
            </div>
            <Button
              onClick={performSemanticSearch}
              disabled={isSearching || !semanticSearchQuery.trim()}
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Search
            </Button>
          </div>

          {semanticSearchResults.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Search Results</h3>
              <div className="divide-y border rounded-md">
                {semanticSearchResults.map((result) => (
                  <div key={result.id} className="p-4 hover:bg-muted/50 flex items-center gap-4">
                    <FileText className="h-8 w-8 text-blue-500" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{result.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {result.createdAt ? new Date(result.createdAt).toLocaleDateString() : 'No date'}
                        </span>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {Math.round(result.similarity * 100)}% match
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const document = documents.find(doc => doc.id === result.id);
                        if (document) {
                          setSelectedDocument(document);
                        }
                      }}
                    >
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Analysis;
