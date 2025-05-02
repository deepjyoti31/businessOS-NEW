import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileMetadata } from "@/services/supabaseStorageService";
import { documentService } from "@/services/documentServiceInstances";
import { DocumentVersionHistory } from "@/components/documents/DocumentVersionHistory";
import { ShareDocumentDialog } from "@/components/documents/ShareDocumentDialog";
import { CreateVersionDialog } from "@/components/documents/CreateVersionDialog";
import { toast } from "sonner";
import {
  ArrowLeft,
  Download,
  Share,
  History,
  Save,
  Loader2,
  FileText,
  FileSpreadsheet,
  FileImage,
  File as FileIcon,
  Trash,
  Star,
  Clock
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const FileDetails = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const navigate = useNavigate();
  const [file, setFile] = useState<FileMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showCreateVersionDialog, setShowCreateVersionDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  // Load file details
  useEffect(() => {
    const loadFile = async () => {
      if (!fileId) return;

      try {
        setIsLoading(true);
        const fileData = await documentService.getFileById(fileId);

        if (!fileData) {
          toast.error("File not found");
          navigate("/modules/documents/all-files");
          return;
        }

        setFile(fileData);
      } catch (error) {
        console.error("Error loading file:", error);
        toast.error("Failed to load file details");
      } finally {
        setIsLoading(false);
      }
    };

    loadFile();
  }, [fileId, navigate]);

  // File type icon mapping
  const getFileIcon = (type: string) => {
    const fileType = type.toUpperCase();
    switch (fileType) {
      case 'APPLICATION/PDF':
      case 'PDF':
        return <FileText className="h-10 w-10 text-red-500" />;
      case 'APPLICATION/MSWORD':
      case 'APPLICATION/VND.OPENXMLFORMATS-OFFICEDOCUMENT.WORDPROCESSINGML.DOCUMENT':
      case 'DOCX':
      case 'DOC':
        return <FileText className="h-10 w-10 text-blue-500" />;
      case 'APPLICATION/VND.MS-EXCEL':
      case 'APPLICATION/VND.OPENXMLFORMATS-OFFICEDOCUMENT.SPREADSHEETML.SHEET':
      case 'XLSX':
      case 'XLS':
        return <FileSpreadsheet className="h-10 w-10 text-green-500" />;
      case 'IMAGE/JPEG':
      case 'IMAGE/PNG':
      case 'JPG':
      case 'PNG':
        return <FileImage className="h-10 w-10 text-purple-500" />;
      default:
        return <FileIcon className="h-10 w-10 text-gray-500" />;
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

  const handleDownload = async () => {
    if (!file) return;

    try {
      setIsDownloading(true);
      await documentService.downloadFile(file);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDelete = async () => {
    if (!file) return;

    if (!window.confirm(`Are you sure you want to delete "${file.name}"?`)) {
      return;
    }

    try {
      setIsDeleting(true);
      const success = await documentService.deleteFile(file);

      if (success) {
        toast.success("File deleted successfully");
        navigate("/modules/documents/all-files");
      } else {
        toast.error("Failed to delete file");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!file) return;

    try {
      setIsTogglingFavorite(true);
      const success = await documentService.toggleFavorite(file.id, !file.isFavorite);

      if (success) {
        setFile({
          ...file,
          isFavorite: !file.isFavorite
        });

        toast.success(file.isFavorite ? "Removed from favorites" : "Added to favorites");
      } else {
        toast.error("Failed to update favorite status");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorite status");
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading file details...</span>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="text-center py-12">
        <p>File not found</p>
        <Button
          variant="link"
          onClick={() => navigate("/modules/documents/all-files")}
          className="mt-4"
        >
          Back to All Files
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate("/modules/documents/all-files")}
          className="gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to All Files
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleToggleFavorite}
            disabled={isTogglingFavorite}
          >
            {isTogglingFavorite ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Star
                className={`h-4 w-4 mr-2 ${file.isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`}
              />
            )}
            {file.isFavorite ? "Favorited" : "Add to Favorites"}
          </Button>

          <Button
            variant="outline"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Download
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Trash className="h-4 w-4 mr-2" />
            )}
            Delete
          </Button>
        </div>
      </div>

      <div className="flex items-start gap-6">
        <div className="bg-muted rounded-md p-6 flex items-center justify-center">
          {getFileIcon(file.type)}
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold">{file.name}</h1>

          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Created {formatDate(file.createdAt)}</span>
            </div>
            {file.updatedAt && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Modified {formatDate(file.updatedAt)}</span>
              </div>
            )}
            <div>
              <span>{documentService.formatFileSize(file.size || 0)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Button onClick={() => setShowShareDialog(true)}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>

            <Button variant="outline" onClick={() => setShowCreateVersionDialog(true)}>
              <Save className="h-4 w-4 mr-2" />
              Create Version
            </Button>

            <Button
              variant="outline"
              onClick={() => setActiveTab("versions")}
            >
              <History className="h-4 w-4 mr-2" />
              Version History
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="versions">Version History</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">File Path</h3>
                  <p>{file.path || "/"}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">File Type</h3>
                  <p>{file.type}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">File Size</h3>
                  <p>{documentService.formatFileSize(file.size || 0)}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Created At</h3>
                  <p>{new Date(file.createdAt).toLocaleString()}</p>
                </div>

                {file.updatedAt && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Last Modified</h3>
                    <p>{new Date(file.updatedAt).toLocaleString()}</p>
                  </div>
                )}

                {file.lastAccessedAt && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Last Accessed</h3>
                    <p>{new Date(file.lastAccessedAt).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="versions" className="mt-6">
          <DocumentVersionHistory fileId={file.id} />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      {showShareDialog && (
        <ShareDocumentDialog
          file={file}
          open={showShareDialog}
          onOpenChange={setShowShareDialog}
        />
      )}

      {showCreateVersionDialog && (
        <CreateVersionDialog
          file={file}
          open={showCreateVersionDialog}
          onOpenChange={setShowCreateVersionDialog}
          onVersionCreated={() => setActiveTab("versions")}
        />
      )}
    </div>
  );
};

export default FileDetails;
