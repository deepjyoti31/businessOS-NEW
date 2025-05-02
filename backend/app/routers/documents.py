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
    DocumentSearchResponse,
    DocumentComparisonRequest,
    DocumentComparisonResult,
    DocumentTemplate,
    ContentGenerationRequest,
    ContentGenerationResult
)
from app.services.document_service import (
    process_document,
    search_documents,
    batch_process_documents,
    compare_documents,
    get_templates,
    get_template_by_id,
    create_template,
    update_template,
    delete_template,
    generate_document_content
)

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
            "Semantic search",
            "Document comparison",
            "Document generation"
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


@router.post("/compare", response_model=DocumentComparisonResult)
async def compare_documents_endpoint(request: DocumentComparisonRequest):
    """
    Compare two documents semantically and analyze their similarities and differences.
    """
    if not request.file_id_1 or not request.file_id_2:
        raise HTTPException(status_code=400, detail="Missing file_id_1 or file_id_2 parameter")

    try:
        print(f"Comparing documents with IDs: {request.file_id_1} and {request.file_id_2}")
        result = await compare_documents(request.file_id_1, request.file_id_2)

        if not result.success:
            print(f"Comparison failed: {result.error}")
            return DocumentComparisonResult(
                success=False,
                file_id_1=request.file_id_1,
                file_id_2=request.file_id_2,
                file_name_1="",
                file_name_2="",
                summary="",
                similarities=result.similarities,
                differences=result.differences,
                error=result.error
            )

        return result
    except Exception as e:
        print(f"Error in compare_documents_endpoint: {e}")
        # Return a proper result instead of raising an exception
        return DocumentComparisonResult(
            success=False,
            file_id_1=request.file_id_1,
            file_id_2=request.file_id_2,
            file_name_1="",
            file_name_2="",
            summary="",
            similarities=DocumentSimilarity(
                overall_similarity=0.0,
                content_similarity=0.0,
                structure_similarity=0.0,
                topic_similarity=0.0
            ),
            differences=DocumentDifference(),
            error=str(e)
        )


@router.get("/templates", response_model=list[DocumentTemplate])
async def get_templates_endpoint(category: str = None, user_id: str = None):
    """
    Get document templates.
    """
    try:
        print(f"Getting templates for category: {category}, user_id: {user_id}")
        templates = await get_templates(category, user_id)
        return templates
    except Exception as e:
        print(f"Error in get_templates_endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/templates/{template_id}", response_model=DocumentTemplate)
async def get_template_endpoint(template_id: str):
    """
    Get a document template by ID.
    """
    try:
        print(f"Getting template with ID: {template_id}")
        template = await get_template_by_id(template_id)
        if not template:
            raise HTTPException(status_code=404, detail=f"Template with ID {template_id} not found")
        return template
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in get_template_endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/templates", response_model=DocumentTemplate)
async def create_template_endpoint(template: DocumentTemplate, user_id: str):
    """
    Create a new document template.
    """
    try:
        print(f"Creating template: {template.name}")
        created_template = await create_template(template, user_id)
        if not created_template:
            raise HTTPException(status_code=500, detail="Failed to create template")
        return created_template
    except Exception as e:
        print(f"Error in create_template_endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/templates/{template_id}", response_model=DocumentTemplate)
async def update_template_endpoint(template_id: str, template: DocumentTemplate, user_id: str):
    """
    Update an existing document template.
    """
    try:
        print(f"Updating template with ID: {template_id}")
        updated_template = await update_template(template_id, template, user_id)
        if not updated_template:
            raise HTTPException(status_code=404, detail=f"Template with ID {template_id} not found or user does not have permission")
        return updated_template
    except Exception as e:
        print(f"Error in update_template_endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/templates/{template_id}")
async def delete_template_endpoint(template_id: str, user_id: str):
    """
    Delete a document template.
    """
    try:
        print(f"Deleting template with ID: {template_id}")
        success = await delete_template(template_id, user_id)
        if not success:
            raise HTTPException(status_code=404, detail=f"Template with ID {template_id} not found or user does not have permission")
        return {"success": True, "message": f"Template with ID {template_id} deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in delete_template_endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate", response_model=ContentGenerationResult)
async def generate_document_endpoint(request: ContentGenerationRequest):
    """
    Generate document content using AI.
    """
    try:
        print(f"Generating document content with format: {request.format}")
        result = await generate_document_content(request)

        if not result.success:
            print(f"Generation failed: {result.error}")
            return ContentGenerationResult(
                success=False,
                format=request.format,
                error=result.error
            )

        return result
    except Exception as e:
        print(f"Error in generate_document_endpoint: {e}")
        return ContentGenerationResult(
            success=False,
            format=request.format,
            error=str(e)
        )
