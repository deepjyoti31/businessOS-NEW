"""
Invoice API routes for the Finance module.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from datetime import datetime
from uuid import UUID

from app.models.invoices import Invoice, InvoiceCreate, InvoiceUpdate, InvoiceFilter, InvoiceSummary
from app.services.invoice_service import InvoiceService
from app.utils.auth import get_user_id

router = APIRouter(
    prefix="/finance/invoices",
    tags=["invoices"],
)

# Dependencies
async def get_invoice_service():
    return InvoiceService()

@router.get("/summary", response_model=InvoiceSummary)
async def get_invoice_summary(
    client_id: Optional[UUID] = None,
    status: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    min_amount: Optional[float] = None,
    max_amount: Optional[float] = None,
    invoice_service: InvoiceService = Depends(get_invoice_service),
    user_id: str = Depends(get_user_id)
):
    """
    Get summary statistics for invoices.
    """
    filter_params = InvoiceFilter(
        client_id=client_id,
        status=status,
        start_date=start_date,
        end_date=end_date,
        min_amount=min_amount,
        max_amount=max_amount
    )

    return await invoice_service.get_invoice_summary(user_id, filter_params)

@router.get("/", response_model=List[Invoice])
async def get_invoices(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    sort_by: str = Query("date", regex="^(date|due_date|invoice_number|total|status|client_id)$"),
    sort_order: str = Query("desc", regex="^(asc|desc)$"),
    client_id: Optional[UUID] = None,
    status: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    min_amount: Optional[float] = None,
    max_amount: Optional[float] = None,
    search: Optional[str] = None,
    invoice_service: InvoiceService = Depends(get_invoice_service),
    user_id: str = Depends(get_user_id)
):
    """
    Get all invoices for the current user with optional filtering, pagination, and sorting.
    """
    filter_params = InvoiceFilter(
        client_id=client_id,
        status=status,
        start_date=start_date,
        end_date=end_date,
        min_amount=min_amount,
        max_amount=max_amount,
        search=search
    )

    return await invoice_service.get_all_invoices(
        user_id=user_id,
        filter_params=filter_params,
        page=page,
        page_size=page_size,
        sort_by=sort_by,
        sort_order=sort_order
    )

@router.get("/{invoice_id}", response_model=Invoice)
async def get_invoice(
    invoice_id: UUID,
    invoice_service: InvoiceService = Depends(get_invoice_service),
    user_id: str = Depends(get_user_id)
):
    """
    Get a specific invoice by ID.
    """
    invoice = await invoice_service.get_invoice_by_id(str(invoice_id), user_id)
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return invoice

@router.post("/", response_model=Invoice)
async def create_invoice(
    invoice_data: InvoiceCreate,
    invoice_service: InvoiceService = Depends(get_invoice_service),
    user_id: str = Depends(get_user_id)
):
    """
    Create a new invoice.
    """
    try:
        return await invoice_service.create_invoice(invoice_data, user_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{invoice_id}", response_model=Invoice)
async def update_invoice(
    invoice_id: UUID,
    invoice_data: InvoiceUpdate,
    invoice_service: InvoiceService = Depends(get_invoice_service),
    user_id: str = Depends(get_user_id)
):
    """
    Update an existing invoice.
    """
    updated_invoice = await invoice_service.update_invoice(str(invoice_id), invoice_data, user_id)
    if not updated_invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return updated_invoice

@router.delete("/{invoice_id}")
async def delete_invoice(
    invoice_id: UUID,
    hard_delete: bool = Query(False, description="Whether to permanently delete the invoice"),
    invoice_service: InvoiceService = Depends(get_invoice_service),
    user_id: str = Depends(get_user_id)
):
    """
    Delete an invoice (soft delete by default).
    """
    success = await invoice_service.delete_invoice(str(invoice_id), user_id, hard_delete)
    if not success:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return {"message": "Invoice deleted successfully"}

@router.post("/{invoice_id}/mark-paid")
async def mark_invoice_paid(
    invoice_id: UUID,
    invoice_service: InvoiceService = Depends(get_invoice_service),
    user_id: str = Depends(get_user_id)
):
    """
    Mark an invoice as paid.
    """
    invoice_data = InvoiceUpdate(status="Paid")
    updated_invoice = await invoice_service.update_invoice(str(invoice_id), invoice_data, user_id)
    if not updated_invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return {"message": "Invoice marked as paid successfully"}
