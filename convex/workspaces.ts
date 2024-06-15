// convex/workspaces.ts

import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { Id } from './_generated/dataModel';

type UserId = Id<'userProfile'>;

export const getAll = query({
  handler: async (ctx) => {
    const workspaces = await ctx.db.query('workspaces').collect();
    return workspaces;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    ownerId: v.id('userProfile'),
    icon: v.optional(v.string()), // Add icon as an optional argument
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }
    const userId = identity.subject as UserId;
    const newWorkspace = await ctx.db.insert('workspaces', {
      name: args.name,
      ownerId: args.ownerId,
      userId: args.ownerId,
      icon: args.icon || 'default-icon', // Provide a default icon if none is specified
      authorizedUsers: [{ userId: args.ownerId, permission: 'admin' }],
    });
    return newWorkspace;
  }
});

export const updateWorkspacePermissions = mutation({
  args: {
    workspaceId: v.id('workspaces'),
    userId: v.id('userProfile'),
    permission: v.string(),
  },
  handler: async (ctx, args) => {
    const { workspaceId, userId, permission } = args;
    
    const workspace = await ctx.db.get(workspaceId);
    if (!workspace) {
      throw new Error('Workspace not found');
    }
    
    const updatedAuthorizedUsers = workspace.authorizedUsers.map((user) => {
      if (user.userId === userId) {
        return { ...user, permission };
      }
      return user;
    });
    
    await ctx.db.replace(workspaceId, {
      ...workspace,
      authorizedUsers: updatedAuthorizedUsers,
    });
    return updatedAuthorizedUsers;
  },
});

export const getWorkspace = query({
  args: {
    workspaceId: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.workspaceId);
  },
});

export const getOrCreateUserWorkspace = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }
    const userId = identity.subject as UserId;
    let workspace = await ctx.db
      .query('workspaces')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first();
    
    if (!workspace) {
      const workspaceId = await ctx.db.insert('workspaces', {
        name: 'My Workspace',
        ownerId: userId,
        userId,
        icon: 'default-icon', // Provide a default icon
        authorizedUsers: [{ userId, permission: 'admin' }],
      });
      workspace = await ctx.db.get(workspaceId); // Fetch the full workspace object after insert
    }
    if (!workspace) {
      throw new Error('Failed to create or fetch workspace');
    }
    return workspace;
  },
});