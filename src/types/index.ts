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
  authorId: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Folder {
  id: string;
  title: string;
  icon?: string;
  parentId?: string;
  isArchived: boolean;
  authorId: string;
  author: User;
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
}

export interface UpdateDocumentRequest {
  title?: string;
  content?: string;
  icon?: string;
  coverImage?: string;
  isArchived?: boolean;
  isPublished?: boolean;
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

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
} 