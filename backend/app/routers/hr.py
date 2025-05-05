"""
HR module API routes.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from datetime import date
from uuid import UUID

from app.models.hr import (
    Employee, EmployeeCreate, EmployeeUpdate, EmployeeFilter,
    Department, DepartmentCreate, DepartmentUpdate
)
from app.services.employee_service import EmployeeService
from app.services.department_service import DepartmentService
from app.utils.auth import get_user_id

router = APIRouter(
    prefix="/api/hr",
    tags=["hr"],
)

# Dependencies
async def get_employee_service():
    return EmployeeService()

async def get_department_service():
    return DepartmentService()

# Employee Endpoints
@router.get("/employees", response_model=dict)
async def get_employees(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    sort_by: str = Query("last_name", regex="^(first_name|last_name|email|position|department|hire_date|status|created_at)$"),
    sort_order: str = Query("asc", regex="^(asc|desc)$"),
    search: Optional[str] = None,
    department: Optional[str] = None,
    status: Optional[str] = None,
    employment_type: Optional[str] = None,
    hire_date_from: Optional[date] = None,
    hire_date_to: Optional[date] = None,
    employee_service: EmployeeService = Depends(get_employee_service),
    user_id: str = Depends(get_user_id)
):
    """
    Get all employees with optional filtering, pagination, and sorting.
    """
    filter_params = EmployeeFilter(
        search=search,
        department=department,
        status=status,
        employment_type=employment_type,
        hire_date_from=hire_date_from,
        hire_date_to=hire_date_to
    )
    
    return await employee_service.get_all_employees(
        page=page,
        page_size=page_size,
        sort_by=sort_by,
        sort_order=sort_order,
        search_term=filter_params.search,
        department=filter_params.department,
        status=filter_params.status,
        employment_type=filter_params.employment_type,
        hire_date_from=filter_params.hire_date_from,
        hire_date_to=filter_params.hire_date_to
    )

@router.get("/employees/{employee_id}", response_model=Employee)
async def get_employee(
    employee_id: UUID,
    employee_service: EmployeeService = Depends(get_employee_service),
    user_id: str = Depends(get_user_id)
):
    """
    Get a specific employee by ID.
    """
    return await employee_service.get_employee_by_id(str(employee_id))

@router.post("/employees", response_model=Employee)
async def create_employee(
    employee_data: EmployeeCreate,
    employee_service: EmployeeService = Depends(get_employee_service),
    user_id: str = Depends(get_user_id)
):
    """
    Create a new employee.
    """
    return await employee_service.create_employee(employee_data.model_dump(exclude_unset=True))

@router.put("/employees/{employee_id}", response_model=Employee)
async def update_employee(
    employee_id: UUID,
    employee_data: EmployeeUpdate,
    employee_service: EmployeeService = Depends(get_employee_service),
    user_id: str = Depends(get_user_id)
):
    """
    Update an employee.
    """
    return await employee_service.update_employee(str(employee_id), employee_data.model_dump(exclude_unset=True))

@router.delete("/employees/{employee_id}")
async def delete_employee(
    employee_id: UUID,
    hard_delete: bool = Query(False, description="Whether to permanently delete the record"),
    employee_service: EmployeeService = Depends(get_employee_service),
    user_id: str = Depends(get_user_id)
):
    """
    Delete an employee (soft delete by default).
    """
    return await employee_service.delete_employee(str(employee_id), hard_delete)

# Department Endpoints
@router.get("/departments", response_model=List[Department])
async def get_departments(
    search: Optional[str] = None,
    department_service: DepartmentService = Depends(get_department_service),
    user_id: str = Depends(get_user_id)
):
    """
    Get all departments with optional filtering.
    """
    return await department_service.get_all_departments(search_term=search)

@router.get("/departments/{department_id}", response_model=Department)
async def get_department(
    department_id: UUID,
    department_service: DepartmentService = Depends(get_department_service),
    user_id: str = Depends(get_user_id)
):
    """
    Get a specific department by ID.
    """
    return await department_service.get_department_by_id(str(department_id))

@router.post("/departments", response_model=Department)
async def create_department(
    department_data: DepartmentCreate,
    department_service: DepartmentService = Depends(get_department_service),
    user_id: str = Depends(get_user_id)
):
    """
    Create a new department.
    """
    return await department_service.create_department(department_data.model_dump(exclude_unset=True))

@router.put("/departments/{department_id}", response_model=Department)
async def update_department(
    department_id: UUID,
    department_data: DepartmentUpdate,
    department_service: DepartmentService = Depends(get_department_service),
    user_id: str = Depends(get_user_id)
):
    """
    Update a department.
    """
    return await department_service.update_department(str(department_id), department_data.model_dump(exclude_unset=True))

@router.delete("/departments/{department_id}")
async def delete_department(
    department_id: UUID,
    hard_delete: bool = Query(False, description="Whether to permanently delete the record"),
    department_service: DepartmentService = Depends(get_department_service),
    user_id: str = Depends(get_user_id)
):
    """
    Delete a department (soft delete by default).
    """
    return await department_service.delete_department(str(department_id), hard_delete)
