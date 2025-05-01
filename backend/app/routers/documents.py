"""
Document processing API routes.
"""

from fastapi import APIRouter, HTTPException
from typing import Dict, Any

from app.models.documents import (
    DocumentProcessingRequest,
    DocumentProcessingResult,
    BatchProcessingRequest,
    BatchProcessingResult,
    DocumentSearchRequest,
    DocumentSearchResponse
)
from app.services.document_service import process_document, search_documents, batch_process_documents

router = APIRouter()


@router.get("/status")
async def get_status() -> Dict[str, Any]:
    """
    Get the status of the document processing service.
    """
    return {
        "status": "operational",
        "message": "Document processing service is running",
        "features": [
            "Document text extraction",
            "Document summarization",
            "Entity extraction",
            "Topic classification",
            "Sentiment analysis",
            "Semantic search"
        ]
    }


@router.post("/process", response_model=DocumentProcessingResult)
async def process_document_endpoint(request: DocumentProcessingRequest):
    """
    Process a document to extract text, generate summary, extract entities, classify topics, and generate embeddings.
    """
    if not request.file_id:
        raise HTTPException(status_code=400, detail="Missing file_id parameter")

    try:
        print(f"Processing document with ID: {request.file_id}")
        result = await process_document(request.file_id)

        if not result.success:
            print(f"Processing failed: {result.error}")
            return DocumentProcessingResult(
                success=False,
                file_id=request.file_id,
                error=result.error
            )

        return result
    except Exception as e:
        print(f"Error in process_document_endpoint: {e}")
        # Return a proper result instead of raising an exception
        # This allows the frontend to display the error message
        return DocumentProcessingResult(
            success=False,
            file_id=request.file_id,
            error=str(e)
        )


@router.post("/batch-process", response_model=BatchProcessingResult)
async def batch_process_documents_endpoint(request: BatchProcessingRequest):
    """
    Process multiple documents in batch to extract text, generate summaries, extract entities, classify topics, and generate embeddings.
    """
    if not request.file_ids or len(request.file_ids) == 0:
        raise HTTPException(status_code=400, detail="Missing file_ids parameter or empty list")

    try:
        print(f"Processing {len(request.file_ids)} documents in batch")
        result = await batch_process_documents(request.file_ids)
        return result
    except Exception as e:
        print(f"Error in batch_process_documents_endpoint: {e}")
        # Return a proper result instead of raising an exception
        return BatchProcessingResult(
            success=False,
            results={},
            error=str(e)
        )


@router.post("/search", response_model=DocumentSearchResponse)
async def search_documents_endpoint(request: DocumentSearchRequest):
    """
    Search for documents similar to the query text.
    """
    if not request.query_text:
        raise HTTPException(status_code=400, detail="Missing query_text parameter")

    try:
        print(f"Searching documents with query: {request.query_text}")
        result = await search_documents(
            request.query_text,
            request.match_threshold,
            request.match_count
        )

        if not result.success:
            print(f"Search failed: {result.error}")
            return DocumentSearchResponse(
                success=False,
                results=[],
                error=result.error
            )

        return result
    except Exception as e:
        print(f"Error in search_documents_endpoint: {e}")
        # Return a proper result instead of raising an exception
        return DocumentSearchResponse(
            success=False,
            results=[],
            error=str(e)
        )
