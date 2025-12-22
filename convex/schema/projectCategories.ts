// convex/schema/projectCategories.ts

import { defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * PROJECT CATEGORIES TABLE
 * 
 * Manages project categorization for better organization and reporting.
 * Categories help group projects by their nature/purpose.
 * 
 * Features:
 * - System defaults (cannot be deleted)
 * - User-created categories (can be CRUD)
 * - Usage tracking (how many projects use this category)
 * - Optional category (projects can exist without a category)
 * - Soft delete support (mark as inactive instead of hard delete)
 */
export const projectCategoryTables = {
  projectCategories: defineTable({
    // ============================================================================
    // CATEGORY IDENTIFICATION
    // ============================================================================
    
    /**
     * Category code/short name
     * Examples: "SOCIAL_SERVICES", "INFRASTRUCTURE", "HEALTH"
     */
    code: v.string(),
    
    /**
     * Full display name
     * Examples: "Social Services", "Infrastructure Services", "Health Services"
     */
    fullName: v.string(),
    
    /**
     * Description of what projects fall under this category
     */
    description: v.optional(v.string()),
    
    // ============================================================================
    // VISUAL & ORGANIZATION
    // ============================================================================
    
    /**
     * Display order for sorting in UI
     * Lower numbers appear first
     */
    displayOrder: v.optional(v.number()),
    
    /**
     * Color code for visual identification (hex format)
     * Example: "#4CAF50"
     */
    colorCode: v.optional(v.string()),
    
    /**
     * Icon name (if using icon library)
     * Example: "building", "heart", "leaf"
     */
    iconName: v.optional(v.string()),
    
    // ============================================================================
    // STATUS & USAGE
    // ============================================================================
    
    /**
     * Whether this category is active and can be used
     */
    isActive: v.boolean(),
    
    /**
     * Mark as system default (cannot be deleted by users)
     * Only super_admin can mark/unmark this during seeding
     */
    isSystemDefault: v.optional(v.boolean()),
    
    /**
     * Number of projects currently using this category
     * Auto-calculated, do not manually set
     */
    usageCount: v.optional(v.number()),
    
    // ============================================================================
    // METADATA
    // ============================================================================
    
    /**
     * Optional parent category for hierarchical organization
     * Example: "Health Services" could be parent of "Primary Health Care"
     */
    parentCategoryId: v.optional(v.id("projectCategories")),
    
    /**
     * Additional metadata (JSON)
     * Can store custom fields like budget range, priority level, etc.
     */
    metadata: v.optional(v.any()),
    
    /**
     * Notes for internal use
     */
    notes: v.optional(v.string()),
    
    // ============================================================================
    // SYSTEM FIELDS
    // ============================================================================
    
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
    updatedBy: v.optional(v.id("users")),
  })
    .index("code", ["code"])
    .index("fullName", ["fullName"])
    .index("isActive", ["isActive"])
    .index("isSystemDefault", ["isSystemDefault"])
    .index("displayOrder", ["displayOrder"])
    .index("parentCategoryId", ["parentCategoryId"])
    .index("createdBy", ["createdBy"])
    .index("createdAt", ["createdAt"])
    .index("usageCount", ["usageCount"]),
};