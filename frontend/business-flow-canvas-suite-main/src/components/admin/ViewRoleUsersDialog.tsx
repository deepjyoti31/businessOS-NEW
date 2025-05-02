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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Search, Shield, UserX, Users } from "lucide-react";
import { toast } from "sonner";
import RoleService, { Role, RoleUser } from "@/services/RoleService";
import UserService from "@/services/UserService";

interface ViewRoleUsersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  roleId: string;
}

const ViewRoleUsersDialog = ({ isOpen, onClose, roleId }: ViewRoleUsersDialogProps) => {
  const [role, setRole] = useState<Role | null>(null);
  const [users, setUsers] = useState<RoleUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRemoving, setIsRemoving] = useState(false);

  // Fetch role and users data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch role details and users in parallel
        const [roleData, usersData] = await Promise.all([
          RoleService.getRoleById(roleId),
          RoleService.getUsersWithRole(roleId)
        ]);

        setRole(roleData);
        setUsers(usersData);

      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load role users");
        onClose();
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && roleId) {
      fetchData();
    }
  }, [isOpen, roleId, onClose]);

  // Handle removing a user from the role
  const handleRemoveUser = async (userId: string) => {
    try {
      setIsRemoving(true);

      // Remove the role from the user
      await RoleService.removeRoleFromUser(roleId, userId);

      // Update the users list
      setUsers(users.filter(user => user.user_id !== userId));

      toast.success("User removed from role successfully");
    } catch (error) {
      console.error("Error removing user from role:", error);
      toast.error("Failed to remove user from role");
    } finally {
      setIsRemoving(false);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.user_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Users with {role?.name || "Role"} Role
          </DialogTitle>
          <DialogDescription>
            {role ? `Manage users assigned to the "${role.name}" role` : "Loading role details..."}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Loading users...</span>
          </div>
        ) : (
          <div className="flex flex-col space-y-4 overflow-hidden">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            {/* Users table */}
            <div className="overflow-y-auto max-h-[50vh] border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <TableRow key={user.user_id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src="" alt={user.user_name} />
                              <AvatarFallback>{getInitials(user.user_name)}</AvatarFallback>
                            </Avatar>
                            <div>{user.user_name}</div>
                          </div>
                        </TableCell>
                        <TableCell>{user.user_email}</TableCell>
                        <TableCell>
                          <Badge
                            variant={user.user_status === "active" ? "default" : "secondary"}
                            className={`${
                              user.user_status === "active"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                            }`}
                          >
                            {user.user_status === "active" ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveUser(user.user_id)}
                            disabled={isRemoving}
                            title="Remove from role"
                          >
                            <UserX className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                        {users.length === 0
                          ? "No users are assigned to this role."
                          : "No users found matching your search."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <DialogFooter className="mt-6">
              <Button onClick={onClose}>
                Close
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewRoleUsersDialog;
