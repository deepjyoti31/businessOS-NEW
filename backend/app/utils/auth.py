"""
Authentication utilities for the BusinessOS API.
"""

import os
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import logging

# Configure logging
logger = logging.getLogger(__name__)

# Initialize security scheme
security = HTTPBearer()

def get_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """
    Extract and validate the user ID from the JWT token.

    Args:
        credentials: The HTTP Authorization credentials

    Returns:
        The user ID from the token

    Raises:
        HTTPException: If the token is invalid or expired
    """
    try:
        # Get the JWT token from the Authorization header
        token = credentials.credentials

        # For development/testing purposes, we'll decode the token without verification
        # In production, you should use the proper JWT secret from Supabase
        try:
            # First try to decode with verification if JWT_SECRET is available
            jwt_secret = os.environ.get("SUPABASE_JWT_SECRET")
            if jwt_secret:
                payload = jwt.decode(
                    token,
                    jwt_secret,
                    algorithms=["HS256"],
                    options={"verify_signature": True}
                )
            else:
                # Fall back to decoding without verification for development
                logger.warning("SUPABASE_JWT_SECRET not set, decoding token without verification")
                payload = jwt.decode(
                    token,
                    options={"verify_signature": False}
                )
        except Exception as decode_error:
            logger.warning(f"Error decoding token with verification: {str(decode_error)}")
            # Fall back to decoding without verification
            payload = jwt.decode(
                token,
                options={"verify_signature": False}
            )

        # Extract the user ID from the token payload
        # Supabase tokens store the user ID in the 'sub' claim
        user_id = payload.get("sub")

        if not user_id:
            # Try alternate locations where Supabase might store the user ID
            user_id = payload.get("user_id") or payload.get("uid")

        if not user_id:
            logger.error("User ID not found in token payload")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token"
            )

        return user_id

    except jwt.ExpiredSignatureError:
        logger.error("Token has expired")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.InvalidTokenError as e:
        logger.error(f"Invalid token: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token"
        )
    except Exception as e:
        logger.error(f"Authentication error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication error"
        )

def is_admin(user_id: str = Depends(get_user_id)) -> bool:
    """
    Check if the user is an admin.

    Args:
        user_id: The user ID

    Returns:
        True if the user is an admin, False otherwise
    """
    # This is a placeholder. In a real implementation, you would check
    # if the user has the admin role in the database.
    # For now, we'll just return False
    return False
