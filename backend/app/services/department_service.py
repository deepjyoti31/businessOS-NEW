"""
Department service for the HR module.
"""

import time
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime
from uuid import UUID
from fastapi import HTTPException

from app.config.supabase import get_supabase_client

# Set up logging
logger = logging.getLogger(__name__)

# Cache for department data
department_cache = {}

# Cache expiration time (in seconds)
CACHE_EXPIRATION = 300  # 5 minutes

class DepartmentService:
    def __init__(self):
        self.supabase = get_supabase_client()

    async def get_all_departments(
        self,
        search_term: Optional[str] = None,
        use_cache: bool = True
    ) -> List[Dict[str, Any]]:
        """
        Get all departments with optional filtering.

        Args:
            search_term: Optional search term to filter departments by name
            use_cache: Whether to use the cache (default: True)

        Returns:
            List of departments
        """
        # Generate cache key based on search parameter
        cache_key = f"departments_{search_term}"

        # Check cache first if use_cache is True
        if use_cache and cache_key in department_cache:
            cache_entry = department_cache[cache_key]
            # Check if cache is still valid
            if time.time() - cache_entry["timestamp"] < CACHE_EXPIRATION:
                logger.info(f"Using cached department data for key: {cache_key}")
                return cache_entry["data"]
            else:
                # Cache expired, remove it
                del department_cache[cache_key]

        try:
            # Start with the base query
            query = self.supabase.table("departments").select("*").eq("is_deleted", False)

            # Apply search filter if provided
            if search_term:
                query = query.ilike("name", f"%{search_term}%")

            # Execute the query
            response = query.execute()

            if response.data is None:
                departments = []
            else:
                departments = response.data

                # Enhance departments with employee count
                for department in departments:
                    # Get employee count for each department
                    count_response = self.supabase.table("employees").select(
                        "*"
                    ).eq("department", department["name"]).eq("is_deleted", False).execute()

                    department["employee_count"] = len(count_response.data) if count_response.data else 0

                    # Get manager name if manager_id is present
                    if department.get("manager_id"):
                        manager_response = self.supabase.table("employees").select(
                            "first_name, last_name"
                        ).eq("id", department["manager_id"]).single().execute()

                        if manager_response.data:
                            department["manager_name"] = f"{manager_response.data['first_name']} {manager_response.data['last_name']}"

            # Store in cache
            if use_cache:
                department_cache[cache_key] = {
                    "data": departments,
                    "timestamp": time.time()
                }
                logger.info(f"Cached department data for key: {cache_key}")

            return departments

        except Exception as e:
            logger.error(f"Error fetching departments: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error fetching departments: {str(e)}")

    async def get_department_by_id(self, department_id: str, use_cache: bool = True) -> Dict[str, Any]:
        """
        Get a specific department by ID.

        Args:
            department_id: The department's UUID
            use_cache: Whether to use the cache (default: True)

        Returns:
            Department data
        """
        # Check cache first if use_cache is True
        if use_cache and department_id in department_cache:
            cache_entry = department_cache[department_id]
            # Check if cache is still valid
            if time.time() - cache_entry["timestamp"] < CACHE_EXPIRATION:
                logger.info(f"Using cached department data for ID: {department_id}")
                return cache_entry["data"]
            else:
                # Cache expired, remove it
                del department_cache[department_id]

        try:
            response = self.supabase.table("departments").select("*").eq("id", department_id).single().execute()

            if not response.data:
                raise HTTPException(status_code=404, detail=f"Department with ID {department_id} not found")

            department = response.data

            # Get employee count for the department
            count_response = self.supabase.table("employees").select(
                "*"
            ).eq("department", department["name"]).eq("is_deleted", False).execute()

            department["employee_count"] = len(count_response.data) if count_response.data else 0

            # Get manager name if manager_id is present
            if department.get("manager_id"):
                manager_response = self.supabase.table("employees").select(
                    "first_name, last_name"
                ).eq("id", department["manager_id"]).single().execute()

                if manager_response.data:
                    department["manager_name"] = f"{manager_response.data['first_name']} {manager_response.data['last_name']}"

            # Store in cache
            if use_cache:
                department_cache[department_id] = {
                    "data": department,
                    "timestamp": time.time()
                }
                logger.info(f"Cached department data for ID: {department_id}")

            return department

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error fetching department {department_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error fetching department: {str(e)}")

    async def create_department(self, department_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new department.

        Args:
            department_data: Department creation parameters

        Returns:
            Created department data
        """
        try:
            # Remove any fields that shouldn't be directly inserted
            safe_data = department_data.copy()
            safe_data.pop("id", None)
            safe_data.pop("created_at", None)
            safe_data.pop("updated_at", None)
            safe_data.pop("is_deleted", None)
            safe_data.pop("employee_count", None)
            safe_data.pop("manager_name", None)

            # Create the department
            response = self.supabase.table("departments").insert(safe_data).execute()

            if not response.data or len(response.data) == 0:
                raise HTTPException(status_code=500, detail="Failed to create department")

            # Clear the list cache
            for key in list(department_cache.keys()):
                if key.startswith("departments_"):
                    del department_cache[key]

            return response.data[0]
        except Exception as e:
            logger.error(f"Error creating department: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error creating department: {str(e)}")

    async def update_department(self, department_id: str, department_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update a department.

        Args:
            department_id: The department's UUID
            department_data: Department update parameters

        Returns:
            Updated department data
        """
        try:
            # Check if the department exists
            await self.get_department_by_id(department_id, use_cache=False)

            # Remove any fields that shouldn't be directly updated
            safe_data = department_data.copy()
            safe_data.pop("id", None)
            safe_data.pop("created_at", None)
            safe_data.pop("updated_at", None)
            safe_data.pop("is_deleted", None)
            safe_data.pop("employee_count", None)
            safe_data.pop("manager_name", None)

            # Update the department
            response = self.supabase.table("departments").update(safe_data).eq("id", department_id).execute()

            if not response.data or len(response.data) == 0:
                raise HTTPException(status_code=404, detail=f"Department with ID {department_id} not found")

            # Clear cache for this department
            if department_id in department_cache:
                del department_cache[department_id]

            # Clear the list cache as well
            for key in list(department_cache.keys()):
                if key.startswith("departments_"):
                    del department_cache[key]

            return response.data[0]
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error updating department {department_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error updating department: {str(e)}")

    async def delete_department(self, department_id: str, hard_delete: bool = False) -> Dict[str, Any]:
        """
        Delete a department.

        Args:
            department_id: The department's UUID
            hard_delete: Whether to permanently delete the record (default: False)

        Returns:
            Success message
        """
        try:
            # Check if the department exists
            await self.get_department_by_id(department_id, use_cache=False)

            if hard_delete:
                # Permanently delete the department
                response = self.supabase.table("departments").delete().eq("id", department_id).execute()
            else:
                # Soft delete the department
                response = self.supabase.table("departments").update({"is_deleted": True}).eq("id", department_id).execute()

            if not response.data or len(response.data) == 0:
                raise HTTPException(status_code=404, detail=f"Department with ID {department_id} not found")

            # Clear cache for this department
            if department_id in department_cache:
                del department_cache[department_id]

            # Clear the list cache as well
            for key in list(department_cache.keys()):
                if key.startswith("departments_"):
                    del department_cache[key]

            return {"message": "Department deleted successfully"}
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error deleting department {department_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error deleting department: {str(e)}")
