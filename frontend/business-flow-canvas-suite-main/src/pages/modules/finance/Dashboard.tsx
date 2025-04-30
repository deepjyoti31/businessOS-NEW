
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Link } from "react-router-dom";

const FinanceDashboard = () => {
  // Mock financial data
  const financialData = [
    { month: 'Jan', revenue: 4000, expenses: 2400, profit: 1600 },
    { month: 'Feb', revenue: 3000, expenses: 1398, profit: 1602 },
    { month: 'Mar', revenue: 9800, expenses: 3908, profit: 5892 },
    { month: 'Apr', revenue: 3780, expenses: 3800, profit: -20 },
    { month: 'May', revenue: 5890, expenses: 4800, profit: 1090 },
    { month: 'Jun', revenue: 4390, expenses: 3800, profit: 590 },
  ];

  // Quick stats
  const quickStats = [
    {
      title: "Total Revenue",
      value: "$30,860.00",
      change: { value: 12.5, trend: "up" },
      description: "vs. previous month"
    },
    {
      title: "Total Expenses",
      value: "$18,106.00",
      change: { value: 5.2, trend: "up" },
      description: "vs. previous month"
    },
    {
      title: "Net Profit",
      value: "$12,754.00",
      change: { value: 24.3, trend: "up" },
      description: "vs. previous month"
    },
    {
      title: "Cash on Hand",
      value: "$42,580.00",
      change: { value: 8.7, trend: "up" },
      description: "vs. previous month"
    }
  ];

  // Recent transactions
  const recentTransactions = [
    {
      id: "TR-001",
      date: "2025-03-25",
      type: "Income",
      description: "Client payment - ABC Corp",
      amount: 12500,
    },
    {
      id: "TR-002",
      date: "2025-03-24",
      type: "Expense",
      description: "Office rent payment",
      amount: -3500,
    },
    {
      id: "TR-003",
      date: "2025-03-23",
      type: "Expense",
      description: "Software subscription",
      amount: -299,
    }
  ];

  // Quick links for finance module
  const quickLinks = [
    {
      title: "Transactions",
      description: "View and manage all financial transactions",
      path: "/dashboard/finance/transactions",
    },
    {
      title: "Reports",
      description: "Generate financial reports and analytics",
      path: "/dashboard/finance/reports",
    },
    {
      title: "Invoicing",
      description: "Create and manage client invoices",
      path: "/dashboard/finance/invoicing",
    },
    {
      title: "Budgeting",
      description: "Plan and track your company budget",
      path: "/dashboard/finance/budgeting",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Finance Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your financial operations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs">
                {stat.change.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3 mr-1 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1 text-red-600" />
                )}
                <span className={stat.change.trend === "up" ? "text-green-600" : "text-red-600"}>
                  {stat.change.value}%
                </span>
                <span className="text-muted-foreground ml-1">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Performance</CardTitle>
              <CardDescription>
                Monthly revenue, expenses, and profit for the current year
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={financialData}
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
                    <Bar dataKey="revenue" fill="#4f46e5" name="Revenue" />
                    <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                    <Bar dataKey="profit" fill="#10b981" name="Profit" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-0.5">
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Your most recent financial transactions
                </CardDescription>
              </div>
              <Link to="/dashboard/finance/transactions">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{transaction.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{transaction.date}</span>
                        <span>•</span>
                        <span>{transaction.id}</span>
                      </div>
                    </div>
                    <span
                      className={
                        transaction.amount > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"
                      }
                    >
                      {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
              <CardDescription>
                Access key financial functions quickly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quickLinks.map((link, index) => (
                  <Link key={index} to={link.path}>
                    <div className="group rounded-lg border p-3 hover:bg-muted transition-all">
                      <h4 className="text-sm font-medium">{link.title}</h4>
                      <p className="text-xs text-muted-foreground">{link.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Financial Insights */}
          <Card>
            <CardHeader>
              <CardTitle>AI Financial Insights</CardTitle>
              <CardDescription>
                Recommendations based on your financial data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-md border border-blue-100 text-sm">
                <span className="block font-medium mb-1 text-blue-700">Cash Flow Optimization</span>
                <span>Based on current trends, optimizing payment terms could improve your cash flow by 15%.</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-md border border-amber-100 text-sm">
                <span className="block font-medium mb-1 text-amber-700">Budget Alert</span>
                <span>Software expenses are trending 12% over budget this quarter. Consider reviewing subscription services.</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
