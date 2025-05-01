"""
Document processing models.
"""

from typing import Dict, List, Optional, Any, Literal
from pydantic import BaseModel, Field
from datetime import datetime


class Entity(BaseModel):
    """Entity extracted from a document."""
    people: List[str] = Field(default_factory=list)
    organizations: List[str] = Field(default_factory=list)
    locations: List[str] = Field(default_factory=list)
    dates: List[str] = Field(default_factory=list)
    key_terms: List[str] = Field(default_factory=list)


class Sentiment(BaseModel):
    """Sentiment analysis result."""
    overall: Literal["positive", "negative", "neutral"] = "neutral"
    score: float = 0.0
    confidence: float = 0.0
    key_phrases: List[str] = Field(default_factory=list)


class DocumentProcessingRequest(BaseModel):
    """Request to process a document."""
    file_id: str


class DocumentProcessingResult(BaseModel):
    """Result of document processing."""
    success: bool
    file_id: str
    summary: Optional[str] = None
    entities: Optional[Entity] = None
    topics: Optional[Dict[str, float]] = None
    sentiment: Optional[Sentiment] = None
    error: Optional[str] = None


class BatchProcessingRequest(BaseModel):
    """Request to process multiple documents."""
    file_ids: List[str]


class BatchProcessingResult(BaseModel):
    """Result of batch document processing."""
    success: bool
    results: Dict[str, DocumentProcessingResult]
    error: Optional[str] = None


class DocumentSearchRequest(BaseModel):
    """Request to search for documents."""
    query_text: str
    match_threshold: float = 0.7
    match_count: int = 10


class FileMetadata(BaseModel):
    """File metadata."""
    id: str
    name: str
    path: str
    size: Optional[int] = None
    type: str
    is_folder: bool
    parent_id: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    last_accessed_at: Optional[datetime] = None
    storage_path: str
    is_favorite: bool = False
    is_archived: bool = False
    metadata: Optional[Dict[str, Any]] = None
    processing_status: Optional[str] = None
    summary: Optional[str] = None
    entities: Optional[Entity] = None
    topics: Optional[Dict[str, float]] = None
    sentiment: Optional[Sentiment] = None
    processed_at: Optional[datetime] = None


class DocumentSearchResult(FileMetadata):
    """Document search result with similarity score."""
    similarity: float


class DocumentSearchResponse(BaseModel):
    """Response to a document search request."""
    success: bool
    results: List[DocumentSearchResult] = Field(default_factory=list)
    error: Optional[str] = None
