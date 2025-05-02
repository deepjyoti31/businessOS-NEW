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
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Shield, Search, Check } from "lucide-react";
import { toast } from "sonner";
import RoleService, { Role, RolePermission } from "@/services/RoleService";
import PermissionService, { Permission } from "@/services/PermissionService";

interface ManagePermissionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  roleId: string;
}

const ManagePermissionsDialog = ({ isOpen, onClose, roleId }: ManagePermissionsDialogProps) => {
  const [role, setRole] = useState<Role | null>(null);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [permissionCategories, setPermissionCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, boolean>>({});

  // Fetch role and permission data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch all data in parallel
        const [roleData, rolePermsData, allPermsData] = await Promise.all([
          RoleService.getRoleById(roleId),
          RoleService.getRolePermissions(roleId),
          PermissionService.getAllPermissions()
        ]);

        setRole(roleData);
        setRolePermissions(rolePermsData);
        setAllPermissions(allPermsData);

        // Create a map of permission IDs that are assigned to the role
        const permissionMap: Record<string, boolean> = {};
        rolePermsData.forEach(perm => {
          permissionMap[perm.permission_id] = true;
        });
        setSelectedPermissions(permissionMap);

        // Extract unique categories
        const categories = Array.from(new Set(allPermsData.map(p => p.category)));
        setPermissionCategories(categories);

      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load role and permission data");
        onClose();
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && roleId) {
      fetchData();
    }
  }, [isOpen, roleId, onClose]);

  // Handle permission selection
  const togglePermission = async (permissionId: string, isChecked: boolean) => {
    try {
      setIsSaving(true);

      if (isChecked) {
        // Assign permission to role
        await RoleService.assignPermissionToRole(roleId, permissionId);
        toast.success("Permission assigned successfully");
      } else {
        // Remove permission from role
        await RoleService.removePermissionFromRole(roleId, permissionId);
        toast.success("Permission removed successfully");
      }

      // Update the selected permissions state
      setSelectedPermissions(prev => ({
        ...prev,
        [permissionId]: isChecked
      }));

    } catch (error) {
      console.error("Error updating permission:", error);
      toast.error("Failed to update permission");
    } finally {
      setIsSaving(false);
    }
  };

  // Filter permissions based on search term and active category
  const filteredPermissions = allPermissions.filter(permission => {
    const matchesSearch =
      permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (permission.description || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = activeCategory === "all" || permission.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Manage Permissions
          </DialogTitle>
          <DialogDescription>
            {role ? `Configure permissions for the "${role.name}" role` : "Loading role details..."}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Loading permissions...</span>
          </div>
        ) : (
          <div className="flex flex-col space-y-4 overflow-hidden">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search permissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            {/* Tabs for categories */}
            <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="mb-2 flex flex-wrap h-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                {permissionCategories.map(category => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value={activeCategory} className="mt-0 overflow-y-auto max-h-[50vh]">
                <div className="space-y-4">
                  {filteredPermissions.length > 0 ? (
                    filteredPermissions.map(permission => (
                      <div key={permission.id} className="flex items-start space-x-3 p-3 rounded-md border">
                        <Checkbox
                          id={`permission-${permission.id}`}
                          checked={!!selectedPermissions[permission.id]}
                          onCheckedChange={(checked) => togglePermission(permission.id, checked === true)}
                          disabled={isSaving}
                        />
                        <div className="space-y-1">
                          <Label
                            htmlFor={`permission-${permission.id}`}
                            className="font-medium cursor-pointer"
                          >
                            {permission.name}
                          </Label>
                          {permission.description && (
                            <p className="text-sm text-muted-foreground">
                              {permission.description}
                            </p>
                          )}
                          <div className="text-xs text-muted-foreground">
                            Category: {permission.category}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No permissions found matching your criteria.
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6">
              <Button onClick={onClose}>
                Done
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ManagePermissionsDialog;
