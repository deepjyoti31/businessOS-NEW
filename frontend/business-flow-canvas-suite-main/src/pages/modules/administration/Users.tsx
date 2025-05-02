
import { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Users, Search, UserPlus, MoreHorizontal, Sparkles, Loader2 } from "lucide-react";
import UserService, { UserProfile } from "@/services/UserService";
import UserDetailDialog from "@/components/admin/UserDetailDialog";
import { toast } from "sonner";
import { format, formatDistanceToNow, parseISO } from "date-fns";

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await UserService.getAllUsers(searchTerm, statusFilter);
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    // Debounce search to avoid too many API calls
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter]);

  // Format the last active date
  const formatLastActive = (lastActiveDate?: string) => {
    if (!lastActiveDate) return "Never";

    try {
      const date = parseISO(lastActiveDate);
      const now = new Date();

      // If it's today, show the time
      if (date.toDateString() === now.toDateString()) {
        return `Today at ${format(date, "h:mm a")}`;
      }

      // If it's yesterday, show "Yesterday"
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      if (date.toDateString() === yesterday.toDateString()) {
        return `Yesterday at ${format(date, "h:mm a")}`;
      }

      // Otherwise, show relative time
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return lastActiveDate;
    }
  };

  // Handle user status change
  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      await UserService.updateUserStatus(userId, newStatus.toLowerCase());

      // Update the local state
      setUsers(users.map(user =>
        user.id === userId
          ? { ...user, status: newStatus.toLowerCase() }
          : user
      ));

      toast.success(`User status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status");
    }
  };

  // Handle bulk status change
  const handleBulkStatusChange = async (newStatus: string) => {
    if (selectedUsers.length === 0) {
      toast.warning("No users selected");
      return;
    }

    try {
      await UserService.bulkUpdateStatus(selectedUsers, newStatus.toLowerCase());

      // Update the local state
      setUsers(users.map(user =>
        selectedUsers.includes(user.id)
          ? { ...user, status: newStatus.toLowerCase() }
          : user
      ));

      // Clear selection
      setSelectedUsers([]);

      toast.success(`${selectedUsers.length} users updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating user status in bulk:", error);
      toast.error("Failed to update users");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold mb-1 flex items-center">
            <Users className="mr-2 h-6 w-6" />
            Users & Access Management
          </h1>
          <p className="text-muted-foreground">
            Manage users, assign roles, and control access permissions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="default" className="flex items-center">
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
          <Button variant="outline" className="flex items-center">
            <Sparkles className="mr-2 h-4 w-4" />
            Suggest Roles
          </Button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {statusFilter ? `Status: ${statusFilter}` : "Filter by Status"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter(undefined)}>
                All Users
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                Active Users
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>
                Inactive Users
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {selectedUsers.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Bulk Actions ({selectedUsers.length})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleBulkStatusChange("active")}>
                  Set Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkStatusChange("inactive")}>
                  Set Inactive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Users table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Loading users...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name || "Unnamed User"}</TableCell>
                  <TableCell>{user.email || "No email"}</TableCell>
                  <TableCell>{user.role || "User"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.status === "active" ? "default" : "secondary"}
                      className={`${
                        user.status === "active"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                      }`}
                    >
                      {user.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatLastActive(user.last_active)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setSelectedUserId(user.id);
                          setIsDetailDialogOpen(true);
                        }}>
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem>Reset Password</DropdownMenuItem>
                        <DropdownMenuItem>Change Role</DropdownMenuItem>
                        {user.status === "active" ? (
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleStatusChange(user.id, "inactive")}
                          >
                            Deactivate Account
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className="text-green-600"
                            onClick={() => handleStatusChange(user.id, "active")}
                          >
                            Activate Account
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No users found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* AI Assistant Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Sparkles className="h-5 w-5 text-blue-500 mr-3" />
          <div>
            <h3 className="font-medium">AI User Management Assistant</h3>
            <p className="text-sm text-muted-foreground">Get AI help with managing users and permissions</p>
          </div>
        </div>
        <Button variant="outline" className="border-blue-200 hover:bg-blue-100">Open Assistant</Button>
      </div>

      {/* User Detail Dialog */}
      <UserDetailDialog
        userId={selectedUserId}
        isOpen={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
        onUserUpdated={() => {
          // Refresh the user list
          const fetchUsers = async () => {
            try {
              setLoading(true);
              const data = await UserService.getAllUsers(searchTerm, statusFilter);
              setUsers(data);
            } catch (error) {
              console.error("Error fetching users:", error);
              toast.error("Failed to refresh user list");
            } finally {
              setLoading(false);
            }
          };

          fetchUsers();
        }}
      />
    </div>
  );
};

export default AdminUsers;
