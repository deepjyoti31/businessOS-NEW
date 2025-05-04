
import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import {
  TransactionService,
  Transaction,
  TransactionCreate,
  TransactionFilter
} from "@/services/TransactionService";
import { DEFAULT_TRANSACTION_CATEGORIES, TRANSACTION_TYPES } from "@/config/constants";

const FinanceTransactions = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [categories, setCategories] = useState<string[]>(DEFAULT_TRANSACTION_CATEGORIES);
  const [filters, setFilters] = useState<TransactionFilter>({});
  const [showFilters, setShowFilters] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState<TransactionCreate>({
    date: format(new Date(), 'yyyy-MM-dd'),
    type: TRANSACTION_TYPES.INCOME,
    description: "",
    amount: 0,
    category: "",
    reference: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch transactions
  const fetchTransactions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const transactionService = TransactionService.getInstance();
      const data = await transactionService.getTransactions(
        page,
        pageSize,
        sortBy,
        sortOrder,
        filters
      );
      setTransactions(data);
      // Calculate total pages (this is a placeholder - in a real app, you'd get this from the API)
      setTotalPages(Math.ceil(data.length / pageSize) || 1);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to load transactions. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load transactions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const transactionService = TransactionService.getInstance();
      const data = await transactionService.getTransactionCategories();

      console.log("Categories from API:", data);
      console.log("Default categories:", DEFAULT_TRANSACTION_CATEGORIES);

      // Combine database categories with default categories to ensure we have a complete list
      const combinedCategories = [...new Set([
        ...data,
        ...DEFAULT_TRANSACTION_CATEGORIES
      ])].sort();

      console.log("Combined categories:", combinedCategories);

      setCategories(combinedCategories);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories(DEFAULT_TRANSACTION_CATEGORIES);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, [page, pageSize, sortBy, sortOrder, filters]);

  // Fetch categories when dialog opens
  useEffect(() => {
    if (isDialogOpen) {
      fetchCategories();
    }
  }, [isDialogOpen]);

  // Handle search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        setFilters(prev => ({ ...prev, search: searchTerm }));
        setPage(1); // Reset to first page when searching
      } else {
        setFilters(prev => {
          const newFilters = { ...prev };
          delete newFilters.search;
          return newFilters;
        });
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Handle new transaction submission
  const handleSubmit = async () => {
    if (!newTransaction.description) {
      toast({
        title: "Validation Error",
        description: "Please enter a description for the transaction.",
        variant: "destructive",
      });
      return;
    }

    if (!newTransaction.amount || newTransaction.amount <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid amount for the transaction.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const transactionService = TransactionService.getInstance();

      // Adjust amount based on transaction type
      const amount = newTransaction.type === TRANSACTION_TYPES.INCOME
        ? Math.abs(newTransaction.amount)
        : -Math.abs(newTransaction.amount);

      await transactionService.createTransaction({
        ...newTransaction,
        amount
      });

      toast({
        title: "Success",
        description: "Transaction created successfully.",
      });

      setIsDialogOpen(false);
      setNewTransaction({
        date: format(new Date(), 'yyyy-MM-dd'),
        type: TRANSACTION_TYPES.INCOME,
        description: "",
        amount: 0,
        category: "",
        reference: ""
      });

      // Refresh transactions
      fetchTransactions();
    } catch (err) {
      console.error("Error creating transaction:", err);
      toast({
        title: "Error",
        description: "Failed to create transaction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter transactions based on search term (client-side filtering as backup)
  const filteredTransactions = transactions.filter((transaction) =>
    !searchTerm ||
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (transaction.id && transaction.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
    transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (transaction.category && transaction.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Transactions</h1>
        <p className="text-muted-foreground">
          Manage and track all your financial transactions
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className="sm:ml-2"
          >
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
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </Button>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
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
              New Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Transaction</DialogTitle>
              <DialogDescription>
                Enter the details for the new transaction.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="transaction-type" className="text-right">
                  Type
                </Label>
                <Select
                  value={newTransaction.type}
                  onValueChange={(value) => setNewTransaction({...newTransaction, type: value as 'Income' | 'Expense'})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TRANSACTION_TYPES.INCOME}>Income</SelectItem>
                    <SelectItem value={TRANSACTION_TYPES.EXPENSE}>Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="transaction-date" className="text-right">
                  Date
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !newTransaction.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newTransaction.date ? format(new Date(newTransaction.date), "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={new Date(newTransaction.date)}
                        onSelect={(date) => setNewTransaction({
                          ...newTransaction,
                          date: date ? format(date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
                        })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="transaction-description" className="text-right">
                  Description
                </Label>
                <Input
                  id="transaction-description"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="transaction-amount" className="text-right">
                  Amount
                </Label>
                <Input
                  id="transaction-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newTransaction.amount || ''}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: parseFloat(e.target.value) || 0})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="transaction-category" className="text-right">
                  Category
                </Label>
                <Select
                  value={newTransaction.category || (categories.length > 0 ? categories[0] : '')}
                  onValueChange={(value) => setNewTransaction({...newTransaction, category: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))
                    ) : (
                      <SelectItem value="Uncategorized">Uncategorized</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="transaction-reference" className="text-right">
                  Reference
                </Label>
                <Input
                  id="transaction-reference"
                  value={newTransaction.reference || ''}
                  onChange={(e) => setNewTransaction({...newTransaction, reference: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Transaction"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {showFilters && (
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="filter-type">Transaction Type</Label>
              <Select
                value={filters.type || 'all'}
                onValueChange={(value) => {
                  if (value && value !== 'all') {
                    setFilters({...filters, type: value});
                  } else {
                    const newFilters = {...filters};
                    delete newFilters.type;
                    setFilters(newFilters);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value={TRANSACTION_TYPES.INCOME}>Income</SelectItem>
                  <SelectItem value={TRANSACTION_TYPES.EXPENSE}>Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filter-category">Category</Label>
              <Select
                value={filters.category || 'all'}
                onValueChange={(value) => {
                  if (value && value !== 'all') {
                    setFilters({...filters, category: value});
                  } else {
                    const newFilters = {...filters};
                    delete newFilters.category;
                    setFilters(newFilters);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({});
                  setSearchTerm('');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center p-8 text-red-500">
              {error}
              <Button
                variant="outline"
                size="sm"
                className="ml-2"
                onClick={fetchTransactions}
              >
                Retry
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id.substring(0, 8)}</TableCell>
                      <TableCell>{format(new Date(transaction.date), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            transaction.type === "Income"
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {transaction.type}
                        </span>
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{transaction.category || 'Uncategorized'}</TableCell>
                      <TableCell className="text-right">
                        <span
                          className={
                            transaction.amount > 0 ? "text-green-600" : "text-red-600"
                          }
                        >
                          ${Math.abs(transaction.amount).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      {Object.keys(filters).length > 0 || searchTerm
                        ? "No transactions found matching your filters."
                        : "No transactions found. Create your first transaction!"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page => Math.max(1, page - 1))}
          disabled={page === 1 || isLoading}
        >
          Previous
        </Button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const pageNumber = i + 1;
          return (
            <Button
              key={pageNumber}
              variant="outline"
              size="sm"
              className={pageNumber === page ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}
              onClick={() => setPage(pageNumber)}
              disabled={isLoading}
            >
              {pageNumber}
            </Button>
          );
        })}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page => Math.min(totalPages, page + 1))}
          disabled={page === totalPages || isLoading}
        >
          Next
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Transaction Assistant</CardTitle>
          <CardDescription>
            Get help analyzing your transactions with AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            Ask our AI to help you categorize transactions, find patterns, or reconcile accounts:
          </p>
          <div className="relative">
            <Input
              type="text"
              placeholder="Ask about your transactions..."
              className="w-full pr-24"
            />
            <Button className="absolute right-1 top-1">
              Ask AI
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceTransactions;
