import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, FileText, ArrowRight, BarChart3, ThumbsUp, ThumbsDown, Diff, FileSearch, RefreshCw } from "lucide-react";
import { documentService } from "@/services/documentServiceInstances";
import { supabaseAIDocumentService } from "@/services/SupabaseAIDocumentService";
import { FileMetadata } from "@/services/supabaseStorageService";
import { DocumentComparisonResult, ComparisonSection } from "@/services/SupabaseAIDocumentService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const DocumentCompare = () => {
  const [documents, setDocuments] = useState<FileMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isComparing, setIsComparing] = useState(false);
  const [selectedDocument1, setSelectedDocument1] = useState<string | null>(null);
  const [selectedDocument2, setSelectedDocument2] = useState<string | null>(null);
  const [comparisonResult, setComparisonResult] = useState<DocumentComparisonResult | null>(null);
  const { toast } = useToast();

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Fetch documents from Supabase
  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const fetchedDocuments = await documentService.getAllFiles();
      // Filter out folders and archived files
      const filteredDocs = fetchedDocuments.filter(doc => !doc.isFolder && !doc.isArchived);
      setDocuments(filteredDocs);
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

  // Handle document selection
  const handleDocument1Change = (value: string) => {
    setSelectedDocument1(value);
  };

  const handleDocument2Change = (value: string) => {
    setSelectedDocument2(value);
  };

  // Compare documents
  const compareDocuments = async () => {
    if (!selectedDocument1 || !selectedDocument2) {
      toast({
        title: "Error",
        description: "Please select two documents to compare.",
        variant: "destructive"
      });
      return;
    }

    if (selectedDocument1 === selectedDocument2) {
      toast({
        title: "Error",
        description: "Please select two different documents to compare.",
        variant: "destructive"
      });
      return;
    }

    setIsComparing(true);
    try {
      const result = await supabaseAIDocumentService.compareDocuments(selectedDocument1, selectedDocument2);
      setComparisonResult(result);
    } catch (error) {
      console.error("Error comparing documents:", error);
      toast({
        title: "Error",
        description: "Failed to compare documents. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsComparing(false);
    }
  };

  // Get document name by ID
  const getDocumentName = (id: string) => {
    const doc = documents.find(d => d.id === id);
    return doc ? doc.name : "Unknown Document";
  };

  // Format similarity score as percentage
  const formatSimilarity = (score: number) => {
    return `${Math.round(score * 100)}%`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Document Comparison</h1>
        <p className="text-muted-foreground">
          Compare two documents to analyze their similarities and differences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Documents to Compare</CardTitle>
          <CardDescription>Choose two documents to analyze their semantic similarities and differences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">First Document</label>
              <Select value={selectedDocument1 || ""} onValueChange={handleDocument1Change}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a document" />
                </SelectTrigger>
                <SelectContent>
                  {documents.map((doc) => (
                    <SelectItem key={`doc1-${doc.id}`} value={doc.id}>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>{doc.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Second Document</label>
              <Select value={selectedDocument2 || ""} onValueChange={handleDocument2Change}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a document" />
                </SelectTrigger>
                <SelectContent>
                  {documents.map((doc) => (
                    <SelectItem key={`doc2-${doc.id}`} value={doc.id}>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>{doc.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={compareDocuments} 
            disabled={!selectedDocument1 || !selectedDocument2 || selectedDocument1 === selectedDocument2 || isComparing}
          >
            {isComparing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Comparing Documents...
              </>
            ) : (
              <>
                <Diff className="mr-2 h-4 w-4" />
                Compare Documents
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {comparisonResult && (
        <Card>
          <CardHeader>
            <CardTitle>Comparison Results</CardTitle>
            <CardDescription>
              Comparing {comparisonResult.file_name_1} with {comparisonResult.file_name_2}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 border rounded-md bg-muted/50">
              <h3 className="font-medium mb-2">Summary</h3>
              <p>{comparisonResult.summary}</p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Similarity Scores</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm">Overall</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center justify-between">
                      <BarChart3 className="h-4 w-4 text-blue-500" />
                      <span className="text-xl font-bold">{formatSimilarity(comparisonResult.similarities.overall_similarity)}</span>
                    </div>
                    <Progress 
                      value={comparisonResult.similarities.overall_similarity * 100} 
                      className="h-2 mt-2" 
                    />
                  </CardContent>
                </Card>
                <Card className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm">Content</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center justify-between">
                      <FileText className="h-4 w-4 text-green-500" />
                      <span className="text-xl font-bold">{formatSimilarity(comparisonResult.similarities.content_similarity)}</span>
                    </div>
                    <Progress 
                      value={comparisonResult.similarities.content_similarity * 100} 
                      className="h-2 mt-2" 
                    />
                  </CardContent>
                </Card>
                <Card className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm">Structure</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center justify-between">
                      <FileSearch className="h-4 w-4 text-purple-500" />
                      <span className="text-xl font-bold">{formatSimilarity(comparisonResult.similarities.structure_similarity)}</span>
                    </div>
                    <Progress 
                      value={comparisonResult.similarities.structure_similarity * 100} 
                      className="h-2 mt-2" 
                    />
                  </CardContent>
                </Card>
                <Card className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm">Topics</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center justify-between">
                      <FileSearch className="h-4 w-4 text-amber-500" />
                      <span className="text-xl font-bold">{formatSimilarity(comparisonResult.similarities.topic_similarity)}</span>
                    </div>
                    <Progress 
                      value={comparisonResult.similarities.topic_similarity * 100} 
                      className="h-2 mt-2" 
                    />
                  </CardContent>
                </Card>
              </div>
            </div>

            <Tabs defaultValue="differences">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="differences">Differences</TabsTrigger>
                <TabsTrigger value="common">Common Topics</TabsTrigger>
                <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="differences" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md flex items-center gap-2">
                        <span className="text-blue-500">Unique to {comparisonResult.file_name_1}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {comparisonResult.differences.unique_to_first.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-1">
                          {comparisonResult.differences.unique_to_first.map((item, index) => (
                            <li key={`unique1-${index}`} className="text-sm">{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">No unique content found</p>
                      )}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md flex items-center gap-2">
                        <span className="text-green-500">Unique to {comparisonResult.file_name_2}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {comparisonResult.differences.unique_to_second.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-1">
                          {comparisonResult.differences.unique_to_second.map((item, index) => (
                            <li key={`unique2-${index}`} className="text-sm">{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">No unique content found</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
                {comparisonResult.differences.contradictions.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md flex items-center gap-2">
                        <span className="text-red-500">Contradictions</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-1">
                        {comparisonResult.differences.contradictions.map((item, index) => (
                          <li key={`contradiction-${index}`} className="text-sm">{item}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="common">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Common Topics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {comparisonResult.common_topics.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {comparisonResult.common_topics.map((topic, index) => (
                          <Badge key={`topic-${index}`} variant="secondary">{topic}</Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No common topics found</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                {comparisonResult.sections.map((section, index) => (
                  <Card key={`section-${index}`}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm whitespace-pre-line">{section.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentCompare;
