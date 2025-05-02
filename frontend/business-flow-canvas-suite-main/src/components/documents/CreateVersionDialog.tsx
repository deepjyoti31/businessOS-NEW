import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileMetadata } from "@/services/supabaseStorageService";
import { documentService } from "@/services/documentServiceInstances";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

interface CreateVersionDialogProps {
  file: FileMetadata;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVersionCreated?: () => void;
}

export function CreateVersionDialog({
  file,
  open,
  onOpenChange,
  onVersionCreated
}: CreateVersionDialogProps) {
  const [comment, setComment] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateVersion = async () => {
    try {
      setIsCreating(true);

      const version = await documentService.createVersion(
        file.id,
        file.storagePath,
        file.size,
        comment || "Manual version created"
      );

      if (version) {
        toast.success("New version created successfully");
        onOpenChange(false);
        setComment("");

        // Call the callback if provided
        if (onVersionCreated) {
          onVersionCreated();
        }
      } else {
        toast.error("Failed to create version");
      }
    } catch (error) {
      console.error("Error creating version:", error);
      toast.error("Failed to create version");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Version</DialogTitle>
          <DialogDescription>
            Create a new version of "{file.name}" to track changes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="comment">Version Comment (Optional)</Label>
            <Textarea
              id="comment"
              placeholder="Describe the changes in this version"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateVersion} disabled={isCreating}>
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Version
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
