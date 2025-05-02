import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
// Try to import DatePicker, but provide a fallback if it's not available
let DatePicker: any;
try {
  DatePicker = require("@/components/ui/date-picker").DatePicker;
} catch (error) {
  // Fallback DatePicker component
  DatePicker = ({ date, setDate }: { date?: Date, setDate: (date?: Date) => void }) => (
    <Input
      type="date"
      value={date ? date.toISOString().split('T')[0] : ''}
      onChange={(e) => setDate(e.target.value ? new Date(e.target.value) : undefined)}
    />
  );
}
import { Loader2, FileText, Download, Copy, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabaseAIDocumentService, DocumentTemplate, ContentGenerationRequest, ContentGenerationResult, TemplateField } from "@/services/SupabaseAIDocumentService";
import { useAuth } from "@/hooks/useAuth";

interface DocumentGeneratorProps {
  onGenerationComplete?: (result: ContentGenerationResult) => void;
}

const DocumentGenerator = ({ onGenerationComplete }: DocumentGeneratorProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState<ContentGenerationResult | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [customDescription, setCustomDescription] = useState("");
  const [customFormat, setCustomFormat] = useState<"docx" | "txt" | "md" | "html">("docx");
  const [copied, setCopied] = useState(false);
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
      setTemplates(fetchedTemplates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast({
        title: "Error",
        description: "Failed to fetch document templates",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle template selection
  const handleTemplateChange = async (templateId: string) => {
    setSelectedTemplateId(templateId);
    setFormValues({}); // Reset form values when template changes

    if (!templateId) {
      setSelectedTemplate(null);
      return;
    }

    try {
      const template = await supabaseAIDocumentService.getTemplateById(templateId);
      if (template) {
        setSelectedTemplate(template);

        // Initialize form values with defaults
        const initialValues: Record<string, any> = {};
        template.fields.forEach(field => {
          if (field.default) {
            initialValues[field.name] = field.default;
          }
        });
        setFormValues(initialValues);
      }
    } catch (error) {
      console.error("Error fetching template:", error);
      toast({
        title: "Error",
        description: "Failed to fetch template details",
        variant: "destructive"
      });
    }
  };

  // Handle form field changes
  const handleFieldChange = (fieldName: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  // Generate document content
  const generateDocument = async (useTemplate: boolean) => {
    setIsGenerating(true);
    setGenerationResult(null);

    try {
      const request: ContentGenerationRequest = useTemplate
        ? {
            template_id: selectedTemplateId,
            format: selectedTemplate?.format || "docx",
            fields: formValues
          }
        : {
            description: customDescription,
            format: customFormat,
            fields: formValues
          };

      const result = await supabaseAIDocumentService.generateDocumentContent(request);
      setGenerationResult(result);

      if (result.success) {
        toast({
          title: "Success",
          description: "Document generated successfully",
          variant: "default"
        });

        if (onGenerationComplete) {
          onGenerationComplete(result);
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to generate document",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error generating document:", error);
      toast({
        title: "Error",
        description: "Failed to generate document content",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy generated content to clipboard
  const copyToClipboard = () => {
    if (generationResult?.content) {
      navigator.clipboard.writeText(generationResult.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      toast({
        title: "Copied",
        description: "Document content copied to clipboard",
        variant: "default"
      });
    }
  };

  // Download generated content as a file
  const downloadDocument = () => {
    if (!generationResult?.content) return;

    const content = generationResult.content;
    const format = generationResult.format;

    // Create file extension based on format
    const extension = format === "docx" ? "docx" :
                     format === "html" ? "html" :
                     format === "md" ? "md" : "txt";

    // Create file name
    const fileName = selectedTemplate
      ? `${selectedTemplate.name.replace(/\s+/g, '_')}.${extension}`
      : `generated_document.${extension}`;

    // Create blob and download
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded",
      description: `Document saved as ${fileName}`,
      variant: "default"
    });
  };

  // Render form field based on field type
  const renderField = (field: TemplateField) => {
    const value = formValues[field.name] || "";

    switch (field.type) {
      case "text":
        return (
          <Input
            id={field.name}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.description}
          />
        );
      case "number":
        return (
          <Input
            id={field.name}
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.description}
          />
        );
      case "date":
        return (
          <DatePicker
            date={value ? new Date(value) : undefined}
            setDate={(date) => handleFieldChange(field.name, date?.toISOString())}
          />
        );
      case "select":
        return (
          <Select value={value} onValueChange={(val) => handleFieldChange(field.name, val)}>
            <SelectTrigger>
              <SelectValue placeholder={field.description} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "boolean":
        return (
          <Checkbox
            id={field.name}
            checked={value === true || value === "true"}
            onCheckedChange={(checked) => handleFieldChange(field.name, checked)}
          />
        );
      default:
        return (
          <Input
            id={field.name}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.description}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="template" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="template">Use Template</TabsTrigger>
          <TabsTrigger value="custom">Custom Generation</TabsTrigger>
        </TabsList>

        <TabsContent value="template">
          <Card>
            <CardHeader>
              <CardTitle>Generate from Template</CardTitle>
              <CardDescription>Select a template and fill in the required fields</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template">Template</Label>
                <Select value={selectedTemplateId} onValueChange={handleTemplateChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoading ? (
                      <div className="flex items-center justify-center py-2">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span>Loading templates...</span>
                      </div>
                    ) : templates.length > 0 ? (
                      templates.map((template) => (
                        <SelectItem key={template.id} value={template.id || ""}>
                          {template.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="py-2 text-center text-muted-foreground">
                        No templates available
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {selectedTemplate && (
                <div className="space-y-4 mt-4">
                  <div className="p-4 border rounded-md bg-muted/50">
                    <h3 className="font-medium">{selectedTemplate.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{selectedTemplate.description}</p>
                  </div>

                  <div className="space-y-4">
                    {selectedTemplate.fields.map((field) => (
                      <div key={field.name} className="space-y-2">
                        <Label htmlFor={field.name}>
                          {field.name} {field.required && <span className="text-red-500">*</span>}
                        </Label>
                        <div className="flex items-center gap-2">
                          {renderField(field)}
                        </div>
                        {field.description && (
                          <p className="text-xs text-muted-foreground">{field.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => generateDocument(true)}
                disabled={!selectedTemplate || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Document
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle>Custom Document Generation</CardTitle>
              <CardDescription>Describe the document you want to generate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Document Description</Label>
                <Textarea
                  id="description"
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="Describe the document you want to generate in detail..."
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="format">Document Format</Label>
                <Select value={customFormat} onValueChange={(val: any) => setCustomFormat(val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="docx">Word Document (.docx)</SelectItem>
                    <SelectItem value="txt">Plain Text (.txt)</SelectItem>
                    <SelectItem value="md">Markdown (.md)</SelectItem>
                    <SelectItem value="html">HTML (.html)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Additional Fields (Optional)</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      value={formValues.company || ""}
                      onChange={(e) => handleFieldChange("company", e.target.value)}
                      placeholder="Your company name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      value={formValues.author || ""}
                      onChange={(e) => handleFieldChange("author", e.target.value)}
                      placeholder="Document author"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => generateDocument(false)}
                disabled={!customDescription || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Document
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {generationResult && generationResult.success && generationResult.content && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Document</CardTitle>
            <CardDescription>Your document has been generated successfully</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 border rounded-md bg-muted/50 max-h-96 overflow-y-auto whitespace-pre-wrap">
              {generationResult.content}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={copyToClipboard}>
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy to Clipboard
                </>
              )}
            </Button>
            <Button onClick={downloadDocument}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default DocumentGenerator;
