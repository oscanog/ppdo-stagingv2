// convex/budgetItems.ts

import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Get all budget items ordered by creation date (newest first)
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    const budgetItems = await ctx.db
      .query("budgetItems")
      .withIndex("createdAt")
      .order("desc")
      .collect();

    return budgetItems;
  },
});

/**
 * Get a single budget item by ID
 */
export const get = query({
  args: {
    id: v.id("budgetItems"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    const budgetItem = await ctx.db.get(args.id);
    return budgetItem;
  },
});

/**
 * Get budget item by particulars name
 */
export const getByParticulars = query({
  args: {
    particulars: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    const budgetItem = await ctx.db
      .query("budgetItems")
      .withIndex("particulars", (q) => q.eq("particulars", args.particulars))
      .first();

    return budgetItem;
  },
});

/**
 * Create a new budget item
 */
export const create = mutation({
  args: {
    particulars: v.string(),
    totalBudgetAllocated: v.number(),
    totalBudgetUtilized: v.number(),
    projectCompleted: v.number(),
    projectDelayed: v.number(),
    projectsOnTrack: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    // Check if particulars already exists
    const existing = await ctx.db
      .query("budgetItems")
      .withIndex("particulars", (q) => q.eq("particulars", args.particulars))
      .first();

    if (existing) {
      throw new Error("Budget item with this particulars already exists");
    }

    // Calculate utilization rate
    const utilizationRate =
      args.totalBudgetAllocated > 0
        ? (args.totalBudgetUtilized / args.totalBudgetAllocated) * 100
        : 0;

    const now = Date.now();

    const budgetItemId = await ctx.db.insert("budgetItems", {
      particulars: args.particulars,
      totalBudgetAllocated: args.totalBudgetAllocated,
      totalBudgetUtilized: args.totalBudgetUtilized,
      utilizationRate: utilizationRate,
      projectCompleted: args.projectCompleted,
      projectDelayed: args.projectDelayed,
      projectsOnTrack: args.projectsOnTrack,
      notes: args.notes,
      createdBy: userId,
      createdAt: now,
      updatedAt: now,
      updatedBy: userId,
    });

    return budgetItemId;
  },
});

/**
 * Update an existing budget item
 */
export const update = mutation({
  args: {
    id: v.id("budgetItems"),
    totalBudgetAllocated: v.number(),
    totalBudgetUtilized: v.number(),
    projectCompleted: v.number(),
    projectDelayed: v.number(),
    projectsOnTrack: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Budget item not found");
    }

    // Calculate utilization rate
    const utilizationRate =
      args.totalBudgetAllocated > 0
        ? (args.totalBudgetUtilized / args.totalBudgetAllocated) * 100
        : 0;

    const now = Date.now();

    await ctx.db.patch(args.id, {
      totalBudgetAllocated: args.totalBudgetAllocated,
      totalBudgetUtilized: args.totalBudgetUtilized,
      utilizationRate: utilizationRate,
      projectCompleted: args.projectCompleted,
      projectDelayed: args.projectDelayed,
      projectsOnTrack: args.projectsOnTrack,
      notes: args.notes,
      updatedBy: userId,
      updatedAt: now,
    });

    return args.id;
  },
});

/**
 * Delete a budget item
 */
export const remove = mutation({
  args: {
    id: v.id("budgetItems"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Budget item not found");
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

/**
 * Get budget statistics
 */
export const getStatistics = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    const budgetItems = await ctx.db.query("budgetItems").collect();

    const totalAllocated = budgetItems.reduce(
      (sum, item) => sum + item.totalBudgetAllocated,
      0
    );

    const totalUtilized = budgetItems.reduce(
      (sum, item) => sum + item.totalBudgetUtilized,
      0
    );

    const averageUtilizationRate =
      budgetItems.length > 0
        ? budgetItems.reduce((sum, item) => sum + item.utilizationRate, 0) /
          budgetItems.length
        : 0;

    const averageProjectCompleted =
      budgetItems.length > 0
        ? budgetItems.reduce((sum, item) => sum + item.projectCompleted, 0) /
          budgetItems.length
        : 0;

    const averageProjectDelayed =
      budgetItems.length > 0
        ? budgetItems.reduce((sum, item) => sum + item.projectDelayed, 0) /
          budgetItems.length
        : 0;

    const averageProjectsOnTrack =
      budgetItems.length > 0
        ? budgetItems.reduce((sum, item) => sum + item.projectsOnTrack, 0) /
          budgetItems.length
        : 0;

    return {
      totalAllocated,
      totalUtilized,
      averageUtilizationRate,
      averageProjectCompleted,
      averageProjectDelayed,
      averageProjectsOnTrack,
      totalProjects: budgetItems.length,
    };
  },
});