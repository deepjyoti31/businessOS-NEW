
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoreHorizontal, Plus, Search } from "lucide-react";

const MarketingCampaigns = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Mock campaign data
  const campaigns = [
    {
      id: "CAMP-001",
      name: "Summer Promotion",
      type: "Email",
      status: "Active",
      progress: 65,
      leads: 124,
      budget: 5000,
      spent: 3250,
      startDate: "2025-04-01",
      endDate: "2025-06-30",
    },
    {
      id: "CAMP-002",
      name: "Product Launch Webinar",
      type: "Event",
      status: "Active",
      progress: 40,
      leads: 86,
      budget: 8000,
      spent: 3200,
      startDate: "2025-05-10",
      endDate: "2025-05-10",
    },
    {
      id: "CAMP-003",
      name: "Google Search Campaign",
      type: "PPC",
      status: "Active",
      progress: 72,
      leads: 138,
      budget: 12000,
      spent: 8640,
      startDate: "2025-03-15",
      endDate: "2025-06-15",
    },
    {
      id: "CAMP-004",
      name: "Industry Conference Sponsorship",
      type: "Event",
      status: "Planned",
      progress: 0,
      leads: 0,
      budget: 15000,
      spent: 0,
      startDate: "2025-07-12",
      endDate: "2025-07-14",
    },
    {
      id: "CAMP-005",
      name: "LinkedIn Lead Generation",
      type: "Social",
      status: "Active",
      progress: 45,
      leads: 67,
      budget: 6000,
      spent: 2700,
      startDate: "2025-04-15",
      endDate: "2025-07-15",
    },
    {
      id: "CAMP-006",
      name: "Spring Content Series",
      type: "Content",
      status: "Completed",
      progress: 100,
      leads: 152,
      budget: 4500,
      spent: 4500,
      startDate: "2025-02-01",
      endDate: "2025-04-15",
    },
  ];

  // Filter campaigns based on search term and status filter
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = 
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      campaign.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-50 text-green-700";
      case "planned":
        return "bg-blue-50 text-blue-700";
      case "completed":
        return "bg-gray-50 text-gray-700";
      case "paused":
        return "bg-amber-50 text-amber-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  // Calculate totals
  const totalBudget = campaigns.reduce((sum, campaign) => sum + campaign.budget, 0);
  const totalSpent = campaigns.reduce((sum, campaign) => sum + campaign.spent, 0);
  const totalLeads = campaigns.reduce((sum, campaign) => sum + campaign.leads, 0);
  const activeCampaigns = campaigns.filter(c => c.status === "Active").length;

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Marketing Campaigns</h1>
        <p className="text-muted-foreground">
          Manage and track your marketing campaigns
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBudget)}</div>
            <p className="text-xs text-muted-foreground">For all campaigns</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Budget Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSpent)}</div>
            <p className="text-xs text-muted-foreground">{Math.round((totalSpent / totalBudget) * 100)}% of total budget</p>
            <Progress value={(totalSpent / totalBudget) * 100} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Leads Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              {totalSpent > 0 ? `${formatCurrency(totalSpent / totalLeads)} per lead` : "No spend yet"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCampaigns}</div>
            <p className="text-xs text-muted-foreground">Of {campaigns.length} total campaigns</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Leads</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Timeline</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampaigns.length > 0 ? (
                filteredCampaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{campaign.name}</div>
                        <div className="text-xs text-muted-foreground">{campaign.id}</div>
                      </div>
                    </TableCell>
                    <TableCell>{campaign.type}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeClass(campaign.status)} variant="outline">
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={campaign.progress} className="h-2 w-16" />
                        <span className="text-xs text-muted-foreground">{campaign.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{campaign.leads}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{formatCurrency(campaign.spent)} / {formatCurrency(campaign.budget)}</div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round((campaign.spent / campaign.budget) * 100)}% spent
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{campaign.startDate}</div>
                        <div className="text-xs text-muted-foreground">to {campaign.endDate}</div>
                      </div>
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
                          <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          {campaign.status === "Active" ? (
                            <DropdownMenuItem>Pause Campaign</DropdownMenuItem>
                          ) : campaign.status === "Paused" ? (
                            <DropdownMenuItem>Resume Campaign</DropdownMenuItem>
                          ) : null}
                          <DropdownMenuItem className="text-red-600">Delete Campaign</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                    No campaigns found matching your search.
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

export default MarketingCampaigns;
