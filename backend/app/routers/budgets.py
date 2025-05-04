"""
Budget module API routes.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from datetime import datetime
from uuid import UUID

from app.models.budget import (
    Budget, BudgetCreate, BudgetUpdate, BudgetFilter,
    BudgetCategory, BudgetCategoryCreate, BudgetCategoryUpdate,
    BudgetPerformance
)
from app.services.budget_service import BudgetService
from app.utils.auth import get_user_id

router = APIRouter(
    prefix="/finance/budgets",
    tags=["budgets"],
)

# Dependencies
async def get_budget_service():
    return BudgetService()

# Budget Endpoints
@router.get("", response_model=List[Budget])
async def get_budgets(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    sort_by: str = Query("created_at"),
    sort_order: str = Query("desc"),
    fiscal_year: Optional[str] = None,
    status: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    search: Optional[str] = None,
    budget_service: BudgetService = Depends(get_budget_service),
    user_id: str = Depends(get_user_id)
):
    """
    Get all budgets with optional filtering, pagination, and sorting.
    """
    filter_params = BudgetFilter(
        fiscal_year=fiscal_year,
        status=status,
        start_date=start_date,
        end_date=end_date,
        search=search
    )

    return await budget_service.get_all_budgets(
        user_id=user_id,
        filter_params=filter_params,
        page=page,
        page_size=page_size,
        sort_by=sort_by,
        sort_order=sort_order
    )

@router.get("/{budget_id}", response_model=Budget)
async def get_budget(
    budget_id: UUID,
    budget_service: BudgetService = Depends(get_budget_service),
    user_id: str = Depends(get_user_id)
):
    """
    Get a specific budget by ID.
    """
    budget = await budget_service.get_budget_by_id(str(budget_id), user_id)
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    return budget

@router.post("", response_model=Budget)
async def create_budget(
    budget_data: BudgetCreate,
    budget_service: BudgetService = Depends(get_budget_service),
    user_id: str = Depends(get_user_id)
):
    """
    Create a new budget.
    """
    return await budget_service.create_budget(budget_data, user_id)

@router.put("/{budget_id}", response_model=Budget)
async def update_budget(
    budget_id: UUID,
    budget_data: BudgetUpdate,
    budget_service: BudgetService = Depends(get_budget_service),
    user_id: str = Depends(get_user_id)
):
    """
    Update a budget.
    """
    updated_budget = await budget_service.update_budget(str(budget_id), budget_data, user_id)
    if not updated_budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    return updated_budget

@router.delete("/{budget_id}")
async def delete_budget(
    budget_id: UUID,
    hard_delete: bool = Query(False),
    budget_service: BudgetService = Depends(get_budget_service),
    user_id: str = Depends(get_user_id)
):
    """
    Delete a budget (soft delete by default).
    """
    success = await budget_service.delete_budget(str(budget_id), user_id, hard_delete)
    if not success:
        raise HTTPException(status_code=404, detail="Budget not found")
    return {"success": True, "message": "Budget deleted successfully"}

# Budget Category Endpoints
@router.get("/{budget_id}/categories", response_model=List[BudgetCategory])
async def get_budget_categories(
    budget_id: UUID,
    budget_service: BudgetService = Depends(get_budget_service),
    user_id: str = Depends(get_user_id)
):
    """
    Get all categories for a budget.
    """
    return await budget_service.get_budget_categories(str(budget_id), user_id)

@router.post("/{budget_id}/categories", response_model=BudgetCategory)
async def create_budget_category(
    budget_id: UUID,
    category_data: BudgetCategoryCreate,
    budget_service: BudgetService = Depends(get_budget_service),
    user_id: str = Depends(get_user_id)
):
    """
    Create a new budget category.
    """
    category = await budget_service.create_budget_category(str(budget_id), category_data, user_id)
    if not category:
        raise HTTPException(status_code=404, detail="Budget not found")
    return category

@router.put("/{budget_id}/categories/{category_id}", response_model=BudgetCategory)
async def update_budget_category(
    budget_id: UUID,
    category_id: UUID,
    category_data: BudgetCategoryUpdate,
    budget_service: BudgetService = Depends(get_budget_service),
    user_id: str = Depends(get_user_id)
):
    """
    Update a budget category.
    """
    updated_category = await budget_service.update_budget_category(
        str(budget_id), str(category_id), category_data, user_id
    )
    if not updated_category:
        raise HTTPException(status_code=404, detail="Budget or category not found")
    return updated_category

@router.delete("/{budget_id}/categories/{category_id}")
async def delete_budget_category(
    budget_id: UUID,
    category_id: UUID,
    hard_delete: bool = Query(False),
    budget_service: BudgetService = Depends(get_budget_service),
    user_id: str = Depends(get_user_id)
):
    """
    Delete a budget category.
    """
    success = await budget_service.delete_budget_category(
        str(budget_id), str(category_id), user_id, hard_delete
    )
    if not success:
        raise HTTPException(status_code=404, detail="Budget or category not found")
    return {"success": True, "message": "Budget category deleted successfully"}

# Budget Performance Endpoint
@router.get("/{budget_id}/performance", response_model=BudgetPerformance)
async def get_budget_performance(
    budget_id: UUID,
    budget_service: BudgetService = Depends(get_budget_service),
    user_id: str = Depends(get_user_id)
):
    """
    Get performance metrics for a budget.
    """
    performance = await budget_service.get_budget_performance(str(budget_id), user_id)
    if not performance:
        raise HTTPException(status_code=404, detail="Budget not found")
    return performance
