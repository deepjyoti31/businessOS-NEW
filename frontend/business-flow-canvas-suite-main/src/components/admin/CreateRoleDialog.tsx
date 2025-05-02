import { useState } from "react";
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
import { RoleCreate } from "@/services/RoleService";

interface CreateRoleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRole: (roleData: RoleCreate) => Promise<void>;
}

const CreateRoleDialog = ({ isOpen, onClose, onCreateRole }: CreateRoleDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameError, setNameError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!name.trim()) {
      setNameError("Role name is required");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onCreateRole({
        name: name.trim(),
        description: description.trim() || undefined
      });
      
      // Reset form
      setName("");
      setDescription("");
      setNameError("");
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
            Create New Role
          </DialogTitle>
          <DialogDescription>
            Create a new role with custom permissions
          </DialogDescription>
        </DialogHeader>
        
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
            />
            {nameError && (
              <p className="text-sm text-red-500">{nameError}</p>
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
                  Creating...
                </>
              ) : (
                "Create Role"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoleDialog;
