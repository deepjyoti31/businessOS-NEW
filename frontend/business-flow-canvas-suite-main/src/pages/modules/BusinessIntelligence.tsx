
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const BusinessIntelligence = () => {
  const [period, setPeriod] = useState("lastYear");

  // Mock sales data
  const salesData = [
    { month: "Jan", revenue: 45000, expenses: 32000, profit: 13000 },
    { month: "Feb", revenue: 52000, expenses: 36000, profit: 16000 },
    { month: "Mar", revenue: 48000, expenses: 34000, profit: 14000 },
    { month: "Apr", revenue: 61000, expenses: 39000, profit: 22000 },
    { month: "May", revenue: 64000, expenses: 41000, profit: 23000 },
    { month: "Jun", revenue: 59000, expenses: 38000, profit: 21000 },
    { month: "Jul", revenue: 65000, expenses: 42000, profit: 23000 },
    { month: "Aug", revenue: 68000, expenses: 44000, profit: 24000 },
    { month: "Sep", revenue: 72000, expenses: 45000, profit: 27000 },
    { month: "Oct", revenue: 78000, expenses: 48000, profit: 30000 },
    { month: "Nov", revenue: 82000, expenses: 51000, profit: 31000 },
    { month: "Dec", revenue: 91000, expenses: 54000, profit: 37000 },
  ];

  // Mock product performance data
  const productPerformanceData = [
    { name: "Product A", sales: 240, share: 20 },
    { name: "Product B", sales: 300, share: 25 },
    { name: "Product C", sales: 180, share: 15 },
    { name: "Product D", sales: 120, share: 10 },
    { name: "Product E", sales: 360, share: 30 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  // Mock channel performance data
  const channelData = [
    { name: "Direct Sales", value: 35 },
    { name: "Online Store", value: 40 },
    { name: "Distributors", value: 15 },
    { name: "Partners", value: 10 },
  ];

  // Mock customer acquisition data
  const customerData = [
    { month: "Jan", newCustomers: 125, returning: 240 },
    { month: "Feb", newCustomers: 130, returning: 245 },
    { month: "Mar", newCustomers: 140, returning: 255 },
    { month: "Apr", newCustomers: 155, returning: 270 },
    { month: "May", newCustomers: 170, returning: 285 },
    { month: "Jun", newCustomers: 180, returning: 290 },
    { month: "Jul", newCustomers: 190, returning: 305 },
    { month: "Aug", newCustomers: 205, returning: 315 },
    { month: "Sep", newCustomers: 220, returning: 330 },
    { month: "Oct", newCustomers: 235, returning: 345 },
    { month: "Nov", newCustomers: 245, returning: 360 },
    { month: "Dec", newCustomers: 260, returning: 380 },
  ];

  // Mock key metrics
  const keyMetrics = [
    { label: "Revenue", value: "$785K", change: "+12.5%", trend: "up" },
    { label: "Profit Margin", value: "28.4%", change: "+3.2%", trend: "up" },
    { label: "Customer Retention", value: "84.7%", change: "+1.8%", trend: "up" },
    { label: "Avg. Order Value", value: "$285", change: "+5.3%", trend: "up" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Business Intelligence</h1>
          <p className="text-muted-foreground">
            Data insights and analytics for informed decision making
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lastMonth">Last Month</SelectItem>
              <SelectItem value="lastQuarter">Last Quarter</SelectItem>
              <SelectItem value="lastYear">Last Year</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {keyMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center text-xs">
                {metric.trend === "up" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-600 mr-1"
                  >
                    <polyline points="18 15 12 9 6 15"></polyline>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-red-600 mr-1"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                )}
                <span
                  className={
                    metric.trend === "up" ? "text-green-600" : "text-red-600"
                  }
                >
                  {metric.change}
                </span>
                <span className="text-muted-foreground ml-1">vs last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales Analysis</TabsTrigger>
          <TabsTrigger value="customers">Customer Insights</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Revenue & Expenses Trend</CardTitle>
                <CardDescription>
                  Financial performance over the last 12 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={salesData}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value}`} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stackId="1"
                        stroke="#4f46e5"
                        fill="#4f46e5"
                        fillOpacity={0.3}
                      />
                      <Area
                        type="monotone"
                        dataKey="expenses"
                        stackId="2"
                        stroke="#ef4444"
                        fill="#ef4444"
                        fillOpacity={0.3}
                      />
                      <Area
                        type="monotone"
                        dataKey="profit"
                        stackId="3"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales Channel Distribution</CardTitle>
                <CardDescription>Revenue by sales channel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[240px] flex justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={channelData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {channelData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [`${value}%`, name]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
              <CardDescription>
                Sales performance by product category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={productPerformanceData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#82ca9d"
                    />
                    <Tooltip />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="sales"
                      fill="#8884d8"
                      name="Sales (units)"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="share"
                      fill="#82ca9d"
                      name="Market Share (%)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>
                  Sales revenue trends over time
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
                      <Tooltip formatter={(value) => `$${value}`} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#4f46e5"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profit Margin Analysis</CardTitle>
                <CardDescription>
                  Revenue vs. profit by month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={salesData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value}`} />
                      <Legend />
                      <Bar
                        dataKey="revenue"
                        stackId="a"
                        fill="#4f46e5"
                        name="Revenue"
                      />
                      <Bar
                        dataKey="profit"
                        stackId="b"
                        fill="#10b981"
                        name="Profit"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sales Analysis</CardTitle>
              <CardDescription>
                Detailed breakdown of sales performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-muted/30 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">Avg. Deal Size</p>
                    <p className="text-xl font-bold">$12,450</p>
                    <p className="text-xs text-green-600">+8.3% vs last period</p>
                  </div>
                  
                  <div className="p-4 bg-muted/30 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">Sales Cycle</p>
                    <p className="text-xl font-bold">22 days</p>
                    <p className="text-xs text-green-600">-3.5 days vs last period</p>
                  </div>
                  
                  <div className="p-4 bg-muted/30 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">Win Rate</p>
                    <p className="text-xl font-bold">68.5%</p>
                    <p className="text-xs text-green-600">+2.1% vs last period</p>
                  </div>
                  
                  <div className="p-4 bg-muted/30 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">Pipeline Value</p>
                    <p className="text-xl font-bold">$1.8M</p>
                    <p className="text-xs text-green-600">+13.5% vs last period</p>
                  </div>
                </div>
                
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                    <h4 className="font-medium">Top Performing Products</h4>
                    <div className="text-sm text-muted-foreground">Based on revenue generated</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Enterprise Software Suite</span>
                        <span className="font-medium">$245,000</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Consulting Services</span>
                        <span className="font-medium">$180,500</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Cloud Infrastructure</span>
                        <span className="font-medium">$156,200</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>CRM Add-ons</span>
                        <span className="font-medium">$98,750</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Customer Acquisition</CardTitle>
                <CardDescription>
                  New vs. returning customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={customerData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="newCustomers"
                        stackId="a"
                        fill="#4f46e5"
                        name="New Customers"
                      />
                      <Bar
                        dataKey="returning"
                        stackId="a"
                        fill="#10b981"
                        name="Returning Customers"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Demographics</CardTitle>
                <CardDescription>
                  Distribution by region
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "North America", value: 45 },
                          { name: "Europe", value: 25 },
                          { name: "Asia Pacific", value: 20 },
                          { name: "Other", value: 10 },
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [`${value}%`, name]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[0] }}></div>
                      <span>North America</span>
                    </div>
                    <span className="font-medium">3,250 customers</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[1] }}></div>
                      <span>Europe</span>
                    </div>
                    <span className="font-medium">1,850 customers</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Customer Insights</CardTitle>
              <CardDescription>
                Key metrics and segmentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Customer Lifetime Value (CLV)</p>
                    <p className="text-xl font-bold">$4,850</p>
                    <p className="text-xs text-green-600">+12.3% from last year</p>
                  </div>
                  
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Customer Acquisition Cost</p>
                    <p className="text-xl font-bold">$950</p>
                    <p className="text-xs text-red-600">+5.7% from last year</p>
                  </div>
                  
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">CLV:CAC Ratio</p>
                    <p className="text-xl font-bold">5.1:1</p>
                    <p className="text-xs text-green-600">Healthy business model</p>
                  </div>
                </div>
                
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-4">Customer Segments by Revenue</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Enterprise</span>
                        <span className="font-medium">45%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Mid-Market</span>
                        <span className="font-medium">30%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Small Business</span>
                        <span className="font-medium">20%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '20%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Individual</span>
                        <span className="font-medium">5%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '5%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Predictive Analytics</CardTitle>
              <CardDescription>
                AI-powered business forecasting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-12 text-muted-foreground">
                This feature is under development. Check back soon for updates.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessIntelligence;
