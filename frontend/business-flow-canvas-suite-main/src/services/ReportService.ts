import { supabase } from '@/lib/supabase';
import { API_URL } from '@/config/constants';

export interface ReportPeriod {
  start_date: string;
  end_date: string;
}

export interface MonthlyReportItem {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface QuarterlyReportItem {
  quarter: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface ExpenseCategoryItem {
  name: string;
  value: number;
  percentage: number;
}

export interface FinancialSummary {
  total_revenue: number;
  total_expenses: number;
  net_profit: number;
  profit_margin: number;
  revenue_change: number;
  expenses_change: number;
  profit_change: number;
}

export interface AIFinancialInsight {
  insight_type: string;
  title: string;
  description: string;
  severity: string;
}

export interface FinancialReportResponse {
  report_type: string;
  period: ReportPeriod;
  summary?: FinancialSummary;
  monthly_data?: MonthlyReportItem[];
  quarterly_data?: QuarterlyReportItem[];
  expense_data?: ExpenseCategoryItem[];
  insights?: AIFinancialInsight[];
}

export class ReportService {
  private static instance: ReportService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = `${API_URL}/api/finance/reports`;
  }

  public static getInstance(): ReportService {
    if (!ReportService.instance) {
      ReportService.instance = new ReportService();
    }
    return ReportService.instance;
  }

  /**
   * Get a financial report with the specified type and period.
   */
  public async getFinancialReport(
    reportType: string = 'monthly',
    startDate?: Date,
    endDate?: Date
  ): Promise<FinancialReportResponse> {
    try {
      // Get the JWT token from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      // Build the query parameters
      const params = new URLSearchParams({
        report_type: reportType,
      });

      if (startDate) {
        params.append('start_date', startDate.toISOString());
      }

      if (endDate) {
        params.append('end_date', endDate.toISOString());
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
        throw new Error(errorData.detail || 'Failed to fetch financial report');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching financial report:', error);
      throw error;
    }
  }

  /**
   * Get a monthly financial report.
   */
  public async getMonthlyReport(
    startDate?: Date,
    endDate?: Date
  ): Promise<FinancialReportResponse> {
    try {
      // Get the JWT token from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      // Build the query parameters
      const params = new URLSearchParams();

      if (startDate) {
        params.append('start_date', startDate.toISOString());
      }

      if (endDate) {
        params.append('end_date', endDate.toISOString());
      }

      // Make the API request
      const response = await fetch(`${this.baseUrl}/monthly?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch monthly report');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching monthly report:', error);
      throw error;
    }
  }

  /**
   * Get a quarterly financial report.
   */
  public async getQuarterlyReport(
    startDate?: Date,
    endDate?: Date
  ): Promise<FinancialReportResponse> {
    try {
      // Get the JWT token from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      // Build the query parameters
      const params = new URLSearchParams();

      if (startDate) {
        params.append('start_date', startDate.toISOString());
      }

      if (endDate) {
        params.append('end_date', endDate.toISOString());
      }

      // Make the API request
      const response = await fetch(`${this.baseUrl}/quarterly?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch quarterly report');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching quarterly report:', error);
      throw error;
    }
  }

  /**
   * Get an expense breakdown report.
   */
  public async getExpenseBreakdown(
    startDate?: Date,
    endDate?: Date
  ): Promise<FinancialReportResponse> {
    try {
      // Get the JWT token from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      // Build the query parameters
      const params = new URLSearchParams();

      if (startDate) {
        params.append('start_date', startDate.toISOString());
      }

      if (endDate) {
        params.append('end_date', endDate.toISOString());
      }

      // Make the API request
      const response = await fetch(`${this.baseUrl}/expense-breakdown?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch expense breakdown');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching expense breakdown:', error);
      throw error;
    }
  }
}
