import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Upload, File, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface UploadFileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[], currentFolder: string) => Promise<boolean | void>;
  currentFolder: string;
}

const UploadFileDialog = ({ isOpen, onClose, onUpload, currentFolder }: UploadFileDialogProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setFiles(prevFiles => [...prevFiles, ...fileArray]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to upload.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 5;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 200);

      // Upload files
      const result = await onUpload(files, currentFolder);

      // Complete progress and show success
      clearInterval(progressInterval);
      setProgress(100);

      // Only show success toast if the parent component didn't already show one
      if (result !== true) {
        toast({
          title: "Upload successful",
          description: `${files.length} file(s) uploaded successfully.`,
        });
      }

      // Reset and close dialog after a short delay
      setTimeout(() => {
        setFiles([]);
        setUploading(false);
        setProgress(0);
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Error uploading files:", error);

      toast({
        title: "Upload failed",
        description: "There was an error uploading your files. Please try again.",
        variant: "destructive",
      });

      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="file-upload">Select Files</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileChange}
                disabled={uploading}
                className="flex-1"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => document.getElementById("file-upload")?.click()}
                disabled={uploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                Browse
              </Button>
            </div>
          </div>

          {files.length > 0 && (
            <div className="border rounded-md p-3">
              <Label className="text-sm mb-2 block">Selected Files ({files.length})</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between text-sm bg-muted/50 p-2 rounded">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <File className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeFile(index)}
                      disabled={uploading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            Uploading to: {currentFolder || "Root"}
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadFileDialog;
