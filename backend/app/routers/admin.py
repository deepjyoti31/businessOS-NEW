from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, UUID4
from datetime import datetime

from app.services.user_service import UserService

router = APIRouter(
    prefix="/api/admin",
    tags=["admin"],
)

# Models
class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    company: Optional[str] = None
    role: Optional[str] = None
    department: Optional[str] = None
    job_title: Optional[str] = None
    avatar_url: Optional[str] = None
    contact_info: Optional[Dict[str, Any]] = None
    preferences: Optional[Dict[str, Any]] = None
    status: Optional[str] = None

class UserStatusUpdate(BaseModel):
    status: str

class BulkStatusUpdate(BaseModel):
    user_ids: List[str]
    status: str

class UserRoleAssignment(BaseModel):
    role_id: str

# Dependency
async def get_user_service():
    return UserService()

# Endpoints
@router.get("/users")
async def get_users(
    search: Optional[str] = None,
    status: Optional[str] = None,
    user_service: UserService = Depends(get_user_service)
):
    """
    Get all users with optional filtering.
    """
    return await user_service.get_all_users(search_term=search, status=status)

@router.get("/users/{user_id}")
async def get_user(
    user_id: str,
    user_service: UserService = Depends(get_user_service)
):
    """
    Get a specific user by ID.
    """
    return await user_service.get_user_by_id(user_id)

@router.put("/users/{user_id}")
async def update_user(
    user_id: str,
    user_data: UserProfileUpdate,
    user_service: UserService = Depends(get_user_service)
):
    """
    Update a user's profile information.
    """
    return await user_service.update_user(user_id, user_data.dict(exclude_unset=True))

@router.put("/users/{user_id}/status")
async def update_user_status(
    user_id: str,
    status_update: UserStatusUpdate,
    user_service: UserService = Depends(get_user_service)
):
    """
    Update a user's status (active/inactive).
    """
    return await user_service.update_user_status(user_id, status_update.status)

@router.post("/users/bulk-status")
async def bulk_update_status(
    update_data: BulkStatusUpdate,
    user_service: UserService = Depends(get_user_service)
):
    """
    Update status for multiple users at once.
    """
    return await user_service.bulk_update_status(update_data.user_ids, update_data.status)

@router.get("/users/{user_id}/roles")
async def get_user_roles(
    user_id: str,
    user_service: UserService = Depends(get_user_service)
):
    """
    Get all roles assigned to a user.
    """
    return await user_service.get_user_roles(user_id)

@router.post("/users/{user_id}/roles")
async def assign_role_to_user(
    user_id: str,
    role_data: UserRoleAssignment,
    user_service: UserService = Depends(get_user_service)
):
    """
    Assign a role to a user.
    """
    return await user_service.assign_role_to_user(user_id, role_data.role_id)

@router.delete("/users/{user_id}/roles/{role_id}")
async def remove_role_from_user(
    user_id: str,
    role_id: str,
    user_service: UserService = Depends(get_user_service)
):
    """
    Remove a role from a user.
    """
    return await user_service.remove_role_from_user(user_id, role_id)

@router.get("/users/{user_id}/permissions")
async def get_user_permissions(
    user_id: str,
    user_service: UserService = Depends(get_user_service)
):
    """
    Get all permissions for a user.
    """
    return await user_service.get_user_permissions(user_id)
