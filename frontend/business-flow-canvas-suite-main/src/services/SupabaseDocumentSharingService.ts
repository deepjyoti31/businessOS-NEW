import { supabase } from '@/config/supabaseClient';
import { toast } from 'sonner';
import {
  DocumentShare,
  DocumentShareWithUser,
  DocumentVersion,
  DocumentVersionWithUser,
  ShareDocumentRequest,
  UpdateSharePermissionRequest,
  CreateVersionRequest,
  RestoreVersionRequest,
  PermissionLevel
} from '@/models/documentSharing';
import { FileMetadata } from './supabaseStorageService';

export class SupabaseDocumentSharingService {
  /**
   * Share a document with another user
   * @param request The share document request
   * @returns The created document share
   */
  async shareDocument(request: ShareDocumentRequest): Promise<DocumentShare | null> {
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Create the document share
      const { data, error } = await supabase
        .from('document_shares')
        .insert({
          file_id: request.file_id,
          owner_id: user.id,
          shared_with_id: request.shared_with_id,
          permission_level: request.permission_level
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error: any) {
      console.error('Error sharing document:', error);
      toast.error(`Failed to share document: ${error.message || 'Unknown error'}`);
      return null;
    }
  }

  /**
   * Get all users a document is shared with
   * @param fileId The ID of the file
   * @returns Array of document shares with user information
   */
  async getDocumentShares(fileId: string): Promise<DocumentShareWithUser[]> {
    try {
      // Get shares with user information
      // Get shares without the join first
      const { data: sharesData, error: sharesError } = await supabase
        .from('document_shares')
        .select('*')
        .eq('file_id', fileId);

      if (sharesError) {
        throw sharesError;
      }

      // Then get user data for each share
      const shares = await Promise.all(
        sharesData.map(async (share) => {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, email, user_metadata')
            .eq('id', share.shared_with_id)
            .single();

          if (userError) {
            console.warn(`Could not fetch user data for ID ${share.shared_with_id}:`, userError);
            return {
              ...share,
              user: {
                id: share.shared_with_id,
                email: 'Unknown user',
                name: 'Unknown user',
                avatar_url: undefined
              }
            };
          }

          // Extract user's full name from metadata
          const firstName = userData.user_metadata?.first_name || '';
          const lastName = userData.user_metadata?.last_name || '';
          const fullName = firstName && lastName
            ? `${firstName} ${lastName}`
            : userData.user_metadata?.name || userData.email?.split('@')[0] || 'User';

          return {
            ...share,
            user: {
              id: userData.id,
              email: userData.email,
              name: fullName,
              avatar_url: userData.user_metadata?.avatar_url
            }
          };
        })
      );

      // Return the shares with user information
      return shares;
    } catch (error: any) {
      console.error('Error getting document shares:', error);
      toast.error(`Failed to get document shares: ${error.message || 'Unknown error'}`);
      return [];
    }
  }

  /**
   * Get all documents shared with the current user
   * @returns Array of file metadata for shared documents
   */
  async getSharedWithMe(): Promise<FileMetadata[]> {
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get all documents shared with the current user
      const { data, error } = await supabase
        .from('document_shares')
        .select(`
          *,
          file:file_id (*)
        `)
        .eq('shared_with_id', user.id);

      if (error) {
        throw error;
      }

      // Transform the data to match the FileMetadata interface
      return data.map(share => ({
        id: share.file.id,
        name: share.file.name,
        path: share.file.path,
        size: share.file.size,
        type: share.file.type,
        isFolder: share.file.is_folder,
        parentId: share.file.parent_id,
        createdAt: share.file.created_at,
        updatedAt: share.file.updated_at,
        lastAccessedAt: share.file.last_accessed_at,
        storagePath: share.file.storage_path,
        isFavorite: share.file.is_favorite,
        isArchived: share.file.is_archived,
        metadata: share.file.metadata,
        // Add sharing-specific fields
        sharedBy: share.owner_id,
        permissionLevel: share.permission_level
      }));
    } catch (error: any) {
      console.error('Error getting shared documents:', error);
      toast.error(`Failed to get shared documents: ${error.message || 'Unknown error'}`);
      return [];
    }
  }

  /**
   * Update the permission level for a document share
   * @param request The update share permission request
   * @returns True if the update was successful
   */
  async updateSharePermission(request: UpdateSharePermissionRequest): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('document_shares')
        .update({ permission_level: request.permission_level })
        .eq('id', request.share_id);

      if (error) {
        throw error;
      }

      return true;
    } catch (error: any) {
      console.error('Error updating share permission:', error);
      toast.error(`Failed to update permission: ${error.message || 'Unknown error'}`);
      return false;
    }
  }

  /**
   * Remove a document share
   * @param shareId The ID of the share to remove
   * @returns True if the removal was successful
   */
  async removeShare(shareId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('document_shares')
        .delete()
        .eq('id', shareId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error: any) {
      console.error('Error removing share:', error);
      toast.error(`Failed to remove share: ${error.message || 'Unknown error'}`);
      return false;
    }
  }

  /**
   * Check if the current user has permission to access a document
   * @param fileId The ID of the file
   * @param requiredPermission The minimum permission level required
   * @returns True if the user has the required permission
   */
  async hasPermission(fileId: string, requiredPermission: PermissionLevel): Promise<boolean> {
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return false;
      }

      // Check if the user is the owner
      const { data: fileData, error: fileError } = await supabase
        .from('files')
        .select('owner_id')
        .eq('id', fileId)
        .single();

      if (fileError) {
        throw fileError;
      }

      // If the user is the owner, they have all permissions
      if (fileData.owner_id === user.id) {
        return true;
      }

      // Check if the user has the required permission
      const { data, error } = await supabase
        .from('document_shares')
        .select('permission_level')
        .eq('file_id', fileId)
        .eq('shared_with_id', user.id)
        .single();

      if (error) {
        return false;
      }

      // Check if the user's permission level is sufficient
      const permissionLevels: PermissionLevel[] = ['view', 'comment', 'edit'];
      const userPermissionIndex = permissionLevels.indexOf(data.permission_level);
      const requiredPermissionIndex = permissionLevels.indexOf(requiredPermission);

      return userPermissionIndex >= requiredPermissionIndex;
    } catch (error: any) {
      console.error('Error checking permission:', error);
      return false;
    }
  }
}
