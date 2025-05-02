import { supabaseStorageService, FileMetadata, UploadOptions } from './supabaseStorageService';
import { supabase } from '@/config/supabaseClient';
import { toast } from 'sonner';

export class SupabaseDocumentService {
  /**
   * Initialize the document service
   */
  async initialize(): Promise<void> {
    try {
      // No specific initialization needed for Supabase
      console.log('Supabase document service initialized successfully');
    } catch (error) {
      console.error('Error initializing Supabase document service:', error);
      throw error;
    }
  }

  /**
   * Upload a file
   * @param file The file to upload
   * @param folderPath The folder path to upload to (optional)
   * @param options Upload options (progress, error, success callbacks)
   * @returns The metadata of the uploaded file
   */
  async uploadFile(
    file: File,
    folderPath: string = '',
    parentId: string | null = null,
    options: UploadOptions = {}
  ): Promise<FileMetadata | null> {
    try {
      return await supabaseStorageService.uploadFile(file, folderPath, parentId, options);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  /**
   * Create a new folder
   * @param folderName The name of the folder to create
   * @param parentPath The parent folder path (optional)
   * @returns The metadata of the created folder
   */
  async createFolder(
    folderName: string,
    parentPath: string = '',
    parentId: string | null = null
  ): Promise<FileMetadata | null> {
    try {
      return await supabaseStorageService.createFolder(folderName, parentPath, parentId);
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  }

  /**
   * List files and folders in a specific path
   * @param folderPath The folder path to list (optional)
   * @param parentId The parent folder ID (optional)
   * @returns Array of file and folder metadata
   */
  async listFilesAndFolders(folderPath: string = '', parentId: string | null = null): Promise<FileMetadata[]> {
    try {
      return await supabaseStorageService.getFiles(folderPath, parentId);
    } catch (error) {
      console.error('Error listing files and folders:', error);
      toast.error(`Failed to list files: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return [];
    }
  }

  /**
   * Download a file
   * @param fileMetadata The metadata of the file to download
   */
  async downloadFile(fileMetadata: FileMetadata): Promise<void> {
    try {
      await supabaseStorageService.downloadFile(fileMetadata);
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }

  /**
   * Delete a file or folder
   * @param fileMetadata The metadata of the file or folder to delete
   * @returns True if deletion was successful
   */
  async deleteFile(fileMetadata: FileMetadata): Promise<boolean> {
    try {
      return await supabaseStorageService.deleteFile(fileMetadata);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  /**
   * Get a file by ID
   * @param id The ID of the file to get
   * @returns The file metadata
   */
  async getFileById(id: string): Promise<FileMetadata | null> {
    try {
      return await supabaseStorageService.getFileById(id);
    } catch (error) {
      console.error('Error getting file by ID:', error);
      return null;
    }
  }

  /**
   * Toggle favorite status for a file or folder
   * @param id The ID of the file or folder
   * @param isFavorite The new favorite status
   * @returns True if update was successful
   */
  async toggleFavorite(id: string, isFavorite: boolean): Promise<boolean> {
    try {
      return await supabaseStorageService.toggleFavorite(id, isFavorite);
    } catch (error) {
      console.error('Error toggling favorite status:', error);
      return false;
    }
  }

  /**
   * Move a file or folder to archive
   * @param id The ID of the file or folder
   * @returns True if update was successful
   */
  async moveToArchive(id: string): Promise<boolean> {
    try {
      return await supabaseStorageService.moveToArchive(id);
    } catch (error) {
      console.error('Error moving to archive:', error);
      return false;
    }
  }

  /**
   * Restore a file or folder from archive
   * @param id The ID of the file or folder
   * @returns True if update was successful
   */
  async restoreFromArchive(id: string): Promise<boolean> {
    try {
      return await supabaseStorageService.restoreFromArchive(id);
    } catch (error) {
      console.error('Error restoring from archive:', error);
      return false;
    }
  }

  /**
   * Get archived files and folders
   * @returns Array of archived file and folder metadata
   */
  async getArchivedFiles(): Promise<FileMetadata[]> {
    try {
      return await supabaseStorageService.getArchivedFiles();
    } catch (error) {
      console.error('Error getting archived files:', error);
      return [];
    }
  }

  /**
   * Get favorite files and folders
   * @returns Array of favorite file and folder metadata
   */
  async getFavoriteFiles(): Promise<FileMetadata[]> {
    try {
      return await supabaseStorageService.getFavoriteFiles();
    } catch (error) {
      console.error('Error getting favorite files:', error);
      return [];
    }
  }

  /**
   * Get all files and folders (non-archived)
   * @returns Array of all file and folder metadata
   */
  async getAllFiles(): Promise<FileMetadata[]> {
    try {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('is_archived', false)
        .order('is_folder', { ascending: false })
        .order('name');

      if (error) {
        throw error;
      }

      // Convert snake_case to camelCase and ensure proper date handling
      return data.map(item => ({
        id: item.id,
        name: item.name,
        path: item.path,
        size: item.size,
        type: item.type,
        isFolder: item.is_folder,
        parentId: item.parent_id,
        // Ensure dates are properly formatted or set to null if invalid
        createdAt: item.created_at && item.created_at !== 'null' ? item.created_at : null,
        updatedAt: item.updated_at && item.updated_at !== 'null' ? item.updated_at : null,
        lastAccessedAt: item.last_accessed_at && item.last_accessed_at !== 'null' ? item.last_accessed_at : null,
        storagePath: item.storage_path,
        isFavorite: item.is_favorite,
        isArchived: item.is_archived,
        metadata: item.metadata,
        // Include processing status if available
        processing_status: item.processing_status || null
      }));
    } catch (error) {
      console.error('Error getting all files:', error);
      toast.error(`Failed to get files: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return [];
    }
  }

  /**
   * Format file size to human-readable format
   * @param bytes The file size in bytes
   * @returns Formatted file size string
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Export a singleton instance
export const supabaseDocumentService = new SupabaseDocumentService();
export default supabaseDocumentService;
