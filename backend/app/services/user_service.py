import os
from typing import Dict, List, Optional, Any
import logging
from datetime import datetime

import supabase
from fastapi import HTTPException

logger = logging.getLogger(__name__)

class UserService:
    """Service for managing users and profiles in Supabase."""

    def __init__(self):
        """Initialize the UserService with Supabase client."""
        supabase_url = os.environ.get("SUPABASE_URL")
        supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")

        if not supabase_url or not supabase_key:
            raise ValueError("Supabase credentials not configured")

        self.supabase = supabase.create_client(supabase_url, supabase_key)

    async def get_all_users(self, search_term: Optional[str] = None, status: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Get all users with optional filtering.

        Args:
            search_term: Optional search term to filter users by name or email
            status: Optional status filter ('active' or 'inactive')

        Returns:
            List of user profiles
        """
        try:
            query = self.supabase.table("profiles").select("*")

            # Apply filters if provided
            if status:
                query = query.eq("status", status)

            # Execute the query
            response = query.execute()

            if response.data is None:
                return []

            # If search term is provided, filter results in Python
            # (Supabase doesn't support case-insensitive text search in the free tier)
            if search_term and search_term.strip():
                search_term = search_term.lower()
                filtered_data = []

                # Get user emails from auth.users to match with profiles
                auth_users_response = self.supabase.rpc(
                    "get_users_with_email",
                    {}
                ).execute()

                email_map = {}
                if auth_users_response.data:
                    for user in auth_users_response.data:
                        email_map[user.get("id")] = user.get("email", "").lower()

                for profile in response.data:
                    profile_id = profile.get("id")
                    name = profile.get("name", "").lower()
                    email = email_map.get(profile_id, "").lower()

                    if search_term in name or search_term in email:
                        # Add email to the profile data
                        profile["email"] = email_map.get(profile_id, "")
                        filtered_data.append(profile)

                return filtered_data

            # If no search term, just add emails to profiles
            auth_users_response = self.supabase.rpc(
                "get_users_with_email",
                {}
            ).execute()

            email_map = {}
            if auth_users_response.data:
                for user in auth_users_response.data:
                    email_map[user.get("id")] = user.get("email", "")

            for profile in response.data:
                profile_id = profile.get("id")
                profile["email"] = email_map.get(profile_id, "")

            return response.data

        except Exception as e:
            logger.error(f"Error getting users: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error getting users: {str(e)}")

    async def get_user_by_id(self, user_id: str) -> Dict[str, Any]:
        """
        Get a user profile by ID.

        Args:
            user_id: The user's UUID

        Returns:
            User profile data
        """
        try:
            response = self.supabase.table("profiles").select("*").eq("id", user_id).single().execute()

            if not response.data:
                raise HTTPException(status_code=404, detail=f"User with ID {user_id} not found")

            # Get user email from auth.users
            auth_user_response = self.supabase.rpc(
                "get_user_by_id",
                {"userid": user_id}
            ).execute()

            if auth_user_response.data and len(auth_user_response.data) > 0:
                # The RPC function returns a list, so we need to get the first item
                response.data["email"] = auth_user_response.data[0].get("email", "")

            return response.data

        except Exception as e:
            logger.error(f"Error getting user {user_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error getting user: {str(e)}")

    async def update_user(self, user_id: str, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update a user profile.

        Args:
            user_id: The user's UUID
            user_data: Dictionary containing user profile data to update

        Returns:
            Updated user profile data
        """
        try:
            # Remove any fields that shouldn't be directly updated
            safe_data = user_data.copy()
            safe_data.pop("id", None)
            safe_data.pop("email", None)  # Email is in auth.users, not profiles
            safe_data.pop("created_at", None)
            safe_data.pop("updated_at", None)

            # Update the profile
            response = self.supabase.table("profiles").update(safe_data).eq("id", user_id).execute()

            if not response.data or len(response.data) == 0:
                raise HTTPException(status_code=404, detail=f"User with ID {user_id} not found")

            return response.data[0]

        except Exception as e:
            logger.error(f"Error updating user {user_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error updating user: {str(e)}")

    async def update_user_status(self, user_id: str, status: str) -> Dict[str, Any]:
        """
        Update a user's status (active/inactive).

        Args:
            user_id: The user's UUID
            status: New status ('active' or 'inactive')

        Returns:
            Updated user profile data
        """
        if status not in ["active", "inactive"]:
            raise HTTPException(status_code=400, detail="Status must be 'active' or 'inactive'")

        return await self.update_user(user_id, {"status": status})

    async def bulk_update_status(self, user_ids: List[str], status: str) -> Dict[str, Any]:
        """
        Update status for multiple users.

        Args:
            user_ids: List of user UUIDs
            status: New status ('active' or 'inactive')

        Returns:
            Result of the operation
        """
        if status not in ["active", "inactive"]:
            raise HTTPException(status_code=400, detail="Status must be 'active' or 'inactive'")

        try:
            # Update each user individually
            results = []
            for user_id in user_ids:
                try:
                    result = await self.update_user_status(user_id, status)
                    results.append({"id": user_id, "success": True, "data": result})
                except Exception as e:
                    results.append({"id": user_id, "success": False, "error": str(e)})

            return {
                "total": len(user_ids),
                "successful": sum(1 for r in results if r["success"]),
                "failed": sum(1 for r in results if not r["success"]),
                "results": results
            }

        except Exception as e:
            logger.error(f"Error in bulk status update: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error in bulk status update: {str(e)}")

    async def get_user_roles(self, user_id: str) -> List[Dict[str, Any]]:
        """
        Get all roles assigned to a user.

        Args:
            user_id: The user's UUID

        Returns:
            List of roles
        """
        try:
            # Check if the user exists
            await self.get_user_by_id(user_id)

            # Get roles for the user
            response = self.supabase.rpc(
                "get_user_roles",
                {"user_id": user_id}
            ).execute()

            if not response.data:
                return []

            return response.data
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error fetching roles for user {user_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error fetching user roles: {str(e)}")

    async def assign_role_to_user(self, user_id: str, role_id: str) -> Dict[str, Any]:
        """
        Assign a role to a user.

        Args:
            user_id: The user's UUID
            role_id: The role's UUID

        Returns:
            Created user_role data
        """
        try:
            # Check if the user exists
            await self.get_user_by_id(user_id)

            # Create the user_role
            data = {
                "user_id": user_id,
                "role_id": role_id
            }

            response = self.supabase.table("user_roles").insert(data).execute()

            if not response.data or len(response.data) == 0:
                raise HTTPException(status_code=500, detail="Failed to assign role to user")

            return response.data[0]
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error assigning role {role_id} to user {user_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error assigning role to user: {str(e)}")

    async def remove_role_from_user(self, user_id: str, role_id: str) -> Dict[str, Any]:
        """
        Remove a role from a user.

        Args:
            user_id: The user's UUID
            role_id: The role's UUID

        Returns:
            Deleted user_role data
        """
        try:
            # Check if the user exists
            await self.get_user_by_id(user_id)

            # Delete the user_role
            response = self.supabase.table("user_roles").delete().eq("user_id", user_id).eq("role_id", role_id).execute()

            if not response.data or len(response.data) == 0:
                raise HTTPException(status_code=404, detail=f"Role {role_id} not assigned to user {user_id}")

            return response.data[0]
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error removing role {role_id} from user {user_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error removing role from user: {str(e)}")

    async def get_user_permissions(self, user_id: str) -> List[Dict[str, Any]]:
        """
        Get all permissions for a user.

        Args:
            user_id: The user's UUID

        Returns:
            List of permissions
        """
        try:
            # Check if the user exists
            await self.get_user_by_id(user_id)

            # Get permissions for the user
            response = self.supabase.rpc(
                "get_user_permissions",
                {"user_id": user_id}
            ).execute()

            if not response.data:
                return []

            return response.data
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error fetching permissions for user {user_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error fetching user permissions: {str(e)}")

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
            # Check if the user exists
            await self.get_user_by_id(user_id)

            # Check if the user has the permission
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
        except HTTPException:
            return False
        except Exception as e:
            logger.error(f"Error checking permission for user {user_id}: {str(e)}")
            return False
