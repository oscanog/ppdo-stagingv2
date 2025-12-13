// convex/blockedManagement.ts
// Additional helper functions for managing blocked IPs and emails

import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Get all blocked IP addresses
 * Admin only
 */
export const getBlockedIPs = query({
  args: {
    includeInactive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new Error("Not authenticated");
    }

    const currentUser = await ctx.db.get(currentUserId);
    if (!currentUser || (currentUser.role !== "super_admin" && currentUser.role !== "admin")) {
      throw new Error("Not authorized - administrator access required");
    }

    let blockedIPs;
    if (args.includeInactive) {
      blockedIPs = await ctx.db
        .query("blockedIPs")
        .order("desc")
        .collect();
    } else {
      blockedIPs = await ctx.db
        .query("blockedIPs")
        .withIndex("isActive", (q) => q.eq("isActive", true))
        .order("desc")
        .collect();
    }

    // Enrich with admin info
    const enriched = await Promise.all(
      blockedIPs.map(async (block) => {
        const blockedBy = await ctx.db.get(block.blockedBy);
        let unblockedBy = null;
        if (block.unblockedBy) {
          unblockedBy = await ctx.db.get(block.unblockedBy);
        }

        return {
          ...block,
          blockedByName: blockedBy?.name,
          blockedByEmail: blockedBy?.email,
          unblockedByName: unblockedBy?.name,
          unblockedByEmail: unblockedBy?.email,
        };
      })
    );

    return enriched;
  },
});

/**
 * Get all blocked emails
 * Admin only
 */
export const getBlockedEmails = query({
  args: {
    includeInactive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new Error("Not authenticated");
    }

    const currentUser = await ctx.db.get(currentUserId);
    if (!currentUser || (currentUser.role !== "super_admin" && currentUser.role !== "admin")) {
      throw new Error("Not authorized - administrator access required");
    }

    let blockedEmails;
    if (args.includeInactive) {
      blockedEmails = await ctx.db
        .query("blockedEmails")
        .order("desc")
        .collect();
    } else {
      blockedEmails = await ctx.db
        .query("blockedEmails")
        .withIndex("isActive", (q) => q.eq("isActive", true))
        .order("desc")
        .collect();
    }

    // Enrich with admin info
    const enriched = await Promise.all(
      blockedEmails.map(async (block) => {
        const blockedBy = await ctx.db.get(block.blockedBy);
        let unblockedBy = null;
        if (block.unblockedBy) {
          unblockedBy = await ctx.db.get(block.unblockedBy);
        }

        return {
          ...block,
          blockedByName: blockedBy?.name,
          blockedByEmail: blockedBy?.email,
          unblockedByName: unblockedBy?.name,
          unblockedByEmail: unblockedBy?.email,
        };
      })
    );

    return enriched;
  },
});

/**
 * Unblock an IP address
 * Admin only
 */
export const unblockIP = mutation({
  args: {
    blockId: v.id("blockedIPs"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new Error("Not authenticated");
    }

    const currentUser = await ctx.db.get(currentUserId);
    if (!currentUser || (currentUser.role !== "super_admin" && currentUser.role !== "admin")) {
      throw new Error("Not authorized - administrator access required");
    }

    const block = await ctx.db.get(args.blockId);
    if (!block) {
      throw new Error("Block not found");
    }

    if (!block.isActive) {
      throw new Error("IP is already unblocked");
    }

    const now = Date.now();
    await ctx.db.patch(args.blockId, {
      isActive: false,
      unblockedBy: currentUserId,
      unblockedAt: now,
      notes: args.notes || block.notes,
    });

    return { success: true };
  },
});

/**
 * Unblock an email address
 * Admin only
 */
export const unblockEmail = mutation({
  args: {
    blockId: v.id("blockedEmails"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new Error("Not authenticated");
    }

    const currentUser = await ctx.db.get(currentUserId);
    if (!currentUser || (currentUser.role !== "super_admin" && currentUser.role !== "admin")) {
      throw new Error("Not authorized - administrator access required");
    }

    const block = await ctx.db.get(args.blockId);
    if (!block) {
      throw new Error("Block not found");
    }

    if (!block.isActive) {
      throw new Error("Email is already unblocked");
    }

    const now = Date.now();
    await ctx.db.patch(args.blockId, {
      isActive: false,
      unblockedBy: currentUserId,
      unblockedAt: now,
      notes: args.notes || block.notes,
    });

    return { success: true };
  },
});

