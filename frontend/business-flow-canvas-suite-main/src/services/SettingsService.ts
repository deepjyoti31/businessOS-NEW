import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface SystemSetting {
  id?: string;
  category: string;
  key: string;
  value: any;
  description?: string;
  data_type: string;
  created_at?: string;
  updated_at?: string;
}

export interface SettingUpdate {
  value: any;
  data_type?: string;
}

class SettingsService {
  /**
   * Get all system settings
   */
  async getAllSettings(): Promise<SystemSetting[]> {
    try {
      const response = await axios.get(`${API_URL}/api/admin/settings`);
      return response.data;
    } catch (error) {
      console.error('Error fetching system settings:', error);
      throw error;
    }
  }

  /**
   * Get all setting categories
   */
  async getSettingCategories(): Promise<string[]> {
    try {
      const response = await axios.get(`${API_URL}/api/admin/settings/categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching setting categories:', error);
      throw error;
    }
  }

  /**
   * Get settings by category
   */
  async getSettingsByCategory(category: string): Promise<SystemSetting[]> {
    try {
      const response = await axios.get(`${API_URL}/api/admin/settings/${category}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching settings for category ${category}:`, error);
      throw error;
    }
  }

  /**
   * Get a specific setting
   */
  async getSetting(category: string, key: string): Promise<SystemSetting> {
    try {
      const response = await axios.get(`${API_URL}/api/admin/settings/${category}/${key}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching setting ${category}.${key}:`, error);
      throw error;
    }
  }

  /**
   * Update a setting
   */
  async updateSetting(category: string, key: string, settingData: SettingUpdate): Promise<SystemSetting> {
    try {
      const response = await axios.put(`${API_URL}/api/admin/settings/${category}/${key}`, settingData);
      return response.data;
    } catch (error) {
      console.error(`Error updating setting ${category}.${key}:`, error);
      throw error;
    }
  }

  /**
   * Get a setting value with type conversion
   */
  async getSettingValue<T>(category: string, key: string, defaultValue: T): Promise<T> {
    try {
      const setting = await this.getSetting(category, key);
      return setting.value as T;
    } catch (error) {
      console.warn(`Setting ${category}.${key} not found, using default value:`, defaultValue);
      return defaultValue;
    }
  }

  /**
   * Get all settings for multiple categories
   */
  async getSettingsForCategories(categories: string[]): Promise<Record<string, SystemSetting[]>> {
    try {
      const result: Record<string, SystemSetting[]> = {};
      
      // Use Promise.all to fetch all categories in parallel
      await Promise.all(
        categories.map(async (category) => {
          const settings = await this.getSettingsByCategory(category);
          result[category] = settings;
        })
      );
      
      return result;
    } catch (error) {
      console.error('Error fetching settings for multiple categories:', error);
      throw error;
    }
  }
}

export default new SettingsService();
