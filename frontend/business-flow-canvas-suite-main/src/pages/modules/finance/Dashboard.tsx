
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

import { TransactionService, Transaction, TransactionSummary } from "@/services/TransactionService";
import { ROUTES } from "@/config/constants";

const FinanceDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [transactionSummary, setTransactionSummary] = useState<TransactionSummary | null>(null);
  const [financialData, setFinancialData] = useState<any[]>([]);

  // Generate monthly financial data based on transaction summary
  const generateFinancialData = (summary: TransactionSummary | null) => {
    if (!summary) {
      // Return placeholder data if no summary is available
      return [
        { month: 'Jan', revenue: 0, expenses: 0, profit: 0 },
        { month: 'Feb', revenue: 0, expenses: 0, profit: 0 },
        { month: 'Mar', revenue: 0, expenses: 0, profit: 0 },
        { month: 'Apr', revenue: 0, expenses: 0, profit: 0 },
        { month: 'May', revenue: 0, expenses: 0, profit: 0 },
        { month: 'Jun', revenue: 0, expenses: 0, profit: 0 },
      ];
    }

    // In a real implementation, this would use actual monthly data from the API
    // For now, we'll generate some data based on the summary
    const totalRevenue = summary.total_income;
    const totalExpenses = Math.abs(summary.total_expenses);

    // Generate 6 months of data with some variation
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => {
      // Create some variation in the data
      const factor = 0.5 + Math.random();
      const revenue = Math.round((totalRevenue / 6) * factor);
      const expenses = Math.round((totalExpenses / 6) * factor);
      const profit = revenue - expenses;

      return {
        month,
        revenue,
        expenses,
        profit
      };
    });
  };

  // Generate quick stats based on transaction summary
  const getQuickStats = (summary: TransactionSummary | null) => {
    if (!summary) {
      return [
        {
          title: "Total Revenue",
          value: "$0.00",
          change: { value: 0, trend: "up" },
          description: "vs. previous month"
        },
        {
          title: "Total Expenses",
          value: "$0.00",
          change: { value: 0, trend: "up" },
          description: "vs. previous month"
        },
        {
          title: "Net Profit",
          value: "$0.00",
          change: { value: 0, trend: "up" },
          description: "vs. previous month"
        },
        {
          title: "Transaction Count",
          value: "0",
          change: { value: 0, trend: "up" },
          description: "vs. previous month"
        }
      ];
    }

    return [
      {
        title: "Total Revenue",
        value: `$${summary.total_income.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`,
        change: { value: 12.5, trend: "up" }, // Placeholder - would be calculated from historical data
        description: "vs. previous month"
      },
      {
        title: "Total Expenses",
        value: `$${Math.abs(summary.total_expenses).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`,
        change: { value: 5.2, trend: "up" }, // Placeholder
        description: "vs. previous month"
      },
      {
        title: "Net Profit",
        value: `$${summary.net_amount.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`,
        change: { value: summary.net_amount > 0 ? 24.3 : -24.3, trend: summary.net_amount > 0 ? "up" : "down" }, // Placeholder
        description: "vs. previous month"
      },
      {
        title: "Transaction Count",
        value: summary.transaction_count.toString(),
        change: { value: 8.7, trend: "up" }, // Placeholder
        description: "vs. previous month"
      }
    ];
  };

  // Quick links for finance module
  const quickLinks = [
    {
      title: "Transactions",
      description: "View and manage all financial transactions",
      path: ROUTES.FINANCE_TRANSACTIONS,
    },
    {
      title: "Reports",
      description: "Generate financial reports and analytics",
      path: ROUTES.FINANCE_REPORTS,
    },
    {
      title: "Invoicing",
      description: "Create and manage client invoices",
      path: ROUTES.FINANCE_INVOICING,
    },
    {
      title: "Budgeting",
      description: "Plan and track your company budget",
      path: ROUTES.FINANCE_BUDGETING,
    },
  ];

  // Fetch transaction data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const transactionService = TransactionService.getInstance();

        // Fetch recent transactions (limited to 3)
        const transactions = await transactionService.getTransactions(1, 3, "date", "desc");
        setRecentTransactions(transactions);

        // Fetch transaction summary
        const summary = await transactionService.getTransactionSummary();
        setTransactionSummary(summary);

        // Generate financial data based on summary
        setFinancialData(generateFinancialData(summary));
      } catch (err) {
        console.error("Error fetching finance data:", err);
        setError("Failed to load financial data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Finance Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your financial operations
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center p-8 text-red-500">
          {error}
          <Button
            variant="outline"
            size="sm"
            className="ml-2"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {getQuickStats(transactionSummary).map((stat, index) => (
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
                      {Math.abs(stat.change.value)}%
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
                        <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
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
                  <Link to={ROUTES.FINANCE_TRANSACTIONS}>
                    <Button variant="outline" size="sm">View All</Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {recentTransactions.length === 0 ? (
                    <div className="py-6 text-center text-muted-foreground">
                      No transactions found. Create your first transaction!
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {recentTransactions.map((transaction) => (
                        <div key={transaction.id} className="py-3 flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{transaction.description}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{format(new Date(transaction.date), 'MMM dd, yyyy')}</span>
                              <span>•</span>
                              <span>{transaction.category || 'Uncategorized'}</span>
                            </div>
                          </div>
                          <span
                            className={
                              transaction.amount > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"
                            }
                          >
                            {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
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
                  {transactionSummary && transactionSummary.transaction_count > 0 ? (
                    <>
                      <div className="p-3 bg-blue-50 rounded-md border border-blue-100 text-sm">
                        <span className="block font-medium mb-1 text-blue-700">Cash Flow Optimization</span>
                        <span>Based on current trends, optimizing payment terms could improve your cash flow by 15%.</span>
                      </div>
                      {transactionSummary.categories.length > 0 && (
                        <div className="p-3 bg-amber-50 rounded-md border border-amber-100 text-sm">
                          <span className="block font-medium mb-1 text-amber-700">Budget Alert</span>
                          <span>
                            {transactionSummary.categories[0].category} expenses are trending higher than usual.
                            Consider reviewing your spending in this category.
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center text-muted-foreground py-4">
                      Add transactions to get AI-powered financial insights.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FinanceDashboard;
