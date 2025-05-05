"""
Employee service for the HR module.
"""

import time
import logging
from typing import List, Dict, Any, Optional
from datetime import date, datetime
from uuid import UUID
from fastapi import HTTPException

from app.config.supabase import get_supabase_client

# Set up logging
logger = logging.getLogger(__name__)

# Cache for employee data
employee_cache = {}
department_cache = {}

# Cache expiration time (in seconds)
CACHE_EXPIRATION = 300  # 5 minutes

class EmployeeService:
    def __init__(self):
        self.supabase = get_supabase_client()

    async def get_all_employees(
        self,
        page: int = 1,
        page_size: int = 20,
        sort_by: str = "last_name",
        sort_order: str = "asc",
        search_term: Optional[str] = None,
        department: Optional[str] = None,
        status: Optional[str] = None,
        employment_type: Optional[str] = None,
        hire_date_from: Optional[date] = None,
        hire_date_to: Optional[date] = None,
        use_cache: bool = True
    ) -> Dict[str, Any]:
        """
        Get all employees with optional filtering, pagination, and sorting.

        Args:
            page: Page number (default: 1)
            page_size: Number of items per page (default: 20)
            sort_by: Field to sort by (default: "last_name")
            sort_order: Sort order ("asc" or "desc", default: "asc")
            search_term: Optional search term to filter employees by name or email
            department: Optional department filter
            status: Optional status filter
            employment_type: Optional employment type filter
            hire_date_from: Optional hire date range start
            hire_date_to: Optional hire date range end
            use_cache: Whether to use the cache (default: True)

        Returns:
            Dict with employees list and pagination info
        """
        # Generate cache key based on all parameters
        cache_key = f"employees_{page}_{page_size}_{sort_by}_{sort_order}_{search_term}_{department}_{status}_{employment_type}_{hire_date_from}_{hire_date_to}"

        # Check cache first if use_cache is True
        if use_cache and cache_key in employee_cache:
            cache_entry = employee_cache[cache_key]
            # Check if cache is still valid
            if time.time() - cache_entry["timestamp"] < CACHE_EXPIRATION:
                logger.info(f"Using cached employee data for key: {cache_key}")
                return cache_entry["data"]
            else:
                # Cache expired, remove it
                del employee_cache[cache_key]

        try:
            # Calculate offset for pagination
            offset = (page - 1) * page_size

            # Start with the base query using the function that joins with manager data
            query = self.supabase.rpc(
                "get_employees_with_details"
            )

            # Apply filters if provided
            if search_term:
                # Search in first_name, last_name, and email
                query = query.or_(
                    f"first_name.ilike.%{search_term}%,last_name.ilike.%{search_term}%,email.ilike.%{search_term}%,position.ilike.%{search_term}%"
                )

            if department:
                query = query.eq("department", department)

            if status:
                query = query.eq("status", status)

            if employment_type:
                query = query.eq("employment_type", employment_type)

            if hire_date_from:
                query = query.gte("hire_date", hire_date_from.isoformat())

            if hire_date_to:
                query = query.lte("hire_date", hire_date_to.isoformat())

            # Get all employees to count them (not efficient but works for now)
            all_employees_response = query.execute()
            total_count = len(all_employees_response.data) if all_employees_response.data else 0

            # Apply sorting and pagination
            # Create a new query to avoid executing the same query twice
            paged_query = self.supabase.rpc(
                "get_employees_with_details"
            )

            # Apply the same filters
            if search_term:
                paged_query = paged_query.or_(
                    f"first_name.ilike.%{search_term}%,last_name.ilike.%{search_term}%,email.ilike.%{search_term}%,position.ilike.%{search_term}%"
                )
            if department:
                paged_query = paged_query.eq("department", department)
            if status:
                paged_query = paged_query.eq("status", status)
            if employment_type:
                paged_query = paged_query.eq("employment_type", employment_type)
            if hire_date_from:
                paged_query = paged_query.gte("hire_date", hire_date_from.isoformat())
            if hire_date_to:
                paged_query = paged_query.lte("hire_date", hire_date_to.isoformat())

            # Apply sorting and pagination
            if sort_order.lower() == "asc":
                paged_query = paged_query.order(sort_by)
            else:
                paged_query = paged_query.order(sort_by, desc=True)
            paged_query = paged_query.range(offset, offset + page_size - 1)

            # Execute the paged query
            response = paged_query.execute()

            if response.data is None:
                employees = []
            else:
                employees = response.data

            # Calculate pagination info
            total_pages = (total_count + page_size - 1) // page_size if total_count > 0 else 0
            has_next = page < total_pages
            has_prev = page > 1

            result = {
                "items": employees,
                "pagination": {
                    "page": page,
                    "page_size": page_size,
                    "total_count": total_count,
                    "total_pages": total_pages,
                    "has_next": has_next,
                    "has_prev": has_prev
                }
            }

            # Store in cache
            if use_cache:
                employee_cache[cache_key] = {
                    "data": result,
                    "timestamp": time.time()
                }
                logger.info(f"Cached employee data for key: {cache_key}")

            return result

        except Exception as e:
            logger.error(f"Error fetching employees: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error fetching employees: {str(e)}")

    async def get_employee_by_id(self, employee_id: str, use_cache: bool = True) -> Dict[str, Any]:
        """
        Get a specific employee by ID.

        Args:
            employee_id: The employee's UUID
            use_cache: Whether to use the cache (default: True)

        Returns:
            Employee data
        """
        # Check cache first if use_cache is True
        if use_cache and employee_id in employee_cache:
            cache_entry = employee_cache[employee_id]
            # Check if cache is still valid
            if time.time() - cache_entry["timestamp"] < CACHE_EXPIRATION:
                logger.info(f"Using cached employee data for ID: {employee_id}")
                return cache_entry["data"]
            else:
                # Cache expired, remove it
                del employee_cache[employee_id]

        try:
            # Use the RPC function to get employee with manager details
            response = self.supabase.rpc(
                "get_employees_with_details"
            ).eq("id", employee_id).single().execute()

            if not response.data:
                raise HTTPException(status_code=404, detail=f"Employee with ID {employee_id} not found")

            # Store in cache
            if use_cache:
                employee_cache[employee_id] = {
                    "data": response.data,
                    "timestamp": time.time()
                }
                logger.info(f"Cached employee data for ID: {employee_id}")

            return response.data

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error fetching employee {employee_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error fetching employee: {str(e)}")

    async def create_employee(self, employee_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new employee.

        Args:
            employee_data: Employee creation parameters

        Returns:
            Created employee data
        """
        try:
            # Remove any fields that shouldn't be directly inserted
            safe_data = employee_data.copy()
            safe_data.pop("id", None)
            safe_data.pop("created_at", None)
            safe_data.pop("updated_at", None)
            safe_data.pop("is_deleted", None)

            # Convert date objects to strings
            if "hire_date" in safe_data and isinstance(safe_data["hire_date"], date):
                safe_data["hire_date"] = safe_data["hire_date"].isoformat()

            # Create the employee
            response = self.supabase.table("employees").insert(safe_data).execute()

            if not response.data or len(response.data) == 0:
                raise HTTPException(status_code=500, detail="Failed to create employee")

            return response.data[0]
        except Exception as e:
            logger.error(f"Error creating employee: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error creating employee: {str(e)}")

    async def update_employee(self, employee_id: str, employee_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update an employee.

        Args:
            employee_id: The employee's UUID
            employee_data: Employee update parameters

        Returns:
            Updated employee data
        """
        try:
            # Check if the employee exists
            await self.get_employee_by_id(employee_id, use_cache=False)

            # Remove any fields that shouldn't be directly updated
            safe_data = employee_data.copy()
            safe_data.pop("id", None)
            safe_data.pop("created_at", None)
            safe_data.pop("updated_at", None)
            safe_data.pop("is_deleted", None)

            # Convert date objects to strings
            if "hire_date" in safe_data and isinstance(safe_data["hire_date"], date):
                safe_data["hire_date"] = safe_data["hire_date"].isoformat()

            # Update the employee
            response = self.supabase.table("employees").update(safe_data).eq("id", employee_id).execute()

            if not response.data or len(response.data) == 0:
                raise HTTPException(status_code=404, detail=f"Employee with ID {employee_id} not found")

            # Clear cache for this employee
            if employee_id in employee_cache:
                del employee_cache[employee_id]

            # Clear the list cache as well
            for key in list(employee_cache.keys()):
                if key.startswith("employees_"):
                    del employee_cache[key]

            return response.data[0]
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error updating employee {employee_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error updating employee: {str(e)}")

    async def delete_employee(self, employee_id: str, hard_delete: bool = False) -> Dict[str, Any]:
        """
        Delete an employee.

        Args:
            employee_id: The employee's UUID
            hard_delete: Whether to permanently delete the record (default: False)

        Returns:
            Success message
        """
        try:
            # Check if the employee exists
            await self.get_employee_by_id(employee_id, use_cache=False)

            if hard_delete:
                # Permanently delete the employee
                response = self.supabase.table("employees").delete().eq("id", employee_id).execute()
            else:
                # Soft delete the employee
                response = self.supabase.table("employees").update({"is_deleted": True}).eq("id", employee_id).execute()

            if not response.data or len(response.data) == 0:
                raise HTTPException(status_code=404, detail=f"Employee with ID {employee_id} not found")

            # Clear cache for this employee
            if employee_id in employee_cache:
                del employee_cache[employee_id]

            # Clear the list cache as well
            for key in list(employee_cache.keys()):
                if key.startswith("employees_"):
                    del employee_cache[key]

            return {"message": "Employee deleted successfully"}
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error deleting employee {employee_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error deleting employee: {str(e)}")
