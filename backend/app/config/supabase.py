"""
Supabase client configuration.
"""

import os
import logging
from typing import Optional
from supabase import create_client, Client

# Set up logging
logger = logging.getLogger(__name__)

# Global Supabase client instance
_supabase_client: Optional[Client] = None

def get_supabase_client() -> Client:
    """
    Get or create a Supabase client instance.
    
    Returns:
        Supabase client instance
    """
    global _supabase_client
    
    if _supabase_client is None:
        # Get Supabase credentials from environment variables
        supabase_url = os.environ.get("SUPABASE_URL")
        supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")
        
        if not supabase_url or not supabase_key:
            logger.error("Supabase credentials not configured")
            raise ValueError("Supabase credentials not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables.")
        
        # Log the Supabase URL (but not the key for security reasons)
        logger.info(f"Supabase URL: {supabase_url}")
        logger.info(f"Supabase Key: {supabase_key[:10]}...{supabase_key[-10:]}")
        
        try:
            # Create Supabase client
            _supabase_client = create_client(supabase_url, supabase_key)
            logger.info("Supabase client created successfully")
        except Exception as e:
            logger.error(f"Error creating Supabase client: {str(e)}")
            raise
    
    return _supabase_client
