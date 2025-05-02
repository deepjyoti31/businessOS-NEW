
import { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Search, Plus, MoreHorizontal, Sparkles, Users, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import RoleService, { Role } from "@/services/RoleService";
import PermissionService from "@/services/PermissionService";
import CreateRoleDialog from "@/components/admin/CreateRoleDialog";
import EditRoleDialog from "@/components/admin/EditRoleDialog";
import ManagePermissionsDialog from "@/components/admin/ManagePermissionsDialog";
import ViewRoleUsersDialog from "@/components/admin/ViewRoleUsersDialog";
import DeleteRoleDialog from "@/components/admin/DeleteRoleDialog";

const AdminRoles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [permissionCategories, setPermissionCategories] = useState<string[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [customRoles, setCustomRoles] = useState(0);

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [isUsersDialogOpen, setIsUsersDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  // Fetch roles and categories in parallel
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch roles and categories in parallel
        const [rolesData, categoriesData] = await Promise.all([
          RoleService.getAllRoles(searchTerm),
          PermissionService.getPermissionCategories()
        ]);

        setRoles(rolesData);
        setPermissionCategories(categoriesData);

        // Count custom roles (non-system roles)
        const customRolesCount = rolesData.filter(role => !role.is_system).length;
        setCustomRoles(customRolesCount);

        // For the initial load, just set a placeholder for total users
        // We'll fetch the actual count separately to avoid blocking the UI
        setTotalUsers(0);
      } catch (error) {
        console.error("Error fetching roles:", error);
        toast.error("Failed to load roles");
      } finally {
        setLoading(false);
      }
    };

    // Debounce search to avoid too many API calls
    const timer = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Calculate total users from role data
  useEffect(() => {
    if (roles.length > 0) {
      // Calculate total users from the user_count property
      const count = roles.reduce((sum, role) => sum + (role.user_count || 0), 0);
      setTotalUsers(count);
    }
  }, [roles]);

  // Handle role operations
  const handleCreateRole = async (newRole: any) => {
    try {
      await RoleService.createRole(newRole);
      toast.success("Role created successfully");
      // Refresh the roles list
      const data = await RoleService.getAllRoles(searchTerm);
      setRoles(data);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating role:", error);
      toast.error("Failed to create role");
    }
  };

  const handleEditRole = async (roleId: string, roleData: any) => {
    try {
      await RoleService.updateRole(roleId, roleData);
      toast.success("Role updated successfully");
      // Refresh the roles list
      const data = await RoleService.getAllRoles(searchTerm);
      setRoles(data);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error(`Error updating role ${roleId}:`, error);
      toast.error("Failed to update role");
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      await RoleService.deleteRole(roleId);
      toast.success("Role deleted successfully");
      // Refresh the roles list
      const data = await RoleService.getAllRoles(searchTerm);
      setRoles(data);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error(`Error deleting role ${roleId}:`, error);
      toast.error("Failed to delete role");
    }
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return format(parseISO(dateString), "MMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold mb-1 flex items-center">
            <Shield className="mr-2 h-6 w-6" />
            Roles & Permissions
          </h1>
          <p className="text-muted-foreground">
            Create and manage roles with customized permissions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="default"
            className="flex items-center"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Role
          </Button>
          <Button variant="outline" className="flex items-center">
            <Sparkles className="mr-2 h-4 w-4" />
            AI Suggestions
          </Button>
        </div>
      </div>

      {/* Role stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Roles</p>
              <p className="text-2xl font-bold">{roles.length}</p>
            </div>
            <Shield className="h-8 w-8 text-purple-500" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Users Assigned</p>
              <p className="text-2xl font-bold">{totalUsers}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Permission Categories</p>
              <p className="text-2xl font-bold">{permissionCategories.length}</p>
            </div>
            <Shield className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Custom Roles</p>
              <p className="text-2xl font-bold">{customRoles}</p>
            </div>
            <Shield className="h-8 w-8 text-amber-500" />
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      {/* Roles table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Loading roles...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : roles.length > 0 ? (
              roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      {role.name}
                    </div>
                  </TableCell>
                  <TableCell>{role.description || "No description"}</TableCell>
                  <TableCell>
                    {role.is_system ? (
                      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                        System
                      </Badge>
                    ) : (
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                        Custom
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(role.created_at)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setSelectedRoleId(role.id);
                          setIsEditDialogOpen(true);
                        }}>
                          Edit Role
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedRoleId(role.id);
                          setIsPermissionsDialogOpen(true);
                        }}>
                          Manage Permissions
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedRoleId(role.id);
                          setIsUsersDialogOpen(true);
                        }}>
                          View Users
                        </DropdownMenuItem>
                        {!role.is_system && (
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setSelectedRoleId(role.id);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            Delete Role
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No roles found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* AI Recommendation */}
      <div className="bg-purple-50 border border-purple-200 rounded-md p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-purple-500 mt-1" />
          <div>
            <h3 className="font-medium">AI Permission Analysis</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Based on your organization's usage patterns, we recommend reviewing the "Manager" role permissions.
              Consider adding "Project Export" capabilities for improved workflow.
            </p>
            <div className="mt-3">
              <Button size="sm" variant="outline" className="border-purple-200 hover:bg-purple-100">
                Apply Suggestion
              </Button>
              <Button size="sm" variant="ghost" className="ml-2 text-purple-700 hover:bg-purple-100">
                View Details
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog components for role management */}
      {isCreateDialogOpen && (
        <CreateRoleDialog
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onCreateRole={handleCreateRole}
        />
      )}

      {isEditDialogOpen && selectedRoleId && (
        <EditRoleDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          roleId={selectedRoleId}
          onUpdateRole={handleEditRole}
        />
      )}

      {isPermissionsDialogOpen && selectedRoleId && (
        <ManagePermissionsDialog
          isOpen={isPermissionsDialogOpen}
          onClose={() => setIsPermissionsDialogOpen(false)}
          roleId={selectedRoleId}
        />
      )}

      {isUsersDialogOpen && selectedRoleId && (
        <ViewRoleUsersDialog
          isOpen={isUsersDialogOpen}
          onClose={() => setIsUsersDialogOpen(false)}
          roleId={selectedRoleId}
        />
      )}

      {isDeleteDialogOpen && selectedRoleId && (
        <DeleteRoleDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          roleId={selectedRoleId}
          onDeleteRole={handleDeleteRole}
        />
      )}
    </div>
  );
};

export default AdminRoles;
