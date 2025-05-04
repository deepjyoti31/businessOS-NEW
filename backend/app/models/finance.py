"""
Finance module models.
"""

from typing import Optional, List
from pydantic import BaseModel, Field, validator
from datetime import datetime
from uuid import UUID


class TransactionBase(BaseModel):
    """Base transaction model with common fields."""
    date: datetime
    type: str
    description: str
    amount: float
    category: Optional[str] = None
    reference: Optional[str] = None

    @validator('type')
    def validate_type(cls, v):
        if v not in ['Income', 'Expense']:
            raise ValueError('Type must be either "Income" or "Expense"')
        return v

    @validator('amount')
    def validate_amount(cls, v, values):
        if 'type' in values:
            if values['type'] == 'Income' and v <= 0:
                raise ValueError('Income amount must be positive')
            elif values['type'] == 'Expense' and v >= 0:
                raise ValueError('Expense amount must be negative')
        return v


class TransactionCreate(TransactionBase):
    """Model for creating a new transaction."""
    pass


class TransactionUpdate(BaseModel):
    """Model for updating an existing transaction."""
    date: Optional[datetime] = None
    type: Optional[str] = None
    description: Optional[str] = None
    amount: Optional[float] = None
    category: Optional[str] = None
    reference: Optional[str] = None
    is_deleted: Optional[bool] = None

    @validator('type')
    def validate_type(cls, v):
        if v is not None and v not in ['Income', 'Expense']:
            raise ValueError('Type must be either "Income" or "Expense"')
        return v

    @validator('amount')
    def validate_amount(cls, v, values):
        if v is not None and 'type' in values and values['type'] is not None:
            if values['type'] == 'Income' and v <= 0:
                raise ValueError('Income amount must be positive')
            elif values['type'] == 'Expense' and v >= 0:
                raise ValueError('Expense amount must be negative')
        return v


class Transaction(TransactionBase):
    """Complete transaction model with all fields."""
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime
    is_deleted: bool = False

    class Config:
        orm_mode = True


class TransactionFilter(BaseModel):
    """Model for filtering transactions."""
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    type: Optional[str] = None
    category: Optional[str] = None
    min_amount: Optional[float] = None
    max_amount: Optional[float] = None
    search: Optional[str] = None


class TransactionSummary(BaseModel):
    """Model for transaction summary statistics."""
    total_income: float
    total_expenses: float
    net_amount: float
    transaction_count: int
    categories: List[dict]
