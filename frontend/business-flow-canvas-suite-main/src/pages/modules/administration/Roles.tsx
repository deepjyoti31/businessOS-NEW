
import { useState } from "react";
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
import { Shield, Search, Plus, MoreHorizontal, Sparkles, Users } from "lucide-react";

const AdminRoles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock roles data
  const roles = [
    {
      id: "1",
      name: "Administrator",
      description: "Full access to all system features",
      users: 2,
      permissions: 24,
      createdAt: "2023-01-15",
    },
    {
      id: "2",
      name: "Manager",
      description: "Access to manage users and projects",
      users: 3,
      permissions: 18,
      createdAt: "2023-01-20",
    },
    {
      id: "3",
      name: "User",
      description: "Basic system access",
      users: 12,
      permissions: 8,
      createdAt: "2023-01-25",
    },
    {
      id: "4",
      name: "Viewer",
      description: "Read-only access to reports and dashboards",
      users: 5,
      permissions: 5,
      createdAt: "2023-02-10",
    },
    {
      id: "5",
      name: "Guest",
      description: "Limited temporary access",
      users: 1,
      permissions: 3,
      createdAt: "2023-03-05",
    },
  ];

  // Filter roles based on search term
  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <Button variant="default" className="flex items-center">
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
              <p className="text-2xl font-bold">{roles.reduce((acc, role) => acc + role.users, 0)}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Permission Categories</p>
              <p className="text-2xl font-bold">8</p>
            </div>
            <Shield className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Custom Roles</p>
              <p className="text-2xl font-bold">2</p>
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
              <TableHead>Users</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRoles.length > 0 ? (
              filteredRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      {role.name}
                      {role.name === "Administrator" && (
                        <Badge className="ml-2 bg-purple-100 text-purple-800 hover:bg-purple-100">
                          System
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>{role.users}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {role.permissions}
                    </Badge>
                  </TableCell>
                  <TableCell>{role.createdAt}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Role</DropdownMenuItem>
                        <DropdownMenuItem>Manage Permissions</DropdownMenuItem>
                        <DropdownMenuItem>View Users</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Delete Role
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
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
    </div>
  );
};

export default AdminRoles;
