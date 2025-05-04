"""
Client service for handling client operations.
"""

import os
from typing import Dict, List, Optional, Any
from datetime import datetime
from uuid import UUID

from supabase import create_client, Client

from app.models.clients import Client, ClientCreate, ClientUpdate, ClientFilter


class ClientService:
    """Service for handling client operations."""

    def __init__(self):
        """Initialize the client service with Supabase client."""
        supabase_url = os.environ.get("SUPABASE_URL")
        supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")
        self.supabase: Client = create_client(supabase_url, supabase_key)
        self.table = "clients"

    async def get_client_by_id(self, client_id: str, user_id: str) -> Optional[Client]:
        """
        Get a client by ID.

        Args:
            client_id: The ID of the client
            user_id: The ID of the user

        Returns:
            The client if found, None otherwise
        """
        response = self.supabase.table(self.table).select("*") \
            .eq("id", client_id) \
            .eq("user_id", user_id) \
            .eq("is_deleted", False) \
            .execute()

        if response.data and len(response.data) > 0:
            return Client(**response.data[0])
        return None

    async def get_all_clients(
        self,
        user_id: str,
        filter_params: Optional[ClientFilter] = None,
        page: int = 1,
        page_size: int = 20,
        sort_by: str = "name",
        sort_order: str = "asc"
    ) -> List[Client]:
        """
        Get all clients for a user with optional filtering, pagination, and sorting.

        Args:
            user_id: The ID of the user
            filter_params: Optional filter parameters
            page: The page number (1-indexed)
            page_size: The number of items per page
            sort_by: The field to sort by
            sort_order: The sort order ('asc' or 'desc')

        Returns:
            List of clients
        """
        query = self.supabase.table(self.table).select("*") \
            .eq("user_id", user_id) \
            .eq("is_deleted", False)

        # Apply filters if provided
        if filter_params:
            if filter_params.search:
                query = query.or_(f"name.ilike.%{filter_params.search}%,contact_name.ilike.%{filter_params.search}%,email.ilike.%{filter_params.search}%")
            if filter_params.city:
                query = query.eq("city", filter_params.city)
            if filter_params.state:
                query = query.eq("state", filter_params.state)
            if filter_params.country:
                query = query.eq("country", filter_params.country)

        # Apply sorting
        if sort_order.lower() == "desc":
            query = query.order(sort_by, desc=True)
        else:
            query = query.order(sort_by)

        # Apply pagination
        offset = (page - 1) * page_size
        query = query.range(offset, offset + page_size - 1)

        response = query.execute()

        if response.data:
            return [Client(**item) for item in response.data]
        return []

    async def create_client(self, client_data: ClientCreate, user_id: str) -> Client:
        """
        Create a new client.

        Args:
            client_data: The client data
            user_id: The ID of the user

        Returns:
            The created client
        """
        data = client_data.dict()
        data["user_id"] = user_id

        response = self.supabase.table(self.table).insert(data).execute()

        if response.data and len(response.data) > 0:
            return Client(**response.data[0])
        raise Exception("Failed to create client")

    async def update_client(self, client_id: str, client_data: ClientUpdate, user_id: str) -> Optional[Client]:
        """
        Update an existing client.

        Args:
            client_id: The ID of the client
            client_data: The updated client data
            user_id: The ID of the user

        Returns:
            The updated client if found, None otherwise
        """
        # First check if the client exists and belongs to the user
        existing = await self.get_client_by_id(client_id, user_id)
        if not existing:
            return None

        data = {k: v for k, v in client_data.dict().items() if v is not None}
        data["updated_at"] = datetime.now().isoformat()

        response = self.supabase.table(self.table).update(data).eq("id", client_id).eq("user_id", user_id).execute()

        if response.data and len(response.data) > 0:
            return Client(**response.data[0])
        return None

    async def delete_client(self, client_id: str, user_id: str, hard_delete: bool = False) -> bool:
        """
        Delete a client (soft delete by default).

        Args:
            client_id: The ID of the client
            user_id: The ID of the user
            hard_delete: Whether to permanently delete the client

        Returns:
            True if successful, False otherwise
        """
        # First check if the client exists and belongs to the user
        existing = await self.get_client_by_id(client_id, user_id)
        if not existing:
            return False

        if hard_delete:
            # Permanently delete the client
            response = self.supabase.table(self.table).delete().eq("id", client_id).eq("user_id", user_id).execute()
        else:
            # Soft delete the client
            response = self.supabase.table(self.table).update({"is_deleted": True, "updated_at": datetime.now().isoformat()}) \
                .eq("id", client_id).eq("user_id", user_id).execute()

        return response.data is not None and len(response.data) > 0
