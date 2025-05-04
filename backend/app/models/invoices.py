"""
Invoice models for the Finance module.
"""

from typing import Optional, List
from pydantic import BaseModel, validator, Field
from datetime import datetime
from uuid import UUID


class InvoiceItemBase(BaseModel):
    """Base invoice item model with common fields."""
    description: str
    quantity: float
    unit_price: float
    amount: float

    @validator('quantity', 'unit_price', 'amount')
    def validate_positive_number(cls, v, values, **kwargs):
        """Validate that numeric values are positive."""
        if v <= 0:
            field_name = kwargs.get('field', 'field')
            raise ValueError(f"{field_name} must be positive")
        return v

    @validator('amount')
    def validate_amount(cls, v, values):
        """Validate that amount equals quantity * unit_price."""
        if 'quantity' in values and 'unit_price' in values:
            expected = round(values['quantity'] * values['unit_price'], 2)
            if abs(v - expected) > 0.01:  # Allow for small floating point differences
                raise ValueError(f"Amount ({v}) must equal quantity ({values['quantity']}) * unit_price ({values['unit_price']}) = {expected}")
        return v


class InvoiceItemCreate(InvoiceItemBase):
    """Model for creating a new invoice item."""
    pass


class InvoiceItemUpdate(BaseModel):
    """Model for updating an existing invoice item."""
    description: Optional[str] = None
    quantity: Optional[float] = None
    unit_price: Optional[float] = None
    amount: Optional[float] = None

    @validator('quantity', 'unit_price', 'amount')
    def validate_positive_number(cls, v, values, **kwargs):
        """Validate that numeric values are positive if provided."""
        if v is not None and v <= 0:
            field_name = kwargs.get('field', 'field')
            raise ValueError(f"{field_name} must be positive")
        return v


class InvoiceItem(InvoiceItemBase):
    """Complete invoice item model with all fields."""
    id: UUID
    invoice_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class InvoiceBase(BaseModel):
    """Base invoice model with common fields."""
    client_id: UUID
    invoice_number: str
    date: datetime
    due_date: datetime
    status: str
    subtotal: float
    tax_rate: Optional[float] = None
    tax_amount: Optional[float] = None
    total: float
    notes: Optional[str] = None
    terms: Optional[str] = None

    @validator('status')
    def validate_status(cls, v):
        """Validate that status is one of the allowed values."""
        allowed_statuses = ['Draft', 'Sent', 'Paid', 'Overdue']
        if v not in allowed_statuses:
            raise ValueError(f"Status must be one of: {', '.join(allowed_statuses)}")
        return v

    @validator('subtotal', 'total')
    def validate_positive_amount(cls, v, values, **kwargs):
        """Validate that amounts are positive."""
        if v <= 0:
            field_name = kwargs.get('field', 'field')
            raise ValueError(f"{field_name} must be positive")
        return v

    @validator('tax_rate')
    def validate_tax_rate(cls, v):
        """Validate that tax rate is non-negative if provided."""
        if v is not None and v < 0:
            raise ValueError("Tax rate cannot be negative")
        return v

    @validator('tax_amount')
    def validate_tax_amount(cls, v, values):
        """Validate that tax amount is non-negative and consistent with tax rate if both provided."""
        if v is not None:
            if v < 0:
                raise ValueError("Tax amount cannot be negative")

            if 'tax_rate' in values and values['tax_rate'] is not None and 'subtotal' in values:
                expected = round(values['subtotal'] * values['tax_rate'] / 100, 2)
                if abs(v - expected) > 0.01:  # Allow for small floating point differences
                    raise ValueError(f"Tax amount ({v}) should be approximately {expected} based on subtotal ({values['subtotal']}) and tax rate ({values['tax_rate']}%)")
        return v

    @validator('total')
    def validate_total(cls, v, values):
        """Validate that total equals subtotal + tax_amount if tax_amount is provided."""
        if 'subtotal' in values and 'tax_amount' in values and values['tax_amount'] is not None:
            expected = round(values['subtotal'] + values['tax_amount'], 2)
            if abs(v - expected) > 0.01:  # Allow for small floating point differences
                raise ValueError(f"Total ({v}) must equal subtotal ({values['subtotal']}) + tax_amount ({values['tax_amount']}) = {expected}")
        return v


class InvoiceCreate(InvoiceBase):
    """Model for creating a new invoice."""
    items: List[InvoiceItemCreate]


class InvoiceUpdate(BaseModel):
    """Model for updating an existing invoice."""
    client_id: Optional[UUID] = None
    invoice_number: Optional[str] = None
    date: Optional[datetime] = None
    due_date: Optional[datetime] = None
    status: Optional[str] = None
    subtotal: Optional[float] = None
    tax_rate: Optional[float] = None
    tax_amount: Optional[float] = None
    total: Optional[float] = None
    notes: Optional[str] = None
    terms: Optional[str] = None
    pdf_url: Optional[str] = None
    is_deleted: Optional[bool] = None

    @validator('status')
    def validate_status(cls, v):
        """Validate that status is one of the allowed values if provided."""
        if v is not None:
            allowed_statuses = ['Draft', 'Sent', 'Paid', 'Overdue']
            if v not in allowed_statuses:
                raise ValueError(f"Status must be one of: {', '.join(allowed_statuses)}")
        return v

    @validator('subtotal', 'total')
    def validate_positive_amount(cls, v, values, **kwargs):
        """Validate that amounts are positive if provided."""
        if v is not None and v <= 0:
            field_name = kwargs.get('field', 'field')
            raise ValueError(f"{field_name} must be positive")
        return v


class Invoice(InvoiceBase):
    """Complete invoice model with all fields."""
    id: UUID
    user_id: UUID
    pdf_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    is_deleted: bool = False
    items: List[InvoiceItem] = []

    class Config:
        from_attributes = True


class InvoiceFilter(BaseModel):
    """Model for filtering invoices."""
    client_id: Optional[UUID] = None
    status: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    min_amount: Optional[float] = None
    max_amount: Optional[float] = None
    search: Optional[str] = None


class InvoiceSummary(BaseModel):
    """Model for invoice summary statistics."""
    total_invoiced: float
    outstanding_amount: float
    overdue_amount: float
    paid_amount: float
    invoice_count: int
    status_counts: dict
