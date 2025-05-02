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


class DocumentComparisonRequest(BaseModel):
    """Request to compare two documents."""
    file_id_1: str
    file_id_2: str


class ComparisonSection(BaseModel):
    """A section of document comparison."""
    title: str
    content: str


class DocumentSimilarity(BaseModel):
    """Similarity metrics between two documents."""
    overall_similarity: float
    content_similarity: float
    structure_similarity: float
    topic_similarity: float


class DocumentDifference(BaseModel):
    """Differences between two documents."""
    unique_to_first: List[str] = Field(default_factory=list)
    unique_to_second: List[str] = Field(default_factory=list)
    contradictions: List[str] = Field(default_factory=list)


class DocumentComparisonResult(BaseModel):
    """Result of document comparison."""
    success: bool
    file_id_1: str
    file_id_2: str
    file_name_1: Optional[str] = None
    file_name_2: Optional[str] = None
    summary: str
    similarities: DocumentSimilarity
    differences: DocumentDifference
    common_topics: List[str] = Field(default_factory=list)
    sections: List[ComparisonSection] = Field(default_factory=list)
    error: Optional[str] = None


class TemplateField(BaseModel):
    """Field in a document template."""
    name: str
    description: str
    type: Literal["text", "number", "date", "select", "boolean"] = "text"
    required: bool = False
    default: Optional[str] = None
    options: Optional[List[str]] = None


class DocumentTemplate(BaseModel):
    """Document template."""
    id: Optional[str] = None
    name: str
    description: str
    category: str
    format: Literal["docx", "txt", "md", "html"] = "docx"
    content: str
    fields: List[TemplateField] = Field(default_factory=list)
    created_by: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    is_public: bool = False
    tags: List[str] = Field(default_factory=list)


class ContentGenerationRequest(BaseModel):
    """Request to generate document content."""
    template_id: Optional[str] = None
    template_name: Optional[str] = None
    description: Optional[str] = None
    format: Literal["docx", "txt", "md", "html"] = "docx"
    fields: Dict[str, Any] = Field(default_factory=dict)


class ContentGenerationResult(BaseModel):
    """Result of document content generation."""
    success: bool
    content: Optional[str] = None
    format: Literal["docx", "txt", "md", "html"] = "docx"
    error: Optional[str] = None
