import { supabase } from '@/lib/supabase';
import { API_URL } from '@/config/constants';

export interface BudgetCategory {
  id: string;
  budget_id: string;
  name: string;
  description?: string;
  allocated_amount: number;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface Budget {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  total_amount: number;
  start_date: string;
  end_date: string;
  fiscal_year: string;
  status: 'Active' | 'Draft' | 'Archived';
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  categories?: BudgetCategory[];
}

export interface BudgetCreate {
  name: string;
  description?: string;
  total_amount: number;
  start_date: string;
  end_date: string;
  fiscal_year: string;
  status: 'Active' | 'Draft' | 'Archived';
  categories?: {
    name: string;
    description?: string;
    allocated_amount: number;
  }[];
}

export interface BudgetUpdate {
  name?: string;
  description?: string;
  total_amount?: number;
  start_date?: string;
  end_date?: string;
  fiscal_year?: string;
  status?: 'Active' | 'Draft' | 'Archived';
}

export interface BudgetCategoryCreate {
  name: string;
  description?: string;
  allocated_amount: number;
}

export interface BudgetCategoryUpdate {
  name?: string;
  description?: string;
  allocated_amount?: number;
}

export interface BudgetFilter {
  fiscal_year?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
}

export interface BudgetPerformance {
  budget_id: string;
  total_budget: number;
  total_allocated: number;
  total_spent: number;
  remaining_budget: number;
  allocation_percentage: number;
  spending_percentage: number;
  categories: Array<{
    id: string;
    name: string;
    allocated_amount: number;
    spent_amount: number;
    remaining_amount: number;
    spending_percentage: number;
    status: string;
  }>;
}

export class BudgetService {
  private static instance: BudgetService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = `${API_URL}/api/finance/budgets`;
  }

  public static getInstance(): BudgetService {
    if (!BudgetService.instance) {
      BudgetService.instance = new BudgetService();
    }
    return BudgetService.instance;
  }

  /**
   * Get all budgets with optional filtering, pagination, and sorting.
   */
  public async getBudgets(
    page: number = 1,
    pageSize: number = 20,
    sortBy: string = 'created_at',
    sortOrder: string = 'desc',
    filters?: BudgetFilter
  ): Promise<Budget[]> {
    try {
      // Get the JWT token from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      // Build the query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
        sort_by: sortBy,
        sort_order: sortOrder,
      });

      // Add filters if provided
      if (filters) {
        if (filters.fiscal_year) params.append('fiscal_year', filters.fiscal_year);
        if (filters.status) params.append('status', filters.status);
        if (filters.start_date) params.append('start_date', filters.start_date);
        if (filters.end_date) params.append('end_date', filters.end_date);
        if (filters.search) params.append('search', filters.search);
      }

      // Make the API request
      const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch budgets');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching budgets:', error);
      throw error;
    }
  }

  /**
   * Get a specific budget by ID.
   */
  public async getBudgetById(id: string): Promise<Budget> {
    try {
      // Get the JWT token from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      // Make the API request
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch budget');
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching budget ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new budget.
   */
  public async createBudget(budget: BudgetCreate): Promise<Budget> {
    try {
      // Get the JWT token from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      // Make the API request
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(budget),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create budget');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating budget:', error);
      throw error;
    }
  }

  /**
   * Update an existing budget.
   */
  public async updateBudget(id: string, budget: BudgetUpdate): Promise<Budget> {
    try {
      // Get the JWT token from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      // Make the API request
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(budget),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update budget');
      }

      return await response.json();
    } catch (error) {
      console.error(`Error updating budget ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a budget (soft delete by default).
   */
  public async deleteBudget(id: string, hardDelete: boolean = false): Promise<void> {
    try {
      // Get the JWT token from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      // Make the API request
      const response = await fetch(`${this.baseUrl}/${id}?hard_delete=${hardDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete budget');
      }
    } catch (error) {
      console.error(`Error deleting budget ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get budget performance metrics.
   */
  public async getBudgetPerformance(id: string): Promise<BudgetPerformance> {
    try {
      // Get the JWT token from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      // Make the API request
      const response = await fetch(`${this.baseUrl}/${id}/performance`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch budget performance');
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching budget performance for ${id}:`, error);
      throw error;
    }
  }
}
