
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Loader2 } from "lucide-react";
import { format, subMonths } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

import { ReportService, MonthlyReportItem, QuarterlyReportItem, ExpenseCategoryItem, FinancialSummary, AIFinancialInsight } from "@/services/ReportService";

const FinanceReports = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("monthly");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Report data states
  const [monthlyData, setMonthlyData] = useState<MonthlyReportItem[]>([]);
  const [quarterlyData, setQuarterlyData] = useState<QuarterlyReportItem[]>([]);
  const [expenseData, setExpenseData] = useState<ExpenseCategoryItem[]>([]);
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [insights, setInsights] = useState<AIFinancialInsight[]>([]);

  // Date range for reports
  const [startDate] = useState<Date>(subMonths(new Date(), 6)); // 6 months ago
  const [endDate] = useState<Date>(new Date()); // Current date

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

  // Fetch report data based on active tab
  useEffect(() => {
    const fetchReportData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const reportService = ReportService.getInstance();

        switch (activeTab) {
          case "monthly":
            const monthlyReport = await reportService.getMonthlyReport(startDate, endDate);
            setMonthlyData(monthlyReport.monthly_data || []);
            setSummary(monthlyReport.summary || null);
            setInsights(monthlyReport.insights || []);
            break;

          case "quarterly":
            const quarterlyReport = await reportService.getQuarterlyReport(startDate, endDate);
            setQuarterlyData(quarterlyReport.quarterly_data || []);
            setSummary(quarterlyReport.summary || null);
            setInsights(quarterlyReport.insights || []);
            break;

          case "expenses":
            const expenseReport = await reportService.getExpenseBreakdown(startDate, endDate);
            setExpenseData(expenseReport.expense_data || []);
            setSummary(expenseReport.summary || null);
            setInsights(expenseReport.insights || []);
            break;

          default:
            // Fetch all data for initial load
            const fullReport = await reportService.getFinancialReport("all", startDate, endDate);
            setMonthlyData(fullReport.monthly_data || []);
            setQuarterlyData(fullReport.quarterly_data || []);
            setExpenseData(fullReport.expense_data || []);
            setSummary(fullReport.summary || null);
            setInsights(fullReport.insights || []);
            break;
        }
      } catch (err) {
        console.error("Error fetching report data:", err);
        setError("Failed to load report data. Please try again.");
        toast({
          title: "Error",
          description: "Failed to load report data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [activeTab, startDate, endDate, toast]);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Financial Reports</h1>
        <p className="text-muted-foreground">
          View and generate reports on your financial performance
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading report data...</span>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-6">
            <div className="text-center text-red-500">
              <p>{error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setIsLoading(true);
                  setError(null);
                  // Trigger a re-fetch by changing the active tab
                  setActiveTab(activeTab === "monthly" ? "quarterly" : "monthly");
                }}
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {summary ? formatCurrency(summary.total_revenue) : '$0.00'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {summary && summary.revenue_change !== 0
                    ? formatPercentage(summary.revenue_change) + ' from previous period'
                    : 'No change from previous period'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {summary ? formatCurrency(summary.total_expenses) : '$0.00'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {summary && summary.expenses_change !== 0
                    ? formatPercentage(summary.expenses_change) + ' from previous period'
                    : 'No change from previous period'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {summary ? formatCurrency(summary.net_profit) : '$0.00'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {summary && summary.profit_change !== 0
                    ? formatPercentage(summary.profit_change) + ' from previous period'
                    : 'No change from previous period'}
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
                <TabsTrigger value="expenses">Expense Breakdown</TabsTrigger>
              </TabsList>
              <Button variant="outline">
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
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Export Report
              </Button>
            </div>

            <TabsContent value="monthly" className="space-y-4">
              {monthlyData.length === 0 ? (
                <Card>
                  <CardContent className="py-10">
                    <div className="text-center text-muted-foreground">
                      <p>No monthly data available for the selected period.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Monthly Financial Performance</CardTitle>
                      <CardDescription>
                        Revenue, expenses, and profit for the selected period by month
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={monthlyData}
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
                            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                            <Legend />
                            <Bar dataKey="revenue" fill="#4f46e5" name="Revenue" />
                            <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                            <Bar dataKey="profit" fill="#10b981" name="Profit" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Monthly Profit Trend</CardTitle>
                      <CardDescription>
                        Profit trend over the selected period
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={monthlyData}
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
                            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                            <Legend />
                            <Line type="monotone" dataKey="profit" stroke="#10b981" activeDot={{ r: 8 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            <TabsContent value="quarterly" className="space-y-4">
              {quarterlyData.length === 0 ? (
                <Card>
                  <CardContent className="py-10">
                    <div className="text-center text-muted-foreground">
                      <p>No quarterly data available for the selected period.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Quarterly Financial Performance</CardTitle>
                    <CardDescription>
                      Revenue, expenses, and profit for the selected period by quarter
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={quarterlyData}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="quarter" />
                          <YAxis />
                          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                          <Legend />
                          <Bar dataKey="revenue" fill="#4f46e5" name="Revenue" />
                          <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                          <Bar dataKey="profit" fill="#10b981" name="Profit" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="expenses" className="space-y-4">
              {expenseData.length === 0 ? (
                <Card>
                  <CardContent className="py-10">
                    <div className="text-center text-muted-foreground">
                      <p>No expense data available for the selected period.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Expense Breakdown</CardTitle>
                    <CardDescription>
                      Distribution of expenses by category for the selected period
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={expenseData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                          >
                            {expenseData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* AI Insights */}
          {insights.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>AI Financial Insights</CardTitle>
                <CardDescription>
                  AI-powered analysis and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {insights.map((insight, index) => {
                  // Determine background color based on severity
                  let bgColor = "bg-blue-50";
                  let borderColor = "border-blue-100";
                  let textColor = "text-blue-700";

                  if (insight.severity === "warning") {
                    bgColor = "bg-amber-50";
                    borderColor = "border-amber-100";
                    textColor = "text-amber-700";
                  } else if (insight.severity === "info") {
                    bgColor = "bg-green-50";
                    borderColor = "border-green-100";
                    textColor = "text-green-700";
                  }

                  return (
                    <div key={index} className={`p-3 ${bgColor} rounded-md border ${borderColor} text-sm`}>
                      <span className={`block font-medium mb-1 ${textColor}`}>{insight.title}</span>
                      <span>{insight.description}</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default FinanceReports;
