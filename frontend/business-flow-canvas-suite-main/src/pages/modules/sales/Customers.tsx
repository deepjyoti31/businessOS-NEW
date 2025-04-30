
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, Plus, Search, UserPlus } from "lucide-react";

const SalesCustomers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock customer data
  const customers = [
    {
      id: "CUST-001",
      name: "Acme Corporation",
      industry: "Technology",
      location: "New York, NY",
      contact: {
        name: "John Smith",
        email: "john.smith@acme.com",
        phone: "+1 (555) 123-4567"
      },
      totalSpent: 125000,
      status: "Active",
      lastPurchase: "2025-04-05",
    },
    {
      id: "CUST-002",
      name: "Global Industries Ltd",
      industry: "Manufacturing",
      location: "Chicago, IL",
      contact: {
        name: "Sarah Johnson",
        email: "sarah.j@globalindustries.com",
        phone: "+1 (555) 234-5678"
      },
      totalSpent: 287500,
      status: "Active",
      lastPurchase: "2025-03-22",
    },
    {
      id: "CUST-003",
      name: "Innovate Solutions",
      industry: "Consulting",
      location: "San Francisco, CA",
      contact: {
        name: "Michael Chen",
        email: "m.chen@innovatesolutions.com",
        phone: "+1 (555) 345-6789"
      },
      totalSpent: 76000,
      status: "Inactive",
      lastPurchase: "2024-11-18",
    },
    {
      id: "CUST-004",
      name: "TechVision Inc",
      industry: "Technology",
      location: "Austin, TX",
      contact: {
        name: "Emily Davis",
        email: "emily.davis@techvision.com",
        phone: "+1 (555) 456-7890"
      },
      totalSpent: 195000,
      status: "Active",
      lastPurchase: "2025-04-10",
    },
    {
      id: "CUST-005",
      name: "Summit Group",
      industry: "Finance",
      location: "Boston, MA",
      contact: {
        name: "Robert Wilson",
        email: "r.wilson@summitgroup.com",
        phone: "+1 (555) 567-8901"
      },
      totalSpent: 312000,
      status: "Active",
      lastPurchase: "2025-03-30",
    },
  ];

  // Filter customers based on search term
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    return status.toLowerCase() === "active" 
      ? "bg-green-50 text-green-700"
      : "bg-gray-50 text-gray-700";
  };

  // Get customer initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Calculate total metrics
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === "Active").length;
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);
  const avgCustomerValue = totalRevenue / totalCustomers;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Customers</h1>
        <p className="text-muted-foreground">
          Manage your customer relationships and accounts
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">+3 this quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCustomers}</div>
            <p className="text-xs text-muted-foreground">{Math.round((activeCustomers / totalCustomers) * 100)}% of total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">+8.5% from last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Customer Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(avgCustomerValue)}</div>
            <p className="text-xs text-muted-foreground">+12% from last year</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Purchase</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{customer.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{customer.industry}</TableCell>
                    <TableCell>{customer.location}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{customer.contact.name}</div>
                        <div className="text-muted-foreground">{customer.contact.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(customer.totalSpent)}</TableCell>
                    <TableCell>{customer.lastPurchase}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeClass(customer.status)} variant="outline">
                        {customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Edit Customer</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>View Orders</DropdownMenuItem>
                          <DropdownMenuItem>Add New Order</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                    No customers found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesCustomers;
