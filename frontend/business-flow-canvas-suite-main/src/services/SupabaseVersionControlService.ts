import { supabase } from '@/config/supabaseClient';
import { toast } from 'sonner';
import {
  DocumentVersion,
  DocumentVersionWithUser,
  CreateVersionRequest,
  RestoreVersionRequest
} from '@/models/documentSharing';
import { FileMetadata } from './supabaseStorageService';

export class SupabaseVersionControlService {
  constructor() {
    // No need to create a SupabaseDocumentService instance here
  }

  /**
   * Create a new version of a document
   * @param request The create version request
   * @returns The created document version
   */
  async createVersion(request: CreateVersionRequest): Promise<DocumentVersion | null> {
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Create the document version
      const { data, error } = await supabase
        .from('document_versions')
        .insert({
          file_id: request.file_id,
          storage_path: request.storage_path,
          created_by: user.id,
          size: request.size,
          comment: request.comment
          // version_number is set automatically by the trigger
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error: any) {
      console.error('Error creating document version:', error);
      toast.error(`Failed to create version: ${error.message || 'Unknown error'}`);
      return null;
    }
  }

  /**
   * Get all versions of a document
   * @param fileId The ID of the file
   * @returns Array of document versions with user information
   */
  async getDocumentVersions(fileId: string): Promise<DocumentVersionWithUser[]> {
    try {
      // Get versions without the join first
      const { data: versionsData, error: versionsError } = await supabase
        .from('document_versions')
        .select('*')
        .eq('file_id', fileId)
        .order('version_number', { ascending: false });

      if (versionsError) {
        throw versionsError;
      }

      // Then get user data for each version
      const versions = await Promise.all(
        versionsData.map(async (version) => {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, email, user_metadata')
            .eq('id', version.created_by)
            .single();

          if (userError) {
            console.warn(`Could not fetch user data for ID ${version.created_by}:`, userError);
            return {
              ...version,
              user: {
                id: version.created_by,
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
            ...version,
            user: {
              id: userData.id,
              email: userData.email,
              name: fullName,
              avatar_url: userData.user_metadata?.avatar_url
            }
          };
        })
      );

      // Return the versions with user information
      return versions;
    } catch (error: any) {
      console.error('Error getting document versions:', error);
      toast.error(`Failed to get document versions: ${error.message || 'Unknown error'}`);
      return [];
    }
  }

  /**
   * Get a specific version of a document
   * @param versionId The ID of the version
   * @returns The document version with user information
   */
  async getDocumentVersion(versionId: string): Promise<DocumentVersionWithUser | null> {
    try {
      // Get the version without the join
      const { data: versionData, error: versionError } = await supabase
        .from('document_versions')
        .select('*')
        .eq('id', versionId)
        .single();

      if (versionError) {
        throw versionError;
      }

      // Get user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, user_metadata')
        .eq('id', versionData.created_by)
        .single();

      if (userError) {
        console.warn(`Could not fetch user data for ID ${versionData.created_by}:`, userError);
        return {
          ...versionData,
          user: {
            id: versionData.created_by,
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

      // Return the version with user information
      return {
        ...versionData,
        user: {
          id: userData.id,
          email: userData.email,
          name: fullName,
          avatar_url: userData.user_metadata?.avatar_url
        }
      };
    } catch (error: any) {
      console.error('Error getting document version:', error);
      toast.error(`Failed to get document version: ${error.message || 'Unknown error'}`);
      return null;
    }
  }

  /**
   * Restore a document to a specific version
   * @param request The restore version request
   * @returns True if the restoration was successful
   */
  async restoreVersion(request: RestoreVersionRequest): Promise<boolean> {
    try {
      // Get the version information
      const { data: versionData, error: versionError } = await supabase
        .from('document_versions')
        .select('*')
        .eq('id', request.version_id)
        .single();

      if (versionError) {
        throw versionError;
      }

      // Get the file information
      const { data: fileData, error: fileError } = await supabase
        .from('files')
        .select('*')
        .eq('id', versionData.file_id)
        .single();

      if (fileError) {
        throw fileError;
      }

      // Create a new version with the current file state before restoring
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Create a backup version of the current state
      await supabase
        .from('document_versions')
        .insert({
          file_id: fileData.id,
          storage_path: fileData.storage_path,
          created_by: user.id,
          size: fileData.size,
          comment: 'Automatic backup before version restore'
        });

      // Update the file to point to the restored version
      const { error: updateError } = await supabase
        .from('files')
        .update({
          storage_path: versionData.storage_path,
          size: versionData.size,
          updated_at: new Date().toISOString()
        })
        .eq('id', fileData.id);

      if (updateError) {
        throw updateError;
      }

      return true;
    } catch (error: any) {
      console.error('Error restoring version:', error);
      toast.error(`Failed to restore version: ${error.message || 'Unknown error'}`);
      return false;
    }
  }

  /**
   * Create a version when a file is updated
   * @param fileMetadata The updated file metadata
   * @param comment Optional comment for the version
   * @returns The created document version
   */
  async createVersionOnUpdate(fileMetadata: FileMetadata, comment?: string): Promise<DocumentVersion | null> {
    return this.createVersion({
      file_id: fileMetadata.id,
      storage_path: fileMetadata.storagePath,
      size: fileMetadata.size,
      comment: comment || 'File updated'
    });
  }
}
