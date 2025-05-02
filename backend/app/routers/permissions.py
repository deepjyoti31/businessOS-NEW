from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, UUID4
from datetime import datetime

from app.services.permission_service import PermissionService

router = APIRouter(
    prefix="/api/admin/permissions",
    tags=["permissions"],
)

# Models
class PermissionCreate(BaseModel):
    name: str
    description: Optional[str] = None
    category: str

class PermissionUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None

# Dependencies
async def get_permission_service():
    return PermissionService()

# Permission Endpoints
@router.get("")
async def get_permissions(
    category: Optional[str] = None,
    permission_service: PermissionService = Depends(get_permission_service)
):
    """
    Get all permissions with optional filtering by category.
    """
    return await permission_service.get_all_permissions(category=category)

@router.get("/categories")
async def get_permission_categories(
    permission_service: PermissionService = Depends(get_permission_service)
):
    """
    Get all unique permission categories.
    """
    return await permission_service.get_permission_categories()

@router.get("/{permission_id}")
async def get_permission(
    permission_id: str,
    permission_service: PermissionService = Depends(get_permission_service)
):
    """
    Get a specific permission by ID.
    """
    return await permission_service.get_permission_by_id(permission_id)

@router.post("")
async def create_permission(
    permission_data: PermissionCreate,
    permission_service: PermissionService = Depends(get_permission_service)
):
    """
    Create a new permission.
    """
    return await permission_service.create_permission(permission_data.dict())

@router.put("/{permission_id}")
async def update_permission(
    permission_id: str,
    permission_data: PermissionUpdate,
    permission_service: PermissionService = Depends(get_permission_service)
):
    """
    Update a permission.
    """
    return await permission_service.update_permission(permission_id, permission_data.dict(exclude_unset=True))

@router.delete("/{permission_id}")
async def delete_permission(
    permission_id: str,
    permission_service: PermissionService = Depends(get_permission_service)
):
    """
    Delete a permission.
    """
    return await permission_service.delete_permission(permission_id)

@router.get("/{permission_id}/roles")
async def get_roles_with_permission(
    permission_id: str,
    permission_service: PermissionService = Depends(get_permission_service)
):
    """
    Get all roles that have a specific permission.
    """
    return await permission_service.get_roles_with_permission(permission_id)
