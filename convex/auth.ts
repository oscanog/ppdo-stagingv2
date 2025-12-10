// convex/auth.ts

import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx, args) {
      // Initialize new users with default role and status
      if (args.existingUserId === undefined) {
        // This is a new user
        const now = Date.now();
        await ctx.db.patch(args.userId, {
          role: "user",
          status: "active",
          createdAt: now,
          updatedAt: now,
          lastLogin: now,
        });
      }
    },
  },
});

/**
 * Initialize new user with default role and status
 * This runs after a user signs up via Convex Auth
 */
export const initializeNewUser = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    
    // Only initialize if the user doesn't already have role/status set
    if (user && (!user.role || !user.status)) {
      const now = Date.now();
      await ctx.db.patch(args.userId, {
        role: user.role || "user",
        status: user.status || "active",
        createdAt: user.createdAt || user._creationTime,
        updatedAt: now,
        lastLogin: now,
      });
    }
  },
});

/**
 * Verify user can sign in based on status
 */
export const verifyUserCanSignIn = query({
  args: {
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.email) {
      return { allowed: true };
    }

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      return { allowed: true }; // Let auth handle user not found
    }

    // Check if status field exists (for backward compatibility)
    if (user.status === undefined) {
      return { allowed: true };
    }

    if (user.status === "suspended") {
      return {
        allowed: false,
        reason: user.suspensionReason || "Your account has been suspended.",
      };
    }

    if (user.status === "inactive") {
      return {
        allowed: false,
        reason: "Your account is inactive. Please contact support.",
      };
    }

    return { allowed: true };
  },
});

/**
 * Get current authenticated user with full details
 */
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    const user = await ctx.db.get(userId);
    return user;
  },
});

/**
 * Update user role (admin only)
 */
export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    newRole: v.union(
      v.literal("administrator"),
      v.literal("user"),
      v.literal("viewer")
    ),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new Error("Not authenticated");
    }

    const currentUser = await ctx.db.get(currentUserId);
    if (!currentUser || currentUser.role !== "administrator") {
      throw new Error("Not authorized - administrator access required");
    }

    const targetUser = await ctx.db.get(args.userId);
    if (!targetUser) {
      throw new Error("User not found");
    }

    const now = Date.now();
    await ctx.db.patch(args.userId, {
      role: args.newRole,
      updatedAt: now,
    });

    // Log the action
    await ctx.db.insert("userAuditLog", {
      performedBy: currentUserId,
      targetUserId: args.userId,
      action: "role_changed",
      previousValues: JSON.stringify({ role: targetUser.role }),
      newValues: JSON.stringify({ role: args.newRole }),
      timestamp: now,
    });

    return { success: true };
  },
});

/**
 * Update user status (admin only)
 */
export const updateUserStatus = mutation({
  args: {
    userId: v.id("users"),
    newStatus: v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("suspended")
    ),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new Error("Not authenticated");
    }

    const currentUser = await ctx.db.get(currentUserId);
    if (!currentUser || currentUser.role !== "administrator") {
      throw new Error("Not authorized - administrator access required");
    }

    const targetUser = await ctx.db.get(args.userId);
    if (!targetUser) {
      throw new Error("User not found");
    }

    const now = Date.now();
    const updateData: any = {
      status: args.newStatus,
      updatedAt: now,
    };

    if (args.newStatus === "suspended") {
      updateData.suspensionReason = args.reason;
      updateData.suspendedBy = currentUserId;
      updateData.suspendedAt = now;
    } else {
      // Clear suspension data if status changed from suspended
      updateData.suspensionReason = undefined;
      updateData.suspendedBy = undefined;
      updateData.suspendedAt = undefined;
    }

    await ctx.db.patch(args.userId, updateData);

    // Log the action
    await ctx.db.insert("userAuditLog", {
      performedBy: currentUserId,
      targetUserId: args.userId,
      action: "status_changed",
      previousValues: JSON.stringify({ status: targetUser.status }),
      newValues: JSON.stringify({ 
        status: args.newStatus, 
        reason: args.reason 
      }),
      timestamp: now,
    });

    return { success: true };
  },
});

/**
 * List all users (admin only)
 */
export const listAllUsers = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const currentUser = await ctx.db.get(userId);
    if (!currentUser || currentUser.role !== "administrator") {
      throw new Error("Not authorized - administrator access required");
    }

    const limit = args.limit || 100;
    const users = await ctx.db
      .query("users")
      .order("desc")
      .take(limit);

    return users.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      suspensionReason: user.suspensionReason,
    }));
  },
});

/**
 * Get user audit log (admin only)
 */
export const getUserAuditLog = query({
  args: {
    userId: v.optional(v.id("users")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new Error("Not authenticated");
    }

    const currentUser = await ctx.db.get(currentUserId);
    if (!currentUser || currentUser.role !== "administrator") {
      throw new Error("Not authorized - administrator access required");
    }

    const limit = args.limit || 50;

    let logs;
    
    if (args.userId) {
      logs = await ctx.db
        .query("userAuditLog")
        .withIndex("targetUserId", (q) => q.eq("targetUserId", args.userId!))
        .order("desc")
        .take(limit);
    } else {
      logs = await ctx.db
        .query("userAuditLog")
        .order("desc")
        .take(limit);
    }

    // Enrich logs with user information
    const enrichedLogs = await Promise.all(
      logs.map(async (log) => {
        const performedByUser = await ctx.db.get(log.performedBy);
        const targetUser = await ctx.db.get(log.targetUserId);
        
        return {
          ...log,
          performedByEmail: performedByUser?.email,
          performedByName: performedByUser?.name,
          targetUserEmail: targetUser?.email,
          targetUserName: targetUser?.name,
        };
      })
    );

    return enrichedLogs;
  },
});