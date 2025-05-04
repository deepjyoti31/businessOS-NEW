import { supabase } from '@/lib/supabase';
import { API_URL } from '@/config/constants';

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItemCreate {
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

export interface Invoice {
  id: string;
  user_id: string;
  client_id: string;
  invoice_number: string;
  date: string;
  due_date: string;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
  subtotal: number;
  tax_rate?: number;
  tax_amount?: number;
  total: number;
  notes?: string;
  terms?: string;
  pdf_url?: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  items: InvoiceItem[];
}

export interface InvoiceCreate {
  client_id: string;
  invoice_number: string;
  date: string;
  due_date: string;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
  subtotal: number;
  tax_rate?: number;
  tax_amount?: number;
  total: number;
  notes?: string;
  terms?: string;
  items: InvoiceItemCreate[];
}

export interface InvoiceUpdate {
  client_id?: string;
  invoice_number?: string;
  date?: string;
  due_date?: string;
  status?: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
  subtotal?: number;
  tax_rate?: number;
  tax_amount?: number;
  total?: number;
  notes?: string;
  terms?: string;
  pdf_url?: string;
  is_deleted?: boolean;
}

export interface InvoiceFilter {
  client_id?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  min_amount?: number;
  max_amount?: number;
  search?: string;
}

export interface InvoiceSummary {
  total_invoiced: number;
  outstanding_amount: number;
  overdue_amount: number;
  paid_amount: number;
  invoice_count: number;
  status_counts: {
    Draft: number;
    Sent: number;
    Paid: number;
    Overdue: number;
  };
}

export class InvoiceService {
  private static instance: InvoiceService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = `${API_URL}/api/finance/invoices`;
  }

  public static getInstance(): InvoiceService {
    if (!InvoiceService.instance) {
      InvoiceService.instance = new InvoiceService();
    }
    return InvoiceService.instance;
  }

  /**
   * Get all invoices with optional filtering, pagination, and sorting.
   */
  public async getInvoices(
    page: number = 1,
    pageSize: number = 20,
    sortBy: string = 'date',
    sortOrder: string = 'desc',
    filters?: InvoiceFilter
  ): Promise<Invoice[]> {
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
        throw new Error(errorData.detail || 'Failed to fetch invoices');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  }

  /**
   * Get a specific invoice by ID.
   */
  public async getInvoice(id: string): Promise<Invoice> {
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
        throw new Error(errorData.detail || 'Failed to fetch invoice');
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching invoice ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new invoice.
   */
  public async createInvoice(invoice: InvoiceCreate): Promise<Invoice> {
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
        body: JSON.stringify(invoice),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create invoice');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  }

  /**
   * Update an existing invoice.
   */
  public async updateInvoice(id: string, invoice: InvoiceUpdate): Promise<Invoice> {
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
        body: JSON.stringify(invoice),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update invoice');
      }

      return await response.json();
    } catch (error) {
      console.error(`Error updating invoice ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete an invoice (soft delete by default).
   */
  public async deleteInvoice(id: string, hardDelete: boolean = false): Promise<void> {
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
        throw new Error(errorData.detail || 'Failed to delete invoice');
      }
    } catch (error) {
      console.error(`Error deleting invoice ${id}:`, error);
      throw error;
    }
  }

  /**
   * Mark an invoice as paid.
   */
  public async markInvoiceAsPaid(id: string): Promise<void> {
    try {
      // Get the JWT token from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      // Make the API request
      const response = await fetch(`${this.baseUrl}/${id}/mark-paid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to mark invoice as paid');
      }
    } catch (error) {
      console.error(`Error marking invoice ${id} as paid:`, error);
      throw error;
    }
  }

  /**
   * Get invoice summary statistics.
   */
  public async getInvoiceSummary(filters?: InvoiceFilter): Promise<InvoiceSummary> {
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
        throw new Error(errorData.detail || 'Failed to fetch invoice summary');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching invoice summary:', error);
      throw error;
    }
  }
}
