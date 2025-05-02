import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FileMetadata } from "@/services/supabaseStorageService";
import { documentService } from "@/services/documentServiceInstances";
import { DocumentVersionWithUser } from "@/models/documentSharing";
import { toast } from "sonner";
import { Loader2, History, RotateCcw, Clock, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DocumentVersionHistoryProps {
  fileId: string;
}

export function DocumentVersionHistory({ fileId }: DocumentVersionHistoryProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [versions, setVersions] = useState<DocumentVersionWithUser[]>([]);
  const [isRestoring, setIsRestoring] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<DocumentVersionWithUser | null>(null);

  // Load document versions
  useEffect(() => {
    const loadVersions = async () => {
      try {
        setIsLoading(true);
        const versionsData = await documentService.getDocumentVersions(fileId);
        setVersions(versionsData);
      } catch (error) {
        console.error("Error loading versions:", error);
        toast.error("Failed to load version history");
      } finally {
        setIsLoading(false);
      }
    };

    loadVersions();
  }, [fileId]);

  // Format date to relative time
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Unknown date";
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return dateString;
    }
  };

  const handleRestoreVersion = async () => {
    if (!selectedVersion) return;

    try {
      setIsRestoring(selectedVersion.id);
      const success = await documentService.restoreVersion(selectedVersion.id);

      if (success) {
        toast.success(`Document restored to version ${selectedVersion.version_number}`);
        setShowConfirmDialog(false);

        // Reload versions after a short delay
        setTimeout(async () => {
          const versionsData = await documentService.getDocumentVersions(fileId);
          setVersions(versionsData);
        }, 1000);
      } else {
        toast.error("Failed to restore version");
      }
    } catch (error) {
      console.error("Error restoring version:", error);
      toast.error("Failed to restore version");
    } finally {
      setIsRestoring(null);
    }
  };

  const confirmRestore = (version: DocumentVersionWithUser) => {
    setSelectedVersion(version);
    setShowConfirmDialog(true);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Version History</CardTitle>
            <CardDescription>
              View and restore previous versions of this document
            </CardDescription>
          </div>
          <History className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading version history...</span>
          </div>
        ) : versions.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">
            No version history available for this document.
          </div>
        ) : (
          <div className="space-y-4">
            {versions.map((version) => (
              <div
                key={version.id}
                className="flex items-center justify-between border rounded-md p-4"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-muted rounded-md p-2">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">
                      Version {version.version_number}
                      {version.version_number === versions[versions.length - 1].version_number && (
                        <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          Original
                        </span>
                      )}
                      {version.version_number === versions[0].version_number && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {version.comment || "No comment provided"}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                      <div className="flex items-center gap-1">
                        <Avatar className="h-4 w-4">
                          <AvatarFallback className="text-[10px]">
                            {version.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>{version.user.name}</span>
                      </div>
                      <span className="opacity-50">•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(version.created_at)}</span>
                      </div>
                      {version.size && (
                        <>
                          <span className="opacity-50">•</span>
                          <span>{documentService.formatFileSize(version.size)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {version.version_number !== versions[0].version_number && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => confirmRestore(version)}
                    disabled={!!isRestoring}
                  >
                    {isRestoring === version.id ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <RotateCcw className="h-4 w-4 mr-2" />
                    )}
                    Restore
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore Version</DialogTitle>
            <DialogDescription>
              Are you sure you want to restore the document to version {selectedVersion?.version_number}?
              This will create a new version with the current state before restoring.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRestoreVersion} disabled={!!isRestoring}>
              {isRestoring ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Restoring...
                </>
              ) : (
                <>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restore
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
