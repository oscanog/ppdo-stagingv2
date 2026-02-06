// convex/schema/breakdownSharedAccess.ts

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const breakdownSharedAccessTables = {
  /**
   * Breakdown Shared Access.
   * Tracks which users have been granted access to breakdown pages
   * for specific projects, trust funds, special education funds, etc.
   */
  breakdownSharedAccess: defineTable({
    /**
     * User who has been granted access
     */
    userId: v.id("users"),
    
    /**
     * Entity type this access is for
     */
    entityType: v.union(
      v.literal("project"),
      v.literal("trustfund"),
      v.literal("specialeducationfund"),
      v.literal("specialhealthfund"),
      v.literal("twentyPercentDF")
    ),
    
    /**
     * Entity ID (projectId, trustFundId, etc.)
     */
    entityId: v.string(),
    
    /**
     * Access level granted
     */
    accessLevel: v.union(
      v.literal("viewer"),
      v.literal("editor"),
      v.literal("admin")
    ),
    
    /**
     * User who granted this access
     */
    grantedBy: v.id("users"),
    
    /**
     * Timestamp when access was granted
     */
    grantedAt: v.number(),
    
    /**
     * Whether this access is currently active
     */
    isActive: v.boolean(),
    
    /**
     * Optional expiration date
     */
    expiresAt: v.optional(v.number()),
    
    /**
     * Optional notes about why access was granted
     */
    notes: v.optional(v.string()),
  })
    .index("userId", ["userId"])
    .index("entityId", ["entityId"])
    .index("entityType", ["entityType"])
    .index("isActive", ["isActive"])
    .index("userIdAndEntity", ["userId", "entityId", "entityType"])
    .index("userIdAndActive", ["userId", "isActive"]),
};
