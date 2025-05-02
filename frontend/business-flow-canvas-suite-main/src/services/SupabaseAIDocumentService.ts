import { supabase } from '@/config/supabaseClient';
import { FileMetadata } from './supabaseStorageService';

export interface DocumentProcessingResult {
  success: boolean;
  file_id: string;
  summary?: string;
  entities?: {
    people: string[];
    organizations: string[];
    locations: string[];
    dates: string[];
    key_terms: string[];
  };
  topics?: Record<string, number>;
  sentiment?: {
    overall: 'positive' | 'negative' | 'neutral';
    score: number;
    confidence: number;
    key_phrases: string[];
  };
  error?: string;
}

export interface DocumentSearchResult extends FileMetadata {
  similarity: number;
}

export interface DocumentSearchResponse {
  success: boolean;
  results: DocumentSearchResult[];
  error?: string;
}

export interface ComparisonSection {
  title: string;
  content: string;
}

export interface DocumentSimilarity {
  overall_similarity: number;
  content_similarity: number;
  structure_similarity: number;
  topic_similarity: number;
}

export interface DocumentDifference {
  unique_to_first: string[];
  unique_to_second: string[];
  contradictions: string[];
}

export interface DocumentComparisonResult {
  success: boolean;
  file_id_1: string;
  file_id_2: string;
  file_name_1?: string;
  file_name_2?: string;
  summary: string;
  similarities: DocumentSimilarity;
  differences: DocumentDifference;
  common_topics: string[];
  sections: ComparisonSection[];
  error?: string;
}

export interface TemplateField {
  name: string;
  description: string;
  type: 'text' | 'number' | 'date' | 'select' | 'boolean';
  required: boolean;
  default?: string;
  options?: string[];
}

export interface DocumentTemplate {
  id?: string;
  name: string;
  description: string;
  category: string;
  format: 'docx' | 'txt' | 'md' | 'html';
  content: string;
  fields: TemplateField[];
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  is_public: boolean;
  tags: string[];
}

export interface ContentGenerationRequest {
  template_id?: string;
  template_name?: string;
  description?: string;
  format: 'docx' | 'txt' | 'md' | 'html';
  fields: Record<string, any>;
}

export interface ContentGenerationResult {
  success: boolean;
  content?: string;
  format: 'docx' | 'txt' | 'md' | 'html';
  error?: string;
}

export class SupabaseAIDocumentService {
  constructor() {
    // No need for Node.js-specific initialization in the browser
  }

  /**
   * Process a document to extract text, generate summary, extract entities, classify topics, and generate embeddings
   * @param fileId The ID of the file to process
   * @returns The processing result
   */
  async processDocument(fileId: string): Promise<DocumentProcessingResult> {
    try {
      // Update processing status to indicate processing has started
      await supabase
        .from('files')
        .update({ processing_status: 'queued' })
        .eq('id', fileId);

      try {
        // Call the FastAPI backend to process the document
        const response = await fetch('http://localhost:8000/api/documents/process', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ file_id: fileId })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`API error: ${errorData.detail || response.statusText}`);
        }

