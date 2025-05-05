import axios from 'axios';
import { API_URL } from '@/config/constants';
import { supabase } from '@/lib/supabase';

export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  position: string;
  department: string;
  manager_id?: string;
  manager_name?: string;
  hire_date: string;
  employment_type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  manager_id?: string;
  manager_name?: string;
  employee_count?: number;
  created_at: string;
  updated_at: string;
}

export interface EmployeeFilter {
  search?: string;
  department?: string;
  status?: string;
  employment_type?: string;
  hire_date_from?: string;
  hire_date_to?: string;
}

export interface EmployeeCreateRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  position: string;
  department: string;
  manager_id?: string | null;
  hire_date: string;
  employment_type: string;
  status: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  user_id?: string | null;
  salary?: number | null;
}

export interface EmployeeUpdateRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  position?: string;
  department?: string;
  manager_id?: string | null;
  hire_date?: string;
  employment_type?: string;
  status?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  user_id?: string | null;
  salary?: number | null;
}

export interface DepartmentCreateRequest {
  name: string;
  description?: string;
  manager_id?: string;
}

export interface DepartmentUpdateRequest {
  name?: string;
  description?: string;
  manager_id?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    page_size: number;
    total_count: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

class HRService {
  /**
   * Get all employees with optional filtering, pagination, and sorting
   */
  async getEmployees(
    page: number = 1,
    pageSize: number = 20,
    sortBy: string = 'last_name',
    sortOrder: string = 'asc',
    filters?: EmployeeFilter
  ): Promise<PaginatedResponse<Employee>> {
    try {
      // Get the JWT token from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      // Build query parameters
      const params: Record<string, string | number> = {
        page,
        page_size: pageSize,
        sort_by: sortBy,
        sort_order: sortOrder,
      };

      // Add filters if provided
      if (filters) {
        if (filters.search) params.search = filters.search;
        if (filters.department) params.department = filters.department;
        if (filters.status) params.status = filters.status;
        if (filters.employment_type) params.employment_type = filters.employment_type;
        if (filters.hire_date_from) params.hire_date_from = filters.hire_date_from;
        if (filters.hire_date_to) params.hire_date_to = filters.hire_date_to;
      }

      // Make the API request
      const response = await axios.get(`${API_URL}/api/hr/employees`, {
        params,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  }

  /**
   * Get a specific employee by ID
   */
  async getEmployee(employeeId: string): Promise<Employee> {
    try {
      // Get the JWT token from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      // Make the API request
      const response = await axios.get(`${API_URL}/api/hr/employees/${employeeId}`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error(`Error fetching employee ${employeeId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new employee
   */
  async createEmployee(employeeData: EmployeeCreateRequest): Promise<Employee> {
    try {
      // Get the JWT token from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      // Make the API request
      const response = await axios.post(`${API_URL}/api/hr/employees`, employeeData, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error creating employee:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      console.error('Error config:', error.config);
      throw error;
    }
  }

  /**
   * Update an employee
   */
  async updateEmployee(employeeId: string, employeeData: EmployeeUpdateRequest): Promise<Employee> {
    try {
      // Get the JWT token from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      // Make the API request
      const response = await axios.put(`${API_URL}/api/hr/employees/${employeeId}`, employeeData, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error(`Error updating employee ${employeeId}:`, error);
      throw error;
    }
  }

  /**
   * Delete an employee
   */
  async deleteEmployee(employeeId: string, hardDelete: boolean = false): Promise<void> {
    try {
      // Get the JWT token from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      // Make the API request
      await axios.delete(`${API_URL}/api/hr/employees/${employeeId}`, {
        params: { hard_delete: hardDelete },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
    } catch (error) {
      console.error(`Error deleting employee ${employeeId}:`, error);
      throw error;
    }
  }

  /**
   * Get all departments
   */
  async getDepartments(search?: string): Promise<Department[]> {
    try {
      // Get the JWT token from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      // Build query parameters
      const params: Record<string, string> = {};
      if (search) params.search = search;

      // Make the API request
      const response = await axios.get(`${API_URL}/api/hr/departments`, {
        params,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  }

  /**
   * Get a specific department by ID
   */
  async getDepartment(departmentId: string): Promise<Department> {
    try {
      // Get the JWT token from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      // Make the API request
      const response = await axios.get(`${API_URL}/api/hr/departments/${departmentId}`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error(`Error fetching department ${departmentId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new department
   */
  async createDepartment(departmentData: DepartmentCreateRequest): Promise<Department> {
    try {
      // Get the JWT token from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      // Make the API request
      const response = await axios.post(`${API_URL}/api/hr/departments`, departmentData, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error creating department:', error);
      throw error;
    }
  }

  /**
   * Update a department
   */
  async updateDepartment(departmentId: string, departmentData: DepartmentUpdateRequest): Promise<Department> {
    try {
      // Get the JWT token from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      // Make the API request
      const response = await axios.put(`${API_URL}/api/hr/departments/${departmentId}`, departmentData, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error(`Error updating department ${departmentId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a department
   */
  async deleteDepartment(departmentId: string, hardDelete: boolean = false): Promise<void> {
    try {
      // Get the JWT token from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      // Make the API request
      await axios.delete(`${API_URL}/api/hr/departments/${departmentId}`, {
        params: { hard_delete: hardDelete },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
    } catch (error) {
      console.error(`Error deleting department ${departmentId}:`, error);
      throw error;
    }
  }
}

export default new HRService();
