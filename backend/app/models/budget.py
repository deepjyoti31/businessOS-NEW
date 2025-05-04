"""
Budget models for the finance module.
"""

from typing import List, Optional, Dict
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, validator


class BudgetCategoryBase(BaseModel):
    """Base budget category model with common fields."""
    name: str
    description: Optional[str] = None
    allocated_amount: float

    @validator('allocated_amount')
    def validate_allocated_amount(cls, v):
        if v <= 0:
            raise ValueError('Allocated amount must be positive')
        return v


class BudgetCategoryCreate(BudgetCategoryBase):
    """Model for creating a new budget category."""
    pass


class BudgetCategoryUpdate(BaseModel):
    """Model for updating an existing budget category."""
    name: Optional[str] = None
    description: Optional[str] = None
    allocated_amount: Optional[float] = None
    is_deleted: Optional[bool] = None

    @validator('allocated_amount')
    def validate_allocated_amount(cls, v):
        if v is not None and v <= 0:
            raise ValueError('Allocated amount must be positive')
        return v


class BudgetCategory(BudgetCategoryBase):
    """Complete budget category model with all fields."""
    id: UUID
    budget_id: UUID
    created_at: datetime
    updated_at: datetime
    is_deleted: bool = False

    class Config:
        orm_mode = True


class BudgetBase(BaseModel):
    """Base budget model with common fields."""
    name: str
    description: Optional[str] = None
    total_amount: float
    start_date: datetime
    end_date: datetime
    fiscal_year: str
    status: str

    @validator('total_amount')
    def validate_total_amount(cls, v):
        if v <= 0:
            raise ValueError('Total amount must be positive')
        return v

    @validator('status')
    def validate_status(cls, v):
        if v not in ['Active', 'Draft', 'Archived']:
            raise ValueError('Status must be one of: Active, Draft, Archived')
        return v

    @validator('end_date')
    def validate_end_date(cls, v, values):
        if 'start_date' in values and v <= values['start_date']:
            raise ValueError('End date must be after start date')
        return v


class BudgetCreate(BudgetBase):
    """Model for creating a new budget."""
    categories: Optional[List[BudgetCategoryCreate]] = None


class BudgetUpdate(BaseModel):
    """Model for updating an existing budget."""
    name: Optional[str] = None
    description: Optional[str] = None
    total_amount: Optional[float] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    fiscal_year: Optional[str] = None
    status: Optional[str] = None
    is_deleted: Optional[bool] = None

    @validator('total_amount')
    def validate_total_amount(cls, v):
        if v is not None and v <= 0:
            raise ValueError('Total amount must be positive')
        return v

    @validator('status')
    def validate_status(cls, v):
        if v is not None and v not in ['Active', 'Draft', 'Archived']:
            raise ValueError('Status must be one of: Active, Draft, Archived')
        return v

    @validator('end_date')
    def validate_end_date(cls, v, values):
        if v is not None and 'start_date' in values and values['start_date'] is not None and v <= values['start_date']:
            raise ValueError('End date must be after start date')
        return v


class Budget(BudgetBase):
    """Complete budget model with all fields."""
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime
    is_deleted: bool = False
    categories: Optional[List[BudgetCategory]] = None

    class Config:
        orm_mode = True


class BudgetFilter(BaseModel):
    """Model for filtering budgets."""
    fiscal_year: Optional[str] = None
    status: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    search: Optional[str] = None


class CategoryPerformance(BaseModel):
    """Model for category performance metrics."""
    id: str
    name: str
    allocated_amount: float
    spent_amount: float
    remaining_amount: float
    spending_percentage: float
    status: str
    monthly_spending: Optional[Dict[str, float]] = None
    trend: Optional[str] = None  # "increasing", "decreasing", "stable"

class BudgetPerformance(BaseModel):
    """Model for budget performance metrics."""
    budget_id: UUID
    total_budget: float
    total_allocated: float
    total_spent: float
    remaining_budget: float
    allocation_percentage: float
    spending_percentage: float
    categories: List[CategoryPerformance]
    monthly_spending: Optional[Dict[str, float]] = None
    monthly_trend: Optional[str] = None  # "increasing", "decreasing", "stable"
    projected_end_status: Optional[str] = None  # "under_budget", "on_track", "over_budget"
    last_updated: Optional[datetime] = None
