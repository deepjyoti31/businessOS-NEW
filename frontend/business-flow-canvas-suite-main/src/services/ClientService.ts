import { supabase } from '@/lib/supabase';
import { API_URL } from '@/config/constants';

export interface Client {
  id: string;
  user_id: string;
  name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface ClientCreate {
  name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface ClientUpdate {
  name?: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  is_deleted?: boolean;
}

export interface ClientFilter {
  search?: string;
  city?: string;
  state?: string;
  country?: string;
}

export class ClientService {
  private static instance: ClientService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = `${API_URL}/api/finance/clients`;
  }

  public static getInstance(): ClientService {
    if (!ClientService.instance) {
      ClientService.instance = new ClientService();
    }
    return ClientService.instance;
  }

  /**
   * Get all clients with optional filtering, pagination, and sorting.
   */
  public async getClients(
    page: number = 1,
    pageSize: number = 20,
    sortBy: string = 'name',
    sortOrder: string = 'asc',
    filters?: ClientFilter
  ): Promise<Client[]> {
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
        throw new Error(errorData.detail || 'Failed to fetch clients');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  }

  /**
   * Get a specific client by ID.
   */
  public async getClient(id: string): Promise<Client> {
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
        throw new Error(errorData.detail || 'Failed to fetch client');
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching client ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new client.
   */
  public async createClient(client: ClientCreate): Promise<Client> {
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
        body: JSON.stringify(client),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create client');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  }

  /**
   * Update an existing client.
   */
  public async updateClient(id: string, client: ClientUpdate): Promise<Client> {
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
        body: JSON.stringify(client),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update client');
      }

      return await response.json();
    } catch (error) {
      console.error(`Error updating client ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a client (soft delete by default).
   */
  public async deleteClient(id: string, hardDelete: boolean = false): Promise<void> {
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
        throw new Error(errorData.detail || 'Failed to delete client');
      }
    } catch (error) {
      console.error(`Error deleting client ${id}:`, error);
      throw error;
    }
  }
}
