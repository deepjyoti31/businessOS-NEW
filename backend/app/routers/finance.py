"""
Finance module API routes.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from datetime import datetime
from uuid import UUID

from app.models.finance import Transaction, TransactionCreate, TransactionUpdate, TransactionFilter, TransactionSummary
from app.services.transaction_service import TransactionService
from app.utils.auth import get_user_id

router = APIRouter(
    prefix="/finance",
    tags=["finance"],
)

# Dependency
async def get_transaction_service():
    return TransactionService()

# Transaction Endpoints
@router.get("/transactions/summary", response_model=TransactionSummary)
async def get_transaction_summary(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    type: Optional[str] = None,
    category: Optional[str] = None,
    transaction_service: TransactionService = Depends(get_transaction_service),
    user_id: str = Depends(get_user_id)
):
    """
    Get summary statistics for transactions.
    """
    filter_params = TransactionFilter(
        start_date=start_date,
        end_date=end_date,
        type=type,
        category=category
    )

    return await transaction_service.get_transaction_summary(user_id, filter_params)

@router.get("/transactions/categories", response_model=List[str])
async def get_transaction_categories(
    transaction_service: TransactionService = Depends(get_transaction_service),
    user_id: str = Depends(get_user_id)
):
    """
    Get all unique transaction categories for the current user.
    """
    return await transaction_service.get_transaction_categories(user_id)

@router.get("/transactions", response_model=List[Transaction])
async def get_transactions(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    sort_by: str = Query("date", regex="^(date|amount|type|description|category)$"),
    sort_order: str = Query("desc", regex="^(asc|desc)$"),
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    type: Optional[str] = None,
    category: Optional[str] = None,
    min_amount: Optional[float] = None,
    max_amount: Optional[float] = None,
    search: Optional[str] = None,
    transaction_service: TransactionService = Depends(get_transaction_service),
    user_id: str = Depends(get_user_id)
):
    """
    Get all transactions for the current user with optional filtering, pagination, and sorting.
    """
    filter_params = TransactionFilter(
        start_date=start_date,
        end_date=end_date,
        type=type,
        category=category,
        min_amount=min_amount,
        max_amount=max_amount,
        search=search
    )

    return await transaction_service.get_all_transactions(
        user_id=user_id,
        filter_params=filter_params,
        page=page,
        page_size=page_size,
        sort_by=sort_by,
        sort_order=sort_order
    )

@router.post("/transactions", response_model=Transaction)
async def create_transaction(
    transaction_data: TransactionCreate,
    transaction_service: TransactionService = Depends(get_transaction_service),
    user_id: str = Depends(get_user_id)
):
    """
    Create a new transaction.
    """
    return await transaction_service.create_transaction(transaction_data, user_id)

@router.get("/transactions/{transaction_id}", response_model=Transaction)
async def get_transaction(
    transaction_id: UUID,
    transaction_service: TransactionService = Depends(get_transaction_service),
    user_id: str = Depends(get_user_id)
):
    """
    Get a specific transaction by ID.
    """
    transaction = await transaction_service.get_transaction_by_id(str(transaction_id), user_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction

@router.put("/transactions/{transaction_id}", response_model=Transaction)
async def update_transaction(
    transaction_id: UUID,
    transaction_data: TransactionUpdate,
    transaction_service: TransactionService = Depends(get_transaction_service),
    user_id: str = Depends(get_user_id)
):
    """
    Update a transaction.
    """
    transaction = await transaction_service.update_transaction(str(transaction_id), transaction_data, user_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction

@router.delete("/transactions/{transaction_id}")
async def delete_transaction(
    transaction_id: UUID,
    hard_delete: bool = Query(False),
    transaction_service: TransactionService = Depends(get_transaction_service),
    user_id: str = Depends(get_user_id)
):
    """
    Delete a transaction (soft delete by default).
    """
    success = await transaction_service.delete_transaction(str(transaction_id), user_id, hard_delete)
    if not success:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return {"message": "Transaction deleted successfully"}
