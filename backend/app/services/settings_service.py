"""
System settings service for BusinessOS.
"""

import logging
import json
import time
from typing import Dict, Any, List, Optional
from datetime import datetime
from fastapi import HTTPException
import os
from supabase import create_client, Client

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Cache for settings
settings_cache = {}
category_cache = {}
# Cache expiration time in seconds (5 minutes)
CACHE_EXPIRATION = 300

# Initialize Supabase client
supabase_url = os.environ.get("SUPABASE_URL", "https://epgrylrflsrxkvpeieud.supabase.co")
supabase_key = os.environ.get("SUPABASE_SERVICE_KEY") or os.environ.get("SUPABASE_KEY")

class SettingsService:
    """Service for managing system settings."""

    def __init__(self):
        """Initialize the settings service with Supabase client."""
        if not supabase_url or not supabase_key:
            logger.error("Supabase URL and key must be provided")
            raise ValueError("Supabase URL and key must be provided")

        logger.info(f"Initializing SettingsService with Supabase URL: {supabase_url}")
        self.supabase: Client = create_client(supabase_url, supabase_key)

    async def get_all_settings(self) -> List[Dict[str, Any]]:
        """
        Get all system settings.

        Returns:
            List of system settings
        """
        try:
            response = self.supabase.table("system_settings").select("*").execute()

            if not response.data:
                return []

            # Parse JSON values
            for setting in response.data:
                if setting.get("value") and isinstance(setting["value"], str):
                    try:
                        setting["value"] = json.loads(setting["value"])
                    except json.JSONDecodeError:
                        # If not valid JSON, keep as is
                        pass

            return response.data
        except Exception as e:
            logger.error(f"Error fetching system settings: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error fetching system settings: {str(e)}")

    async def get_settings_by_category(self, category: str, use_cache: bool = True) -> List[Dict[str, Any]]:
        """
        Get system settings by category.

        Args:
            category: The settings category
            use_cache: Whether to use the cache (default: True)

        Returns:
            List of system settings in the specified category
        """
        # Check cache first if use_cache is True
        cache_key = f"category_{category}"
        if use_cache and cache_key in category_cache:
            cache_entry = category_cache[cache_key]
            # Check if cache is still valid
            if time.time() - cache_entry["timestamp"] < CACHE_EXPIRATION:
                logger.info(f"Using cached data for settings category {category}")
                return cache_entry["data"]
            else:
                # Cache expired, remove it
                del category_cache[cache_key]

        try:
            response = self.supabase.table("system_settings").select("*").eq("category", category).execute()

            if not response.data:
                return []

            # Parse JSON values
            for setting in response.data:
                if setting.get("value") and isinstance(setting["value"], str):
                    try:
                        setting["value"] = json.loads(setting["value"])
                    except json.JSONDecodeError:
                        # If not valid JSON, keep as is
                        pass

            # Store in cache
            if use_cache:
                category_cache[cache_key] = {
                    "data": response.data,
                    "timestamp": time.time()
                }
                logger.info(f"Cached settings for category {category}")

            return response.data
        except Exception as e:
            logger.error(f"Error fetching settings for category {category}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error fetching settings: {str(e)}")

    async def get_setting(self, category: str, key: str, use_cache: bool = True) -> Dict[str, Any]:
        """
        Get a specific system setting.

        Args:
            category: The setting category
            key: The setting key
            use_cache: Whether to use the cache (default: True)

        Returns:
            System setting data
        """
        # Check cache first if use_cache is True
        cache_key = f"setting_{category}_{key}"
        if use_cache and cache_key in settings_cache:
            cache_entry = settings_cache[cache_key]
            # Check if cache is still valid
            if time.time() - cache_entry["timestamp"] < CACHE_EXPIRATION:
                logger.info(f"Using cached data for setting {category}.{key}")
                return cache_entry["data"]
            else:
                # Cache expired, remove it
                del settings_cache[cache_key]

        try:
            response = self.supabase.table("system_settings").select("*").eq("category", category).eq("key", key).single().execute()

            if not response.data:
                raise HTTPException(status_code=404, detail=f"Setting {category}.{key} not found")

            # Parse JSON value
            if response.data.get("value") and isinstance(response.data["value"], str):
                try:
                    response.data["value"] = json.loads(response.data["value"])
                except json.JSONDecodeError:
                    # If not valid JSON, keep as is
                    pass

            # Store in cache
            if use_cache:
                settings_cache[cache_key] = {
                    "data": response.data,
                    "timestamp": time.time()
                }
                logger.info(f"Cached setting {category}.{key}")

            return response.data
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error fetching setting {category}.{key}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error fetching setting: {str(e)}")

    async def update_setting(self, category: str, key: str, value: Any, data_type: Optional[str] = None) -> Dict[str, Any]:
        """
        Update a system setting.

        Args:
            category: The setting category
            key: The setting key
            value: The new setting value
            data_type: The data type of the value (optional)

        Returns:
            Updated system setting data
        """
        try:
            # Get the current setting to check if it exists
            try:
                current_setting = await self.get_setting(category, key)
            except HTTPException as e:
                if e.status_code == 404:
                    # Setting doesn't exist, create it
                    if not data_type:
                        # Infer data type if not provided
                        if isinstance(value, bool):
                            data_type = "boolean"
                        elif isinstance(value, (int, float)):
                            data_type = "number"
                        elif isinstance(value, list):
                            data_type = "array"
                        else:
                            data_type = "string"

                    new_setting = {
                        "category": category,
                        "key": key,
                        "value": json.dumps(value) if not isinstance(value, str) else value,
                        "data_type": data_type,
                        "description": f"Setting for {category}.{key}"
                    }

                    response = self.supabase.table("system_settings").insert(new_setting).execute()

                    if not response.data or len(response.data) == 0:
                        raise HTTPException(status_code=500, detail=f"Failed to create setting {category}.{key}")

                    # Invalidate category cache
                    cache_key = f"category_{category}"
                    if cache_key in category_cache:
                        del category_cache[cache_key]
                        logger.info(f"Invalidated cache for settings category {category}")

                    return response.data[0]
                else:
                    raise

            # Prepare the value for storage
            if not isinstance(value, str):
                value = json.dumps(value)

            # Update the setting
            update_data = {
                "value": value,
                "updated_at": datetime.now().isoformat()
            }

            # Update data_type if provided
            if data_type:
                update_data["data_type"] = data_type

            response = self.supabase.table("system_settings").update(update_data).eq("category", category).eq("key", key).execute()

            if not response.data or len(response.data) == 0:
                raise HTTPException(status_code=404, detail=f"Setting {category}.{key} not found")

            # Parse JSON value for response
            if response.data[0].get("value") and isinstance(response.data[0]["value"], str):
                try:
                    response.data[0]["value"] = json.loads(response.data[0]["value"])
                except json.JSONDecodeError:
                    # If not valid JSON, keep as is
                    pass

            # Invalidate category cache
            cache_key = f"category_{category}"
            if cache_key in category_cache:
                del category_cache[cache_key]
                logger.info(f"Invalidated cache for settings category {category}")

            # Invalidate specific setting cache
            setting_cache_key = f"setting_{category}_{key}"
            if setting_cache_key in settings_cache:
                del settings_cache[setting_cache_key]
                logger.info(f"Invalidated cache for setting {category}.{key}")

            return response.data[0]
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error updating setting {category}.{key}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error updating setting: {str(e)}")

    async def get_setting_categories(self) -> List[str]:
        """
        Get all unique setting categories.

        Returns:
            List of unique categories
        """
        try:
            response = self.supabase.table("system_settings").select("category").execute()

            if not response.data:
                return []

            # Extract unique categories
            categories = list(set(item["category"] for item in response.data))
            return sorted(categories)
        except Exception as e:
            logger.error(f"Error fetching setting categories: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error fetching setting categories: {str(e)}")
