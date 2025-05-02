import axios from 'axios';
import { Permission } from './RoleService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface PermissionCreate {
  name: string;
  description?: string;
  category: string;
}

export interface PermissionUpdate {
  name?: string;
  description?: string;
  category?: string;
}

export interface PermissionRole {
  role_id: string;
  role_name: string;
  role_description?: string;
  is_system: boolean;
}

class PermissionService {
  /**
   * Get all permissions with optional filtering by category
   */
  async getAllPermissions(category?: string): Promise<Permission[]> {
    try {
      const params: Record<string, string> = {};
      if (category) params.category = category;

      const response = await axios.get(`${API_URL}/api/admin/permissions`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching permissions:', error);
      throw error;
    }
  }

  /**
   * Get all permission categories
   */
  async getPermissionCategories(): Promise<string[]> {
    try {
      const response = await axios.get(`${API_URL}/api/admin/permissions/categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching permission categories:', error);
      throw error;
    }
  }

  /**
   * Get a permission by ID
   */
  async getPermissionById(permissionId: string): Promise<Permission> {
    try {
      const response = await axios.get(`${API_URL}/api/admin/permissions/${permissionId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching permission ${permissionId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new permission
   */
  async createPermission(permissionData: PermissionCreate): Promise<Permission> {
    try {
      const response = await axios.post(`${API_URL}/api/admin/permissions`, permissionData);
      return response.data;
    } catch (error) {
      console.error('Error creating permission:', error);
      throw error;
    }
  }

  /**
   * Update a permission
   */
  async updatePermission(permissionId: string, permissionData: PermissionUpdate): Promise<Permission> {
    try {
      const response = await axios.put(`${API_URL}/api/admin/permissions/${permissionId}`, permissionData);
      return response.data;
    } catch (error) {
      console.error(`Error updating permission ${permissionId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a permission
   */
  async deletePermission(permissionId: string): Promise<Permission> {
    try {
      const response = await axios.delete(`${API_URL}/api/admin/permissions/${permissionId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting permission ${permissionId}:`, error);
      throw error;
    }
  }

  /**
   * Get all roles that have a specific permission
   */
  async getRolesWithPermission(permissionId: string): Promise<PermissionRole[]> {
    try {
      const response = await axios.get(`${API_URL}/api/admin/permissions/${permissionId}/roles`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching roles for permission ${permissionId}:`, error);
      throw error;
    }
  }
}

export default new PermissionService();
