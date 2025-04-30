
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, Search } from "lucide-react";

const SalesDeals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock deals data
  const deals = [
    {
      id: "DEAL-001",
      name: "Enterprise Software Subscription",
      company: "Acme Corp",
      value: 75000,
      stage: "Proposal",
      progress: 60,
      owner: "Alex Johnson",
      closeDate: "2025-05-15",
    },
    {
      id: "DEAL-002",
      name: "Consulting Services Package",
      company: "TechGrowth Inc",
      value: 45000,
      stage: "Negotiation",
      progress: 80,
      owner: "Michelle Smith",
      closeDate: "2025-05-02",
    },
    {
      id: "DEAL-003",
      name: "Annual Maintenance Contract",
      company: "Summit Solutions",
      value: 28000,
      stage: "Discovery",
      progress: 30,
      owner: "David Wilson",
      closeDate: "2025-06-10",
    },
    {
      id: "DEAL-004",
      name: "Product Expansion",
      company: "Global Innovations",
      value: 120000,
      stage: "Closed Won",
      progress: 100,
      owner: "Sarah Chen",
      closeDate: "2025-04-22",
    },
    {
      id: "DEAL-005",
      name: "Software Integration Project",
      company: "Bright Ideas LLC",
      value: 35000,
      stage: "Qualification",
      progress: 20,
      owner: "James Rodriguez",
      closeDate: "2025-06-30",
    },
  ];

  // Filter deals based on search term
  const filteredDeals = deals.filter((deal) =>
    deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total pipeline value
  const totalPipelineValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  
  // Calculate weighted pipeline (based on progress)
  const weightedPipelineValue = deals.reduce(
    (sum, deal) => sum + (deal.value * deal.progress / 100), 
    0
  );

  // Get stage badge class
  const getStageBadgeClass = (stage: string) => {
    switch (stage.toLowerCase()) {
      case "qualification":
        return "bg-blue-50 text-blue-700";
      case "discovery":
        return "bg-purple-50 text-purple-700";
      case "proposal":
        return "bg-amber-50 text-amber-700";
      case "negotiation":
        return "bg-orange-50 text-orange-700";
      case "closed won":
        return "bg-green-50 text-green-700";
      case "closed lost":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

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
        <h1 className="text-2xl font-semibold mb-1">Sales Deals</h1>
        <p className="text-muted-foreground">
          Manage and track your sales opportunities
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search deals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Deal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPipelineValue)}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Weighted Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(weightedPipelineValue)}</div>
            <p className="text-xs text-muted-foreground">Based on deal progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deals.length}</div>
            <p className="text-xs text-muted-foreground">+3 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Deal Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPipelineValue / deals.length)}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Deal</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Close Date</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeals.length > 0 ? (
                filteredDeals.map((deal) => (
                  <TableRow key={deal.id}>
                    <TableCell className="font-medium">{deal.name}</TableCell>
                    <TableCell>{deal.company}</TableCell>
                    <TableCell>{formatCurrency(deal.value)}</TableCell>
                    <TableCell>{deal.owner}</TableCell>
                    <TableCell>{deal.closeDate}</TableCell>
                    <TableCell>
                      <Badge className={getStageBadgeClass(deal.stage)} variant="outline">
                        {deal.stage}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={deal.progress} className="h-2" />
                        <span className="text-xs text-muted-foreground w-8">{deal.progress}%</span>
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
                          <DropdownMenuItem>Edit Deal</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Advance Stage</DropdownMenuItem>
                          <DropdownMenuItem className="text-green-600">Mark as Won</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Mark as Lost</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                    No deals found matching your search.
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

export default SalesDeals;
