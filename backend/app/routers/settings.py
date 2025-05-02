"""
API routes for system settings management.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

from app.services.settings_service import SettingsService

router = APIRouter(
    prefix="/api/admin/settings",
    tags=["settings"],
)

# Models
class SettingUpdate(BaseModel):
    value: Any
    data_type: Optional[str] = None

# Dependency
async def get_settings_service():
    return SettingsService()

# Endpoints
@router.get("")
async def get_all_settings(
    settings_service: SettingsService = Depends(get_settings_service)
):
    """
    Get all system settings.
    """
    return await settings_service.get_all_settings()

@router.get("/categories")
async def get_setting_categories(
    settings_service: SettingsService = Depends(get_settings_service)
):
    """
    Get all unique setting categories.
    """
    return await settings_service.get_setting_categories()

@router.get("/{category}")
async def get_settings_by_category(
    category: str,
    settings_service: SettingsService = Depends(get_settings_service)
):
    """
    Get system settings by category.
    """
    return await settings_service.get_settings_by_category(category)

@router.get("/{category}/{key}")
async def get_setting(
    category: str,
    key: str,
    settings_service: SettingsService = Depends(get_settings_service)
):
    """
    Get a specific system setting.
    """
    return await settings_service.get_setting(category, key)

@router.put("/{category}/{key}")
async def update_setting(
    category: str,
    key: str,
    setting_data: SettingUpdate,
    settings_service: SettingsService = Depends(get_settings_service)
):
    """
    Update a system setting.
    """
    return await settings_service.update_setting(
        category, 
        key, 
        setting_data.value, 
        setting_data.data_type
    )
