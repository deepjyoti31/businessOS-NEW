import { supabase } from '@/config/supabaseClient';
import { toast } from 'sonner';

export interface FileMetadata {
  id: string;
  name: string;
  path: string;
  size: number;
  type: string;
  isFolder: boolean;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  lastAccessedAt: string;
  storagePath: string;
  isFavorite: boolean;
  isArchived: boolean;
  metadata: Record<string, any>;
}

export interface UploadProgressEvent {
  loaded: number;
  total: number;
}

export interface UploadOptions {
  onProgress?: (event: UploadProgressEvent) => void;
  onError?: (error: Error) => void;
  onSuccess?: (metadata: FileMetadata) => void;
}

class SupabaseStorageService {
  private readonly bucketName = 'documents';
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // 1 second

  /**
   * Upload a file to Supabase Storage
   */
  async uploadFile(
    file: File,
    path: string,
    parentId: string | null = null,
    options: UploadOptions = {}
  ): Promise<FileMetadata | null> {
    const { onProgress, onError, onSuccess } = options;
    
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Create a storage path with user ID as the first folder
      const storagePath = `${user.id}/${path}/${file.name}`;
      
      // Upload the file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(this.bucketName)
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: true,
          onUploadProgress: (progress) => {
            onProgress?.({
              loaded: progress.loaded,
              total: progress.totalBytes
            });
          }
        });
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL for the file
      const { data: urlData } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(storagePath);
      
      // Save file metadata to the database
      const { data: metadataData, error: metadataError } = await supabase
        .from('files')
        .insert({
          name: file.name,
          path: path,
          size: file.size,
          type: file.type,
          is_folder: false,
          parent_id: parentId,
          owner_id: user.id,
          storage_path: storagePath,
          metadata: {
            contentType: file.type,
            url: urlData.publicUrl
          }
        })
        .select()
        .single();
      
      if (metadataError) {
        // If metadata saving fails, try to delete the uploaded file
        await supabase.storage
          .from(this.bucketName)
          .remove([storagePath]);
        
        throw metadataError;
      }
      
      // Convert snake_case to camelCase
      const fileMetadata: FileMetadata = {
        id: metadataData.id,
        name: metadataData.name,
        path: metadataData.path,
        size: metadataData.size,
        type: metadataData.type,
        isFolder: metadataData.is_folder,
        parentId: metadataData.parent_id,
        createdAt: metadataData.created_at,
        updatedAt: metadataData.updated_at,
        lastAccessedAt: metadataData.last_accessed_at,
        storagePath: metadataData.storage_path,
        isFavorite: metadataData.is_favorite,
        isArchived: metadataData.is_archived,
        metadata: metadataData.metadata
      };
      
      onSuccess?.(fileMetadata);
      return fileMetadata;
    } catch (error: any) {
      console.error('Error uploading file:', error);
      onError?.(error);
      toast.error(`Failed to upload file: ${error.message || 'Unknown error'}`);
      return null;
    }
  }

  /**
   * Create a folder in the database
   */
  async createFolder(
    name: string,
    path: string,
    parentId: string | null = null
  ): Promise<FileMetadata | null> {
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Create folder path
      const folderPath = path ? `${path}/${name}` : name;
      
      // Save folder metadata to the database
      const { data, error } = await supabase
        .from('files')
        .insert({
          name: name,
          path: path,
          is_folder: true,
          parent_id: parentId,
          owner_id: user.id,
          size: 0,
          type: 'folder'
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Convert snake_case to camelCase
      const folderMetadata: FileMetadata = {
        id: data.id,
        name: data.name,
        path: data.path,
        size: data.size,
        type: data.type,
        isFolder: data.is_folder,
        parentId: data.parent_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        lastAccessedAt: data.last_accessed_at,
        storagePath: data.storage_path,
        isFavorite: data.is_favorite,
        isArchived: data.is_archived,
        metadata: data.metadata
      };
      
      return folderMetadata;
    } catch (error: any) {
      console.error('Error creating folder:', error);
      toast.error(`Failed to create folder: ${error.message || 'Unknown error'}`);
      return null;
    }
  }

  /**
   * Get files and folders for a specific path
   */
  async getFiles(path: string = '', parentId: string | null = null): Promise<FileMetadata[]> {
    try {
      let query = supabase
        .from('files')
        .select('*')
        .eq('is_archived', false);
      
      if (parentId) {
        query = query.eq('parent_id', parentId);
      } else if (path) {
        query = query.eq('path', path);
      } else {
        query = query.is('parent_id', null);
      }
      
      const { data, error } = await query.order('is_folder', { ascending: false }).order('name');
      
      if (error) {
        throw error;
      }
      
      // Convert snake_case to camelCase
      return data.map(item => ({
        id: item.id,
        name: item.name,
        path: item.path,
        size: item.size,
        type: item.type,
        isFolder: item.is_folder,
        parentId: item.parent_id,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        lastAccessedAt: item.last_accessed_at,
        storagePath: item.storage_path,
        isFavorite: item.is_favorite,
        isArchived: item.is_archived,
        metadata: item.metadata
      }));
    } catch (error: any) {
      console.error('Error getting files:', error);
      toast.error(`Failed to get files: ${error.message || 'Unknown error'}`);
      return [];
    }
  }

  /**
   * Download a file from Supabase Storage
   */
  async downloadFile(fileMetadata: FileMetadata): Promise<void> {
    try {
      if (fileMetadata.isFolder) {
        throw new Error('Cannot download a folder');
      }
      
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .download(fileMetadata.storagePath);
      
      if (error) {
        throw error;
      }
      
      // Create a download link
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileMetadata.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Error downloading file:', error);
      toast.error(`Failed to download file: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Delete a file or folder
   */
  async deleteFile(fileMetadata: FileMetadata): Promise<boolean> {
    try {
      if (fileMetadata.isFolder) {
        // For folders, we need to recursively delete all contents
        const childFiles = await this.getFiles(fileMetadata.path, fileMetadata.id);
        
        for (const childFile of childFiles) {
          await this.deleteFile(childFile);
        }
        
        // Delete the folder metadata
        const { error } = await supabase
          .from('files')
          .delete()
          .eq('id', fileMetadata.id);
        
        if (error) {
          throw error;
        }
      } else {
        // Delete the file from storage
        const { error: storageError } = await supabase.storage
          .from(this.bucketName)
          .remove([fileMetadata.storagePath]);
        
        if (storageError) {
          throw storageError;
        }
        
        // Delete the file metadata
        const { error: metadataError } = await supabase
          .from('files')
          .delete()
          .eq('id', fileMetadata.id);
        
        if (metadataError) {
          throw metadataError;
        }
      }
      
      return true;
    } catch (error: any) {
      console.error('Error deleting file:', error);
      toast.error(`Failed to delete file: ${error.message || 'Unknown error'}`);
      return false;
    }
  }

  /**
   * Get a file by ID
   */
  async getFileById(id: string): Promise<FileMetadata | null> {
    try {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      // Convert snake_case to camelCase
      return {
        id: data.id,
        name: data.name,
        path: data.path,
        size: data.size,
        type: data.type,
        isFolder: data.is_folder,
        parentId: data.parent_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        lastAccessedAt: data.last_accessed_at,
        storagePath: data.storage_path,
        isFavorite: data.is_favorite,
        isArchived: data.is_archived,
        metadata: data.metadata
      };
    } catch (error: any) {
      console.error('Error getting file by ID:', error);
      return null;
    }
  }

  /**
   * Toggle favorite status for a file or folder
   */
  async toggleFavorite(id: string, isFavorite: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('files')
        .update({ is_favorite: isFavorite })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error: any) {
      console.error('Error toggling favorite status:', error);
      toast.error(`Failed to update favorite status: ${error.message || 'Unknown error'}`);
      return false;
    }
  }

  /**
   * Move a file or folder to archive
   */
  async moveToArchive(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('files')
        .update({ is_archived: true })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error: any) {
      console.error('Error moving to archive:', error);
      toast.error(`Failed to move to archive: ${error.message || 'Unknown error'}`);
      return false;
    }
  }

  /**
   * Restore a file or folder from archive
   */
  async restoreFromArchive(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('files')
        .update({ is_archived: false })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error: any) {
      console.error('Error restoring from archive:', error);
      toast.error(`Failed to restore from archive: ${error.message || 'Unknown error'}`);
      return false;
    }
  }

  /**
   * Get archived files and folders
   */
  async getArchivedFiles(): Promise<FileMetadata[]> {
    try {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('is_archived', true)
        .order('updated_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Convert snake_case to camelCase
      return data.map(item => ({
        id: item.id,
        name: item.name,
        path: item.path,
        size: item.size,
        type: item.type,
        isFolder: item.is_folder,
        parentId: item.parent_id,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        lastAccessedAt: item.last_accessed_at,
        storagePath: item.storage_path,
        isFavorite: item.is_favorite,
        isArchived: item.is_archived,
        metadata: item.metadata
      }));
    } catch (error: any) {
      console.error('Error getting archived files:', error);
      toast.error(`Failed to get archived files: ${error.message || 'Unknown error'}`);
      return [];
    }
  }

  /**
   * Get favorite files and folders
   */
  async getFavoriteFiles(): Promise<FileMetadata[]> {
    try {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('is_favorite', true)
        .eq('is_archived', false)
        .order('updated_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Convert snake_case to camelCase
      return data.map(item => ({
        id: item.id,
        name: item.name,
        path: item.path,
        size: item.size,
        type: item.type,
        isFolder: item.is_folder,
        parentId: item.parent_id,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        lastAccessedAt: item.last_accessed_at,
        storagePath: item.storage_path,
        isFavorite: item.is_favorite,
        isArchived: item.is_archived,
        metadata: item.metadata
      }));
    } catch (error: any) {
      console.error('Error getting favorite files:', error);
      toast.error(`Failed to get favorite files: ${error.message || 'Unknown error'}`);
      return [];
    }
  }
}

export const supabaseStorageService = new SupabaseStorageService();
export default supabaseStorageService;
