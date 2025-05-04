import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BudgetPerformance } from "@/services/BudgetService";
import { ArrowDown, ArrowUp, Minus, TrendingDown, TrendingUp } from "lucide-react";

// Import recharts components
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  TooltipProps
} from "recharts";

interface BudgetAnalysisChartsProps {
  performance: BudgetPerformance;
}

export function BudgetAnalysisCharts({ performance }: BudgetAnalysisChartsProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Prepare data for charts
  const categoryData = performance.categories.map(category => ({
    name: category.name,
    allocated: category.allocated_amount,
    spent: category.spent_amount,
    remaining: category.remaining_amount,
    percentage: category.spending_percentage
  }));

  // Prepare monthly spending data
  const monthlySpendingData = performance.monthly_spending 
    ? Object.entries(performance.monthly_spending).map(([month, amount]) => ({
        month,
        amount
      }))
    : [];

  // Prepare allocation pie chart data
  const allocationData = performance.categories.map(category => ({
    name: category.name,
    value: category.allocated_amount
  }));

  // Prepare spending pie chart data
  const spendingData = performance.categories.map(category => ({
    name: category.name,
    value: category.spent_amount
  }));

  // Colors for pie charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Custom tooltip for pie charts
  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="font-medium">{`${payload[0].name}`}</p>
          <p className="text-sm">{`${payload[0].value?.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  // Trend indicator component
  const TrendIndicator = ({ trend }: { trend: string }) => {
    if (trend === "increasing") {
      return (
        <div className="flex items-center text-red-500">
          <TrendingUp className="h-4 w-4 mr-1" />
          <span>Increasing</span>
        </div>
      );
    } else if (trend === "decreasing") {
      return (
        <div className="flex items-center text-green-500">
          <TrendingDown className="h-4 w-4 mr-1" />
          <span>Decreasing</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-gray-500">
          <Minus className="h-4 w-4 mr-1" />
          <span>Stable</span>
        </div>
      );
    }
  };

  // Projected status indicator
  const ProjectedStatusIndicator = ({ status }: { status: string }) => {
    if (status === "over_budget") {
      return (
        <div className="flex items-center text-red-500">
          <ArrowUp className="h-4 w-4 mr-1" />
          <span>Projected to be over budget</span>
        </div>
      );
    } else if (status === "under_budget") {
      return (
        <div className="flex items-center text-green-500">
          <ArrowDown className="h-4 w-4 mr-1" />
          <span>Projected to be under budget</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-blue-500">
          <Minus className="h-4 w-4 mr-1" />
          <span>Projected to be on track</span>
        </div>
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Analysis</CardTitle>
        <CardDescription>
          Detailed analysis of budget allocation and spending
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Budget Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${performance.total_spent.toLocaleString()} / ${performance.total_budget.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {performance.spending_percentage.toFixed(1)}% of total budget spent
                  </p>
                  {performance.projected_end_status && (
                    <ProjectedStatusIndicator status={performance.projected_end_status} />
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Spending Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${performance.remaining_budget.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Remaining budget
                  </p>
                  {performance.monthly_trend && (
                    <TrendIndicator trend={performance.monthly_trend} />
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="allocated" name="Allocated" fill="#8884d8" />
                  <Bar dataKey="spent" name="Spent" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="allocated" name="Allocated" fill="#8884d8" />
                  <Bar dataKey="spent" name="Spent" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="percentage" name="Spending %" fill="#ff7c43" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlySpendingData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="amount" name="Monthly Spending" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {performance.categories.map((category) => (
                <Card key={category.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{category.name}</CardTitle>
                    <CardDescription>
                      ${category.spent_amount.toLocaleString()} of ${category.allocated_amount.toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {category.trend && (
                      <TrendIndicator trend={category.trend} />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Allocation Tab */}
          <TabsContent value="allocation" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Budget Allocation</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={allocationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {allocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Actual Spending</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={spendingData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#82ca9d"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {spendingData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
