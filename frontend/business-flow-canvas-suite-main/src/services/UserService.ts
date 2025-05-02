import { supabase } from '@/lib/supabase';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  company?: string;
  role?: string;
  department?: string;
  job_title?: string;
  avatar_url?: string;
  contact_info?: Record<string, any>;
  preferences?: Record<string, any>;
  status?: string;
  last_active?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserProfileUpdate {
  name?: string;
  company?: string;
  role?: string;
  department?: string;
  job_title?: string;
  avatar_url?: string;
  contact_info?: Record<string, any>;
  preferences?: Record<string, any>;
  status?: string;
}

export interface UserRole {
  role_id: string;
  role_name: string;
  role_description?: string;
  is_system: boolean;
}

export interface UserPermission {
  permission_id: string;
  permission_name: string;
  permission_description?: string;
  permission_category: string;
}

export interface BulkStatusUpdate {
  user_ids: string[];
  status: string;
}

class UserService {
  /**
   * Get all users with optional filtering
   */
  async getAllUsers(search?: string, status?: string): Promise<UserProfile[]> {
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (status) params.status = status;

      const response = await axios.get(`${API_URL}/api/admin/users`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  /**
   * Get a user by ID
   */
  async getUserById(userId: string): Promise<UserProfile> {
    try {
      const response = await axios.get(`${API_URL}/api/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Update a user's profile
   */
  async updateUser(userId: string, userData: UserProfileUpdate): Promise<UserProfile> {
    try {
      const response = await axios.put(`${API_URL}/api/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Update a user's status (active/inactive)
   */
  async updateUserStatus(userId: string, status: string): Promise<UserProfile> {
    try {
      const response = await axios.put(`${API_URL}/api/admin/users/${userId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating status for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Bulk update status for multiple users
   */
  async bulkUpdateStatus(userIds: string[], status: string): Promise<any> {
    try {
      const response = await axios.post(`${API_URL}/api/admin/users/bulk-status`, {
        user_ids: userIds,
        status
      });
      return response.data;
    } catch (error) {
      console.error('Error performing bulk status update:', error);
      throw error;
    }
  }

  /**
   * Upload a user avatar
   */
  async uploadAvatar(userId: string, file: File): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar-${Date.now()}.${fileExt}`;
      // The path must start with the user's ID to match the storage policy
      const filePath = `${userId}/${fileName}`;

      console.log('Uploading avatar to path:', filePath);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Supabase storage upload error:', error);
        throw error;
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      console.log('Avatar uploaded successfully, URL:', urlData.publicUrl);

      // Update the user's avatar_url
      await this.updateUser(userId, { avatar_url: urlData.publicUrl });

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  }

  /**
   * Get the current authenticated user's profile
   */
  async getCurrentUserProfile(): Promise<UserProfile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return null;

      return await this.getUserById(user.id);
    } catch (error) {
      console.error('Error fetching current user profile:', error);
      return null;
    }
  }

  /**
   * Get all roles assigned to a user
   */
  async getUserRoles(userId: string): Promise<UserRole[]> {
    try {
      const response = await axios.get(`${API_URL}/api/admin/users/${userId}/roles`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching roles for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Assign a role to a user
   */
  async assignRoleToUser(userId: string, roleId: string): Promise<any> {
    try {
      const response = await axios.post(`${API_URL}/api/admin/users/${userId}/roles`, {
        role_id: roleId
      });
      return response.data;
    } catch (error) {
      console.error(`Error assigning role to user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Remove a role from a user
   */
  async removeRoleFromUser(userId: string, roleId: string): Promise<any> {
    try {
      const response = await axios.delete(`${API_URL}/api/admin/users/${userId}/roles/${roleId}`);
      return response.data;
    } catch (error) {
      console.error(`Error removing role from user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get all permissions for a user
   */
  async getUserPermissions(userId: string): Promise<UserPermission[]> {
    try {
      const response = await axios.get(`${API_URL}/api/admin/users/${userId}/permissions`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching permissions for user ${userId}:`, error);
      throw error;
    }
  }
}

export default new UserService();
