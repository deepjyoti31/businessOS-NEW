
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DocumentManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock documents data
  const documents = [
    {
      id: "DOC-001",
      name: "Q1 2025 Financial Report.pdf",
      type: "PDF",
      size: "2.4 MB",
      folder: "Finance",
      owner: "John Doe",
      ownerAvatar: "JD",
      modifiedBy: "Sarah Wilson",
      modifiedByAvatar: "SW",
      modifiedAt: "2025-03-28 10:15 AM",
      shared: true,
      favorited: true,
      tags: ["finance", "quarterly", "report"]
    },
    {
      id: "DOC-002",
      name: "Marketing Strategy 2025.docx",
      type: "DOCX",
      size: "1.8 MB",
      folder: "Marketing",
      owner: "Emily Davis",
      ownerAvatar: "ED",
      modifiedBy: "Emily Davis",
      modifiedByAvatar: "ED",
      modifiedAt: "2025-03-25 02:30 PM",
      shared: true,
      favorited: false,
      tags: ["marketing", "strategy"]
    },
    {
      id: "DOC-003",
      name: "Product Roadmap.xlsx",
      type: "XLSX",
      size: "3.6 MB",
      folder: "Product",
      owner: "Robert Johnson",
      ownerAvatar: "RJ",
      modifiedBy: "David Clark",
      modifiedByAvatar: "DC",
      modifiedAt: "2025-03-22 11:45 AM",
      shared: true,
      favorited: true,
      tags: ["product", "roadmap", "planning"]
    },
    {
      id: "DOC-004",
      name: "Client Meeting Notes.docx",
      type: "DOCX",
      size: "0.9 MB",
      folder: "Sales",
      owner: "Jane Smith",
      ownerAvatar: "JS",
      modifiedBy: "Jane Smith",
      modifiedByAvatar: "JS",
      modifiedAt: "2025-03-27 09:20 AM",
      shared: false,
      favorited: false,
      tags: ["sales", "meeting", "notes"]
    },
    {
      id: "DOC-005",
      name: "Company Logo Files.zip",
      type: "ZIP",
      size: "8.2 MB",
      folder: "Brand Assets",
      owner: "Michael Brown",
      ownerAvatar: "MB",
      modifiedBy: "Emily Davis",
      modifiedByAvatar: "ED",
      modifiedAt: "2025-03-15 04:10 PM",
      shared: true,
      favorited: false,
      tags: ["brand", "logo", "assets"]
    },
    {
      id: "DOC-006",
      name: "Employee Handbook 2025.pdf",
      type: "PDF",
      size: "4.5 MB",
      folder: "HR",
      owner: "Sarah Wilson",
      ownerAvatar: "SW",
      modifiedBy: "Sarah Wilson",
      modifiedByAvatar: "SW",
      modifiedAt: "2025-03-20 01:30 PM",
      shared: true,
      favorited: false,
      tags: ["hr", "handbook", "policy"]
    }
  ];

  // Mock folders data
  const folders = [
    { name: "Finance", count: 24 },
    { name: "Marketing", count: 18 },
    { name: "Product", count: 15 },
    { name: "Sales", count: 22 },
    { name: "HR", count: 12 },
    { name: "Legal", count: 8 },
    { name: "Brand Assets", count: 16 }
  ];

  // Filter documents based on search term
  const filteredDocuments = documents.filter((document) =>
    document.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    document.folder.toLowerCase().includes(searchTerm.toLowerCase()) ||
    document.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // File type icon mapping
  const getFileIcon = (type) => {
    switch (type) {
      case 'PDF':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <path d="M9 15v-2"></path>
            <path d="M12 15v-6"></path>
            <path d="M15 15v-4"></path>
          </svg>
        );
      case 'DOCX':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        );
      case 'XLSX':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <polyline points="8 16 10 18 16 12"></polyline>
          </svg>
        );
      case 'ZIP':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
            <path d="M21 8v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8"></path>
            <path d="M21 8H3"></path>
            <path d="M9 8V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v3"></path>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Document Management</h1>
        <p className="text-muted-foreground">
          Store, organize, and share files
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">+15 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2 GB</div>
            <p className="text-xs text-muted-foreground">of 10 GB (42%)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Shared With Me</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">36</div>
            <p className="text-xs text-muted-foreground">From 8 collaborators</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="files" className="space-y-4">
        <TabsList>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="files" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1 space-y-6">
              <div className="space-y-4">
                <Button className="w-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Upload File
                </Button>
                <Button variant="outline" className="w-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  </svg>
                  New Folder
                </Button>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Folders</h3>
                <div className="space-y-1">
                  {folders.map((folder, index) => (
                    <button 
                      key={index}
                      className="flex items-center justify-between w-full px-3 py-2 text-sm rounded-md hover:bg-muted"
                    >
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-2 text-muted-foreground"
                        >
                          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                        </svg>
                        <span>{folder.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{folder.count}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">finance</Badge>
                  <Badge variant="outline">marketing</Badge>
                  <Badge variant="outline">report</Badge>
                  <Badge variant="outline">product</Badge>
                  <Badge variant="outline">sales</Badge>
                  <Badge variant="outline">hr</Badge>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-3 space-y-4">
              <div className="flex items-center justify-between">
                <Input
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="8" y1="6" x2="21" y2="6"></line>
                      <line x1="8" y1="12" x2="21" y2="12"></line>
                      <line x1="8" y1="18" x2="21" y2="18"></line>
                      <line x1="3" y1="6" x2="3.01" y2="6"></line>
                      <line x1="3" y1="12" x2="3.01" y2="12"></line>
                      <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                  </Button>
                </div>
              </div>
              
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {filteredDocuments.length > 0 ? (
                      filteredDocuments.map((document) => (
                        <div key={document.id} className="p-4 hover:bg-muted/50 flex items-center gap-4">
                          {getFileIcon(document.type)}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium truncate">{document.name}</p>
                              {document.favorited && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-amber-400"
                                >
                                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                </svg>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <span>{document.folder}</span>
                              <span>•</span>
                              <span>{document.size}</span>
                              <span>•</span>
                              <span>Modified {document.modifiedAt}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {document.shared && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-muted-foreground"
                              >
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                                <polyline points="16 6 12 2 8 6"></polyline>
                                <line x1="12" y1="2" x2="12" y2="15"></line>
                              </svg>
                            )}
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>{document.modifiedByAvatar}</AvatarFallback>
                            </Avatar>
                            <Button variant="ghost" size="icon">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <circle cx="12" cy="12" r="1"></circle>
                                <circle cx="19" cy="12" r="1"></circle>
                                <circle cx="5" cy="12" r="1"></circle>
                              </svg>
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-muted-foreground">
                        No files found matching your search.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="shared" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shared Documents</CardTitle>
              <CardDescription>
                Files shared with you by other users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {documents.filter(doc => doc.shared).map((document) => (
                  <div key={document.id} className="py-3 flex items-center gap-4">
                    {getFileIcon(document.type)}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{document.name}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Avatar className="h-4 w-4">
                          <AvatarFallback className="text-[8px]">{document.ownerAvatar}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">Shared by {document.owner}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="favorites" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Favorite Documents</CardTitle>
              <CardDescription>
                Your starred documents for quick access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {documents.filter(doc => doc.favorited).map((document) => (
                  <div key={document.id} className="py-3 flex items-center gap-4">
                    {getFileIcon(document.type)}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{document.name}</p>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-amber-400"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span>{document.folder}</span>
                        <span>•</span>
                        <span>Modified {document.modifiedAt}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Open</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Templates</CardTitle>
              <CardDescription>
                Standardized document templates for common use cases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    <div>
                      <p className="font-medium">Project Proposal</p>
                      <p className="text-xs text-muted-foreground">DOCX Template</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">Use Template</Button>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <polyline points="8 16 10 18 16 12"></polyline>
                    </svg>
                    <div>
                      <p className="font-medium">Budget Calculator</p>
                      <p className="text-xs text-muted-foreground">XLSX Template</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">Use Template</Button>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <path d="M9 15v-2"></path>
                      <path d="M12 15v-6"></path>
                      <path d="M15 15v-4"></path>
                    </svg>
                    <div>
                      <p className="font-medium">Invoice</p>
                      <p className="text-xs text-muted-foreground">PDF Form</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">Use Template</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentManagement;
