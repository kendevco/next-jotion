// types/types.ts

export interface Permission {
  id: string;
  name: string;
  level: number;
}

export interface UserProfile {
  _id: string;
  _creationTime: number;
  avatar?: string;
  displayName?: string;
  email?: string;
  userId: string;
  permission?: string; // Add this property if it is expected
}

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  members: UserProfile[];
}

// types.ts
export interface Document {
  title: string;
  coverImage?: string;
  content?: string;
  userId: string;
  isArchived: boolean;
  isPublished: boolean;
  parentDocument?: string; // If parentDocument is an Id, you might want to use a specific type.
}
