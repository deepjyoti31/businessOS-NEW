"""
API routes for company profile management.
"""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from typing import Dict, Any, Optional
from pydantic import BaseModel
import base64

from app.services.company_service import CompanyService

router = APIRouter(
    prefix="/api/admin/company",
    tags=["company"],
)

# Models
class CompanyProfileUpdate(BaseModel):
    name: Optional[str] = None
    industry: Optional[str] = None
    size: Optional[str] = None
    founded: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    tax_id: Optional[str] = None
    registration_number: Optional[str] = None
    fiscal_year: Optional[str] = None

# Dependency
async def get_company_service():
    return CompanyService()

# Endpoints
@router.get("")
async def get_company_profile(
    company_service: CompanyService = Depends(get_company_service)
):
    """
    Get the company profile.
    """
    return await company_service.get_company_profile()

@router.put("")
async def update_company_profile(
    profile_data: CompanyProfileUpdate,
    company_service: CompanyService = Depends(get_company_service)
):
    """
    Update the company profile.
    """
    return await company_service.update_company_profile(profile_data.dict(exclude_unset=True))

@router.post("/logo")
async def upload_logo(
    file: UploadFile = File(...),
    company_service: CompanyService = Depends(get_company_service)
):
    """
    Upload a company logo.
    """
    # Read file content
    file_content = await file.read()
    
    # Generate file path
    file_extension = file.filename.split(".")[-1] if "." in file.filename else "png"
    file_path = f"logo.{file_extension}"
    
    # Upload logo
    return await company_service.upload_logo(file_path, file_content)

@router.post("/logo/base64")
async def upload_logo_base64(
    file_name: str = Form(...),
    file_data: str = Form(...),
    company_service: CompanyService = Depends(get_company_service)
):
    """
    Upload a company logo using base64 encoded data.
    """
    try:
        # Decode base64 data
        # Remove data URL prefix if present
        if "base64," in file_data:
            file_data = file_data.split("base64,")[1]
        
        file_content = base64.b64decode(file_data)
        
        # Generate file path
        file_extension = file_name.split(".")[-1] if "." in file_name else "png"
        file_path = f"logo.{file_extension}"
        
        # Upload logo
        return await company_service.upload_logo(file_path, file_content)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid base64 data: {str(e)}")