/**
 * Check if an IP address is blocked
 * Used during authentication
 */
export const isIPBlocked = query({
  args: {
    ipAddress: v.string(),
  },
  handler: async (ctx, args) => {
    const block = await ctx.db
      .query("blockedIPs")
      .withIndex("ipAddress", (q) => q.eq("ipAddress", args.ipAddress))
      .first();

    if (!block || !block.isActive) {
      return { isBlocked: false };
    }

    // Check if block has expired (but don't auto-expire in a query)
    if (block.expiresAt && block.expiresAt < Date.now()) {
      return { 
        isBlocked: false,
        expired: true,
        blockId: block._id 
      };
    }

    return {
      isBlocked: true,
      reason: block.reason,
      blockedAt: block.blockedAt,
    };
  },
});

/**
 * Check if an email is blocked
 * Used during authentication
 */
export const isEmailBlocked = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const block = await ctx.db
      .query("blockedEmails")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();

    if (!block || !block.isActive) {
      return { isBlocked: false };
    }

    // Check if block has expired (but don't auto-expire in a query)
    if (block.expiresAt && block.expiresAt < Date.now()) {
      return { 
        isBlocked: false,
        expired: true,
        blockId: block._id 
      };
    }

    return {
      isBlocked: true,
      reason: block.reason,
      blockedAt: block.blockedAt,
    };
  },
});

/**
 * Auto-expire an IP block
 * Separate mutation to handle expiration
 */
export const expireIPBlock = mutation({
  args: {
    blockId: v.id("blockedIPs"),
  },
  handler: async (ctx, args) => {
    const block = await ctx.db.get(args.blockId);
    if (!block) {
      return { success: false };
    }

    if (block.expiresAt && block.expiresAt < Date.now()) {
      await ctx.db.patch(args.blockId, { isActive: false });
      return { success: true };
    }

    return { success: false };
  },
});

/**
 * Auto-expire an email block
 * Separate mutation to handle expiration
 */
export const expireEmailBlock = mutation({
  args: {
    blockId: v.id("blockedEmails"),
  },
  handler: async (ctx, args) => {
    const block = await ctx.db.get(args.blockId);
    if (!block) {
      return { success: false };
    }

    if (block.expiresAt && block.expiresAt < Date.now()) {
      await ctx.db.patch(args.blockId, { isActive: false });
      return { success: true };
    }

    return { success: false };
  },
});

/**
 * Update block notes
 * Admin only
 */
export const updateBlockNotes = mutation({
  args: {
    blockId: v.union(v.id("blockedIPs"), v.id("blockedEmails")),
    notes: v.string(),
    type: v.union(v.literal("ip"), v.literal("email")),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new Error("Not authenticated");
    }

    const currentUser = await ctx.db.get(currentUserId);
    if (!currentUser || (currentUser.role !== "super_admin" && currentUser.role !== "admin")) {
      throw new Error("Not authorized - administrator access required");
    }

    if (args.type === "ip") {
      const block = await ctx.db.get(args.blockId as any);
      if (!block) {
        throw new Error("Block not found");
      }
      await ctx.db.patch(args.blockId as any, { notes: args.notes });
    } else {
      const block = await ctx.db.get(args.blockId as any);
      if (!block) {
        throw new Error("Block not found");
      }
      await ctx.db.patch(args.blockId as any, { notes: args.notes });
    }

    return { success: true };
  },
});

/**
 * Set expiration date for a block
 * Admin only
 */
export const setBlockExpiration = mutation({
  args: {
    blockId: v.union(v.id("blockedIPs"), v.id("blockedEmails")),
    expiresAt: v.number(),
    type: v.union(v.literal("ip"), v.literal("email")),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new Error("Not authenticated");
    }

    const currentUser = await ctx.db.get(currentUserId);
    if (!currentUser || (currentUser.role !== "super_admin" && currentUser.role !== "admin")) {
      throw new Error("Not authorized - administrator access required");
    }

    if (args.expiresAt < Date.now()) {
      throw new Error("Expiration date must be in the future");
    }

    if (args.type === "ip") {
      await ctx.db.patch(args.blockId as any, { expiresAt: args.expiresAt });
    } else {
      await ctx.db.patch(args.blockId as any, { expiresAt: args.expiresAt });
    }

    return { success: true };
  },
});