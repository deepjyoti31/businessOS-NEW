import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import {
  FileText,
  FolderOpen,
  Search,
  Upload,
  FileSpreadsheet,
  FileImage,
  File,
  ChevronLeft,
  Loader2
} from "lucide-react";
import { supabaseDocumentService } from "@/services/SupabaseDocumentService";
import { FileMetadata } from "@/services/supabaseStorageService";
import UploadFileDialog from "@/components/documents/UploadFileDialog";
import NewFolderDialog from "@/components/documents/NewFolderDialog";

const AllFiles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [currentFolder, setCurrentFolder] = useState("");
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [documents, setDocuments] = useState<FileMetadata[]>([]);
  const [folders, setFolders] = useState<FileMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const { toast } = useToast();

  // Initialize document service and load files
  useEffect(() => {
    const initializeService = async () => {
      // Set a timeout for the entire initialization process
      const initTimeout = setTimeout(() => {
        console.error("Document service initialization timed out");
        toast({
          title: "Connection Timeout",
          description: "Connection to document storage timed out. Using mock data instead.",
          variant: "destructive",
          duration: 6000,
        });
        loadMockData();
      }, 15000); // 15 seconds timeout for the entire initialization process

      try {
        await supabaseDocumentService.initialize();
        clearTimeout(initTimeout); // Clear the timeout if initialization succeeds
        loadFilesAndFolders();
      } catch (error) {
        clearTimeout(initTimeout); // Clear the timeout if initialization fails with an error
        console.error("Error initializing document service:", error);

        // Check if it's a CORS error
        const errorMessage = error.toString();
        if (errorMessage.includes("CORS") || errorMessage.includes("Failed to fetch")) {
          toast({
            title: "CORS Error",
            description: "CORS is not configured on Azure Blob Storage. Using mock data instead. Please configure CORS in Azure Portal.",
            variant: "destructive",
            duration: 6000,
          });
        } else if (errorMessage.includes("timeout") || errorMessage.includes("Timeout")) {
          toast({
            title: "Connection Timeout",
            description: "Connection to document storage timed out. Using mock data instead.",
            variant: "destructive",
            duration: 6000,
          });
        } else {
          toast({
            title: "Service Initialization Failed",
            description: "Could not connect to document storage. Using mock data instead.",
            variant: "destructive",
          });
        }

        // Load mock data if service initialization fails
        loadMockData();
      }
    };

    initializeService();
  }, []);

  // Load files and folders when current folder changes
  useEffect(() => {
    loadFilesAndFolders();
  }, [currentFolder]);

  // Load files and folders from the document service
  const loadFilesAndFolders = async () => {
    setIsLoading(true);

    // Set a timeout for loading files and folders
    const loadTimeout = setTimeout(() => {
      console.error("Loading files and folders timed out");
      toast({
        title: "Loading Timeout",
        description: "Loading files took too long. Using mock data instead.",
        variant: "destructive",
        duration: 6000,
      });
      loadMockData();
      setIsLoading(false);
    }, 10000); // 10 seconds timeout for loading

    try {
      const items = await supabaseDocumentService.listFilesAndFolders(currentFolder);
      clearTimeout(loadTimeout); // Clear the timeout if loading succeeds

      // Separate files and folders
      const folderItems = items.filter(item => item.isFolder);
      const documentItems = items.filter(item => !item.isFolder);

      setFolders(folderItems);
      setDocuments(documentItems);
    } catch (error) {
      clearTimeout(loadTimeout); // Clear the timeout if loading fails with an error
      console.error("Error loading files and folders:", error);

      // Check if it's a CORS error
      const errorMessage = error.toString();
      if (errorMessage.includes("CORS") || errorMessage.includes("Failed to fetch")) {
        // Only show the toast if we haven't already shown one for initialization
        if (folders.length === 0 && documents.length === 0) {
          toast({
            title: "CORS Error",
            description: "CORS is not configured on Azure Blob Storage. Using mock data instead.",
            variant: "destructive",
            duration: 6000,
          });
        }
      } else if (errorMessage.includes("timeout") || errorMessage.includes("Timeout")) {
        toast({
          title: "Loading Timeout",
          description: "Loading files took too long. Using mock data instead.",
          variant: "destructive",
          duration: 6000,
        });
      } else {
        toast({
          title: "Failed to Load Files",
          description: "There was an error loading your files. Using mock data instead.",
          variant: "destructive",
        });
      }

      // Load mock data if loading fails
      loadMockData();
    } finally {
      setIsLoading(false);
    }
  };

  // Load mock data for development/fallback
  const loadMockData = () => {
    // Mock documents data
    const mockDocuments: FileMetadata[] = [
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
        tags: ["finance", "quarterly", "report"],
        path: "Finance/Q1 2025 Financial Report.pdf",
        isFolder: false
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
        tags: ["marketing", "strategy"],
        path: "Marketing/Marketing Strategy 2025.docx",
        isFolder: false
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
        tags: ["product", "roadmap", "planning"],
        path: "Product/Product Roadmap.xlsx",
        isFolder: false
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
        tags: ["sales", "meeting", "notes"],
        path: "Sales/Client Meeting Notes.docx",
        isFolder: false
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
        tags: ["brand", "logo", "assets"],
        path: "Brand Assets/Company Logo Files.zip",
        isFolder: false
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
        tags: ["hr", "handbook", "policy"],
        path: "HR/Employee Handbook 2025.pdf",
        isFolder: false
      }
    ];

    // Mock folders data
    const mockFolders: FileMetadata[] = [
      {
        id: "folder-1",
        name: "Finance",
        type: "FOLDER",
        size: "0 KB",
        folder: "Root",
        owner: "System",
        ownerAvatar: "SY",
        modifiedBy: "System",
        modifiedByAvatar: "SY",
        modifiedAt: new Date().toLocaleString(),
        shared: false,
        favorited: false,
        tags: [],
        path: "Finance",
        isFolder: true
      },
      {
        id: "folder-2",
        name: "Marketing",
        type: "FOLDER",
        size: "0 KB",
        folder: "Root",
        owner: "System",
        ownerAvatar: "SY",
        modifiedBy: "System",
        modifiedByAvatar: "SY",
        modifiedAt: new Date().toLocaleString(),
        shared: false,
        favorited: false,
        tags: [],
        path: "Marketing",
        isFolder: true
      },
      {
        id: "folder-3",
        name: "Product",
        type: "FOLDER",
        size: "0 KB",
        folder: "Root",
        owner: "System",
        ownerAvatar: "SY",
        modifiedBy: "System",
        modifiedByAvatar: "SY",
        modifiedAt: new Date().toLocaleString(),
        shared: false,
        favorited: false,
        tags: [],
        path: "Product",
        isFolder: true
      },
      {
        id: "folder-4",
        name: "Sales",
        type: "FOLDER",
        size: "0 KB",
        folder: "Root",
        owner: "System",
        ownerAvatar: "SY",
        modifiedBy: "System",
        modifiedByAvatar: "SY",
        modifiedAt: new Date().toLocaleString(),
        shared: false,
        favorited: false,
        tags: [],
        path: "Sales",
        isFolder: true
      },
      {
        id: "folder-5",
        name: "HR",
        type: "FOLDER",
        size: "0 KB",
        folder: "Root",
        owner: "System",
        ownerAvatar: "SY",
        modifiedBy: "System",
        modifiedByAvatar: "SY",
        modifiedAt: new Date().toLocaleString(),
        shared: false,
        favorited: false,
        tags: [],
        path: "HR",
        isFolder: true
      },
      {
        id: "folder-6",
        name: "Legal",
        type: "FOLDER",
        size: "0 KB",
        folder: "Root",
        owner: "System",
        ownerAvatar: "SY",
        modifiedBy: "System",
        modifiedByAvatar: "SY",
        modifiedAt: new Date().toLocaleString(),
        shared: false,
        favorited: false,
        tags: [],
        path: "Legal",
        isFolder: true
      },
      {
        id: "folder-7",
        name: "Brand Assets",
        type: "FOLDER",
        size: "0 KB",
        folder: "Root",
        owner: "System",
        ownerAvatar: "SY",
        modifiedBy: "System",
        modifiedByAvatar: "SY",
        modifiedAt: new Date().toLocaleString(),
        shared: false,
        favorited: false,
        tags: [],
        path: "Brand Assets",
        isFolder: true
      }
    ];

    setFolders(mockFolders);
    setDocuments(mockDocuments);
    setIsLoading(false);
  };

  // Handle folder navigation
  const navigateToFolder = (folderPath: string) => {
    setCurrentFolder(folderPath);
    setCurrentPath(folderPath.split('/').filter(Boolean));
  };

  // Handle navigation to parent folder
  const navigateToParentFolder = () => {
    const pathParts = currentPath.slice(0, -1);
    const parentPath = pathParts.join('/');
    setCurrentFolder(parentPath);
    setCurrentPath(pathParts);
  };

  // Handle file upload
  const handleFileUpload = async (files: File[], targetFolder: string) => {
    // Set a timeout for the upload process
    const uploadTimeout = setTimeout(() => {
      console.error("File upload timed out");
      toast({
        title: "Upload Timeout",
        description: "File upload took too long. Simulating upload with mock data.",
        variant: "destructive",
        duration: 6000,
      });
      loadMockData();
      return true;
    }, 30000); // 30 seconds timeout for uploads (files can be large)

    try {
      for (const file of files) {
        await supabaseDocumentService.uploadFile(file, targetFolder);
      }
      clearTimeout(uploadTimeout); // Clear the timeout if upload succeeds

      // Reload files after upload
      loadFilesAndFolders();

      // Show success message
      toast({
        title: "Upload Successful",
        description: `${files.length} file(s) uploaded successfully.`,
        variant: "default",
      });

      return true;
    } catch (error) {
      clearTimeout(uploadTimeout); // Clear the timeout if upload fails with an error
      console.error("Error uploading files:", error);

      // Check if it's a CORS error
      const errorMessage = error.toString();
      if (errorMessage.includes("CORS") || errorMessage.includes("Failed to fetch")) {
        toast({
          title: "CORS Error",
          description: "CORS is not configured on Azure Blob Storage. File upload simulated with mock data.",
          variant: "destructive",
          duration: 6000,
        });

        // Simulate successful upload with mock data
        loadMockData();
        return true;
      } else if (errorMessage.includes("timeout") || errorMessage.includes("Timeout")) {
        toast({
          title: "Upload Timeout",
          description: "File upload took too long. Simulating upload with mock data.",
          variant: "destructive",
          duration: 6000,
        });

        // Simulate successful upload with mock data
        loadMockData();
        return true;
      } else {
        // Re-throw the error to be handled by the upload dialog
        throw error;
      }
    }
  };

  // Handle folder creation
  const handleCreateFolder = async (folderName: string, parentFolder: string) => {
    // Set a timeout for the folder creation process
    const folderTimeout = setTimeout(() => {
      console.error("Folder creation timed out");
      toast({
        title: "Creation Timeout",
        description: "Folder creation took too long. Simulating creation with mock data.",
        variant: "destructive",
        duration: 6000,
      });

      // Add a mock folder to the current folders
      const newMockFolder: FileMetadata = {
        id: `folder-${Date.now()}`,
        name: folderName,
        type: "FOLDER",
        size: "0 KB",
        folder: parentFolder || "Root",
        owner: "Current User",
        ownerAvatar: "CU",
        modifiedBy: "Current User",
        modifiedByAvatar: "CU",
        modifiedAt: new Date().toLocaleString(),
        shared: false,
        favorited: false,
        tags: [],
        path: parentFolder ? `${parentFolder}/${folderName}` : folderName,
        isFolder: true
      };

      setFolders(prevFolders => [...prevFolders, newMockFolder]);
      return true;
    }, 10000); // 10 seconds timeout for folder creation

    try {
      await supabaseDocumentService.createFolder(folderName, parentFolder);
      clearTimeout(folderTimeout); // Clear the timeout if creation succeeds

      // Reload files after folder creation
      loadFilesAndFolders();

      // Show success message
      toast({
        title: "Folder Created",
        description: `Folder "${folderName}" created successfully.`,
        variant: "default",
      });

      return true;
    } catch (error) {
      clearTimeout(folderTimeout); // Clear the timeout if creation fails with an error
      console.error("Error creating folder:", error);

      // Check if it's a CORS error
      const errorMessage = error.toString();
      if (errorMessage.includes("CORS") || errorMessage.includes("Failed to fetch")) {
        toast({
          title: "CORS Error",
          description: "CORS is not configured on Azure Blob Storage. Folder creation simulated with mock data.",
          variant: "destructive",
          duration: 6000,
        });

        // Add a mock folder to the current folders
        const newMockFolder: FileMetadata = {
          id: `folder-${Date.now()}`,
          name: folderName,
          type: "FOLDER",
          size: "0 KB",
          folder: parentFolder || "Root",
          owner: "Current User",
          ownerAvatar: "CU",
          modifiedBy: "Current User",
          modifiedByAvatar: "CU",
          modifiedAt: new Date().toLocaleString(),
          shared: false,
          favorited: false,
          tags: [],
          path: parentFolder ? `${parentFolder}/${folderName}` : folderName,
          isFolder: true
        };

        setFolders(prevFolders => [...prevFolders, newMockFolder]);
        return true;
      } else if (errorMessage.includes("timeout") || errorMessage.includes("Timeout")) {
        toast({
          title: "Creation Timeout",
          description: "Folder creation took too long. Simulating creation with mock data.",
          variant: "destructive",
          duration: 6000,
        });

        // Add a mock folder to the current folders
        const newMockFolder: FileMetadata = {
          id: `folder-${Date.now()}`,
          name: folderName,
          type: "FOLDER",
          size: "0 KB",
          folder: parentFolder || "Root",
          owner: "Current User",
          ownerAvatar: "CU",
          modifiedBy: "Current User",
          modifiedByAvatar: "CU",
          modifiedAt: new Date().toLocaleString(),
          shared: false,
          favorited: false,
          tags: [],
          path: parentFolder ? `${parentFolder}/${folderName}` : folderName,
          isFolder: true
        };

        setFolders(prevFolders => [...prevFolders, newMockFolder]);
        return true;
      } else {
        // Re-throw the error to be handled by the folder creation dialog
        throw error;
      }
    }
  };

  // Filter documents based on search term
  const filteredDocuments = documents.filter((document) =>
    document.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    document.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Filter folders based on search term
  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">
          {currentFolder ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={navigateToParentFolder}
                disabled={!currentFolder}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              {currentPath.length > 0 ? currentPath[currentPath.length - 1] : "All Files"}
            </div>
          ) : (
            "All Files"
          )}
        </h1>
        <p className="text-muted-foreground">
          {currentFolder ? `Browsing ${currentFolder}` : "Browse and manage all your documents"}
        </p>
      </div>

      {/* Breadcrumb navigation */}
      {currentPath.length > 0 && (
        <div className="flex items-center gap-1 text-sm">
          <Button
            variant="link"
            className="p-0 h-auto"
            onClick={() => navigateToFolder("")}
          >
            Root
          </Button>
          {currentPath.map((part, index) => (
            <div key={index} className="flex items-center">
              <span className="mx-1">/</span>
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => navigateToFolder(currentPath.slice(0, index + 1).join('/'))}
              >
                {part}
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="space-y-4">
            <Button
              className="w-full"
              onClick={() => setIsUploadDialogOpen(true)}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload File
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsNewFolderDialogOpen(true)}
            >
              <FolderOpen className="mr-2 h-4 w-4" />
              New Folder
            </Button>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Folders</h3>
            <div className="space-y-1 max-h-[300px] overflow-y-auto">
              {filteredFolders.length > 0 ? (
                filteredFolders.map((folder) => (
                  <button
                    key={folder.id}
                    className="flex items-center justify-between w-full px-3 py-2 text-sm rounded-md hover:bg-muted"
                    onClick={() => navigateToFolder(folder.path)}
                  >
                    <div className="flex items-center">
                      <FolderOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{folder.name}</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-sm text-muted-foreground text-center py-2">
                  No folders found
                </div>
              )}
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
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
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
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
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
            <CardHeader className="pb-3">
              <CardTitle className="text-md flex items-center justify-between">
                <span>{currentFolder ? `Files in ${currentPath[currentPath.length - 1] || ""}` : "All Documents"}</span>
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-8 flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : viewMode === "list" ? (
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
                      {searchTerm ? "No files found matching your search." : "No files in this folder."}
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
                  {filteredDocuments.length > 0 ? (
                    filteredDocuments.map((document) => (
                      <Card key={document.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-4 flex flex-col h-full">
                          <div className="flex items-start justify-between mb-3">
                            {getFileIcon(document.type)}
                            <div className="flex items-center">
                              {document.favorited && (
                                <Button variant="ghost" size="icon" className="h-8 w-8">
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
                                </Button>
                              )}
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
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
                          <div className="flex-1">
                            <h3 className="font-medium truncate mb-1">{document.name}</h3>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{document.size}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-4 pt-3 border-t">
                            <div className="flex items-center gap-1">
                              <Avatar className="h-5 w-5">
                                <AvatarFallback className="text-[10px]">{document.modifiedByAvatar}</AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">{document.modifiedBy}</span>
                            </div>
                            <Button variant="outline" size="sm">Open</Button>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full p-6 text-center text-muted-foreground">
                      {searchTerm ? "No files found matching your search." : "No files in this folder."}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upload File Dialog */}
      <UploadFileDialog
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        onUpload={handleFileUpload}
        currentFolder={currentFolder}
      />

      {/* New Folder Dialog */}
      <NewFolderDialog
        isOpen={isNewFolderDialogOpen}
        onClose={() => setIsNewFolderDialogOpen(false)}
        onCreateFolder={handleCreateFolder}
        currentFolder={currentFolder}
      />
    </div>
  );
};

export default AllFiles;
