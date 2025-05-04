import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Download, Filter } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { BudgetService, Budget, BudgetPerformance } from "@/services/BudgetService";
import { BudgetAnalysisCharts } from "@/components/budget/BudgetAnalysisCharts";
import { ROUTES } from "@/config/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

const BudgetAnalysis = () => {
  const { budgetId } = useParams<{ budgetId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [performance, setPerformance] = useState<BudgetPerformance | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Function to determine progress color based on status
  const getProgressColor = (status: string) => {
    if (status === "Over Budget") return "bg-red-500";
    if (status === "Near Limit") return "bg-amber-500";
    if (status === "Under Budget") return "bg-blue-500";
    return "bg-green-500";
  };

  // Fetch budget data
  useEffect(() => {
    const fetchData = async () => {
      if (!budgetId) {
        navigate(ROUTES.FINANCE_BUDGETING);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const budgetService = BudgetService.getInstance();

        // Fetch budget details
        const budgetData = await budgetService.getBudgetById(budgetId);
        setBudget(budgetData);

        // Fetch budget performance
        const performanceData = await budgetService.getBudgetPerformance(budgetId);
        setPerformance(performanceData);
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

    fetchData();
  }, [budgetId, navigate, toast]);

  // Filter categories based on selected filter
  const filteredCategories = performance?.categories.filter(category => {
    if (categoryFilter === "all") return true;
    if (categoryFilter === "over_budget") return category.status === "Over Budget";
    if (categoryFilter === "near_limit") return category.status === "Near Limit";
    if (categoryFilter === "on_track") return category.status === "On Track";
    if (categoryFilter === "under_budget") return category.status === "Under Budget";
    return true;
  });

  // Handle export to CSV
  const handleExportCSV = () => {
    if (!performance) return;

    // Create CSV content
    let csvContent = "Category,Allocated,Spent,Remaining,Percentage,Status\n";

    performance.categories.forEach(category => {
      csvContent += `"${category.name}",${category.allocated_amount},${category.spent_amount},${category.remaining_amount},${category.spending_percentage.toFixed(2)}%,"${category.status}"\n`;
    });

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `budget-analysis-${budget?.name}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            className="mr-2"
            onClick={() => navigate(ROUTES.FINANCE_BUDGETING)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold mb-1">Budget Analysis</h1>
            <p className="text-muted-foreground">
              Detailed analysis and reporting for your budget
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleExportCSV}
          disabled={isLoading || !performance}
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading budget analysis...</span>
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
      ) : !budget || !performance ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="mb-4">Budget not found or no performance data available.</p>
              <Button onClick={() => navigate(ROUTES.FINANCE_BUDGETING)}>Back to Budgeting</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Budget Info */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{budget.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {new Date(budget.start_date).toLocaleDateString()} to {new Date(budget.end_date).toLocaleDateString()} | Fiscal Year: {budget.fiscal_year}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  budget.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : budget.status === "Draft"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-gray-100 text-gray-700"
                }`}>
                  {budget.status}
                </span>
              </div>
              {budget.description && (
                <p className="text-sm mb-2">{budget.description}</p>
              )}
            </CardContent>
          </Card>

          {/* Budget Analysis Charts */}
          <BudgetAnalysisCharts performance={performance} />

          {/* Budget Categories Table */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Budget Categories</CardTitle>
                  <CardDescription>
                    Detailed breakdown of budget categories and spending
                  </CardDescription>
                </div>
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="over_budget">Over Budget</SelectItem>
                      <SelectItem value="near_limit">Near Limit</SelectItem>
                      <SelectItem value="on_track">On Track</SelectItem>
                      <SelectItem value="under_budget">Under Budget</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Allocated</TableHead>
                    <TableHead>Spent</TableHead>
                    <TableHead>Remaining</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories && filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>${category.allocated_amount.toLocaleString()}</TableCell>
                        <TableCell>${category.spent_amount.toLocaleString()}</TableCell>
                        <TableCell>${category.remaining_amount.toLocaleString()}</TableCell>
                        <TableCell className="w-[200px]">
                          <div className="flex items-center">
                            <Progress
                              value={category.spending_percentage}
                              className={`h-2 mr-2 ${getProgressColor(category.status)}`}
                            />
                            <span className="text-xs">{category.spending_percentage.toFixed(0)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            category.status === "Over Budget"
                              ? "bg-red-100 text-red-700"
                              : category.status === "Under Budget"
                                ? "bg-blue-100 text-blue-700"
                                : category.status === "Near Limit"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-green-100 text-green-700"
                          }`}>
                            {category.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No categories found matching the selected filter.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default BudgetAnalysis;
