// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    userId: v.string(),
    workspaceId: v.optional(v.id("workspaces")),
    sharedWith: v.optional(
      v.array(
        v.object({
          userId: v.string(),
          permission: v.string(),
        })
      )
    ),
    isArchived: v.boolean(),
    lastUpdated: v.optional(v.number()),
    parentDocument: v.optional(v.id("documents")),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_parent", ["parentDocument"])
    .index("by_user_parent", ["userId", "parentDocument"])
    .index("by_published", ["isPublished"]),
  workspaces: defineTable({
    name: v.string(),
    ownerId: v.optional(v.id("userProfile")),
    userId: v.string(),
    icon: v.optional(v.string()), // Add the icon property
    authorizedUsers: v.array(
      v.object({
        userId: v.string(),
        permission: v.string(),
      })
    ),
  }).index("by_user", ["userId"]),
  userProfile: defineTable({
    userId: v.string(),
    avatar: v.optional(v.string()), // Change to accept string URLs
    displayName: v.optional(v.string()),
    email: v.optional(v.string()),
  }),
  memberships: defineTable({
    workspaceId: v.id("workspaces"),
    userId: v.id("userProfile"),
    role: v.union(
      v.literal("admin"),
      v.literal("member"),
      v.literal("guest"),
      v.literal("owner")
    ),
  }).index("by_workspace", ["workspaceId"]),
  publicFiles: defineTable({
    file: v.bytes(),
    filename: v.string(),
  }).index("by_filename", ["filename"]),
});