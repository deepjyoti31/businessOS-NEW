import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Search,
  Plus,
  FileCheck,
  Clock,
  Star,
  Download,
  Copy
} from "lucide-react";

const Templates = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock templates data
  const templates = [
    {
      id: "TPL-001",
      name: "Invoice Template",
      description: "Standard invoice template with tax calculation",
      category: "Finance",
      format: "DOCX",
      lastUsed: "2025-03-15",
      usageCount: 42,
      featured: true,
      tags: ["finance", "invoice", "billing"]
    },
    {
      id: "TPL-002",
      name: "Project Proposal",
      description: "Comprehensive project proposal with timeline and budget sections",
      category: "Business",
      format: "DOCX",
      lastUsed: "2025-03-20",
      usageCount: 28,
      featured: true,
      tags: ["proposal", "project", "business"]
    },
    {
      id: "TPL-003",
      name: "Meeting Minutes",
      description: "Structured template for recording meeting discussions and action items",
      category: "Administration",
      format: "DOCX",
      lastUsed: "2025-03-22",
      usageCount: 56,
      featured: false,
      tags: ["meeting", "minutes", "administration"]
    },
    {
      id: "TPL-004",
      name: "Employee Contract",
      description: "Standard employment contract with customizable terms",
      category: "HR",
      format: "DOCX",
      lastUsed: "2025-03-10",
      usageCount: 18,
      featured: false,
      tags: ["hr", "contract", "employment"]
    },
    {
      id: "TPL-005",
      name: "Marketing Campaign Plan",
      description: "Template for planning marketing campaigns with budget and KPIs",
      category: "Marketing",
      format: "XLSX",
      lastUsed: "2025-03-18",
      usageCount: 24,
      featured: true,
      tags: ["marketing", "campaign", "planning"]
    },
    {
      id: "TPL-006",
      name: "Product Specification",
      description: "Detailed product specification document with technical requirements",
      category: "Product",
      format: "DOCX",
      lastUsed: "2025-03-05",
      usageCount: 15,
      featured: false,
      tags: ["product", "specification", "technical"]
    },
    {
      id: "TPL-007",
      name: "Customer Feedback Survey",
      description: "Customer satisfaction survey with standard questions",
      category: "Customer Service",
      format: "DOCX",
      lastUsed: "2025-03-12",
      usageCount: 32,
      featured: false,
      tags: ["customer", "feedback", "survey"]
    },
    {
      id: "TPL-008",
      name: "Monthly Financial Report",
      description: "Financial reporting template with P&L, balance sheet, and cash flow",
      category: "Finance",
      format: "XLSX",
      lastUsed: "2025-03-25",
      usageCount: 38,
      featured: true,
      tags: ["finance", "report", "monthly"]
    }
  ];

  // Filter templates based on search term
  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get featured templates
  const featuredTemplates = templates.filter(template => template.featured);

  // Get template categories
  const categories = Array.from(new Set(templates.map(template => template.category)));

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
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create New Template
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="recent">Recently Used</TabsTrigger>
          <TabsTrigger value="my">My Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.length > 0 ? (
              filteredTemplates.map((template) => (
                <Card key={template.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                        {template.category}
                      </Badge>
                      {template.featured && (
                        <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                      )}
                    </div>
                    <CardTitle className="mt-2">{template.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <FileText className="h-3.5 w-3.5" />
                      <span>{template.format}</span>
                      <span className="opacity-50">•</span>
                      <Clock className="h-3.5 w-3.5" />
                      <span>Last used: {template.lastUsed}</span>
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
                      Used {template.usageCount} times
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Copy className="h-3.5 w-3.5 mr-1" />
                        Use
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
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
        </TabsContent>
        
        <TabsContent value="featured" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredTemplates.map((template) => (
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
                    <span>{template.format}</span>
                    <span className="opacity-50">•</span>
                    <Clock className="h-3.5 w-3.5" />
                    <span>Last used: {template.lastUsed}</span>
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
                    Used {template.usageCount} times
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      Use
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recently Used Templates</CardTitle>
              <CardDescription>Templates you've used in the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {templates
                  .sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime())
                  .slice(0, 5)
                  .map((template) => (
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
                          <span>{template.format}</span>
                          <span className="opacity-50">•</span>
                          <span>Last used: {template.lastUsed}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Copy className="h-3.5 w-3.5 mr-1" />
                        Use
                      </Button>
                    </div>
                  ))}
              </div>
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
              <div className="text-center py-8">
                <FileCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Create your first template</h3>
                <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                  Save time by creating custom templates for documents you use frequently.
                </p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{category}</h3>
                      <p className="text-xs text-muted-foreground">{count} templates</p>
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
    </div>
  );
};

export default Templates;
