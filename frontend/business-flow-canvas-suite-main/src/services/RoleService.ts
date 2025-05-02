import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface Role {
  id: string;
  name: string;
  description?: string;
  is_system: boolean;
  created_at?: string;
  updated_at?: string;
  user_count?: number;
  permission_count?: number;
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
  category: string;
  created_at?: string;
  updated_at?: string;
}

export interface RolePermission {
  permission_id: string;
  permission_name: string;
  permission_description?: string;
  permission_category: string;
}

export interface RoleUser {
  user_id: string;
  user_name: string;
  user_email: string;
  user_status: string;
}

export interface RoleCreate {
  name: string;
  description?: string;
  is_system?: boolean;
}

export interface RoleUpdate {
  name?: string;
  description?: string;
}

class RoleService {
  /**
   * Get all roles with optional filtering
   */
  async getAllRoles(search?: string): Promise<Role[]> {
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;

      const response = await axios.get(`${API_URL}/api/admin/roles`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  }

  /**
   * Get a role by ID
   */
  async getRoleById(roleId: string): Promise<Role> {
    try {
      const response = await axios.get(`${API_URL}/api/admin/roles/${roleId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching role ${roleId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new role
   */
  async createRole(roleData: RoleCreate): Promise<Role> {
    try {
      const response = await axios.post(`${API_URL}/api/admin/roles`, roleData);
      return response.data;
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  }

  /**
   * Update a role
   */
  async updateRole(roleId: string, roleData: RoleUpdate): Promise<Role> {
    try {
      const response = await axios.put(`${API_URL}/api/admin/roles/${roleId}`, roleData);
      return response.data;
    } catch (error) {
      console.error(`Error updating role ${roleId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a role
   */
  async deleteRole(roleId: string): Promise<Role> {
    try {
      const response = await axios.delete(`${API_URL}/api/admin/roles/${roleId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting role ${roleId}:`, error);
      throw error;
    }
  }

  /**
   * Get all permissions for a role
   */
  async getRolePermissions(roleId: string): Promise<RolePermission[]> {
    try {
      const response = await axios.get(`${API_URL}/api/admin/roles/${roleId}/permissions`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching permissions for role ${roleId}:`, error);
      throw error;
    }
  }

  /**
   * Assign a permission to a role
   */
  async assignPermissionToRole(roleId: string, permissionId: string): Promise<any> {
    try {
      const response = await axios.post(`${API_URL}/api/admin/roles/${roleId}/permissions`, {
        permission_id: permissionId
      });
      return response.data;
    } catch (error) {
      console.error(`Error assigning permission to role ${roleId}:`, error);
      throw error;
    }
  }

  /**
   * Remove a permission from a role
   */
  async removePermissionFromRole(roleId: string, permissionId: string): Promise<any> {
    try {
      const response = await axios.delete(`${API_URL}/api/admin/roles/${roleId}/permissions/${permissionId}`);
      return response.data;
    } catch (error) {
      console.error(`Error removing permission from role ${roleId}:`, error);
      throw error;
    }
  }

  /**
   * Get all users with a specific role
   */
  async getUsersWithRole(roleId: string): Promise<RoleUser[]> {
    try {
      const response = await axios.get(`${API_URL}/api/admin/roles/${roleId}/users`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching users for role ${roleId}:`, error);
      throw error;
    }
  }

  /**
   * Assign a role to a user
   */
  async assignRoleToUser(roleId: string, userId: string): Promise<any> {
    try {
      const response = await axios.post(`${API_URL}/api/admin/roles/${roleId}/users`, {
        user_id: userId
      });
      return response.data;
    } catch (error) {
      console.error(`Error assigning role ${roleId} to user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Remove a role from a user
   */
  async removeRoleFromUser(roleId: string, userId: string): Promise<any> {
    try {
      const response = await axios.delete(`${API_URL}/api/admin/roles/${roleId}/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error removing role ${roleId} from user ${userId}:`, error);
      throw error;
    }
  }
}

export default new RoleService();
