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
    matchThreshold: number = 0.7,
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
        const result: DocumentSearchResponse = await response.json();
        return result;
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
            createdAt: file.created_at,
            updatedAt: file.updated_at,
            lastAccessedAt: file.last_accessed_at,
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
}

// Create a singleton instance
export const supabaseAIDocumentService = new SupabaseAIDocumentService();

export default supabaseAIDocumentService;
