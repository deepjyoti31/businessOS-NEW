import os
from typing import Dict, List, Optional, Any
import logging
from datetime import datetime

import supabase
from fastapi import HTTPException

logger = logging.getLogger(__name__)

class RoleService:
    """Service for managing roles and permissions in Supabase."""

    def __init__(self):
        """Initialize the RoleService with Supabase client."""
        supabase_url = os.environ.get("SUPABASE_URL")
        supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")

        if not supabase_url or not supabase_key:
            raise ValueError("Supabase credentials not configured")

        self.supabase = supabase.create_client(supabase_url, supabase_key)

    async def get_all_roles(self, search_term: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Get all roles with optional filtering.

        Args:
            search_term: Optional search term to filter roles by name

        Returns:
            List of roles
        """
        try:
            # Use the get_roles_with_stats function to get roles with user and permission counts
            response = self.supabase.rpc(
                "get_roles_with_stats"
            ).execute()

            if response.data is None:
                return []

            # Map the response to match the expected format
            roles = []
            for role in response.data:
                roles.append({
                    "id": role.get("role_id"),
                    "name": role.get("role_name"),
                    "description": role.get("role_description"),
                    "is_system": role.get("is_system"),
                    "created_at": role.get("created_at"),
                    "updated_at": role.get("updated_at"),
                    "user_count": role.get("user_count"),
                    "permission_count": role.get("permission_count")
                })

            # If search term is provided, filter results in Python
            if search_term and search_term.strip():
                search_term = search_term.lower()
                filtered_data = []

                for role in roles:
                    name = role.get("name", "").lower()
                    description = role.get("description", "").lower()

                    if search_term in name or search_term in description:
                        filtered_data.append(role)

                return filtered_data

            return roles
        except Exception as e:
            logger.error(f"Error fetching roles: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error fetching roles: {str(e)}")

    async def get_role_by_id(self, role_id: str) -> Dict[str, Any]:
        """
        Get a role by ID.

        Args:
            role_id: The role's UUID

        Returns:
            Role data
        """
        try:
            response = self.supabase.table("roles").select("*").eq("id", role_id).single().execute()

            if not response.data:
                raise HTTPException(status_code=404, detail=f"Role with ID {role_id} not found")

            return response.data
        except Exception as e:
            logger.error(f"Error fetching role {role_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error fetching role: {str(e)}")

    async def create_role(self, role_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new role.

        Args:
            role_data: Role data including name and description

        Returns:
            Created role data
        """
        try:
            # Remove any fields that shouldn't be directly inserted
            safe_data = role_data.copy()
            safe_data.pop("id", None)
            safe_data.pop("created_at", None)
            safe_data.pop("updated_at", None)

            # Set is_system to False for user-created roles
            if "is_system" not in safe_data:
                safe_data["is_system"] = False

            # Create the role
            response = self.supabase.table("roles").insert(safe_data).execute()

            if not response.data or len(response.data) == 0:
                raise HTTPException(status_code=500, detail="Failed to create role")

            return response.data[0]
        except Exception as e:
            logger.error(f"Error creating role: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error creating role: {str(e)}")

    async def update_role(self, role_id: str, role_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update a role.

        Args:
            role_id: The role's UUID
            role_data: Updated role data

        Returns:
            Updated role data
        """
        try:
            # Check if the role exists and is not a system role
            existing_role = await self.get_role_by_id(role_id)

            if existing_role.get("is_system", False):
                # Allow updating description of system roles, but not the name
                if "name" in role_data and role_data["name"] != existing_role["name"]:
                    raise HTTPException(status_code=403, detail="Cannot modify the name of system roles")

            # Remove any fields that shouldn't be directly updated
            safe_data = role_data.copy()
            safe_data.pop("id", None)
            safe_data.pop("created_at", None)
            safe_data.pop("is_system", None)  # Don't allow changing is_system flag

            # Set updated_at timestamp
            safe_data["updated_at"] = datetime.now().isoformat()

            # Update the role
            response = self.supabase.table("roles").update(safe_data).eq("id", role_id).execute()

            if not response.data or len(response.data) == 0:
                raise HTTPException(status_code=404, detail=f"Role with ID {role_id} not found")

            return response.data[0]
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error updating role {role_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error updating role: {str(e)}")

    async def delete_role(self, role_id: str) -> Dict[str, Any]:
        """
        Delete a role.

        Args:
            role_id: The role's UUID

        Returns:
            Deleted role data
        """
        try:
            # Check if the role exists and is not a system role
            existing_role = await self.get_role_by_id(role_id)

            if existing_role.get("is_system", False):
                raise HTTPException(status_code=403, detail="Cannot delete system roles")

            # Delete the role
            response = self.supabase.table("roles").delete().eq("id", role_id).execute()

            if not response.data or len(response.data) == 0:
                raise HTTPException(status_code=404, detail=f"Role with ID {role_id} not found")

            return response.data[0]
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error deleting role {role_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error deleting role: {str(e)}")

    async def get_role_permissions(self, role_id: str) -> List[Dict[str, Any]]:
        """
        Get all permissions assigned to a role.

        Args:
            role_id: The role's UUID

        Returns:
            List of permissions
        """
        try:
            # Check if the role exists
            await self.get_role_by_id(role_id)

            # Get permissions for the role
            response = self.supabase.rpc(
                "get_role_permissions",
                {"role_id": role_id}
            ).execute()

            if not response.data:
                return []

            return response.data
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error fetching permissions for role {role_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error fetching role permissions: {str(e)}")

    async def assign_permission_to_role(self, role_id: str, permission_id: str) -> Dict[str, Any]:
        """
        Assign a permission to a role.

        Args:
            role_id: The role's UUID
            permission_id: The permission's UUID

        Returns:
            Created role_permission data
        """
        try:
            # Check if the role exists
            await self.get_role_by_id(role_id)

            # Create the role_permission
            data = {
                "role_id": role_id,
                "permission_id": permission_id
            }

            response = self.supabase.table("role_permissions").insert(data).execute()

            if not response.data or len(response.data) == 0:
                raise HTTPException(status_code=500, detail="Failed to assign permission to role")

            return response.data[0]
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error assigning permission {permission_id} to role {role_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error assigning permission to role: {str(e)}")

    async def remove_permission_from_role(self, role_id: str, permission_id: str) -> Dict[str, Any]:
        """
        Remove a permission from a role.

        Args:
            role_id: The role's UUID
            permission_id: The permission's UUID

        Returns:
            Deleted role_permission data
        """
        try:
            # Check if the role exists
            role = await self.get_role_by_id(role_id)

            # Don't allow removing essential permissions from system roles
            if role.get("is_system", False) and role.get("name") == "Admin":
                # For Admin role, check if this is a critical permission
                # This is a simplified check - in a real system, you might have a more sophisticated approach
                raise HTTPException(status_code=403, detail="Cannot remove essential permissions from the Admin role")

            # Delete the role_permission
            response = self.supabase.table("role_permissions").delete().eq("role_id", role_id).eq("permission_id", permission_id).execute()

            if not response.data or len(response.data) == 0:
                raise HTTPException(status_code=404, detail=f"Permission {permission_id} not assigned to role {role_id}")

            return response.data[0]
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error removing permission {permission_id} from role {role_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error removing permission from role: {str(e)}")

    async def get_users_with_role(self, role_id: str) -> List[Dict[str, Any]]:
        """
        Get all users assigned to a role.

        Args:
            role_id: The role's UUID

        Returns:
            List of users
        """
        try:
            # Check if the role exists
            await self.get_role_by_id(role_id)

            # Get users for the role
            response = self.supabase.rpc(
                "get_users_with_role",
                {"role_id": role_id}
            ).execute()

            if not response.data:
                return []

            return response.data
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error fetching users for role {role_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error fetching users with role: {str(e)}")
