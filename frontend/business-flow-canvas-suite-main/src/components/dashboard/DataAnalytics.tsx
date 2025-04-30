
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface DataPoint {
  name: string;
  value: number;
  color?: string;
}

interface TimeSeriesData {
  date: string;
  sales: number;
  revenue: number;
  customers: number;
}

interface PerformanceData {
  department: string;
  performance: number;
  target: number;
}

const DataAnalytics = () => {
  const [timeRange, setTimeRange] = useState("week");
  const [chartType, setChartType] = useState("bar");
  
  // Mock data
  const salesByProduct: DataPoint[] = [
    { name: "Product A", value: 32000, color: "#8884d8" },
    { name: "Product B", value: 45000, color: "#82ca9d" },
    { name: "Product C", value: 18000, color: "#ffc658" },
    { name: "Product D", value: 23000, color: "#ff8042" },
    { name: "Product E", value: 29000, color: "#0088fe" }
  ];
  
  const revenueByDepartment: DataPoint[] = [
    { name: "Sales", value: 120000, color: "#0088FE" },
    { name: "Marketing", value: 75000, color: "#00C49F" },
    { name: "Support", value: 45000, color: "#FFBB28" },
    { name: "R&D", value: 80000, color: "#FF8042" }
  ];
  
  const timeSeriesData: TimeSeriesData[] = [
    { date: "Jan", sales: 1000, revenue: 2400, customers: 240 },
    { date: "Feb", sales: 1200, revenue: 2800, customers: 320 },
    { date: "Mar", sales: 1500, revenue: 3500, customers: 380 },
    { date: "Apr", sales: 1300, revenue: 3100, customers: 350 },
    { date: "May", sales: 1800, revenue: 4000, customers: 420 },
    { date: "Jun", sales: 2000, revenue: 4500, customers: 480 },
    { date: "Jul", sales: 1700, revenue: 3800, customers: 410 },
    { date: "Aug", sales: 1900, revenue: 4200, customers: 450 },
    { date: "Sep", sales: 2200, revenue: 4900, customers: 520 },
    { date: "Oct", sales: 2400, revenue: 5300, customers: 550 },
    { date: "Nov", sales: 2100, revenue: 4700, customers: 500 },
    { date: "Dec", sales: 2500, revenue: 5600, customers: 580 }
  ];
  
  const departmentPerformance: PerformanceData[] = [
    { department: "Sales", performance: 87, target: 80 },
    { department: "Marketing", performance: 92, target: 85 },
    { department: "Support", performance: 78, target: 75 },
    { department: "R&D", performance: 95, target: 90 },
    { department: "HR", performance: 82, target: 80 },
    { department: "Finance", performance: 89, target: 85 }
  ];
  
  const renderTimeSeriesChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" name="Sales Volume" />
              <Bar dataKey="revenue" fill="#82ca9d" name="Revenue ($)" />
            </BarChart>
          </ResponsiveContainer>
        );
      case "line":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" name="Sales Volume" />
              <Line type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenue ($)" />
            </LineChart>
          </ResponsiveContainer>
        );
      case "area":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="sales" stackId="1" stroke="#8884d8" fill="#8884d8" name="Sales Volume" />
              <Area type="monotone" dataKey="revenue" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="Revenue ($)" />
            </AreaChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Data Analytics</h1>
        <p className="text-muted-foreground">
          Visualize and analyze your business performance metrics
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* KPI Cards */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$245,890</div>
            <p className="text-xs text-muted-foreground mt-1">+12.3% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,852</div>
            <p className="text-xs text-muted-foreground mt-1">+5.7% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.24%</div>
            <p className="text-xs text-muted-foreground mt-1">+0.8% from last month</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="sales">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="sales">Sales Analysis</TabsTrigger>
            <TabsTrigger value="performance">Team Performance</TabsTrigger>
            <TabsTrigger value="customers">Customer Analytics</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Chart Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="area">Area Chart</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <TabsContent value="sales" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales & Revenue Trends</CardTitle>
              <CardDescription>
                Monthly sales and revenue data for the current year
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderTimeSeriesChart()}
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Sales by Product</CardTitle>
                <CardDescription>Product performance comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={salesByProduct}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {salesByProduct.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Department</CardTitle>
                <CardDescription>Department contribution to total revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueByDepartment} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" name="Revenue">
                      {revenueByDepartment.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Department Performance vs Targets</CardTitle>
              <CardDescription>
                Performance metrics compared to target goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="performance" fill="#8884d8" name="Current Performance" />
                  <Bar dataKey="target" fill="#82ca9d" name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customers" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Growth Trends</CardTitle>
              <CardDescription>
                Monthly growth in customer base
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="customers" stroke="#ff7300" name="Customer Count" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline">Export Report</Button>
        <Button>Share Dashboard</Button>
      </div>
    </div>
  );
};

export default DataAnalytics;
