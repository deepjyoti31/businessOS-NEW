"""
Client models for the Finance module.
"""

from typing import Optional
from pydantic import BaseModel, validator, field_validator
from datetime import datetime
from uuid import UUID
import re


class ClientBase(BaseModel):
    """Base client model with common fields."""
    name: str
    contact_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip: Optional[str] = None
    country: Optional[str] = None

    @validator('email')
    def validate_email(cls, v):
        """Validate email format if provided."""
        if v is not None and v.strip():
            # Simple email validation using regex
            email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            if not re.match(email_regex, v):
                raise ValueError("Invalid email format")
        return v


class ClientCreate(ClientBase):
    """Model for creating a new client."""
    pass


class ClientUpdate(BaseModel):
    """Model for updating an existing client."""
    name: Optional[str] = None
    contact_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip: Optional[str] = None
    country: Optional[str] = None
    is_deleted: Optional[bool] = None

    @validator('email')
    def validate_email(cls, v):
        """Validate email format if provided."""
        if v is not None and v.strip():
            # Simple email validation using regex
            email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            if not re.match(email_regex, v):
                raise ValueError("Invalid email format")
        return v


class Client(ClientBase):
    """Complete client model with all fields."""
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime
    is_deleted: bool = False

    class Config:
        from_attributes = True


class ClientFilter(BaseModel):
    """Model for filtering clients."""
    search: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
