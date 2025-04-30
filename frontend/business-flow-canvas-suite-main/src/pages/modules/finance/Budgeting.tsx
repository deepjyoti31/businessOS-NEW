
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

const FinanceBudgeting = () => {
  // Mock budget data
  const budgetData = {
    totalBudget: 250000,
    allocated: 175000,
    remaining: 75000,
    categories: [
      {
        name: "Marketing & Sales",
        allocated: 50000,
        spent: 32500,
        progress: 65,
        status: "On Track"
      },
      {
        name: "Research & Development",
        allocated: 75000,
        spent: 68000,
        progress: 91,
        status: "Over Budget"
      },
      {
        name: "Operations",
        allocated: 40000,
        spent: 25000,
        progress: 62,
        status: "On Track"
      },
      {
        name: "Human Resources",
        allocated: 25000,
        spent: 12000,
        progress: 48,
        status: "Under Budget"
      },
      {
        name: "IT Infrastructure",
        allocated: 35000,
        spent: 30000,
        progress: 86,
        status: "On Track"
      },
    ],
    expenses: [
      {
        id: "EXP-001",
        date: "2025-03-15",
        category: "Marketing & Sales",
        description: "Digital Marketing Campaign",
        amount: 8500
      },
      {
        id: "EXP-002",
        date: "2025-03-14",
        category: "IT Infrastructure",
        description: "Cloud Services Subscription",
        amount: 3200
      },
      {
        id: "EXP-003",
        date: "2025-03-12",
        category: "Research & Development",
        description: "Product Testing Materials",
        amount: 5750
      },
      {
        id: "EXP-004",
        date: "2025-03-10",
        category: "Operations",
        description: "Office Supplies",
        amount: 1200
      },
      {
        id: "EXP-005",
        date: "2025-03-08",
        category: "Human Resources",
        description: "Team Building Event",
        amount: 3500
      }
    ]
  };

  // Function to determine progress color based on progress percentage
  const getProgressColor = (progress: number, status: string) => {
    if (status === "Over Budget") return "bg-red-500";
    if (progress > 80) return "bg-amber-500";
    if (progress < 50) return "bg-blue-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Budget Management</h1>
        <p className="text-muted-foreground">
          Track and manage departmental budgets and expenses
        </p>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${budgetData.totalBudget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Fiscal Year 2025</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Allocated Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${budgetData.allocated.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{Math.round((budgetData.allocated / budgetData.totalBudget) * 100)}% of total budget</p>
            <Progress value={(budgetData.allocated / budgetData.totalBudget) * 100} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Remaining Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${budgetData.remaining.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{Math.round((budgetData.remaining / budgetData.totalBudget) * 100)}% of total budget</p>
            <Progress value={(budgetData.remaining / budgetData.totalBudget) * 100} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Budget Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Categories</CardTitle>
          <CardDescription>
            Breakdown of allocated budget by department
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {budgetData.categories.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ${category.spent.toLocaleString()} of ${category.allocated.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-sm font-medium">
                    <span 
                      className={`px-2 py-1 rounded-full text-xs ${
                        category.status === "Over Budget" 
                          ? "bg-red-100 text-red-700" 
                          : category.status === "Under Budget"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {category.status}
                    </span>
                  </div>
                </div>
                <Progress 
                  value={category.progress} 
                  className={`h-2 ${getProgressColor(category.progress, category.status)}`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Expenses */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Recent Expenses</CardTitle>
              <CardDescription>
                Track recent expenditures across departments
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">View All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budgetData.expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.id}</TableCell>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell className="text-right">${expense.amount.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceBudgeting;
