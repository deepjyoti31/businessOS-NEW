
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { BudgetService, Budget, BudgetPerformance } from "@/services/BudgetService";
import { TransactionService, Transaction } from "@/services/TransactionService";
import { CreateBudgetDialog } from "@/components/budget/CreateBudgetDialog";

const FinanceBudgeting = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeBudget, setActiveBudget] = useState<Budget | null>(null);
  const [budgetPerformance, setBudgetPerformance] = useState<BudgetPerformance | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  // Default budget data for initial render or when no data is available
  const defaultBudgetData = {
    totalBudget: 0,
    allocated: 0,
    remaining: 0,
    categories: [],
    expenses: []
  };

  // Function to determine progress color based on progress percentage
  const getProgressColor = (progress: number, status: string) => {
    if (status === "Over Budget") return "bg-red-500";
    if (status === "Near Limit") return "bg-amber-500";
    if (status === "Under Budget") return "bg-blue-500";
    return "bg-green-500";
  };

  // Function to fetch budget data
  const fetchBudgetData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const budgetService = BudgetService.getInstance();
      const transactionService = TransactionService.getInstance();

      // Fetch both active and draft budgets
      const budgets = await budgetService.getBudgets(1, 10, "created_at", "desc");

      if (budgets && budgets.length > 0) {
        // Use the most recent active budget
        const budget = budgets[0];
        setActiveBudget(budget);

        // Fetch budget performance metrics
        const performance = await budgetService.getBudgetPerformance(budget.id);
        setBudgetPerformance(performance);

        // Fetch recent transactions (limited to 5)
        const transactions = await transactionService.getTransactions(1, 5, "date", "desc");
        setRecentTransactions(transactions);
      } else {
        // No budgets found
        setActiveBudget(null);
        setBudgetPerformance(null);
        toast({
          title: "No budgets found",
          description: "Create a budget to start tracking your finances.",
          variant: "default",
        });
      }
    } catch (err) {
      console.error("Error fetching budget data:", err);
      setError("Failed to load budget data. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load budget data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch budget data on component mount
  useEffect(() => {
    fetchBudgetData();
  }, [toast]);

  // Prepare data for rendering
  const budgetData = {
    totalBudget: budgetPerformance?.total_budget || defaultBudgetData.totalBudget,
    allocated: budgetPerformance?.total_allocated || defaultBudgetData.allocated,
    remaining: budgetPerformance?.remaining_budget || defaultBudgetData.remaining,
    categories: budgetPerformance?.categories || defaultBudgetData.categories,
    expenses: recentTransactions || defaultBudgetData.expenses
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Budget Management</h1>
          <p className="text-muted-foreground">
            Track and manage departmental budgets and expenses
          </p>
        </div>
        <CreateBudgetDialog onBudgetCreated={fetchBudgetData}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New Budget
          </Button>
        </CreateBudgetDialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading budget data...</span>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-red-500 mb-2">{error}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      ) : !activeBudget ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="mb-4">No budgets found. Create a budget to start tracking your finances.</p>
              <CreateBudgetDialog onBudgetCreated={fetchBudgetData}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Budget
                </Button>
              </CreateBudgetDialog>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Active Budget Info */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{activeBudget.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {new Date(activeBudget.start_date).toLocaleDateString()} to {new Date(activeBudget.end_date).toLocaleDateString()} | Fiscal Year: {activeBudget.fiscal_year}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    activeBudget.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : activeBudget.status === "Draft"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-gray-100 text-gray-700"
                  }`}>
                    {activeBudget.status}
                  </span>
                  {activeBudget.status === "Draft" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        try {
                          setIsLoading(true);
                          const budgetService = BudgetService.getInstance();
                          await budgetService.updateBudget(activeBudget.id, { status: "Active" });
                          toast({
                            title: "Budget activated",
                            description: "The budget has been activated successfully.",
                          });
                          fetchBudgetData();
                        } catch (err) {
                          console.error("Error activating budget:", err);
                          toast({
                            title: "Error",
                            description: "Failed to activate budget. Please try again.",
                            variant: "destructive",
                          });
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                    >
                      Activate
                    </Button>
                  )}
                </div>
              </div>
              {activeBudget.description && (
                <p className="text-sm mb-2">{activeBudget.description}</p>
              )}
            </CardContent>
          </Card>

          {/* Budget Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${budgetData.totalBudget.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Fiscal Year {activeBudget.fiscal_year}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Allocated Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${budgetData.allocated.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {budgetData.totalBudget > 0
                    ? Math.round((budgetData.allocated / budgetData.totalBudget) * 100)
                    : 0}% of total budget
                </p>
                <Progress
                  value={budgetData.totalBudget > 0 ? (budgetData.allocated / budgetData.totalBudget) * 100 : 0}
                  className="h-2 mt-2"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Remaining Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${budgetData.remaining.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {budgetData.totalBudget > 0
                    ? Math.round((budgetData.remaining / budgetData.totalBudget) * 100)
                    : 0}% of total budget
                </p>
                <Progress
                  value={budgetData.totalBudget > 0 ? (budgetData.remaining / budgetData.totalBudget) * 100 : 0}
                  className="h-2 mt-2"
                />
              </CardContent>
            </Card>
          </div>

          {/* Budget Categories */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Budget Categories</CardTitle>
                <CardDescription>
                  Breakdown of allocated budget by department
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">Manage Categories</Button>
            </CardHeader>
            <CardContent>
              {budgetPerformance && budgetPerformance.categories.length > 0 ? (
                <div className="space-y-8">
                  {budgetPerformance.categories.map((category) => (
                    <div key={category.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-muted-foreground">
                            ${category.spent_amount.toLocaleString()} of ${category.allocated_amount.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-sm font-medium">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              category.status === "Over Budget"
                                ? "bg-red-100 text-red-700"
                                : category.status === "Under Budget"
                                  ? "bg-blue-100 text-blue-700"
                                  : category.status === "Near Limit"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-green-100 text-green-700"
                            }`}
                          >
                            {category.status}
                          </span>
                        </div>
                      </div>
                      <Progress
                        value={category.spending_percentage}
                        className={`h-2 ${getProgressColor(category.spending_percentage, category.status)}`}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No budget categories found.</p>
                  <Button variant="outline">Add Category</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Expenses */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>
                    Recent financial transactions across categories
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentTransactions && recentTransactions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            transaction.type === "Income"
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}>
                            {transaction.type}
                          </span>
                        </TableCell>
                        <TableCell>{transaction.category || "Uncategorized"}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell className="text-right">${Math.abs(transaction.amount).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No recent transactions found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default FinanceBudgeting;
