
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Input } from "@/components/ui/input";

// Mock data for charts and tables
const salesData = [
  { month: 'Jan', target: 150000, actual: 145000 },
  { month: 'Feb', target: 150000, actual: 138000 },
  { month: 'Mar', target: 150000, actual: 162000 },
  { month: 'Apr', target: 150000, actual: 175000 },
  { month: 'May', target: 150000, actual: 180000 },
  { month: 'Jun', target: 150000, actual: 195000 },
];

const pipelineData = [
  { name: 'Qualification', value: 150000 },
  { name: 'Discovery', value: 240000 },
  { name: 'Proposal', value: 320000 },
  { name: 'Negotiation', value: 210000 },
  { name: 'Closing', value: 180000 },
];

const customerGrowthData = [
  { month: 'Jan', customers: 120 },
  { month: 'Feb', customers: 132 },
  { month: 'Mar', customers: 138 },
  { month: 'Apr', customers: 145 },
  { month: 'May', customers: 153 },
  { month: 'Jun', customers: 160 },
];

const recentDeals = [
  { id: "DEAL-001", name: "Enterprise Software Subscription", company: "Acme Corp", value: 75000, stage: "Proposal", date: "2025-04-20" },
  { id: "DEAL-002", name: "Consulting Services Package", company: "TechGrowth Inc", value: 45000, stage: "Negotiation", date: "2025-04-18" },
  { id: "DEAL-003", name: "Annual Maintenance Contract", company: "Summit Solutions", value: 28000, stage: "Discovery", date: "2025-04-15" },
  { id: "DEAL-004", name: "Product Expansion", company: "Global Innovations", value: 120000, stage: "Closed Won", date: "2025-04-12" },
];

const topSalesReps = [
  { name: "Alex Johnson", deals: 24, value: 425000, target: 500000 },
  { name: "Sarah Chen", deals: 21, value: 380000, target: 400000 },
  { name: "Michael Rodriguez", deals: 18, value: 310000, target: 350000 },
  { name: "Emily Davis", deals: 16, value: 290000, target: 300000 },
];

const SalesDashboard = () => {
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Get stage badge class
  const getStageBadgeClass = (stage: string) => {
    switch (stage.toLowerCase()) {
      case "proposal":
        return "bg-amber-50 text-amber-700";
      case "negotiation":
        return "bg-orange-50 text-orange-700";
      case "discovery":
        return "bg-purple-50 text-purple-700";
      case "closed won":
        return "bg-green-50 text-green-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  // Calculate total metrics
  const currentMonthSales = salesData[salesData.length - 1].actual;
  const previousMonthSales = salesData[salesData.length - 2].actual;
  const salesGrowth = ((currentMonthSales - previousMonthSales) / previousMonthSales) * 100;
  
  const totalPipeline = pipelineData.reduce((sum, item) => sum + item.value, 0);
  
  const currentCustomers = customerGrowthData[customerGrowthData.length - 1].customers;
  const previousCustomers = customerGrowthData[customerGrowthData.length - 2].customers;
  const customerGrowth = ((currentCustomers - previousCustomers) / previousCustomers) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Sales Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your sales performance and pipeline
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(currentMonthSales)}</div>
            <div className="flex items-center mt-1">
              <Badge className={salesGrowth >= 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"} variant="outline">
                {salesGrowth >= 0 ? "+" : ""}{salesGrowth.toFixed(1)}%
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">vs last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sales Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPipeline)}</div>
            <p className="text-xs text-muted-foreground">Across {pipelineData.length} stages</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42%</div>
            <p className="text-xs text-muted-foreground">+5% from last quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentCustomers}</div>
            <div className="flex items-center mt-1">
              <Badge className="bg-green-50 text-green-700" variant="outline">
                +{customerGrowth.toFixed(1)}%
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">vs last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Sales Performance</CardTitle>
            <CardDescription>Monthly targets vs. actual sales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salesData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Bar dataKey="target" fill="#e2e8f0" name="Target" />
                  <Bar dataKey="actual" fill="#4f46e5" name="Actual" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Customer Growth</CardTitle>
            <CardDescription>Monthly customer acquisition</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={customerGrowthData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="customers" 
                    stroke="#10b981"
                    strokeWidth={2} 
                    name="Customers" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Deals</CardTitle>
            <CardDescription>Latest sales activities and opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Deal</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Stage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentDeals.map((deal) => (
                  <TableRow key={deal.id}>
                    <TableCell>{deal.company}</TableCell>
                    <TableCell>{deal.name}</TableCell>
                    <TableCell>{formatCurrency(deal.value)}</TableCell>
                    <TableCell>
                      <Badge className={getStageBadgeClass(deal.stage)} variant="outline">
                        {deal.stage}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Top Sales Representatives</CardTitle>
            <CardDescription>Performance against targets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSalesReps.map((rep) => (
                <div key={rep.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{rep.name}</p>
                      <p className="text-xs text-muted-foreground">{rep.deals} deals - {formatCurrency(rep.value)}</p>
                    </div>
                    <p className="text-sm">{Math.round((rep.value / rep.target) * 100)}%</p>
                  </div>
                  <Progress value={(rep.value / rep.target) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Sales Pipeline</CardTitle>
            <CardDescription>Current value by pipeline stage</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Input 
              type="date" 
              className="w-40"
              defaultValue="2025-04-25"
            />
            <Button variant="outline">Filter</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={pipelineData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="value" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesDashboard;
