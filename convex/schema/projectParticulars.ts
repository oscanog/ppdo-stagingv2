// convex/schema/projectParticulars.ts
import { defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Project Particulars Table
 * 
 * This table stores the master list of project particulars (codes and names)
 * that can ONLY be used by projects (not budgetItems).
 * 
 * This is completely separate from budgetParticulars.
 * 
 * Example particulars:
 * - CONST_ROADS: "Construction of Roads"
 * - REPAIR_BRIDGE: "Repair of Bridges"
 * - WATER_SYSTEM: "Water System Development"
 * - etc.
 */
export const projectParticularTables = {
  projectParticulars: defineTable({
    /**
     * Short code/abbreviation (e.g., "CONST_ROADS", "REPAIR_BRIDGE")
     * Must be unique across all project particulars
     */
    code: v.string(),

    /**
     * Full name/description
     * (e.g., "Construction of Roads", "Repair of Bridges")
     */
    fullName: v.string(),

    /**
     * Optional description providing more context
     */
    description: v.optional(v.string()),

    /**
     * Display order for sorting in UI (lower numbers appear first)
     */
    displayOrder: v.optional(v.number()),

    /**
     * Whether this particular is currently active/available for use
     * Inactive particulars won't show in dropdowns but existing records remain valid
     */
    isActive: v.boolean(),

    /**
     * Whether this is a system default particular (cannot be deleted)
     * Set to true for default project particulars
     */
    isSystemDefault: v.optional(v.boolean()),

    /**
     * Usage statistics - how many projects use this particular
     */
    usageCount: v.optional(v.number()),

    /**
     * Optional category for grouping (e.g., "Infrastructure", "Social Services")
     */
    category: v.optional(v.string()),

    /**
     * Optional color code for UI display (hex color)
     */
    colorCode: v.optional(v.string()),

    /**
     * Audit fields
     */
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
    updatedBy: v.optional(v.id("users")),

    /**
     * Optional notes about this particular
     */
    notes: v.optional(v.string()),
  })
    // Indexes for efficient queries
    .index("code", ["code"]) // For uniqueness check and lookups by code
    .index("isActive", ["isActive"]) // For filtering active particulars
    .index("displayOrder", ["displayOrder"]) // For ordered display
    .index("category", ["category"]) // For category filtering
    .index("isActiveAndDisplayOrder", ["isActive", "displayOrder"]) // Combined for sorted active list
    .index("createdBy", ["createdBy"])
    .index("createdAt", ["createdAt"])
    .index("isSystemDefault", ["isSystemDefault"])
    .index("usageCount", ["usageCount"]), // For sorting by popularity
};