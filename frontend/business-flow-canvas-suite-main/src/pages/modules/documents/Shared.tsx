import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  FileText,
  Search,
  FileSpreadsheet,
  FileImage,
  File,
  Users,
  Clock,
  Loader2
} from "lucide-react";
import { documentService } from "@/services/documentServiceInstances";
import { FileMetadata } from "@/services/supabaseStorageService";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { ShareDocumentDialog } from "@/components/documents/ShareDocumentDialog";

const Shared = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sharedWithMe, setSharedWithMe] = useState<FileMetadata[]>([]);
  const [sharedByMe, setSharedByMe] = useState<FileMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<FileMetadata | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);

  // Load shared documents
  useEffect(() => {
    const loadSharedDocuments = async () => {
      try {
        setIsLoading(true);

        // Get documents shared with me
        const sharedWithMeData = await documentService.getSharedWithMe();
        setSharedWithMe(sharedWithMeData);

        // Get all files to filter for ones I've shared
        const allFiles = await documentService.getAllFiles();

        // For each file, check if it has shares
        const sharedByMeFiles: FileMetadata[] = [];
        for (const file of allFiles) {
          if (!file.isFolder) {
            const shares = await documentService.getDocumentShares(file.id);
            if (shares.length > 0) {
              sharedByMeFiles.push({
                ...file,
                sharedWith: shares.map(share => ({
                  id: share.user.id,
                  name: share.user.name,
                  email: share.user.email,
                  avatar: share.user.name.split(' ').map(n => n[0]).join('').toUpperCase(),
                  permissionLevel: share.permission_level
                }))
              });
            }
          }
        }

        setSharedByMe(sharedByMeFiles);
      } catch (error) {
        console.error("Error loading shared documents:", error);
        toast.error("Failed to load shared documents");
      } finally {
        setIsLoading(false);
      }
    };

    loadSharedDocuments();
  }, []);

  // Filter documents based on search term
  const filteredSharedWithMe = sharedWithMe.filter((document) =>
    document.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSharedByMe = sharedByMe.filter((document) =>
    document.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // File type icon mapping
  const getFileIcon = (type: string) => {
    const fileType = type.toUpperCase();
    switch (fileType) {
      case 'APPLICATION/PDF':
      case 'PDF':
        return <FileText className="h-6 w-6 text-red-500" />;
      case 'APPLICATION/MSWORD':
      case 'APPLICATION/VND.OPENXMLFORMATS-OFFICEDOCUMENT.WORDPROCESSINGML.DOCUMENT':
      case 'DOCX':
      case 'DOC':
        return <FileText className="h-6 w-6 text-blue-500" />;
      case 'APPLICATION/VND.MS-EXCEL':
      case 'APPLICATION/VND.OPENXMLFORMATS-OFFICEDOCUMENT.SPREADSHEETML.SHEET':
      case 'XLSX':
      case 'XLS':
        return <FileSpreadsheet className="h-6 w-6 text-green-500" />;
      case 'APPLICATION/ZIP':
      case 'ZIP':
        return <File className="h-6 w-6 text-amber-500" />;
      case 'IMAGE/JPEG':
      case 'IMAGE/PNG':
      case 'JPG':
      case 'PNG':
        return <FileImage className="h-6 w-6 text-purple-500" />;
      default:
        return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  // Get permission badge color
  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case 'edit':
        return "bg-green-100 text-green-800";
      case 'view':
        return "bg-blue-100 text-blue-800";
      case 'comment':
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format date to relative time
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Unknown date";
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return dateString;
    }
  };

  const handleShareDocument = () => {
    // Open file browser to select a document to share
    // For now, we'll just show a toast
    toast.info("Please select a document from All Files to share");
  };

  const handleViewDocument = (document: FileMetadata) => {
    // Navigate to document viewer or details page
    window.location.href = `/modules/documents/file/${document.id}`;
  };

  const handleManageShares = (document: FileMetadata) => {
    setSelectedFile(document);
    setShowShareDialog(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Shared Documents</h1>
        <p className="text-muted-foreground">
          Files shared with you by other users and files you've shared
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Shared with Me</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sharedWithMe.length}</div>
            <p className="text-xs text-muted-foreground">
              {sharedWithMe.length === 0 ? "No documents shared with you" :
               `From ${new Set(sharedWithMe.map(doc => doc.sharedBy)).size} collaborators`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Shared by Me</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sharedByMe.length}</div>
            <p className="text-xs text-muted-foreground">
              {sharedByMe.length === 0 ? "You haven't shared any documents" :
               `With ${new Set(sharedByMe.flatMap(doc => doc.sharedWith?.map(user => user.id) || [])).size} collaborators`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sharedWithMe.filter(doc =>
                doc.updatedAt && new Date(doc.updatedAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">Updates in the last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search shared documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleShareDocument}>
          <Users className="mr-2 h-4 w-4" />
          Share New Document
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading shared documents...</span>
        </div>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Shared with Me</CardTitle>
              <CardDescription>
                Documents shared with you by other users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {filteredSharedWithMe.length > 0 ? (
                  filteredSharedWithMe.map((document) => (
                    <div key={document.id} className="py-4 flex items-center gap-4">
                      {getFileIcon(document.type)}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{document.name}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getPermissionColor(document.permissionLevel || 'view')}`}>
                            {document.permissionLevel || 'view'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Avatar className="h-4 w-4">
                              <AvatarFallback className="text-[10px]">
                                {document.sharedBy?.substring(0, 2).toUpperCase() || 'UN'}
                              </AvatarFallback>
                            </Avatar>
                            <span>Shared by {document.sharedBy || 'Unknown'}</span>
                          </div>
                          <span className="opacity-50">•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatDate(document.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDocument(document)}
                      >
                        View
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-muted-foreground">
                    {searchTerm ? "No shared documents found matching your search." : "No documents have been shared with you yet."}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shared by Me</CardTitle>
              <CardDescription>
                Documents you've shared with others
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {filteredSharedByMe.length > 0 ? (
                  filteredSharedByMe.map((document) => (
                    <div key={`shared-by-me-${document.id}`} className="py-4 flex items-center gap-4">
                      {getFileIcon(document.type)}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{document.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <span>{document.path || 'Root'}</span>
                          <span className="opacity-50">•</span>
                          <span>{documentService.formatFileSize(document.size || 0)}</span>
                          <span className="opacity-50">•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Shared {formatDate(document.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {document.sharedWith?.slice(0, 3).map((user, index) => (
                            <Avatar key={index} className="h-6 w-6 border-2 border-background">
                              <AvatarFallback>{user.avatar}</AvatarFallback>
                            </Avatar>
                          ))}
                          {document.sharedWith && document.sharedWith.length > 3 && (
                            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                              +{document.sharedWith.length - 3}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleManageShares(document)}
                        >
                          Manage
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-muted-foreground">
                    {searchTerm ? "No shared documents found matching your search." : "You haven't shared any documents yet."}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {showShareDialog && selectedFile && (
        <ShareDocumentDialog
          file={selectedFile}
          open={showShareDialog}
          onOpenChange={setShowShareDialog}
        />
      )}
    </div>
  );
};

export default Shared;
