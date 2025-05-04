"""
Budget service for handling budget operations.
"""

import os
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime
from uuid import UUID, uuid4

from supabase import create_client, Client

from app.models.budget import (
    Budget, BudgetCreate, BudgetUpdate, BudgetFilter,
    BudgetCategory, BudgetCategoryCreate, BudgetCategoryUpdate,
    BudgetPerformance
)

logger = logging.getLogger(__name__)

class BudgetService:
    """Service for handling budget operations."""

    def __init__(self):
        """Initialize the budget service with Supabase client."""
        supabase_url = os.environ.get("SUPABASE_URL")
        supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")

        if not supabase_url or not supabase_key:
            logger.error("Supabase URL and key must be provided")
            raise ValueError("Supabase URL and key must be provided")

        self.supabase: Client = create_client(supabase_url, supabase_key)
        self.budget_table = "budgets"
        self.category_table = "budget_categories"
        self.expense_table = "budget_expenses"
        self.transaction_table = "transactions"

    async def get_all_budgets(
        self,
        user_id: str,
        filter_params: Optional[BudgetFilter] = None,
        page: int = 1,
        page_size: int = 20,
        sort_by: str = "created_at",
        sort_order: str = "desc"
    ) -> List[Budget]:
        """
        Get all budgets for a user with optional filtering, pagination, and sorting.

        Args:
            user_id: The ID of the user
            filter_params: Optional filter parameters
            page: Page number (1-based)
            page_size: Number of items per page
            sort_by: Field to sort by
            sort_order: Sort order ('asc' or 'desc')

        Returns:
            List of budgets
        """
        query = self.supabase.table(self.budget_table).select("*").eq("user_id", user_id).eq("is_deleted", False)

        # Apply filters if provided
        if filter_params:
            if filter_params.fiscal_year:
                query = query.eq("fiscal_year", filter_params.fiscal_year)
            if filter_params.status:
                query = query.eq("status", filter_params.status)
            if filter_params.start_date:
                query = query.gte("start_date", filter_params.start_date.isoformat())
            if filter_params.end_date:
                query = query.lte("end_date", filter_params.end_date.isoformat())
            if filter_params.search:
                query = query.or_(f"name.ilike.%{filter_params.search}%,description.ilike.%{filter_params.search}%")

        # Apply sorting
        if sort_order.lower() == "asc":
            query = query.order(sort_by)
        else:
            query = query.order(sort_by, desc=True)

        # Apply pagination
        offset = (page - 1) * page_size
        query = query.range(offset, offset + page_size - 1)

        # Execute query
        response = query.execute()

        if not response.data:
            return []

        # Convert to Budget objects
        budgets = []
        for budget_data in response.data:
            # Fetch categories for each budget
            categories_response = self.supabase.table(self.category_table) \
                .select("*") \
                .eq("budget_id", budget_data["id"]) \
                .eq("is_deleted", False) \
                .execute()

            budget_data["categories"] = categories_response.data if categories_response.data else []
            budgets.append(Budget(**budget_data))

        return budgets

    async def get_budget_by_id(self, budget_id: str, user_id: str) -> Optional[Budget]:
        """
        Get a specific budget by ID.

        Args:
            budget_id: The ID of the budget
            user_id: The ID of the user

        Returns:
            Budget if found, None otherwise
        """
        response = self.supabase.table(self.budget_table) \
            .select("*") \
            .eq("id", budget_id) \
            .eq("user_id", user_id) \
            .eq("is_deleted", False) \
            .execute()

        if not response.data or len(response.data) == 0:
            return None

        budget_data = response.data[0]

        # Fetch categories for the budget
        categories_response = self.supabase.table(self.category_table) \
            .select("*") \
            .eq("budget_id", budget_id) \
            .eq("is_deleted", False) \
            .execute()

        budget_data["categories"] = categories_response.data if categories_response.data else []
        return Budget(**budget_data)

    async def create_budget(self, budget_data: BudgetCreate, user_id: str) -> Budget:
        """
        Create a new budget.

        Args:
            budget_data: The budget data to create
            user_id: The ID of the user

        Returns:
            Created budget
        """
        # Extract categories if provided
        categories = budget_data.categories
        budget_dict = budget_data.dict(exclude={"categories"})
        budget_dict["user_id"] = user_id

        # Convert datetime objects to ISO format strings for JSON serialization
        if isinstance(budget_dict.get("start_date"), datetime):
            budget_dict["start_date"] = budget_dict["start_date"].isoformat()
        if isinstance(budget_dict.get("end_date"), datetime):
            budget_dict["end_date"] = budget_dict["end_date"].isoformat()

        # Create budget
        response = self.supabase.table(self.budget_table).insert(budget_dict).execute()

        if not response.data or len(response.data) == 0:
            logger.error("Failed to create budget")
            raise ValueError("Failed to create budget")

        created_budget = response.data[0]
        budget_id = created_budget["id"]

        # Create categories if provided
        if categories:
            category_data = []
            for category in categories:
                category_dict = category.dict()
                category_dict["budget_id"] = budget_id
                category_data.append(category_dict)

            if category_data:
                categories_response = self.supabase.table(self.category_table).insert(category_data).execute()
                created_budget["categories"] = categories_response.data if categories_response.data else []
        else:
            created_budget["categories"] = []

        return Budget(**created_budget)

    async def update_budget(self, budget_id: str, budget_data: BudgetUpdate, user_id: str) -> Optional[Budget]:
        """
        Update an existing budget.

        Args:
            budget_id: The ID of the budget to update
            budget_data: The budget data to update
            user_id: The ID of the user

        Returns:
            Updated budget if found, None otherwise
        """
        # Check if budget exists and belongs to user
        existing_budget = await self.get_budget_by_id(budget_id, user_id)
        if not existing_budget:
            return None

        # Update budget
        update_data = budget_data.dict(exclude_unset=True)

        # Convert datetime objects to ISO format strings for JSON serialization
        if isinstance(update_data.get("start_date"), datetime):
            update_data["start_date"] = update_data["start_date"].isoformat()
        if isinstance(update_data.get("end_date"), datetime):
            update_data["end_date"] = update_data["end_date"].isoformat()

        response = self.supabase.table(self.budget_table) \
            .update(update_data) \
            .eq("id", budget_id) \
            .eq("user_id", user_id) \
            .execute()

        if not response.data or len(response.data) == 0:
            logger.error(f"Failed to update budget {budget_id}")
            return None

        # Fetch updated budget with categories
        return await self.get_budget_by_id(budget_id, user_id)

    async def delete_budget(self, budget_id: str, user_id: str, hard_delete: bool = False) -> bool:
        """
        Delete a budget.

        Args:
            budget_id: The ID of the budget to delete
            user_id: The ID of the user
            hard_delete: Whether to perform a hard delete

        Returns:
            True if deleted successfully, False otherwise
        """
        # Check if budget exists and belongs to user
        existing_budget = await self.get_budget_by_id(budget_id, user_id)
        if not existing_budget:
            return False

        if hard_delete:
            # Hard delete (delete from database)
            response = self.supabase.table(self.budget_table) \
                .delete() \
                .eq("id", budget_id) \
                .eq("user_id", user_id) \
                .execute()
        else:
            # Soft delete (update is_deleted flag)
            response = self.supabase.table(self.budget_table) \
                .update({"is_deleted": True}) \
                .eq("id", budget_id) \
                .eq("user_id", user_id) \
                .execute()

        return response.data is not None and len(response.data) > 0

    async def get_budget_categories(self, budget_id: str, user_id: str) -> List[BudgetCategory]:
        """
        Get all categories for a budget.

        Args:
            budget_id: The ID of the budget
            user_id: The ID of the user

        Returns:
            List of budget categories
        """
        # Check if budget exists and belongs to user
        existing_budget = await self.get_budget_by_id(budget_id, user_id)
        if not existing_budget:
            return []

        # Fetch categories
        response = self.supabase.table(self.category_table) \
            .select("*") \
            .eq("budget_id", budget_id) \
            .eq("is_deleted", False) \
            .execute()

        if not response.data:
            return []

        return [BudgetCategory(**category_data) for category_data in response.data]

    async def create_budget_category(self, budget_id: str, category_data: BudgetCategoryCreate, user_id: str) -> Optional[BudgetCategory]:
        """
        Create a new budget category.

        Args:
            budget_id: The ID of the budget
            category_data: The category data to create
            user_id: The ID of the user

        Returns:
            Created budget category if successful, None otherwise
        """
        # Check if budget exists and belongs to user
        existing_budget = await self.get_budget_by_id(budget_id, user_id)
        if not existing_budget:
            return None

        # Create category
        category_dict = category_data.dict()
        category_dict["budget_id"] = budget_id

        # Convert any datetime objects to ISO format strings for JSON serialization
        for key, value in category_dict.items():
            if isinstance(value, datetime):
                category_dict[key] = value.isoformat()

        response = self.supabase.table(self.category_table).insert(category_dict).execute()

        if not response.data or len(response.data) == 0:
            logger.error(f"Failed to create category for budget {budget_id}")
            return None

        return BudgetCategory(**response.data[0])

    async def update_budget_category(self, budget_id: str, category_id: str, category_data: BudgetCategoryUpdate, user_id: str) -> Optional[BudgetCategory]:
        """
        Update an existing budget category.

        Args:
            budget_id: The ID of the budget
            category_id: The ID of the category to update
            category_data: The category data to update
            user_id: The ID of the user

        Returns:
            Updated budget category if successful, None otherwise
        """
        # Check if budget exists and belongs to user
        existing_budget = await self.get_budget_by_id(budget_id, user_id)
        if not existing_budget:
            return None

        # Check if category exists and belongs to budget
        response = self.supabase.table(self.category_table) \
            .select("*") \
            .eq("id", category_id) \
            .eq("budget_id", budget_id) \
            .eq("is_deleted", False) \
            .execute()

        if not response.data or len(response.data) == 0:
            return None

        # Update category
        update_data = category_data.dict(exclude_unset=True)

        # Convert any datetime objects to ISO format strings for JSON serialization
        for key, value in update_data.items():
            if isinstance(value, datetime):
                update_data[key] = value.isoformat()

        response = self.supabase.table(self.category_table) \
            .update(update_data) \
            .eq("id", category_id) \
            .eq("budget_id", budget_id) \
            .execute()

        if not response.data or len(response.data) == 0:
            logger.error(f"Failed to update category {category_id} for budget {budget_id}")
            return None

        return BudgetCategory(**response.data[0])

    async def delete_budget_category(self, budget_id: str, category_id: str, user_id: str, hard_delete: bool = False) -> bool:
        """
        Delete a budget category.

        Args:
            budget_id: The ID of the budget
            category_id: The ID of the category to delete
            user_id: The ID of the user
            hard_delete: Whether to perform a hard delete

        Returns:
            True if deleted successfully, False otherwise
        """
        # Check if budget exists and belongs to user
        existing_budget = await self.get_budget_by_id(budget_id, user_id)
        if not existing_budget:
            return False

        # Check if category exists and belongs to budget
        response = self.supabase.table(self.category_table) \
            .select("*") \
            .eq("id", category_id) \
            .eq("budget_id", budget_id) \
            .execute()

        if not response.data or len(response.data) == 0:
            return False

        if hard_delete:
            # Hard delete (delete from database)
            response = self.supabase.table(self.category_table) \
                .delete() \
                .eq("id", category_id) \
                .eq("budget_id", budget_id) \
                .execute()
        else:
            # Soft delete (update is_deleted flag)
            response = self.supabase.table(self.category_table) \
                .update({"is_deleted": True}) \
                .eq("id", category_id) \
                .eq("budget_id", budget_id) \
                .execute()

        return response.data is not None and len(response.data) > 0

    async def get_budget_performance(self, budget_id: str, user_id: str) -> Optional[BudgetPerformance]:
        """
        Get performance metrics for a budget.

        Args:
            budget_id: The ID of the budget
            user_id: The ID of the user

        Returns:
            Budget performance metrics if budget exists, None otherwise
        """
        # Check if budget exists and belongs to user
        budget = await self.get_budget_by_id(budget_id, user_id)
        if not budget:
            return None

        # Get budget categories
        categories = await self.get_budget_categories(budget_id, user_id)
        if not categories:
            return BudgetPerformance(
                budget_id=UUID(budget_id),
                total_budget=budget.total_amount,
                total_allocated=0,
                total_spent=0,
                remaining_budget=budget.total_amount,
                allocation_percentage=0,
                spending_percentage=0,
                categories=[]
            )

        # Calculate total allocated amount
        total_allocated = sum(category.allocated_amount for category in categories)

        # Get spending data for each category
        category_performance = []
        total_spent = 0

        for category in categories:
            # Get expenses for this category
            expenses_response = self.supabase.table(self.expense_table) \
                .select("*") \
                .eq("budget_category_id", str(category.id)) \
                .eq("is_deleted", False) \
                .execute()

            category_spent = sum(expense["amount"] for expense in expenses_response.data) if expenses_response.data else 0
            total_spent += category_spent

            # Calculate category performance metrics
            category_performance.append({
                "id": str(category.id),
                "name": category.name,
                "allocated_amount": category.allocated_amount,
                "spent_amount": category_spent,
                "remaining_amount": category.allocated_amount - category_spent,
                "spending_percentage": (category_spent / category.allocated_amount * 100) if category.allocated_amount > 0 else 0,
                "status": self._get_budget_status(category_spent, category.allocated_amount)
            })

        # Calculate overall performance metrics
        remaining_budget = budget.total_amount - total_spent
        allocation_percentage = (total_allocated / budget.total_amount * 100) if budget.total_amount > 0 else 0
        spending_percentage = (total_spent / budget.total_amount * 100) if budget.total_amount > 0 else 0

        return BudgetPerformance(
            budget_id=UUID(budget_id),
            total_budget=budget.total_amount,
            total_allocated=total_allocated,
            total_spent=total_spent,
            remaining_budget=remaining_budget,
            allocation_percentage=allocation_percentage,
            spending_percentage=spending_percentage,
            categories=category_performance
        )

    def _get_budget_status(self, spent: float, allocated: float) -> str:
        """
        Determine budget status based on spending.

        Args:
            spent: Amount spent
            allocated: Amount allocated

        Returns:
            Budget status string
        """
        if allocated == 0:
            return "Not Allocated"

        percentage = (spent / allocated) * 100

        if percentage > 100:
            return "Over Budget"
        elif percentage >= 90:
            return "Near Limit"
        elif percentage >= 70:
            return "On Track"
        else:
            return "Under Budget"
