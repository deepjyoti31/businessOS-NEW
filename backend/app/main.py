"""
Main FastAPI application for BusinessOS backend services.
"""

import os
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import routers
from app.routers import documents, admin, roles, permissions, company, settings, finance, clients, invoices, budgets

# Create FastAPI app
app = FastAPI(
    title="BusinessOS API",
    description="API for BusinessOS document processing and AI services",
    version="1.0.0"
)

# Configure CORS
origins = os.getenv("CORS_ORIGINS", "http://localhost:8080").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(documents.router, prefix="/api/documents", tags=["documents"])
app.include_router(admin.router)
app.include_router(roles.router)
app.include_router(permissions.router)
app.include_router(company.router)
app.include_router(settings.router)
app.include_router(finance.router, prefix="/api", tags=["finance"])
app.include_router(clients.router, prefix="/api", tags=["clients"])
app.include_router(invoices.router, prefix="/api", tags=["invoices"])
app.include_router(budgets.router, prefix="/api", tags=["budgets"])

@app.get("/")
async def root():
    """Root endpoint to check if the API is running."""
    return {"message": "BusinessOS API is running"}

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    # Check if Supabase connection is working
    supabase_status = "healthy"
    supabase_error = None

    try:
        # Import the Supabase client
        import supabase

        # Initialize Supabase client
        supabase_url = os.environ.get("SUPABASE_URL")
        supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")

        if not supabase_url or not supabase_key:
            supabase_status = "error"
            supabase_error = "Supabase credentials not configured"
        else:
            # Try to connect to Supabase
            supabase_client = supabase.create_client(supabase_url, supabase_key)
            # Test the connection with a simple query
            response = supabase_client.table("files").select("count", count="exact").limit(1).execute()
            if response.data is None:
                supabase_status = "error"
                supabase_error = "Failed to query Supabase"
    except Exception as e:
        supabase_status = "error"
        supabase_error = str(e)

    # Check if Azure OpenAI connection is working
    azure_openai_status = "healthy"
    azure_openai_error = None

    try:
        # Check if Azure OpenAI credentials are configured
        azure_openai_api_key = os.environ.get("AZURE_OPENAI_API_KEY")
        azure_openai_endpoint = os.environ.get("AZURE_OPENAI_ENDPOINT")

        if not azure_openai_api_key or not azure_openai_endpoint:
            azure_openai_status = "error"
            azure_openai_error = "Azure OpenAI credentials not configured"
    except Exception as e:
        azure_openai_status = "error"
        azure_openai_error = str(e)

    return {
        "status": "healthy" if supabase_status == "healthy" and azure_openai_status == "healthy" else "degraded",
        "services": {
            "api": "healthy",
            "supabase": {
                "status": supabase_status,
                "error": supabase_error
            },
            "azure_openai": {
                "status": azure_openai_status,
                "error": azure_openai_error
            }
        },
        "timestamp": datetime.now().isoformat()
    }
