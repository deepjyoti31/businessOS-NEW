"""
Transaction service for handling financial transactions.
"""

import os
from typing import Dict, List, Optional, Any
from datetime import datetime
from uuid import UUID
import json

from supabase import create_client, Client

from app.models.finance import Transaction, TransactionCreate, TransactionUpdate, TransactionFilter, TransactionSummary
from app.utils.auth import get_user_id


class TransactionService:
    """Service for handling financial transactions."""

    def __init__(self):
        """Initialize the transaction service with Supabase client."""
        supabase_url = os.environ.get("SUPABASE_URL")
        supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")
        self.supabase: Client = create_client(supabase_url, supabase_key)
        self.table = "transactions"

    async def get_all_transactions(
        self,
        user_id: str,
        filter_params: Optional[TransactionFilter] = None,
        page: int = 1,
        page_size: int = 20,
        sort_by: str = "date",
        sort_order: str = "desc"
    ) -> List[Transaction]:
        """
        Get all transactions for a user with optional filtering, pagination, and sorting.

        Args:
            user_id: The ID of the user
            filter_params: Optional filter parameters
            page: Page number (1-based)
            page_size: Number of items per page
            sort_by: Field to sort by
            sort_order: Sort order ('asc' or 'desc')

        Returns:
            List of transactions
        """
        query = self.supabase.table(self.table).select("*").eq("user_id", user_id).eq("is_deleted", False)

        # Apply filters if provided
        if filter_params:
            if filter_params.start_date:
                query = query.gte("date", filter_params.start_date.isoformat())
            if filter_params.end_date:
                query = query.lte("date", filter_params.end_date.isoformat())
            if filter_params.type:
                query = query.eq("type", filter_params.type)
            if filter_params.category:
                query = query.eq("category", filter_params.category)
            if filter_params.min_amount:
                query = query.gte("amount", filter_params.min_amount)
            if filter_params.max_amount:
                query = query.lte("amount", filter_params.max_amount)
            if filter_params.search:
                query = query.ilike("description", f"%{filter_params.search}%")

        # Apply sorting
        if sort_order.lower() == "asc":
            query = query.order(sort_by)  # Default is ascending
        else:
            query = query.order(sort_by, desc=True)  # Use desc parameter for descending

        # Apply pagination
        offset = (page - 1) * page_size
        query = query.range(offset, offset + page_size - 1)

        response = query.execute()

        if response.data:
            return [Transaction(**item) for item in response.data]
        return []

    async def get_transaction_by_id(self, transaction_id: str, user_id: str) -> Optional[Transaction]:
        """
        Get a specific transaction by ID.

        Args:
            transaction_id: The ID of the transaction
            user_id: The ID of the user

        Returns:
            Transaction if found, None otherwise
        """
        response = self.supabase.table(self.table).select("*").eq("id", transaction_id).eq("user_id", user_id).eq("is_deleted", False).execute()

        if response.data and len(response.data) > 0:
            return Transaction(**response.data[0])
        return None

    async def create_transaction(self, transaction_data: TransactionCreate, user_id: str) -> Transaction:
        """
        Create a new transaction.

        Args:
            transaction_data: The transaction data
            user_id: The ID of the user

        Returns:
            The created transaction
        """
        data = transaction_data.dict()
        data["user_id"] = user_id

        # Convert datetime objects to ISO format strings for JSON serialization
        if isinstance(data.get("date"), datetime):
            data["date"] = data["date"].isoformat()

        # Ensure amount has the correct sign based on transaction type
        if data["type"] == "Income" and data["amount"] < 0:
            data["amount"] = abs(data["amount"])
        elif data["type"] == "Expense" and data["amount"] > 0:
            data["amount"] = -abs(data["amount"])

        response = self.supabase.table(self.table).insert(data).execute()

        if response.data and len(response.data) > 0:
            return Transaction(**response.data[0])
        raise Exception("Failed to create transaction")

    async def update_transaction(self, transaction_id: str, transaction_data: TransactionUpdate, user_id: str) -> Optional[Transaction]:
        """
        Update an existing transaction.

        Args:
            transaction_id: The ID of the transaction
            transaction_data: The updated transaction data
            user_id: The ID of the user

        Returns:
            The updated transaction if found, None otherwise
        """
        # First check if the transaction exists and belongs to the user
        existing = await self.get_transaction_by_id(transaction_id, user_id)
        if not existing:
            return None

        # Update the transaction
        data = {k: v for k, v in transaction_data.dict().items() if v is not None}

        # Convert datetime objects to ISO format strings for JSON serialization
        if isinstance(data.get("date"), datetime):
            data["date"] = data["date"].isoformat()

        # Ensure amount has the correct sign based on transaction type
        if "type" in data and "amount" in data:
            if data["type"] == "Income" and data["amount"] < 0:
                data["amount"] = abs(data["amount"])
            elif data["type"] == "Expense" and data["amount"] > 0:
                data["amount"] = -abs(data["amount"])
        elif "type" in data and data["type"] != existing.type and "amount" not in data:
            # If only the type is changing, adjust the existing amount accordingly
            if data["type"] == "Income" and existing.amount < 0:
                data["amount"] = abs(existing.amount)
            elif data["type"] == "Expense" and existing.amount > 0:
                data["amount"] = -abs(existing.amount)

        response = self.supabase.table(self.table).update(data).eq("id", transaction_id).eq("user_id", user_id).execute()

        if response.data and len(response.data) > 0:
            return Transaction(**response.data[0])
        return None

    async def delete_transaction(self, transaction_id: str, user_id: str, hard_delete: bool = False) -> bool:
        """
        Delete a transaction (soft delete by default).

        Args:
            transaction_id: The ID of the transaction
            user_id: The ID of the user
            hard_delete: Whether to permanently delete the transaction

        Returns:
            True if successful, False otherwise
        """
        # First check if the transaction exists and belongs to the user
        existing = await self.get_transaction_by_id(transaction_id, user_id)
        if not existing:
            return False

        if hard_delete:
            # Permanently delete the transaction
            response = self.supabase.table(self.table).delete().eq("id", transaction_id).eq("user_id", user_id).execute()
        else:
            # Soft delete the transaction
            response = self.supabase.table(self.table).update({"is_deleted": True}).eq("id", transaction_id).eq("user_id", user_id).execute()

        return response.data is not None

    async def get_transaction_summary(self, user_id: str, filter_params: Optional[TransactionFilter] = None) -> TransactionSummary:
        """
        Get summary statistics for transactions.

        Args:
            user_id: The ID of the user
            filter_params: Optional filter parameters

        Returns:
            Transaction summary statistics
        """
        transactions = await self.get_all_transactions(user_id, filter_params, page=1, page_size=1000)

        total_income = sum(t.amount for t in transactions if t.type == "Income")
        total_expenses = sum(t.amount for t in transactions if t.type == "Expense")
        net_amount = total_income + total_expenses  # Expenses are already negative

        # Group by category
        categories = {}
        for t in transactions:
            category = t.category or "Uncategorized"
            if category not in categories:
                categories[category] = {"category": category, "amount": 0, "count": 0}
            categories[category]["amount"] += t.amount
            categories[category]["count"] += 1

        return TransactionSummary(
            total_income=total_income,
            total_expenses=total_expenses,
            net_amount=net_amount,
            transaction_count=len(transactions),
            categories=list(categories.values())
        )

    async def get_transaction_categories(self, user_id: str) -> List[str]:
        """
        Get all unique transaction categories for a user.

        Args:
            user_id: The ID of the user

        Returns:
            List of unique categories
        """
        response = self.supabase.table(self.table).select("category").eq("user_id", user_id).eq("is_deleted", False).execute()

        if response.data:
            # Extract unique non-null categories
            categories = set(item["category"] for item in response.data if item["category"])
            return sorted(list(categories))
        return []
