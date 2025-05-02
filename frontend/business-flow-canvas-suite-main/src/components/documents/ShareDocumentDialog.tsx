import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FileMetadata } from "@/services/supabaseStorageService";
import { documentService } from "@/services/documentServiceInstances";
import { DocumentShareWithUser, PermissionLevel } from "@/models/documentSharing";
import { toast } from "sonner";
import { Loader2, X, Check, Mail } from "lucide-react";
import { supabase } from "@/config/supabaseClient";

interface ShareDocumentDialogProps {
  file: FileMetadata;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareDocumentDialog({ file, open, onOpenChange }: ShareDocumentDialogProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [shares, setShares] = useState<DocumentShareWithUser[]>([]);
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState<PermissionLevel>("view");
  const [isSharing, setIsSharing] = useState(false);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Load existing shares
  useEffect(() => {
    const loadShares = async () => {
      if (open && file) {
        try {
          setIsLoading(true);
          const sharesData = await documentService.getDocumentShares(file.id);
          setShares(sharesData);
        } catch (error) {
          console.error("Error loading shares:", error);
          toast.error("Failed to load shares");
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadShares();
  }, [file, open]);

  const handleShareDocument = async () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    try {
      setIsSharing(true);

      // Find the user by email
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (userError) {
        toast.error("User not found with this email address");
        return;
      }

      // Share the document
      const success = await documentService.shareDocument(
        file.id,
        userData.id,
        permission
      );

      if (success) {
        toast.success(`Document shared with ${email}`);

        // Reload shares
        const sharesData = await documentService.getDocumentShares(file.id);
        setShares(sharesData);

        // Clear form
        setEmail("");
      } else {
        toast.error("Failed to share document");
      }
    } catch (error) {
      console.error("Error sharing document:", error);
      toast.error("Failed to share document");
    } finally {
      setIsSharing(false);
    }
  };

  const handleUpdatePermission = async (shareId: string, newPermission: PermissionLevel) => {
    try {
      setIsUpdating(shareId);
      const success = await documentService.updateSharePermission(shareId, newPermission);

      if (success) {
        toast.success("Permission updated");

        // Update local state
        setShares(shares.map(share =>
          share.id === shareId
            ? { ...share, permission_level: newPermission }
            : share
        ));
      } else {
        toast.error("Failed to update permission");
      }
    } catch (error) {
      console.error("Error updating permission:", error);
      toast.error("Failed to update permission");
    } finally {
      setIsUpdating(null);
    }
  };

  const handleRemoveShare = async (shareId: string) => {
    try {
      setIsRemoving(shareId);
      const success = await documentService.removeShare(shareId);

      if (success) {
        toast.success("Share removed");

        // Update local state
        setShares(shares.filter(share => share.id !== shareId));
      } else {
        toast.error("Failed to remove share");
      }
    } catch (error) {
      console.error("Error removing share:", error);
      toast.error("Failed to remove share");
    } finally {
      setIsRemoving(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
          <DialogDescription>
            Share "{file.name}" with other users
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-end gap-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                placeholder="Enter email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="permission">Permission</Label>
              <Select value={permission} onValueChange={(value) => setPermission(value as PermissionLevel)}>
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="Permission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">View</SelectItem>
                  <SelectItem value="comment">Comment</SelectItem>
                  <SelectItem value="edit">Edit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleShareDocument}
              disabled={isSharing || !email}
              className="ml-auto"
            >
              {isSharing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Share"}
            </Button>
          </div>

          <div className="border rounded-md">
            <div className="px-4 py-3 border-b bg-muted/50">
              <h3 className="text-sm font-medium">Shared with</h3>
            </div>
            <div className="divide-y">
              {isLoading ? (
                <div className="flex justify-center items-center py-6">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">Loading shares...</span>
                </div>
              ) : shares.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  This document hasn't been shared with anyone yet.
                </div>
              ) : (
                shares.map((share) => (
                  <div key={share.id} className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {share.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{share.user.name}</p>
                        <p className="text-xs text-muted-foreground">{share.user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={share.permission_level}
                        onValueChange={(value) => handleUpdatePermission(share.id, value as PermissionLevel)}
                        disabled={!!isUpdating}
                      >
                        <SelectTrigger className="h-8 w-[100px]">
                          {isUpdating === share.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <SelectValue />
                          )}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="view">View</SelectItem>
                          <SelectItem value="comment">Comment</SelectItem>
                          <SelectItem value="edit">Edit</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveShare(share.id)}
                        disabled={!!isRemoving}
                      >
                        {isRemoving === share.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-start">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
