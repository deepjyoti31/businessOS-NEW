import { supabase } from '@/lib/supabase';

export interface AuditLog {
  id: string;
  timestamp: string;
  user_id: string;
  email?: string;
  action: string;
  details: Record<string, any>;
  category: string;
  severity: string;
  ip_address?: string;
  user_agent?: string;
  resource_id?: string;
  resource_type?: string;
  created_at: string;
}

export interface AuditLogFilter {
  category?: string;
  severity?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

class AuditLogService {
  private static instance: AuditLogService;

  private constructor() {}

  public static getInstance(): AuditLogService {
    if (!AuditLogService.instance) {
      AuditLogService.instance = new AuditLogService();
    }
    return AuditLogService.instance;
  }

  /**
   * Get audit logs with optional filtering, pagination, and sorting.
   */
  public async getAuditLogs(
    page: number = 1,
    pageSize: number = 20,
    sortBy: string = 'created_at',
    sortOrder: string = 'desc',
    filters?: AuditLogFilter
  ): Promise<AuditLog[]> {
    try {
      // Get the JWT token from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      // Build the query
      let query = supabase
        .from('audit_logs')
        .select('*')
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range((page - 1) * pageSize, page * pageSize - 1);

      // Apply filters if provided
      if (filters) {
        if (filters.category) {
          query = query.eq('category', filters.category);
        }
        if (filters.severity) {
          query = query.eq('severity', filters.severity);
        }
        if (filters.startDate) {
          query = query.gte('created_at', filters.startDate);
        }
        if (filters.endDate) {
          query = query.lte('created_at', filters.endDate);
        }
        if (filters.search) {
          query = query.or(`action.ilike.%${filters.search}%,details->message.ilike.%${filters.search}%`);
        }
      }

      // Execute the query
      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data as AuditLog[];
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw error;
    }
  }

  /**
   * Get recent activity logs for the dashboard.
   */
  public async getRecentActivity(limit: number = 5): Promise<AuditLog[]> {
    try {
      // Get the JWT token from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      // Execute the query
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return data as AuditLog[];
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      throw error;
    }
  }
}

export default AuditLogService;
