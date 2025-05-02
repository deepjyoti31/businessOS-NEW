"""
Company profile service for BusinessOS.
"""

import logging
import time
from typing import Dict, Any, List, Optional
from datetime import datetime
from fastapi import HTTPException
import os
from supabase import create_client, Client

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Cache for company profile
company_profile_cache = {}
# Cache expiration time in seconds (5 minutes)
CACHE_EXPIRATION = 300

# Initialize Supabase client
supabase_url = os.environ.get("SUPABASE_URL", "https://epgrylrflsrxkvpeieud.supabase.co")
supabase_key = os.environ.get("SUPABASE_SERVICE_KEY") or os.environ.get("SUPABASE_KEY")

class CompanyService:
    """Service for managing company profile information."""

    def __init__(self):
        """Initialize the company service with Supabase client."""
        if not supabase_url or not supabase_key:
            logger.error("Supabase URL and key must be provided")
            raise ValueError("Supabase URL and key must be provided")

        logger.info(f"Initializing CompanyService with Supabase URL: {supabase_url}")
        self.supabase: Client = create_client(supabase_url, supabase_key)

        # Ensure the company bucket exists
        try:
            # Check if the bucket exists
            buckets = self.supabase.storage.list_buckets()
            bucket_exists = any(bucket.name == "company" for bucket in buckets)

            if not bucket_exists:
                # Create the bucket if it doesn't exist
                self.supabase.storage.create_bucket("company", {"public": True})
                logger.info("Created company storage bucket")
        except Exception as e:
            logger.warning(f"Error checking/creating company bucket: {str(e)}")

    async def get_company_profile(self, use_cache: bool = True) -> Dict[str, Any]:
        """
        Get the company profile.

        Args:
            use_cache: Whether to use the cache (default: True)

        Returns:
            Company profile data
        """
        # Check cache first if use_cache is True
        if use_cache and "profile" in company_profile_cache:
            cache_entry = company_profile_cache["profile"]
            # Check if cache is still valid
            if time.time() - cache_entry["timestamp"] < CACHE_EXPIRATION:
                logger.info("Using cached company profile data")
                return cache_entry["data"]
            else:
                # Cache expired, remove it
                del company_profile_cache["profile"]

        try:
            response = self.supabase.table("company_profile").select("*").limit(1).execute()

            if not response.data:
                # If no company profile exists, create a default one
                default_profile = {
                    "name": "BusinessOS",
                    "industry": "Software Development",
                    "size": "10-50 employees",
                    "founded": "2023",
                    "website": "https://business-os.example.com",
                    "description": "AI-First Business Management Platform for Small Businesses",
                    "email": "contact@business-os.example.com",
                    "phone": "+1 (555) 123-4567"
                }
                create_response = self.supabase.table("company_profile").insert(default_profile).execute()
                if create_response.data:
                    result = create_response.data[0]
                    # Store in cache
                    if use_cache:
                        company_profile_cache["profile"] = {
                            "data": result,
                            "timestamp": time.time()
                        }
                        logger.info("Cached company profile data (newly created)")
                    return result
                else:
                    raise HTTPException(status_code=500, detail="Failed to create default company profile")

            result = response.data[0]
            # Store in cache
            if use_cache:
                company_profile_cache["profile"] = {
                    "data": result,
                    "timestamp": time.time()
                }
                logger.info("Cached company profile data")

            return result
        except Exception as e:
            logger.error(f"Error fetching company profile: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error fetching company profile: {str(e)}")

    async def update_company_profile(self, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update the company profile.

        Args:
            profile_data: Company profile data to update

        Returns:
            Updated company profile data
        """
        try:
            # Get the current profile to get the ID (don't use cache for this)
            current_profile = await self.get_company_profile(use_cache=False)
            profile_id = current_profile.get("id")

            # Remove any fields that shouldn't be directly updated
            safe_data = profile_data.copy()
            safe_data.pop("id", None)
            safe_data.pop("created_at", None)

            # Set updated_at timestamp
            safe_data["updated_at"] = datetime.now().isoformat()

            # Update the profile
            response = self.supabase.table("company_profile").update(safe_data).eq("id", profile_id).execute()

            if not response.data or len(response.data) == 0:
                raise HTTPException(status_code=404, detail=f"Company profile not found")

            # Invalidate cache
            if "profile" in company_profile_cache:
                del company_profile_cache["profile"]
                logger.info("Invalidated company profile cache")

            return response.data[0]
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error updating company profile: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error updating company profile: {str(e)}")

    async def upload_logo(self, file_path: str, file_content: bytes) -> Dict[str, Any]:
        """
        Upload a company logo to Supabase Storage.

        Args:
            file_path: Path where the file should be stored
            file_content: Binary content of the file

        Returns:
            Updated company profile with new logo URL
        """
        try:
            # Upload the file to Supabase Storage
            bucket_name = "company"

            # Ensure the bucket exists
            buckets = self.supabase.storage.list_buckets()
            bucket_exists = any(bucket.name == bucket_name for bucket in buckets)

            if not bucket_exists:
                self.supabase.storage.create_bucket(bucket_name, {"public": True})

            # Upload the file
            self.supabase.storage.from_(bucket_name).upload(file_path, file_content)

            # Get the public URL
            logo_url = self.supabase.storage.from_(bucket_name).get_public_url(file_path)

            # Update the company profile with the new logo URL
            current_profile = await self.get_company_profile(use_cache=False)
            profile_id = current_profile.get("id")

            update_data = {"logo_url": logo_url, "updated_at": datetime.now().isoformat()}
            response = self.supabase.table("company_profile").update(update_data).eq("id", profile_id).execute()

            if not response.data or len(response.data) == 0:
                raise HTTPException(status_code=404, detail=f"Company profile not found")

            # Invalidate cache
            if "profile" in company_profile_cache:
                del company_profile_cache["profile"]
                logger.info("Invalidated company profile cache after logo upload")

            return response.data[0]
        except Exception as e:
            logger.error(f"Error uploading company logo: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error uploading company logo: {str(e)}")
