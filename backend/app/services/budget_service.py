"""
Budget service for handling budget operations.
"""

import os
import logging
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime, timedelta
from uuid import UUID, uuid4
from calendar import month_name
import statistics

from supabase import create_client, Client

from app.models.budget import (
    Budget, BudgetCreate, BudgetUpdate, BudgetFilter,
    BudgetCategory, BudgetCategoryCreate, BudgetCategoryUpdate,
    BudgetPerformance, CategoryPerformance
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
                categories=[],
                last_updated=datetime.now()
            )

        # Calculate total allocated amount
        total_allocated = sum(category.allocated_amount for category in categories)

        # Get spending data for each category
        category_performance_list = []
        total_spent = 0

        # Get budget start and end dates
        start_date = budget.start_date
        end_date = budget.end_date

        # Calculate monthly spending for the budget
        monthly_spending, monthly_trend = await self._calculate_monthly_spending(budget_id, start_date, end_date)

        # Calculate projected end status
        projected_end_status = self._calculate_projected_end_status(
            budget.total_amount,
            total_spent,
            start_date,
            end_date,
            monthly_spending
        )

        for category in categories:
            # Get expenses for this category
            expenses_response = self.supabase.table(self.expense_table) \
                .select("*") \
                .eq("budget_category_id", str(category.id)) \
                .eq("is_deleted", False) \
                .execute()

            expenses = expenses_response.data if expenses_response.data else []
            category_spent = sum(expense["amount"] for expense in expenses)
            total_spent += category_spent

            # Calculate monthly spending for this category
            category_monthly_spending, category_trend = self._calculate_category_monthly_spending(
                expenses,
                start_date,
                end_date
            )

            # Calculate category performance metrics
            category_performance = CategoryPerformance(
                id=str(category.id),
                name=category.name,
                allocated_amount=category.allocated_amount,
                spent_amount=category_spent,
                remaining_amount=category.allocated_amount - category_spent,
                spending_percentage=(category_spent / category.allocated_amount * 100) if category.allocated_amount > 0 else 0,
                status=self._get_budget_status(category_spent, category.allocated_amount),
                monthly_spending=category_monthly_spending,
                trend=category_trend
            )

            category_performance_list.append(category_performance)

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
            categories=category_performance_list,
            monthly_spending=monthly_spending,
            monthly_trend=monthly_trend,
            projected_end_status=projected_end_status,
            last_updated=datetime.now()
        )

    async def _calculate_monthly_spending(self, budget_id: str, start_date: datetime, end_date: datetime) -> Tuple[Dict[str, float], str]:
        """
        Calculate monthly spending for a budget.

        Args:
            budget_id: The ID of the budget
            start_date: Budget start date
            end_date: Budget end date

        Returns:
            Tuple of monthly spending dictionary and trend
        """
        # Get all expenses for this budget
        expenses_response = self.supabase.table(self.expense_table) \
            .select("*") \
            .eq("is_deleted", False) \
            .execute()

        if not expenses_response.data:
            return {}, "stable"

        # Filter expenses that belong to this budget's categories
        categories_response = self.supabase.table(self.category_table) \
            .select("id") \
            .eq("budget_id", budget_id) \
            .eq("is_deleted", False) \
            .execute()

        if not categories_response.data:
            return {}, "stable"

        category_ids = [category["id"] for category in categories_response.data]

        # Filter expenses by category
        budget_expenses = [
            expense for expense in expenses_response.data
            if expense["budget_category_id"] in category_ids
        ]

        # Group expenses by month
        monthly_spending = {}

        # Initialize all months in the budget period
        current_date = start_date.replace(day=1)
        while current_date <= end_date:
            month_key = current_date.strftime("%Y-%m")
            month_name_key = current_date.strftime("%b %Y")
            monthly_spending[month_name_key] = 0
            current_date = (current_date.replace(day=28) + timedelta(days=4)).replace(day=1)

        # Sum expenses by month
        for expense in budget_expenses:
            expense_date = datetime.fromisoformat(expense["date"].replace('Z', '+00:00'))
            month_key = expense_date.strftime("%b %Y")
            if month_key in monthly_spending:
                monthly_spending[month_key] += expense["amount"]

        # Determine trend
        trend = "stable"
        if len(monthly_spending) >= 3:
            # Get the last three months with data
            last_months = list(monthly_spending.items())[-3:]
            values = [amount for _, amount in last_months if amount > 0]

            if len(values) >= 2:
                if all(values[i] < values[i+1] for i in range(len(values)-1)):
                    trend = "increasing"
                elif all(values[i] > values[i+1] for i in range(len(values)-1)):
                    trend = "decreasing"

        return monthly_spending, trend

    def _calculate_category_monthly_spending(self, expenses: List[dict], start_date: datetime, end_date: datetime) -> Tuple[Dict[str, float], str]:
        """
        Calculate monthly spending for a category.

        Args:
            expenses: List of expenses
            start_date: Budget start date
            end_date: Budget end date

        Returns:
            Tuple of monthly spending dictionary and trend
        """
        # Group expenses by month
        monthly_spending = {}

        # Initialize all months in the budget period
        current_date = start_date.replace(day=1)
        while current_date <= end_date:
            month_key = current_date.strftime("%Y-%m")
            month_name_key = current_date.strftime("%b %Y")
            monthly_spending[month_name_key] = 0
            current_date = (current_date.replace(day=28) + timedelta(days=4)).replace(day=1)

        # Sum expenses by month
        for expense in expenses:
            expense_date = datetime.fromisoformat(expense["date"].replace('Z', '+00:00'))
            month_key = expense_date.strftime("%b %Y")
            if month_key in monthly_spending:
                monthly_spending[month_key] += expense["amount"]

        # Determine trend
        trend = "stable"
        if len(monthly_spending) >= 3:
            # Get the last three months with data
            last_months = list(monthly_spending.items())[-3:]
            values = [amount for _, amount in last_months if amount > 0]

            if len(values) >= 2:
                if all(values[i] < values[i+1] for i in range(len(values)-1)):
                    trend = "increasing"
                elif all(values[i] > values[i+1] for i in range(len(values)-1)):
                    trend = "decreasing"

        return monthly_spending, trend

    def _calculate_projected_end_status(self, total_budget: float, current_spent: float, start_date: datetime, end_date: datetime, monthly_spending: Dict[str, float]) -> str:
        """
        Calculate projected end status based on current spending rate.

        Args:
            total_budget: Total budget amount
            current_spent: Current spent amount
            start_date: Budget start date
            end_date: Budget end date
            monthly_spending: Monthly spending dictionary

        Returns:
            Projected end status: "under_budget", "on_track", or "over_budget"
        """
        # If no spending yet, return on_track
        if current_spent == 0:
            return "on_track"

        # Calculate total budget duration in days
        total_days = (end_date - start_date).days
        if total_days <= 0:
            return "on_track"

        # Calculate days elapsed
        days_elapsed = (datetime.now() - start_date).days
        if days_elapsed <= 0:
            return "on_track"

        # Calculate ideal spending rate (amount per day)
        ideal_rate = total_budget / total_days

        # Calculate actual spending rate
        actual_rate = current_spent / days_elapsed

        # Calculate projected final spending
        projected_final = actual_rate * total_days

        # Determine status based on projected final spending
        if projected_final > total_budget * 1.1:  # 10% over budget
            return "over_budget"
        elif projected_final < total_budget * 0.9:  # 10% under budget
            return "under_budget"
        else:
            return "on_track"

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