        // Parse the response
        const result: DocumentProcessingResult = await response.json();
        return result;
      } catch (apiError) {
        console.error('Error calling document processing API:', apiError);

        // If the API call fails, provide a fallback response
        const { data: fileData } = await supabase
          .from('files')
          .select('name')
          .eq('id', fileId)
          .single();

        const fileName = fileData?.name || 'Document';

        // Fallback result with error message
        const result: DocumentProcessingResult = {
          success: false,
          file_id: fileId,
          error: `Unable to process "${fileName}". The document processing service is not available or returned an error: ${apiError instanceof Error ? apiError.message : String(apiError)}. Please make sure the FastAPI backend is running at http://localhost:8000.`
        };

        return result;
      }

      // No need to update the file here as the backend handles it
    } catch (error) {
      console.error('Error processing document:', error);

      // Update processing status to indicate failure
      await supabase
        .from('files')
        .update({ processing_status: 'failed' })
        .eq('id', fileId);

      return {
        success: false,
        file_id: fileId,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Search for documents similar to the query text
   * @param queryText The text to search for
   * @param matchThreshold The minimum similarity threshold (0.0 to 1.0)
   * @param matchCount The maximum number of results to return
   * @returns The search results
   */
  async searchDocuments(
    queryText: string,
    matchThreshold: number = 0.5,
    matchCount: number = 10
  ): Promise<DocumentSearchResponse> {
    try {
      try {
        // Call the FastAPI backend to search for documents
        const response = await fetch('http://localhost:8000/api/documents/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query_text: queryText,
            match_threshold: matchThreshold,
            match_count: matchCount
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`API error: ${errorData.detail || response.statusText}`);
        }

        // Parse the response
        const rawResult: DocumentSearchResponse = await response.json();

        // Process the results to ensure proper date formatting
        if (rawResult.success && rawResult.results && rawResult.results.length > 0) {
          // Ensure dates are properly formatted
          const processedResults = rawResult.results.map(result => ({
            ...result,
            // Convert date strings to proper format or set to null if invalid
            createdAt: result.createdAt && result.createdAt !== 'null' ? result.createdAt : null,
            updatedAt: result.updatedAt && result.updatedAt !== 'null' ? result.updatedAt : null,
            lastAccessedAt: result.lastAccessedAt && result.lastAccessedAt !== 'null' ? result.lastAccessedAt : null,
            processed_at: result.processed_at && result.processed_at !== 'null' ? result.processed_at : null
          }));

          return {
            ...rawResult,
            results: processedResults
          };
        }

        return rawResult;
      } catch (apiError) {
        console.error('Error calling document search API:', apiError);

        // Fallback to basic search if the API call fails
        console.log('Falling back to basic search...');

        // Get all files
        const { data: files, error: supabaseError } = await supabase
          .from('files')
          .select('*')
          .eq('is_archived', false)
          .order('created_at', { ascending: false });

        if (supabaseError) {
          throw supabaseError;
        }

        if (!files || files.length === 0) {
          return {
            success: true,
            results: []
          };
        }

        // Since we don't have real embeddings and vector search yet,
        // we'll do a basic keyword search on file names
        const queryTerms = queryText.toLowerCase().split(' ');

        // Convert database results to our FileMetadata format
        const results = files
          .filter(file => {
            const fileName = file.name.toLowerCase();
            // Only include files that match at least one query term
            return queryTerms.some(term => fileName.includes(term));
          })
          .map(file => ({
            id: file.id,
            name: file.name,
            path: file.path,
            size: file.size,
            type: file.type,
            isFolder: file.is_folder,
            parentId: file.parent_id,
            // Ensure dates are properly formatted or set to null if invalid
            createdAt: file.created_at && file.created_at !== 'null' ? file.created_at : null,
            updatedAt: file.updated_at && file.updated_at !== 'null' ? file.updated_at : null,
            lastAccessedAt: file.last_accessed_at && file.last_accessed_at !== 'null' ? file.last_accessed_at : null,
            storagePath: file.storage_path,
            isFavorite: file.is_favorite,
            isArchived: file.is_archived,
            metadata: file.metadata,
            // Calculate a simple relevance score based on how many terms match
            similarity: queryTerms.filter(term =>
              file.name.toLowerCase().includes(term)
            ).length / queryTerms.length
          }))
          .sort((a, b) => b.similarity - a.similarity)
          .slice(0, matchCount);

        return {
          success: true,
          results
        };
      }
    } catch (searchError) {
      console.error('Error searching documents:', searchError);

      return {
        success: false,
        results: [],
        error: searchError instanceof Error ? searchError.message : String(searchError)
      };
    }
  }

  /**
   * Get the processing status of a document
   * @param fileId The ID of the file to check
   * @returns The processing status
   */
  async getProcessingStatus(fileId: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('files')
        .select('processing_status')
        .eq('id', fileId)
        .single();

      if (error) {
        throw error;
      }

      return data?.processing_status || null;
    } catch (error) {
      console.error('Error getting processing status:', error);
      return null;
    }
  }

  /**
   * Get the AI-generated metadata for a document
   * @param fileId The ID of the file to get metadata for
   * @returns The AI-generated metadata
   */
  async getDocumentMetadata(fileId: string): Promise<Partial<FileMetadata> | null> {
    try {
      const { data, error } = await supabase
        .from('files')
        .select('summary, entities, topics, sentiment, processed_at, processing_status')
        .eq('id', fileId)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        return null;
      }

      // Parse JSON strings
      const parsedData = {
        ...data,
        entities: data.entities ? JSON.parse(data.entities) : null,
        topics: data.topics ? JSON.parse(data.topics) : null,
        sentiment: data.sentiment ? JSON.parse(data.sentiment) : null
      };

      console.log('Parsed document metadata:', parsedData);
      return parsedData;
    } catch (error) {
      console.error('Error getting document metadata:', error);
      return null;
    }
  }

  /**
   * Check if a document has been processed
   * @param fileId The ID of the file to check
   * @returns Whether the document has been processed
   */
  async isDocumentProcessed(fileId: string): Promise<boolean> {
    const status = await this.getProcessingStatus(fileId);
    return status === 'completed';
  }

  /**
   * Process multiple documents in batch
   * @param fileIds The IDs of the files to process
   * @returns The processing results
   */
  async processDocumentBatch(fileIds: string[]): Promise<Record<string, DocumentProcessingResult>> {
    const results: Record<string, DocumentProcessingResult> = {};

    // Process documents sequentially to avoid overloading the system
    for (const fileId of fileIds) {
      results[fileId] = await this.processDocument(fileId);
    }

    return results;
  }

  /**
   * Compare two documents semantically and analyze their similarities and differences
   * @param fileId1 The ID of the first file to compare
   * @param fileId2 The ID of the second file to compare
   * @returns The comparison result
   */
  async compareDocuments(fileId1: string, fileId2: string): Promise<DocumentComparisonResult> {
    try {
      // Ensure both documents have been processed
      const status1 = await this.getProcessingStatus(fileId1);
      const status2 = await this.getProcessingStatus(fileId2);

      if (status1 !== 'completed') {
        // Process the first document if it hasn't been processed yet
        await this.processDocument(fileId1);
      }

      if (status2 !== 'completed') {
        // Process the second document if it hasn't been processed yet
        await this.processDocument(fileId2);
      }

      try {
        // Call the FastAPI backend to compare the documents
        const response = await fetch('http://localhost:8000/api/documents/compare', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            file_id_1: fileId1,
            file_id_2: fileId2
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`API error: ${errorData.detail || response.statusText}`);
        }

        // Parse the response
        const result: DocumentComparisonResult = await response.json();
        return result;
      } catch (apiError) {
        console.error('Error calling document comparison API:', apiError);

        // If the API call fails, provide a fallback response
        return {
          success: false,
          file_id_1: fileId1,
          file_id_2: fileId2,
          summary: 'Failed to compare documents',
          similarities: {
            overall_similarity: 0,
            content_similarity: 0,
            structure_similarity: 0,
            topic_similarity: 0
          },
          differences: {
            unique_to_first: [],
            unique_to_second: [],
            contradictions: []
          },
          common_topics: [],
          sections: [
            {
              title: 'Error',
              content: `Failed to compare documents: ${apiError instanceof Error ? apiError.message : String(apiError)}`
            }
          ],
          error: apiError instanceof Error ? apiError.message : String(apiError)
        };
      }
    } catch (error) {
      console.error('Error in compareDocuments:', error);
      return {
        success: false,
        file_id_1: fileId1,
        file_id_2: fileId2,
        summary: 'Failed to compare documents',
        similarities: {
          overall_similarity: 0,
          content_similarity: 0,
          structure_similarity: 0,
          topic_similarity: 0
        },
        differences: {
          unique_to_first: [],
          unique_to_second: [],
          contradictions: []
        },
        common_topics: [],
        sections: [
          {
            title: 'Error',
            content: `Failed to compare documents: ${error instanceof Error ? error.message : String(error)}`
          }
        ],
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Get all document templates
   * @param category Optional category to filter templates
   * @param userId Optional user ID to filter templates
   * @returns List of document templates
   */
  async getTemplates(category?: string, userId?: string): Promise<DocumentTemplate[]> {
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (userId) params.append('user_id', userId);

      // Call the FastAPI backend to get templates
      const response = await fetch(`http://localhost:8000/api/documents/templates?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${errorData.detail || response.statusText}`);
      }

      // Parse the response
      const templates: DocumentTemplate[] = await response.json();
      return templates;
    } catch (error) {
      console.error('Error getting templates:', error);
      return [];
    }
  }

  /**
   * Get a document template by ID
   * @param templateId The ID of the template to get
   * @returns The document template
   */
  async getTemplateById(templateId: string): Promise<DocumentTemplate | null> {
    try {
      // Call the FastAPI backend to get the template
      const response = await fetch(`http://localhost:8000/api/documents/templates/${templateId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${errorData.detail || response.statusText}`);
      }

      // Parse the response
      const template: DocumentTemplate = await response.json();
      return template;
    } catch (error) {
      console.error(`Error getting template ${templateId}:`, error);
      return null;
    }
  }

  /**
   * Create a new document template
   * @param template The template to create
   * @param userId The ID of the user creating the template
   * @returns The created template
   */
  async createTemplate(template: DocumentTemplate, userId: string): Promise<DocumentTemplate | null> {
    try {
      // Call the FastAPI backend to create the template
      const response = await fetch(`http://localhost:8000/api/documents/templates?user_id=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(template)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${errorData.detail || response.statusText}`);
      }

      // Parse the response
      const createdTemplate: DocumentTemplate = await response.json();
      return createdTemplate;
    } catch (error) {
      console.error('Error creating template:', error);
      return null;
    }
  }

  /**
   * Update an existing document template
   * @param templateId The ID of the template to update
   * @param template The updated template data
   * @param userId The ID of the user updating the template
   * @returns The updated template
   */
  async updateTemplate(templateId: string, template: DocumentTemplate, userId: string): Promise<DocumentTemplate | null> {
    try {
      // Call the FastAPI backend to update the template
      const response = await fetch(`http://localhost:8000/api/documents/templates/${templateId}?user_id=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(template)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${errorData.detail || response.statusText}`);
      }

      // Parse the response
      const updatedTemplate: DocumentTemplate = await response.json();
      return updatedTemplate;
    } catch (error) {
      console.error(`Error updating template ${templateId}:`, error);
      return null;
    }
  }

  /**
   * Delete a document template
   * @param templateId The ID of the template to delete
   * @param userId The ID of the user deleting the template
   * @returns Whether the deletion was successful
   */
  async deleteTemplate(templateId: string, userId: string): Promise<boolean> {
    try {
      // Call the FastAPI backend to delete the template
      const response = await fetch(`http://localhost:8000/api/documents/templates/${templateId}?user_id=${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${errorData.detail || response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error(`Error deleting template ${templateId}:`, error);
      return false;
    }
  }

  /**
   * Generate document content using AI
   * @param request The content generation request
   * @returns The generated content
   */
  async generateDocumentContent(request: ContentGenerationRequest): Promise<ContentGenerationResult> {
    try {
      // Call the FastAPI backend to generate content
      const response = await fetch('http://localhost:8000/api/documents/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${errorData.detail || response.statusText}`);
      }

      // Parse the response
      const result: ContentGenerationResult = await response.json();
      return result;
    } catch (error) {
      console.error('Error generating document content:', error);
      return {
        success: false,
        format: request.format,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
}

// Create a singleton instance
export const supabaseAIDocumentService = new SupabaseAIDocumentService();

export default supabaseAIDocumentService;
