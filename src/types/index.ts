export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  icon?: string;
  coverImage?: string;
  parentId?: string;
  isArchived: boolean;
  isPublished: boolean;
  isFavorite: boolean;
  authorId: string;
  author: User;
  collaborators: User[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Folder {
  id: string;
  title: string;
  icon?: string;
  parentId?: string;
  isArchived: boolean;
  isFavorite: boolean;
  authorId: string;
  author: User;
  collaborators: User[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface CreateDocumentRequest {
  title: string;
  parentId?: string;
  icon?: string;
  coverImage?: string;
  content?: string;
}

export interface UpdateDocumentRequest {
  title?: string;
  content?: string;
  icon?: string;
  coverImage?: string;
  isArchived?: boolean;
  isPublished?: boolean;
  isFavorite?: boolean;
  tags?: string[];
}

export interface CreateFolderRequest {
  title: string;
  parentId?: string;
  icon?: string;
}

export interface UpdateFolderRequest {
  title?: string;
  icon?: string;
  isArchived?: boolean;
  isFavorite?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface SearchRequest {
  query: string;
  type?: 'document' | 'folder' | 'all';
}

export interface ShareRequest {
  documentId: string;
  userId: string;
  permission: 'read' | 'write' | 'admin';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SearchResult {
  documents: Document[];
  folders: Folder[];
  total: number;
}

export interface Theme {
  mode: 'light' | 'dark' | 'system';
}

export interface Shortcut {
  key: string;
  action: string;
  description: string;
} 