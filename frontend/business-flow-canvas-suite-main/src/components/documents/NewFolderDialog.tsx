import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FolderPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface NewFolderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFolder: (folderName: string, currentFolder: string) => Promise<boolean | void>;
  currentFolder: string;
}

const NewFolderDialog = ({ isOpen, onClose, onCreateFolder, currentFolder }: NewFolderDialogProps) => {
  const [folderName, setFolderName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      toast({
        title: "Folder name required",
        description: "Please enter a name for the folder.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      const result = await onCreateFolder(folderName.trim(), currentFolder);

      // Only show success toast if the parent component didn't already show one
      if (result !== true) {
        toast({
          title: "Folder created",
          description: `Folder "${folderName}" created successfully.`,
        });
      }

      // Reset and close dialog
      setFolderName("");
      setIsCreating(false);
      onClose();
    } catch (error) {
      console.error("Error creating folder:", error);

      toast({
        title: "Failed to create folder",
        description: "There was an error creating the folder. Please try again.",
        variant: "destructive",
      });

      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setFolderName("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="folder-name">Folder Name</Label>
            <div className="flex items-center gap-2">
              <FolderPlus className="h-5 w-5 text-muted-foreground" />
              <Input
                id="folder-name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Enter folder name"
                disabled={isCreating}
                className="flex-1"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isCreating) {
                    handleCreateFolder();
                  }
                }}
              />
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Creating folder in: {currentFolder || "Root"}
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateFolder}
            disabled={!folderName.trim() || isCreating}
          >
            {isCreating ? "Creating..." : "Create Folder"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewFolderDialog;
