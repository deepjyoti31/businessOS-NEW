import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface CompanyProfile {
  id?: string;
  name: string;
  logo_url?: string;
  industry?: string;
  size?: string;
  founded?: string;
  website?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  tax_id?: string;
  registration_number?: string;
  fiscal_year?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CompanyProfileUpdate {
  name?: string;
  industry?: string;
  size?: string;
  founded?: string;
  website?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  tax_id?: string;
  registration_number?: string;
  fiscal_year?: string;
}

class CompanyService {
  /**
   * Get the company profile
   */
  async getCompanyProfile(): Promise<CompanyProfile> {
    try {
      const response = await axios.get(`${API_URL}/api/admin/company`);
      return response.data;
    } catch (error) {
      console.error('Error fetching company profile:', error);
      throw error;
    }
  }

  /**
   * Update the company profile
   */
  async updateCompanyProfile(profileData: CompanyProfileUpdate): Promise<CompanyProfile> {
    try {
      const response = await axios.put(`${API_URL}/api/admin/company`, profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating company profile:', error);
      throw error;
    }
  }

  /**
   * Upload a company logo
   */
  async uploadLogo(file: File): Promise<CompanyProfile> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API_URL}/api/admin/company/logo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading company logo:', error);
      throw error;
    }
  }

  /**
   * Upload a company logo using base64 data
   */
  async uploadLogoBase64(fileName: string, fileData: string): Promise<CompanyProfile> {
    try {
      const formData = new FormData();
      formData.append('file_name', fileName);
      formData.append('file_data', fileData);

      const response = await axios.post(`${API_URL}/api/admin/company/logo/base64`, formData);
      return response.data;
    } catch (error) {
      console.error('Error uploading company logo:', error);
      throw error;
    }
  }
}

export default new CompanyService();
