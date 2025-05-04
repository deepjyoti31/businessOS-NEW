import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { BudgetService, BudgetCategory, BudgetCategoryCreate } from "@/services/BudgetService";
import { TransactionService } from "@/services/TransactionService";
import { DEFAULT_TRANSACTION_CATEGORIES } from "@/config/constants";

// Form schema for category creation/editing
const formSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
  allocated_amount: z.coerce.number().positive("Allocated amount must be positive"),
});

type FormValues = z.infer<typeof formSchema>;

interface CategoryManagementDialogProps {
  budgetId: string;
  onCategoriesUpdated: () => void;
  children?: React.ReactNode;
}

export function CategoryManagementDialog({ budgetId, onCategoriesUpdated, children }: CategoryManagementDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [editingCategory, setEditingCategory] = useState<BudgetCategory | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<BudgetCategory | null>(null);
  const [transactionCategories, setTransactionCategories] = useState<string[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      allocated_amount: 0,
    },
  });

  // Fetch categories when dialog opens
  useEffect(() => {
    if (open) {
      fetchCategories();
      fetchTransactionCategories();
    }
  }, [open]);

  // Fetch transaction categories
  const fetchTransactionCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const transactionService = TransactionService.getInstance();
      const categories = await transactionService.getTransactionCategories();

      // If we got categories from the API, use those
      if (categories && categories.length > 0) {
        setTransactionCategories(categories);
      } else {
        // Otherwise, use the default categories
        setTransactionCategories(DEFAULT_TRANSACTION_CATEGORIES);
      }
    } catch (error) {
      console.error("Error fetching transaction categories:", error);
      // Use default categories on error
      setTransactionCategories(DEFAULT_TRANSACTION_CATEGORIES);
      toast({
        title: "Using default categories",
        description: "Could not fetch custom categories. Using default categories instead.",
        variant: "default",
      });
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Update form values when editing a category
  useEffect(() => {
    if (editingCategory) {
      form.reset({
        name: editingCategory.name,
        description: editingCategory.description || "",
        allocated_amount: editingCategory.allocated_amount,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        allocated_amount: 0,
      });
    }
  }, [editingCategory, form]);

  // Fetch categories
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const budgetService = BudgetService.getInstance();
      const budget = await budgetService.getBudgetById(budgetId);
      if (budget && budget.categories) {
        setCategories(budget.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Error",
        description: "Failed to fetch categories. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const budgetService = BudgetService.getInstance();

      if (editingCategory) {
        // Update existing category
        await budgetService.updateBudgetCategory(
          budgetId,
          editingCategory.id,
          values
        );

        toast({
          title: "Category updated",
          description: "The budget category has been updated successfully.",
        });
      } else {
        // Create new category
        await budgetService.createBudgetCategory(
          budgetId,
          values
        );

        toast({
          title: "Category created",
          description: "The budget category has been created successfully.",
        });
      }

      // Reset form and refresh categories
      form.reset();
      setEditingCategory(null);
      fetchCategories();
      onCategoriesUpdated();
    } catch (error) {
      console.error("Error saving category:", error);
      toast({
        title: "Error",
        description: "Failed to save category. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle category deletion
  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      const budgetService = BudgetService.getInstance();
      await budgetService.deleteBudgetCategory(budgetId, categoryToDelete.id);

      toast({
        title: "Category deleted",
        description: "The budget category has been deleted successfully.",
      });

      // Refresh categories
      fetchCategories();
      onCategoriesUpdated();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children || <Button variant="outline">Manage Categories</Button>}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Manage Budget Categories</DialogTitle>
            <DialogDescription>
              Add, edit, or remove budget categories for better financial tracking.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Form */}
            <div>
              <h3 className="text-lg font-medium mb-4">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category Name</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={isLoadingCategories}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {isLoadingCategories ? (
                                <div className="flex items-center justify-center p-2">
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  <span>Loading categories...</span>
                                </div>
                              ) : (
                                transactionCategories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>
                          Select from existing transaction categories to ensure proper expense tracking.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Budget for marketing activities"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="allocated_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Allocated Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="10000"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The amount allocated to this category in your budget.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex space-x-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {editingCategory ? "Update Category" : "Add Category"}
                    </Button>

                    {editingCategory && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditingCategory(null)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </div>

            {/* Categories List */}
            <div>
              <h3 className="text-lg font-medium mb-4">Current Categories</h3>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-8 border rounded-md">
                  <p className="text-muted-foreground">No categories found.</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add a category to get started.
                  </p>
                </div>
              ) : (
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell className="font-medium">{category.name}</TableCell>
                          <TableCell className="text-right">${category.allocated_amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditingCategory(category)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setCategoryToDelete(category);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the category "{categoryToDelete?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
