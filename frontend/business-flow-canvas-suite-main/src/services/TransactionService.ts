import { supabase } from '@/lib/supabase';
import { API_URL } from '@/config/constants';

export interface Transaction {
  id: string;
  user_id: string;
  date: string;
  type: 'Income' | 'Expense';
  description: string;
  amount: number;
  category?: string;
  reference?: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface TransactionCreate {
  date: string;
  type: 'Income' | 'Expense';
  description: string;
  amount: number;
  category?: string;
  reference?: string;
}

export interface TransactionUpdate {
  date?: string;
  type?: 'Income' | 'Expense';
  description?: string;
  amount?: number;
  category?: string;
  reference?: string;
  is_deleted?: boolean;
}

export interface TransactionFilter {
  start_date?: string;
  end_date?: string;
  type?: string;
  category?: string;
  min_amount?: number;
  max_amount?: number;
  search?: string;
}

export interface TransactionSummary {
  total_income: number;
  total_expenses: number;
  net_amount: number;
  transaction_count: number;
  categories: Array<{
    category: string;
    amount: number;
    count: number;
  }>;
}

export class TransactionService {
  private static instance: TransactionService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = `${API_URL}/api/finance/transactions`;
  }

  public static getInstance(): TransactionService {
    if (!TransactionService.instance) {
      TransactionService.instance = new TransactionService();
    }
    return TransactionService.instance;
  }

  /**
   * Get all transactions with optional filtering, pagination, and sorting.
   */
  public async getTransactions(
    page: number = 1,
    pageSize: number = 20,
    sortBy: string = 'date',
    sortOrder: string = 'desc',
    filters?: TransactionFilter
  ): Promise<Transaction[]> {
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

      // Add filter parameters if provided
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
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
        throw new Error(errorData.detail || 'Failed to fetch transactions');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  /**
   * Get a specific transaction by ID.
   */
  public async getTransaction(id: string): Promise<Transaction> {
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
        throw new Error(errorData.detail || 'Failed to fetch transaction');
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching transaction ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new transaction.
   */
  public async createTransaction(transaction: TransactionCreate): Promise<Transaction> {
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
        body: JSON.stringify(transaction),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create transaction');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  /**
   * Update an existing transaction.
   */
  public async updateTransaction(id: string, transaction: TransactionUpdate): Promise<Transaction> {
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
        body: JSON.stringify(transaction),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update transaction');
      }

      return await response.json();
    } catch (error) {
      console.error(`Error updating transaction ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a transaction (soft delete by default).
   */
  public async deleteTransaction(id: string, hardDelete: boolean = false): Promise<void> {
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
        throw new Error(errorData.detail || 'Failed to delete transaction');
      }
    } catch (error) {
      console.error(`Error deleting transaction ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get transaction summary statistics.
   */
  public async getTransactionSummary(filters?: TransactionFilter): Promise<TransactionSummary> {
    try {
      // Get the JWT token from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      // Build the query parameters
      const params = new URLSearchParams();

      // Add filter parameters if provided
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }

      // Make the API request
      const response = await fetch(`${this.baseUrl}/summary?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch transaction summary');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching transaction summary:', error);
      throw error;
    }
  }

  /**
   * Get all unique transaction categories.
   */
  public async getTransactionCategories(): Promise<string[]> {
    try {
      // Get the JWT token from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      // Make the API request
      const response = await fetch(`${this.baseUrl}/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch transaction categories');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching transaction categories:', error);
      throw error;
    }
  }
}
