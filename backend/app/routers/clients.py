"""
Client API routes for the Finance module.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from uuid import UUID

from app.models.clients import Client, ClientCreate, ClientUpdate, ClientFilter
from app.services.client_service import ClientService
from app.utils.auth import get_user_id

router = APIRouter(
    prefix="/finance/clients",
    tags=["clients"],
)

# Dependencies
async def get_client_service():
    return ClientService()

@router.get("/", response_model=List[Client])
async def get_clients(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    sort_by: str = Query("name", regex="^(name|contact_name|email|city|state|country|created_at)$"),
    sort_order: str = Query("asc", regex="^(asc|desc)$"),
    search: Optional[str] = None,
    city: Optional[str] = None,
    state: Optional[str] = None,
    country: Optional[str] = None,
    client_service: ClientService = Depends(get_client_service),
    user_id: str = Depends(get_user_id)
):
    """
    Get all clients for the current user with optional filtering, pagination, and sorting.
    """
    filter_params = ClientFilter(
        search=search,
        city=city,
        state=state,
        country=country
    )

    return await client_service.get_all_clients(
        user_id=user_id,
        filter_params=filter_params,
        page=page,
        page_size=page_size,
        sort_by=sort_by,
        sort_order=sort_order
    )

@router.get("/{client_id}", response_model=Client)
async def get_client(
    client_id: UUID,
    client_service: ClientService = Depends(get_client_service),
    user_id: str = Depends(get_user_id)
):
    """
    Get a specific client by ID.
    """
    client = await client_service.get_client_by_id(str(client_id), user_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client

@router.post("/", response_model=Client)
async def create_client(
    client_data: ClientCreate,
    client_service: ClientService = Depends(get_client_service),
    user_id: str = Depends(get_user_id)
):
    """
    Create a new client.
    """
    return await client_service.create_client(client_data, user_id)

@router.put("/{client_id}", response_model=Client)
async def update_client(
    client_id: UUID,
    client_data: ClientUpdate,
    client_service: ClientService = Depends(get_client_service),
    user_id: str = Depends(get_user_id)
):
    """
    Update an existing client.
    """
    updated_client = await client_service.update_client(str(client_id), client_data, user_id)
    if not updated_client:
        raise HTTPException(status_code=404, detail="Client not found")
    return updated_client

@router.delete("/{client_id}")
async def delete_client(
    client_id: UUID,
    hard_delete: bool = Query(False, description="Whether to permanently delete the client"),
    client_service: ClientService = Depends(get_client_service),
    user_id: str = Depends(get_user_id)
):
    """
    Delete a client (soft delete by default).
    """
    success = await client_service.delete_client(str(client_id), user_id, hard_delete)
    if not success:
        raise HTTPException(status_code=404, detail="Client not found")
    return {"message": "Client deleted successfully"}
