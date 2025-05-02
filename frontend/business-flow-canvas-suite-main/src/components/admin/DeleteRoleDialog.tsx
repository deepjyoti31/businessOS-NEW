import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import RoleService from "@/services/RoleService";

interface DeleteRoleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  roleId: string;
  onDeleteRole: (roleId: string) => Promise<void>;
}

const DeleteRoleDialog = ({ isOpen, onClose, roleId, onDeleteRole }: DeleteRoleDialogProps) => {
  const [roleName, setRoleName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch role data to display the name
  useEffect(() => {
    const fetchRole = async () => {
      try {
        setIsLoading(true);
        const roleData = await RoleService.getRoleById(roleId);
        setRoleName(roleData.name);
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

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDeleteRole(roleId);
    } catch (error) {
      console.error("Error deleting role:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this role?</AlertDialogTitle>
          <AlertDialogDescription>
            {isLoading ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading role details...
              </div>
            ) : (
              <>
                You are about to delete the role <strong>"{roleName}"</strong>. This action cannot be undone.
                <br /><br />
                Users assigned to this role will lose the permissions associated with it.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isLoading || isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Deleting...
              </>
            ) : (
              "Delete Role"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteRoleDialog;
