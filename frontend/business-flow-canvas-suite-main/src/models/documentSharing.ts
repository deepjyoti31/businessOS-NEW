/**
 * Document sharing and version control models
 */

export type PermissionLevel = 'view' | 'edit' | 'comment';

export interface DocumentShare {
  id: string;
  file_id: string;
  owner_id: string;
  shared_with_id: string;
  permission_level: PermissionLevel;
  created_at: string;
  updated_at: string;
}

export interface DocumentShareWithUser extends DocumentShare {
  user: {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
  };
}

export interface DocumentVersion {
  id: string;
  file_id: string;
  version_number: number;
  storage_path: string;
  created_by: string;
  created_at: string;
  size?: number;
  comment?: string;
}

export interface DocumentVersionWithUser extends DocumentVersion {
  user: {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
  };
}

export interface ShareDocumentRequest {
  file_id: string;
  shared_with_id: string;
  permission_level: PermissionLevel;
}

export interface UpdateSharePermissionRequest {
  share_id: string;
  permission_level: PermissionLevel;
}

export interface CreateVersionRequest {
  file_id: string;
  storage_path: string;
  size?: number;
  comment?: string;
}

export interface RestoreVersionRequest {
  version_id: string;
}
