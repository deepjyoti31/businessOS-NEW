"""
Models for the HR module.
"""

from typing import List, Optional, Dict, Any
from datetime import date, datetime
from uuid import UUID
from pydantic import BaseModel, Field, EmailStr, ConfigDict

# Employee Models
class EmployeeBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    position: str
    department: str
    manager_id: Optional[UUID] = None
    hire_date: date
    employment_type: str
    status: str = "Active"
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip: Optional[str] = None
    country: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    emergency_contact_relationship: Optional[str] = None

class EmployeeCreate(EmployeeBase):
    user_id: Optional[UUID] = None
    salary: Optional[float] = None

class EmployeeUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    position: Optional[str] = None
    department: Optional[str] = None
    manager_id: Optional[UUID] = None
    hire_date: Optional[date] = None
    employment_type: Optional[str] = None
    status: Optional[str] = None
    salary: Optional[float] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip: Optional[str] = None
    country: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    emergency_contact_relationship: Optional[str] = None

class Employee(EmployeeBase):
    id: UUID
    user_id: Optional[UUID] = None
    manager_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    is_deleted: bool = False

    model_config = ConfigDict(from_attributes=True)

class EmployeeFilter(BaseModel):
    search: Optional[str] = None
    department: Optional[str] = None
    status: Optional[str] = None
    employment_type: Optional[str] = None
    hire_date_from: Optional[date] = None
    hire_date_to: Optional[date] = None

# Department Models
class DepartmentBase(BaseModel):
    name: str
    description: Optional[str] = None
    manager_id: Optional[UUID] = None

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    manager_id: Optional[UUID] = None

class Department(DepartmentBase):
    id: UUID
    manager_name: Optional[str] = None
    employee_count: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    is_deleted: bool = False

    model_config = ConfigDict(from_attributes=True)

# Employee Document Models
class EmployeeDocumentBase(BaseModel):
    employee_id: UUID
    file_id: UUID
    document_type: str
    description: Optional[str] = None

class EmployeeDocumentCreate(EmployeeDocumentBase):
    pass

class EmployeeDocumentUpdate(BaseModel):
    document_type: Optional[str] = None
    description: Optional[str] = None

class EmployeeDocument(EmployeeDocumentBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    is_deleted: bool = False
    file_name: Optional[str] = None
    file_size: Optional[int] = None
    file_type: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

# Time Off Request Models
class TimeOffRequestBase(BaseModel):
    employee_id: UUID
    request_type: str
    start_date: date
    end_date: date
    total_days: int
    notes: Optional[str] = None

class TimeOffRequestCreate(TimeOffRequestBase):
    pass

class TimeOffRequestUpdate(BaseModel):
    request_type: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    total_days: Optional[int] = None
    status: Optional[str] = None
    notes: Optional[str] = None
    approved_by: Optional[UUID] = None

class TimeOffRequest(TimeOffRequestBase):
    id: UUID
    status: str = "Pending"
    approved_by: Optional[UUID] = None
    employee_name: Optional[str] = None
    approver_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    is_deleted: bool = False

    model_config = ConfigDict(from_attributes=True)

class TimeOffRequestFilter(BaseModel):
    employee_id: Optional[UUID] = None
    status: Optional[str] = None
    request_type: Optional[str] = None
    start_date_from: Optional[date] = None
    start_date_to: Optional[date] = None
