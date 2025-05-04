"""
Invoice service for handling invoice operations.
"""

import os
from typing import Dict, List, Optional, Any
from datetime import datetime
from uuid import UUID
import logging

from supabase import create_client, Client

from app.models.invoices import Invoice, InvoiceCreate, InvoiceUpdate, InvoiceFilter, InvoiceSummary
from app.models.invoices import InvoiceItem, InvoiceItemCreate, InvoiceItemUpdate

# Configure logging
logger = logging.getLogger(__name__)

class InvoiceService:
    """Service for handling invoice operations."""

    def __init__(self):
        """Initialize the invoice service with Supabase client."""
        supabase_url = os.environ.get("SUPABASE_URL")
        supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")
        self.supabase: Client = create_client(supabase_url, supabase_key)
        self.invoice_table = "invoices"
        self.invoice_item_table = "invoice_items"

    async def get_invoice_by_id(self, invoice_id: str, user_id: str) -> Optional[Invoice]:
        """
        Get an invoice by ID with its items.

        Args:
            invoice_id: The ID of the invoice
            user_id: The ID of the user

        Returns:
            The invoice if found, None otherwise
        """
        # Get the invoice
        invoice_response = self.supabase.table(self.invoice_table).select("*") \
            .eq("id", invoice_id) \
            .eq("user_id", user_id) \
            .eq("is_deleted", False) \
            .execute()

        if not invoice_response.data or len(invoice_response.data) == 0:
            return None

        invoice_data = invoice_response.data[0]

        # Get the invoice items
        items_response = self.supabase.table(self.invoice_item_table).select("*") \
            .eq("invoice_id", invoice_id) \
            .execute()

        # Create the invoice with items
        invoice = Invoice(**invoice_data)
        if items_response.data:
            invoice.items = [InvoiceItem(**item) for item in items_response.data]

        return invoice

    async def get_all_invoices(
        self,
        user_id: str,
        filter_params: Optional[InvoiceFilter] = None,
        page: int = 1,
        page_size: int = 20,
        sort_by: str = "date",
        sort_order: str = "desc"
    ) -> List[Invoice]:
        """
        Get all invoices for a user with optional filtering, pagination, and sorting.

        Args:
            user_id: The ID of the user
            filter_params: Optional filter parameters
            page: The page number (1-indexed)
            page_size: The number of items per page
            sort_by: The field to sort by
            sort_order: The sort order ('asc' or 'desc')

        Returns:
            List of invoices
        """
        query = self.supabase.table(self.invoice_table).select("*") \
            .eq("user_id", user_id) \
            .eq("is_deleted", False)

        # Apply filters if provided
        if filter_params:
            if filter_params.client_id:
                query = query.eq("client_id", str(filter_params.client_id))
            if filter_params.status:
                query = query.eq("status", filter_params.status)
            if filter_params.start_date:
                query = query.gte("date", filter_params.start_date.isoformat())
            if filter_params.end_date:
                query = query.lte("date", filter_params.end_date.isoformat())
            if filter_params.min_amount:
                query = query.gte("total", filter_params.min_amount)
            if filter_params.max_amount:
                query = query.lte("total", filter_params.max_amount)
            if filter_params.search:
                query = query.or_(f"invoice_number.ilike.%{filter_params.search}%")

        # Apply sorting
        if sort_order.lower() == "desc":
            query = query.order(sort_by, desc=True)
        else:
            query = query.order(sort_by)

        # Apply pagination
        offset = (page - 1) * page_size
        query = query.range(offset, offset + page_size - 1)

        invoice_response = query.execute()

        if not invoice_response.data:
            return []

        # Get all invoice IDs
        invoice_ids = [invoice["id"] for invoice in invoice_response.data]

        # Get all invoice items for these invoices in a single query
        items_response = self.supabase.table(self.invoice_item_table).select("*") \
            .in_("invoice_id", invoice_ids) \
            .execute()

        # Create a dictionary of invoice items by invoice ID
        items_by_invoice = {}
        if items_response.data:
            for item in items_response.data:
                invoice_id = item["invoice_id"]
                if invoice_id not in items_by_invoice:
                    items_by_invoice[invoice_id] = []
                items_by_invoice[invoice_id].append(InvoiceItem(**item))

        # Create invoices with their items
        invoices = []
        for invoice_data in invoice_response.data:
            invoice = Invoice(**invoice_data)
            invoice.items = items_by_invoice.get(invoice.id, [])
            invoices.append(invoice)

        return invoices

    async def create_invoice(self, invoice_data: InvoiceCreate, user_id: str) -> Invoice:
        """
        Create a new invoice with its items.

        Args:
            invoice_data: The invoice data
            user_id: The ID of the user

        Returns:
            The created invoice
        """
        # Start a transaction
        try:
            # Extract items from the invoice data
            items = invoice_data.items
            
            # Create the invoice data without items
            invoice_dict = invoice_data.dict(exclude={"items"})
            invoice_dict["user_id"] = user_id

            # Insert the invoice
            invoice_response = self.supabase.table(self.invoice_table).insert(invoice_dict).execute()

            if not invoice_response.data or len(invoice_response.data) == 0:
                raise Exception("Failed to create invoice")

            invoice_id = invoice_response.data[0]["id"]

            # Insert the invoice items
            if items:
                items_data = []
                for item in items:
                    item_dict = item.dict()
                    item_dict["invoice_id"] = invoice_id
                    items_data.append(item_dict)

                items_response = self.supabase.table(self.invoice_item_table).insert(items_data).execute()

                if not items_response.data:
                    # If items insertion fails, we should delete the invoice
                    self.supabase.table(self.invoice_table).delete().eq("id", invoice_id).execute()
                    raise Exception("Failed to create invoice items")

            # Get the complete invoice with items
            return await self.get_invoice_by_id(invoice_id, user_id)

        except Exception as e:
            logger.error(f"Error creating invoice: {str(e)}")
            raise Exception(f"Failed to create invoice: {str(e)}")

    async def update_invoice(self, invoice_id: str, invoice_data: InvoiceUpdate, user_id: str) -> Optional[Invoice]:
        """
        Update an existing invoice.

        Args:
            invoice_id: The ID of the invoice
            invoice_data: The updated invoice data
            user_id: The ID of the user

        Returns:
            The updated invoice if found, None otherwise
        """
        # First check if the invoice exists and belongs to the user
        existing = await self.get_invoice_by_id(invoice_id, user_id)
        if not existing:
            return None

        data = {k: v for k, v in invoice_data.dict().items() if v is not None}
        data["updated_at"] = datetime.now().isoformat()

        response = self.supabase.table(self.invoice_table).update(data).eq("id", invoice_id).eq("user_id", user_id).execute()

        if response.data and len(response.data) > 0:
            return await self.get_invoice_by_id(invoice_id, user_id)
        return None

    async def delete_invoice(self, invoice_id: str, user_id: str, hard_delete: bool = False) -> bool:
        """
        Delete an invoice (soft delete by default).

        Args:
            invoice_id: The ID of the invoice
            user_id: The ID of the user
            hard_delete: Whether to permanently delete the invoice

        Returns:
            True if successful, False otherwise
        """
        # First check if the invoice exists and belongs to the user
        existing = await self.get_invoice_by_id(invoice_id, user_id)
        if not existing:
            return False

        if hard_delete:
            # Permanently delete the invoice (cascade will delete items)
            response = self.supabase.table(self.invoice_table).delete().eq("id", invoice_id).eq("user_id", user_id).execute()
        else:
            # Soft delete the invoice
            response = self.supabase.table(self.invoice_table).update({"is_deleted": True, "updated_at": datetime.now().isoformat()}) \
                .eq("id", invoice_id).eq("user_id", user_id).execute()

        return response.data is not None and len(response.data) > 0

    async def get_invoice_summary(self, user_id: str, filter_params: Optional[InvoiceFilter] = None) -> InvoiceSummary:
        """
        Get summary statistics for invoices.

        Args:
            user_id: The ID of the user
            filter_params: Optional filter parameters

        Returns:
            Invoice summary statistics
        """
        query = self.supabase.table(self.invoice_table).select("*") \
            .eq("user_id", user_id) \
            .eq("is_deleted", False)

        # Apply filters if provided
        if filter_params:
            if filter_params.client_id:
                query = query.eq("client_id", str(filter_params.client_id))
            if filter_params.status:
                query = query.eq("status", filter_params.status)
            if filter_params.start_date:
                query = query.gte("date", filter_params.start_date.isoformat())
            if filter_params.end_date:
                query = query.lte("date", filter_params.end_date.isoformat())
            if filter_params.min_amount:
                query = query.gte("total", filter_params.min_amount)
            if filter_params.max_amount:
                query = query.lte("total", filter_params.max_amount)

        response = query.execute()

        if not response.data:
            return InvoiceSummary(
                total_invoiced=0,
                outstanding_amount=0,
                overdue_amount=0,
                paid_amount=0,
                invoice_count=0,
                status_counts={"Draft": 0, "Sent": 0, "Paid": 0, "Overdue": 0}
            )

        # Calculate summary statistics
        total_invoiced = sum(invoice["total"] for invoice in response.data)
        outstanding_amount = sum(invoice["total"] for invoice in response.data if invoice["status"] in ["Sent", "Overdue"])
        overdue_amount = sum(invoice["total"] for invoice in response.data if invoice["status"] == "Overdue")
        paid_amount = sum(invoice["total"] for invoice in response.data if invoice["status"] == "Paid")
        invoice_count = len(response.data)

        # Count invoices by status
        status_counts = {"Draft": 0, "Sent": 0, "Paid": 0, "Overdue": 0}
        for invoice in response.data:
            status = invoice["status"]
            status_counts[status] = status_counts.get(status, 0) + 1

        return InvoiceSummary(
            total_invoiced=total_invoiced,
            outstanding_amount=outstanding_amount,
            overdue_amount=overdue_amount,
            paid_amount=paid_amount,
            invoice_count=invoice_count,
            status_counts=status_counts
        )
