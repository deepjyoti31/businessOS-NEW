
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Sales = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock sales data
  const salesData = [
    { month: 'Jan', sales: 4000 },
    { month: 'Feb', sales: 3000 },
    { month: 'Mar', sales: 5000 },
    { month: 'Apr', sales: 2780 },
    { month: 'May', sales: 1890 },
    { month: 'Jun', sales: 2390 },
  ];

  // Mock deals data
  const deals = [
    {
      id: "DEAL-001",
      company: "Acme Corp",
      value: 25000,
      stage: "Proposal",
      probability: 60,
      owner: "John Doe",
      ownerAvatar: "JD",
      created: "2025-03-10",
      closingDate: "2025-04-15"
    },
    {
      id: "DEAL-002",
      company: "Globex Inc",
      value: 48000,
      stage: "Negotiation",
      probability: 80,
      owner: "Jane Smith",
      ownerAvatar: "JS",
      created: "2025-03-05",
      closingDate: "2025-04-20"
    },
    {
      id: "DEAL-003",
      company: "Stark Industries",
      value: 95000,
      stage: "Discovery",
      probability: 30,
      owner: "Michael Johnson",
      ownerAvatar: "MJ",
      created: "2025-03-18",
      closingDate: "2025-05-10"
    },
    {
      id: "DEAL-004",
      company: "Wayne Enterprises",
      value: 36500,
      stage: "Closed Won",
      probability: 100,
      owner: "Emily Brown",
      ownerAvatar: "EB",
      created: "2025-02-28",
      closingDate: "2025-03-25"
    },
    {
      id: "DEAL-005",
      company: "Umbrella Corp",
      value: 12800,
      stage: "Qualified",
      probability: 45,
      owner: "David Wilson",
      ownerAvatar: "DW",
      created: "2025-03-20",
      closingDate: "2025-04-30"
    },
  ];

  // Mock pipeline data
  const pipelineData = [
    { name: 'Discovery', value: 12 },
    { name: 'Qualified', value: 8 },
    { name: 'Proposal', value: 5 },
    { name: 'Negotiation', value: 3 },
    { name: 'Closed Won', value: 7 }
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Filter deals based on search term
  const filteredDeals = deals.filter((deal) =>
    deal.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.stage.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Sales</h1>
        <p className="text-muted-foreground">
          Manage your sales pipeline and customer relationships
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$217,300</div>
            <p className="text-xs text-muted-foreground">+8.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$384,500</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67.8%</div>
            <p className="text-xs text-muted-foreground">+5.4% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pipeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="deals">Deals</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Sales Pipeline</CardTitle>
                <CardDescription>
                  Current deals by pipeline stage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={pipelineData}
                      layout="vertical"
                      margin={{
                        top: 20,
                        right: 30,
                        left: 60,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Bar dataKey="value" fill="#4f46e5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Deals by Stage</CardTitle>
                <CardDescription>
                  Distribution of current deals
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="h-[200px] w-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pipelineData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name }) => name}
                      >
                        {pipelineData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Active Deals</h3>
            <Button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add New Deal
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {deals.slice(0, 3).map((deal) => (
              <Card key={deal.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{deal.company}</CardTitle>
                      <CardDescription>${deal.value.toLocaleString()}</CardDescription>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      deal.stage === 'Closed Won' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {deal.stage}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Probability:</span>
                      <span>{deal.probability}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Closing Date:</span>
                      <span>{deal.closingDate}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Owner:</span>
                      <div className="flex items-center gap-2">
                        <span>{deal.owner}</span>
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{deal.ownerAvatar}</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="deals" className="space-y-4">
          <div className="flex items-center justify-between">
            <Input
              placeholder="Search deals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add New Deal
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Deal</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Probability</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Closing Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDeals.length > 0 ? (
                    filteredDeals.map((deal) => (
                      <TableRow key={deal.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{deal.company}</p>
                            <p className="text-sm text-muted-foreground">{deal.id}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              deal.stage === "Closed Won"
                                ? "bg-green-50 text-green-700"
                                : "bg-blue-50 text-blue-700"
                            }`}
                          >
                            {deal.stage}
                          </span>
                        </TableCell>
                        <TableCell>${deal.value.toLocaleString()}</TableCell>
                        <TableCell>{deal.probability}%</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>{deal.ownerAvatar}</AvatarFallback>
                            </Avatar>
                            <span>{deal.owner}</span>
                          </div>
                        </TableCell>
                        <TableCell>{deal.closingDate}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No deals found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Management</CardTitle>
              <CardDescription>
                Manage your customer relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-12 text-muted-foreground">
                This section is under development. Check back soon for updates.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Performance</CardTitle>
              <CardDescription>
                Monthly sales performance data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={salesData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="sales" stroke="#4f46e5" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sales;
