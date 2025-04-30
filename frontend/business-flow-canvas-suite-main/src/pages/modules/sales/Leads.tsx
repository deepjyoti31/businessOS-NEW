
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, Search } from "lucide-react";

const SalesLeads = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock lead data
  const leads = [
    {
      id: "LEAD-001",
      name: "Sarah Johnson",
      company: "Acme Corp",
      email: "sarah.johnson@acmecorp.com",
      phone: "+1 (555) 123-4567",
      status: "New",
      source: "Website",
      date: "2025-04-15",
    },
    {
      id: "LEAD-002",
      name: "Robert Chen",
      company: "TechGrowth Inc",
      email: "robert.chen@techgrowth.com",
      phone: "+1 (555) 234-5678",
      status: "Contacted",
      source: "Referral",
      date: "2025-04-12",
    },
    {
      id: "LEAD-003",
      name: "Emily Davis",
      company: "Summit Solutions",
      email: "emily.davis@summitsolutions.com",
      phone: "+1 (555) 345-6789",
      status: "Qualified",
      source: "LinkedIn",
      date: "2025-04-10",
    },
    {
      id: "LEAD-004",
      name: "Michael Rodriguez",
      company: "Global Innovations",
      email: "michael.rodriguez@globalinnovations.com",
      phone: "+1 (555) 456-7890",
      status: "Nurturing",
      source: "Trade Show",
      date: "2025-04-07",
    },
    {
      id: "LEAD-005",
      name: "Jessica Kim",
      company: "Bright Ideas LLC",
      email: "jessica.kim@brightideas.com",
      phone: "+1 (555) 567-8901",
      status: "New",
      source: "Social Media",
      date: "2025-04-03",
    },
  ];

  // Filter leads based on search term
  const filteredLeads = leads.filter((lead) =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "new":
        return "bg-blue-50 text-blue-700";
      case "contacted":
        return "bg-purple-50 text-purple-700";
      case "qualified":
        return "bg-green-50 text-green-700";
      case "nurturing":
        return "bg-amber-50 text-amber-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Sales Leads</h1>
        <p className="text-muted-foreground">
          Manage and track potential customer leads
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Lead
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+8 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">+2 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Qualification Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32%</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.4h</div>
            <p className="text-xs text-muted-foreground">-0.5h from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.company}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{lead.email}</div>
                        <div className="text-muted-foreground">{lead.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>{lead.source}</TableCell>
                    <TableCell>{lead.date}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeClass(lead.status)} variant="outline">
                        {lead.status}
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
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Lead</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Convert to Customer</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Delete Lead</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No leads found matching your search.
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

export default SalesLeads;
