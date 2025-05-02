import { supabaseStorageService, FileMetadata, UploadOptions } from './supabaseStorageService';
import { supabase } from '@/config/supabaseClient';
import { toast } from 'sonner';
import { SupabaseDocumentSharingService } from './SupabaseDocumentSharingService';
import { SupabaseVersionControlService } from './SupabaseVersionControlService';
import { PermissionLevel } from '@/models/documentSharing';

export class SupabaseDocumentService {
  private sharingService: SupabaseDocumentSharingService;
  private versionControlService: SupabaseVersionControlService;

  constructor() {
    // Initialize services
    this.sharingService = new SupabaseDocumentSharingService();
    this.versionControlService = new SupabaseVersionControlService();
  }

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

  // Document Sharing Methods

  /**
   * Share a document with another user
   * @param fileId The ID of the file to share
   * @param sharedWithId The ID of the user to share with
   * @param permissionLevel The permission level to grant
   * @returns True if sharing was successful
   */
  async shareDocument(fileId: string, sharedWithId: string, permissionLevel: PermissionLevel): Promise<boolean> {
    try {
      const result = await this.sharingService.shareDocument({
        file_id: fileId,
        shared_with_id: sharedWithId,
        permission_level: permissionLevel
      });
      return !!result;
    } catch (error) {
      console.error('Error sharing document:', error);
      return false;
    }
  }

  /**
   * Get all users a document is shared with
   * @param fileId The ID of the file
   * @returns Array of document shares with user information
   */
  async getDocumentShares(fileId: string) {
    return this.sharingService.getDocumentShares(fileId);
  }

  /**
   * Get all documents shared with the current user
   * @returns Array of file metadata for shared documents
   */
  async getSharedWithMe() {
    return this.sharingService.getSharedWithMe();
  }

  /**
   * Update the permission level for a document share
   * @param shareId The ID of the share to update
   * @param permissionLevel The new permission level
   * @returns True if the update was successful
   */
  async updateSharePermission(shareId: string, permissionLevel: PermissionLevel) {
    return this.sharingService.updateSharePermission({
      share_id: shareId,
      permission_level: permissionLevel
    });
  }

  /**
   * Remove a document share
   * @param shareId The ID of the share to remove
   * @returns True if the removal was successful
   */
  async removeShare(shareId: string) {
    return this.sharingService.removeShare(shareId);
  }

  /**
   * Check if the current user has permission to access a document
   * @param fileId The ID of the file
   * @param requiredPermission The minimum permission level required
   * @returns True if the user has the required permission
   */
  async hasPermission(fileId: string, requiredPermission: PermissionLevel) {
    return this.sharingService.hasPermission(fileId, requiredPermission);
  }

  // Version Control Methods

  /**
   * Create a new version of a document
   * @param fileId The ID of the file
   * @param storagePath The storage path of the file
   * @param size The size of the file
   * @param comment Optional comment for the version
   * @returns The created document version
   */
  async createVersion(fileId: string, storagePath: string, size?: number, comment?: string) {
    return this.versionControlService.createVersion({
      file_id: fileId,
      storage_path: storagePath,
      size,
      comment
    });
  }

  /**
   * Get all versions of a document
   * @param fileId The ID of the file
   * @returns Array of document versions with user information
   */
  async getDocumentVersions(fileId: string) {
    return this.versionControlService.getDocumentVersions(fileId);
  }

  /**
   * Get a specific version of a document
   * @param versionId The ID of the version
   * @returns The document version with user information
   */
  async getDocumentVersion(versionId: string) {
    return this.versionControlService.getDocumentVersion(versionId);
  }

  /**
   * Restore a document to a specific version
   * @param versionId The ID of the version to restore
   * @returns True if the restoration was successful
   */
  async restoreVersion(versionId: string) {
    return this.versionControlService.restoreVersion({ version_id: versionId });
  }

  /**
   * Create a version when a file is updated
   * @param fileMetadata The updated file metadata
   * @param comment Optional comment for the version
   * @returns The created document version
   */
  async createVersionOnUpdate(fileMetadata: FileMetadata, comment?: string) {
    return this.versionControlService.createVersionOnUpdate(fileMetadata, comment);
  }
}

// Note: Singleton instances are now created in documentServiceInstances.ts
// This prevents circular dependencies
