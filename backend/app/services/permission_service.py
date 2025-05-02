import os
from typing import Dict, List, Optional, Any
import logging
from datetime import datetime

import supabase
from fastapi import HTTPException

logger = logging.getLogger(__name__)

class PermissionService:
    """Service for managing permissions in Supabase."""

    def __init__(self):
        """Initialize the PermissionService with Supabase client."""
        supabase_url = os.environ.get("SUPABASE_URL")
        supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")

        if not supabase_url or not supabase_key:
            raise ValueError("Supabase credentials not configured")

        self.supabase = supabase.create_client(supabase_url, supabase_key)

    async def get_all_permissions(self, category: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Get all permissions with optional filtering by category.

        Args:
            category: Optional category to filter permissions

        Returns:
            List of permissions
        """
        try:
            query = self.supabase.table("permissions").select("*")

            # Apply category filter if provided
            if category:
                query = query.eq("category", category)

            # Execute the query
            response = query.execute()

            if response.data is None:
                return []

            return response.data
        except Exception as e:
            logger.error(f"Error fetching permissions: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error fetching permissions: {str(e)}")

    async def get_permission_by_id(self, permission_id: str) -> Dict[str, Any]:
        """
        Get a permission by ID.

        Args:
            permission_id: The permission's UUID

        Returns:
            Permission data
        """
        try:
            response = self.supabase.table("permissions").select("*").eq("id", permission_id).single().execute()

            if not response.data:
                raise HTTPException(status_code=404, detail=f"Permission with ID {permission_id} not found")

            return response.data
        except Exception as e:
            logger.error(f"Error fetching permission {permission_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error fetching permission: {str(e)}")

    async def create_permission(self, permission_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new permission.

        Args:
            permission_data: Permission data including name, description, and category

        Returns:
            Created permission data
        """
        try:
            # Remove any fields that shouldn't be directly inserted
            safe_data = permission_data.copy()
            safe_data.pop("id", None)
            safe_data.pop("created_at", None)
            safe_data.pop("updated_at", None)

            # Create the permission
            response = self.supabase.table("permissions").insert(safe_data).execute()

            if not response.data or len(response.data) == 0:
                raise HTTPException(status_code=500, detail="Failed to create permission")

            return response.data[0]
        except Exception as e:
            logger.error(f"Error creating permission: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error creating permission: {str(e)}")

    async def update_permission(self, permission_id: str, permission_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update a permission.

        Args:
            permission_id: The permission's UUID
            permission_data: Updated permission data

        Returns:
            Updated permission data
        """
        try:
            # Remove any fields that shouldn't be directly updated
            safe_data = permission_data.copy()
            safe_data.pop("id", None)
            safe_data.pop("created_at", None)
            
            # Set updated_at timestamp
            safe_data["updated_at"] = datetime.now().isoformat()

            # Update the permission
            response = self.supabase.table("permissions").update(safe_data).eq("id", permission_id).execute()

            if not response.data or len(response.data) == 0:
                raise HTTPException(status_code=404, detail=f"Permission with ID {permission_id} not found")

            return response.data[0]
        except Exception as e:
            logger.error(f"Error updating permission {permission_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error updating permission: {str(e)}")

    async def delete_permission(self, permission_id: str) -> Dict[str, Any]:
        """
        Delete a permission.

        Args:
            permission_id: The permission's UUID

        Returns:
            Deleted permission data
        """
        try:
            # Delete the permission
            response = self.supabase.table("permissions").delete().eq("id", permission_id).execute()

            if not response.data or len(response.data) == 0:
                raise HTTPException(status_code=404, detail=f"Permission with ID {permission_id} not found")

            return response.data[0]
        except Exception as e:
            logger.error(f"Error deleting permission {permission_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error deleting permission: {str(e)}")

    async def get_permission_categories(self) -> List[str]:
        """
        Get all unique permission categories.

        Returns:
            List of category names
        """
        try:
            response = self.supabase.rpc(
                "get_permission_categories",
                {}
            ).execute()

            if not response.data:
                return []

            # Extract category names from the response
            categories = [item.get("category") for item in response.data if item.get("category")]
            return categories
        except Exception as e:
            logger.error(f"Error fetching permission categories: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error fetching permission categories: {str(e)}")

    async def get_roles_with_permission(self, permission_id: str) -> List[Dict[str, Any]]:
        """
        Get all roles that have a specific permission.

        Args:
            permission_id: The permission's UUID

        Returns:
            List of roles
        """
        try:
            # Check if the permission exists
            await self.get_permission_by_id(permission_id)

            # Get roles for the permission
            response = self.supabase.rpc(
                "get_roles_with_permission",
                {"permission_id": permission_id}
            ).execute()

            if not response.data:
                return []

            return response.data
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error fetching roles for permission {permission_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error fetching roles with permission: {str(e)}")

    async def check_user_permission(self, user_id: str, permission_name: str) -> bool:
        """
        Check if a user has a specific permission.

        Args:
            user_id: The user's UUID
            permission_name: The permission name to check

        Returns:
            True if the user has the permission, False otherwise
        """
        try:
            response = self.supabase.rpc(
                "user_has_permission",
                {
                    "user_id": user_id,
                    "permission_name": permission_name
                }
            ).execute()

            if not response.data:
                return False

            return response.data
        except Exception as e:
            logger.error(f"Error checking permission for user {user_id}: {str(e)}")
            return False

    async def get_user_permissions(self, user_id: str) -> List[Dict[str, Any]]:
        """
        Get all permissions for a user.

        Args:
            user_id: The user's UUID

        Returns:
            List of permissions
        """
        try:
            response = self.supabase.rpc(
                "get_user_permissions",
                {"user_id": user_id}
            ).execute()

            if not response.data:
                return []

            return response.data
        except Exception as e:
            logger.error(f"Error fetching permissions for user {user_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error fetching user permissions: {str(e)}")
