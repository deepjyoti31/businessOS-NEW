import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Shield } from "lucide-react";
import { toast } from "sonner";
import RoleService, { Role, RoleUpdate } from "@/services/RoleService";

interface EditRoleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  roleId: string;
  onUpdateRole: (roleId: string, roleData: RoleUpdate) => Promise<void>;
}

const EditRoleDialog = ({ isOpen, onClose, roleId, onUpdateRole }: EditRoleDialogProps) => {
  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameError, setNameError] = useState("");

  // Fetch role data
  useEffect(() => {
    const fetchRole = async () => {
      try {
        setIsLoading(true);
        const roleData = await RoleService.getRoleById(roleId);
        setRole(roleData);
        setName(roleData.name);
        setDescription(roleData.description || "");
      } catch (error) {
        console.error("Error fetching role:", error);
        toast.error("Failed to load role details");
        onClose();
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && roleId) {
      // Add a small delay to prevent UI jank when opening the dialog
      const timer = setTimeout(() => {
        fetchRole();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, roleId, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!name.trim()) {
      setNameError("Role name is required");
      return;
    }

    setIsSubmitting(true);

    try {
      await onUpdateRole(roleId, {
        name: name.trim(),
        description: description.trim() || undefined
      });
    } catch (error) {
      console.error("Error in form submission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Edit Role
          </DialogTitle>
          <DialogDescription>
            Update role details
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Loading role details...</span>
          </div>
        ) : role ? (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-right">
                Role Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameError("");
                }}
                placeholder="e.g., Project Manager"
                className={nameError ? "border-red-500" : ""}
                disabled={role.is_system}
              />
              {nameError && (
                <p className="text-sm text-red-500">{nameError}</p>
              )}
              {role.is_system && (
                <p className="text-sm text-muted-foreground">System role names cannot be changed</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the role's purpose and responsibilities"
                rows={3}
              />
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            Role not found or could not be loaded.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditRoleDialog;
