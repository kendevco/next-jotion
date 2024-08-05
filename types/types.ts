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
import { Id } from "@/convex/_generated/dataModel";
export interface Document {
  _id: Id<"documents">;
  _creationTime: number; // Convex typically provides this automatically
  title: string;
  userId: string;
  workspaceId?: Id<"workspaces">;
  sharedWith?: Array<{ userId: string; permission: string }>;
  isArchived: boolean;
  parentDocument?: Id<"documents">;
  content?: string;
  coverImage?: string;
  icon?: string;
  isPublished: boolean;
}
