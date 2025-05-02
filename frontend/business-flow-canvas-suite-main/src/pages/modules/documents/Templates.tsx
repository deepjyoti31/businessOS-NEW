import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import DocumentGenerator from "@/components/documents/DocumentGenerator";
import { supabaseAIDocumentService, DocumentTemplate, ContentGenerationResult } from "@/services/SupabaseAIDocumentService";
import { useAuth } from "@/hooks/useAuth";
import {
  FileText,
  Search,
  Plus,
  FileCheck,
  Clock,
  Star,
  Download,
  Copy,
  Loader2
} from "lucide-react";

const Templates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Use a default user ID if not authenticated
  const userId = user?.id || 'anonymous';

  // Fetch templates on component mount
  useEffect(() => {
    fetchTemplates();
  }, []);

  // Fetch templates from the backend
  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const fetchedTemplates = await supabaseAIDocumentService.getTemplates(undefined, userId);

      // If no templates exist yet, create some default ones
      if (fetchedTemplates.length === 0) {
        await createDefaultTemplates();
        const newTemplates = await supabaseAIDocumentService.getTemplates(undefined, userId);
        setTemplates(newTemplates);
      } else {
        setTemplates(fetchedTemplates);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast({
        title: "Error",
        description: "Failed to fetch document templates",
        variant: "destructive"
      });
      // Use default templates if API fails
      setTemplates(getDefaultTemplates());
    } finally {
      setIsLoading(false);
    }
  };

  // Create default templates if none exist
  const createDefaultTemplates = async () => {
    try {
      const defaultTemplates = getDefaultTemplates();

      // Create each default template
      for (const template of defaultTemplates) {
        await supabaseAIDocumentService.createTemplate(template, userId);
      }

      toast({
        title: "Templates Created",
        description: "Default templates have been created for you",
        variant: "default"
      });
    } catch (error) {
      console.error("Error creating default templates:", error);
    }
  };

  // Get default templates
  const getDefaultTemplates = (): DocumentTemplate[] => {
    return [
      {
        name: "Business Proposal",
        description: "A comprehensive business proposal template with executive summary, problem statement, solution, and financial projections",
        category: "Business",
        format: "docx",
        content: "# [Company Name] Business Proposal\n\n## Executive Summary\n[Brief overview of the proposal]\n\n## Problem Statement\n[Description of the problem being addressed]\n\n## Proposed Solution\n[Detailed description of the solution]\n\n## Market Analysis\n[Analysis of the target market]\n\n## Implementation Plan\n[Steps for implementing the solution]\n\n## Financial Projections\n[Financial forecasts and ROI analysis]\n\n## Conclusion\n[Summary and call to action]",
        fields: [
          {
            name: "Company Name",
            description: "Your company name",
            type: "text",
            required: true,
            default: ""
          },
          {
            name: "Project Title",
            description: "Title of the proposed project",
            type: "text",
            required: true,
            default: ""
          },
          {
            name: "Budget",
            description: "Estimated budget for the project",
            type: "number",
            required: true,
            default: ""
          },
          {
            name: "Timeline",
            description: "Expected project timeline in months",
            type: "number",
            required: true,
            default: "6"
          }
        ],
        is_public: true,
        tags: ["business", "proposal", "project"]
      },
      {
        name: "Meeting Minutes",
        description: "Template for recording meeting discussions, decisions, and action items",
        category: "Administration",
        format: "docx",
        content: "# Meeting Minutes\n\n**Date:** [Meeting Date]\n**Time:** [Start Time] - [End Time]\n**Location:** [Meeting Location]\n**Attendees:** [List of Attendees]\n**Absent:** [List of Absent Members]\n\n## Agenda Items\n\n1. [Agenda Item 1]\n2. [Agenda Item 2]\n3. [Agenda Item 3]\n\n## Discussion\n\n### [Agenda Item 1]\n[Discussion notes]\n\n### [Agenda Item 2]\n[Discussion notes]\n\n### [Agenda Item 3]\n[Discussion notes]\n\n## Decisions\n\n* [Decision 1]\n* [Decision 2]\n\n## Action Items\n\n| Action Item | Responsible | Deadline |\n|-------------|-------------|----------|\n| [Item 1]    | [Person 1]  | [Date 1] |\n| [Item 2]    | [Person 2]  | [Date 2] |\n\n## Next Meeting\n\n**Date:** [Next Meeting Date]\n**Time:** [Next Meeting Time]\n**Location:** [Next Meeting Location]",
        fields: [
          {
            name: "Meeting Date",
            description: "Date of the meeting",
            type: "date",
            required: true,
            default: ""
          },
          {
            name: "Start Time",
            description: "Meeting start time",
            type: "text",
            required: true,
            default: "9:00 AM"
          },
          {
            name: "End Time",
            description: "Meeting end time",
            type: "text",
            required: true,
            default: "10:00 AM"
          },
          {
            name: "Location",
            description: "Meeting location or virtual link",
            type: "text",
            required: true,
            default: ""
          },
          {
            name: "Attendees",
            description: "List of meeting attendees",
            type: "text",
            required: true,
            default: ""
          }
        ],
        is_public: true,
        tags: ["meeting", "minutes", "administration"]
      },
      {
        name: "Project Status Report",
        description: "Weekly or monthly project status report template",
        category: "Project Management",
        format: "docx",
        content: "# Project Status Report\n\n## Project Information\n\n**Project Name:** [Project Name]\n**Report Date:** [Report Date]\n**Project Manager:** [Project Manager]\n**Reporting Period:** [Start Date] to [End Date]\n\n## Executive Summary\n\n[Brief summary of project status, key achievements, and challenges]\n\n## Project Status\n\n**Overall Status:** [On Track/At Risk/Delayed]\n**Schedule Status:** [On Track/At Risk/Delayed]\n**Budget Status:** [On Track/At Risk/Delayed]\n**Scope Status:** [On Track/At Risk/Delayed]\n\n## Key Accomplishments\n\n* [Accomplishment 1]\n* [Accomplishment 2]\n* [Accomplishment 3]\n\n## Challenges and Issues\n\n| Issue | Impact | Mitigation Plan | Owner | Status |\n|-------|--------|-----------------|-------|--------|\n| [Issue 1] | [Impact] | [Plan] | [Owner] | [Status] |\n| [Issue 2] | [Impact] | [Plan] | [Owner] | [Status] |\n\n## Upcoming Milestones\n\n| Milestone | Due Date | Status | Comments |\n|-----------|----------|--------|----------|\n| [Milestone 1] | [Date] | [Status] | [Comments] |\n| [Milestone 2] | [Date] | [Status] | [Comments] |\n\n## Budget Summary\n\n**Total Budget:** [Total Budget]\n**Spent to Date:** [Spent to Date]\n**Remaining:** [Remaining Budget]\n**Forecast at Completion:** [Forecast]\n\n## Next Steps\n\n* [Next Step 1]\n* [Next Step 2]\n* [Next Step 3]",
        fields: [
          {
            name: "Project Name",
            description: "Name of the project",
            type: "text",
            required: true,
            default: ""
          },
          {
            name: "Report Date",
            description: "Date of this report",
            type: "date",
            required: true,
            default: ""
          },
          {
            name: "Project Manager",
            description: "Name of the project manager",
            type: "text",
            required: true,
            default: ""
          },
          {
            name: "Status",
            description: "Current project status",
            type: "select",
            required: true,
            default: "On Track",
            options: ["On Track", "At Risk", "Delayed"]
          }
        ],
        is_public: true,
        tags: ["project", "status", "report"]
      }
    ];
  };

  // Filter templates based on search term
  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get featured templates (public templates)
  const featuredTemplates = templates.filter(template => template.is_public);

  // Get my templates (created by the current user)
  const myTemplates = templates.filter(template => template.created_by === userId);

  // Get recently used templates (sort by updated_at)
  const recentTemplates = [...templates]
    .sort((a, b) => {
      const dateA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
      const dateB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  // Get template categories
  const categories = Array.from(new Set(templates.map(template => template.category)));

  // Handle template selection for generation
  const handleUseTemplate = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setIsGeneratorOpen(true);
  };

  // Handle generation completion
  const handleGenerationComplete = (result: ContentGenerationResult) => {
    if (result.success) {
      toast({
        title: "Document Generated",
        description: "Your document has been generated successfully",
        variant: "default"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Document Templates</h1>
        <p className="text-muted-foreground">
          Create new documents from pre-designed templates
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-auto sm:min-w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isGeneratorOpen} onOpenChange={setIsGeneratorOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Generate Document
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Generate Document</DialogTitle>
              <DialogDescription>
                Create a new document using AI-powered generation
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <DocumentGenerator
                onGenerationComplete={handleGenerationComplete}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="recent">Recently Used</TabsTrigger>
          <TabsTrigger value="my">My Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.length > 0 ? (
                filteredTemplates.map((template) => (
                  <Card key={template.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                          {template.category}
                        </Badge>
                        {template.is_public && (
                          <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                        )}
                      </div>
                      <CardTitle className="mt-2">{template.name}</CardTitle>
                      <CardDescription className="line-clamp-2">{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <FileText className="h-3.5 w-3.5" />
                        <span>{template.format.toUpperCase()}</span>
                        {template.updated_at && (
                          <>
                            <span className="opacity-50">•</span>
                            <Clock className="h-3.5 w-3.5" />
                            <span>Updated: {new Date(template.updated_at).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {template.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2 border-t">
                      <div className="text-sm text-muted-foreground">
                        {template.fields.length} input fields
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleUseTemplate(template)}>
                          <Copy className="h-3.5 w-3.5 mr-1" />
                          Use
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full p-6 text-center text-muted-foreground">
                  No templates found matching your search.
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="featured" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredTemplates.length > 0 ? (
                featuredTemplates.map((template) => (
                  <Card key={template.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                          {template.category}
                        </Badge>
                        <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                      </div>
                      <CardTitle className="mt-2">{template.name}</CardTitle>
                      <CardDescription className="line-clamp-2">{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <FileText className="h-3.5 w-3.5" />
                        <span>{template.format.toUpperCase()}</span>
                        {template.updated_at && (
                          <>
                            <span className="opacity-50">•</span>
                            <Clock className="h-3.5 w-3.5" />
                            <span>Updated: {new Date(template.updated_at).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {template.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2 border-t">
                      <div className="text-sm text-muted-foreground">
                        {template.fields.length} input fields
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleUseTemplate(template)}>
                          <Copy className="h-3.5 w-3.5 mr-1" />
                          Use
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full p-6 text-center text-muted-foreground">
                  No featured templates available.
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recently Updated Templates</CardTitle>
              <CardDescription>Templates that were recently created or updated</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="divide-y">
                  {recentTemplates.length > 0 ? (
                    recentTemplates.map((template) => (
                      <div key={template.id} className="py-3 flex items-center gap-4">
                        <div className="p-2 bg-muted rounded">
                          <FileCheck className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate">{template.name}</p>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                              {template.category}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <span>{template.format.toUpperCase()}</span>
                            {template.updated_at && (
                              <>
                                <span className="opacity-50">•</span>
                                <span>Updated: {new Date(template.updated_at).toLocaleDateString()}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleUseTemplate(template)}>
                          <Copy className="h-3.5 w-3.5 mr-1" />
                          Use
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">
                      No recently used templates found.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Templates</CardTitle>
              <CardDescription>Templates you've created or customized</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : myTemplates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  {myTemplates.map((template) => (
                    <Card key={template.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                            {template.category}
                          </Badge>
                          {template.is_public && (
                            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                          )}
                        </div>
                        <CardTitle className="mt-2">{template.name}</CardTitle>
                        <CardDescription className="line-clamp-2">{template.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <FileText className="h-3.5 w-3.5" />
                          <span>{template.format.toUpperCase()}</span>
                          {template.updated_at && (
                            <>
                              <span className="opacity-50">•</span>
                              <Clock className="h-3.5 w-3.5" />
                              <span>Updated: {new Date(template.updated_at).toLocaleDateString()}</span>
                            </>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-2 border-t">
                        <div className="text-sm text-muted-foreground">
                          {template.fields.length} input fields
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleUseTemplate(template)}>
                            <Copy className="h-3.5 w-3.5 mr-1" />
                            Use
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Create your first template</h3>
                  <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                    Save time by creating custom templates for documents you use frequently.
                  </p>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Generate Document
                    </Button>
                  </DialogTrigger>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Template Categories</CardTitle>
            <CardDescription>Browse templates by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category, index) => {
                const count = templates.filter(t => t.category === category).length;
                return (
                  <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSearchTerm(category)}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{category}</h3>
                        <p className="text-xs text-muted-foreground">{count} template{count !== 1 ? 's' : ''}</p>
                      </div>
                      <div className="p-2 bg-muted rounded-full">
                        <FileCheck className="h-5 w-5 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Templates;
