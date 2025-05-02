from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, UUID4
from datetime import datetime

from app.services.role_service import RoleService
from app.services.permission_service import PermissionService
from app.services.user_service import UserService

router = APIRouter(
    prefix="/api/admin/roles",
    tags=["roles"],
)

# Models
class RoleCreate(BaseModel):
    name: str
    description: Optional[str] = None
    is_system: Optional[bool] = False

class RoleUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class PermissionAssignment(BaseModel):
    permission_id: str

class UserRoleAssignment(BaseModel):
    user_id: str

# Dependencies
async def get_role_service():
    return RoleService()

async def get_permission_service():
    return PermissionService()

async def get_user_service():
    return UserService()

# Role Endpoints
@router.get("")
async def get_roles(
    search: Optional[str] = None,
    role_service: RoleService = Depends(get_role_service)
):
    """
    Get all roles with optional filtering.
    """
    return await role_service.get_all_roles(search_term=search)

@router.get("/{role_id}")
async def get_role(
    role_id: str,
    role_service: RoleService = Depends(get_role_service)
):
    """
    Get a specific role by ID.
    """
    return await role_service.get_role_by_id(role_id)

@router.post("")
async def create_role(
    role_data: RoleCreate,
    role_service: RoleService = Depends(get_role_service)
):
    """
    Create a new role.
    """
    return await role_service.create_role(role_data.dict())

@router.put("/{role_id}")
async def update_role(
    role_id: str,
    role_data: RoleUpdate,
    role_service: RoleService = Depends(get_role_service)
):
    """
    Update a role.
    """
    return await role_service.update_role(role_id, role_data.dict(exclude_unset=True))

@router.delete("/{role_id}")
async def delete_role(
    role_id: str,
    role_service: RoleService = Depends(get_role_service)
):
    """
    Delete a role.
    """
    return await role_service.delete_role(role_id)

# Role Permissions Endpoints
@router.get("/{role_id}/permissions")
async def get_role_permissions(
    role_id: str,
    role_service: RoleService = Depends(get_role_service)
):
    """
    Get all permissions assigned to a role.
    """
    return await role_service.get_role_permissions(role_id)

@router.post("/{role_id}/permissions")
async def assign_permission_to_role(
    role_id: str,
    permission_data: PermissionAssignment,
    role_service: RoleService = Depends(get_role_service)
):
    """
    Assign a permission to a role.
    """
    return await role_service.assign_permission_to_role(role_id, permission_data.permission_id)

@router.delete("/{role_id}/permissions/{permission_id}")
async def remove_permission_from_role(
    role_id: str,
    permission_id: str,
    role_service: RoleService = Depends(get_role_service)
):
    """
    Remove a permission from a role.
    """
    return await role_service.remove_permission_from_role(role_id, permission_id)

# Role Users Endpoints
@router.get("/{role_id}/users")
async def get_users_with_role(
    role_id: str,
    role_service: RoleService = Depends(get_role_service)
):
    """
    Get all users assigned to a role.
    """
    return await role_service.get_users_with_role(role_id)

@router.post("/{role_id}/users")
async def assign_role_to_user(
    role_id: str,
    user_data: UserRoleAssignment,
    user_service: UserService = Depends(get_user_service)
):
    """
    Assign a role to a user.
    """
    return await user_service.assign_role_to_user(user_data.user_id, role_id)

@router.delete("/{role_id}/users/{user_id}")
async def remove_role_from_user(
    role_id: str,
    user_id: str,
    user_service: UserService = Depends(get_user_service)
):
    """
    Remove a role from a user.
    """
    return await user_service.remove_role_from_user(user_id, role_id)
