// convex/dashboardSearch.ts
// Unified search across all fund types and particulars

import { v } from "convex/values";
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Define the searchable item type
export type SearchableItem = {
  id: string;
  type: "project" | "twentyPercentDF" | "trustFund" | "specialEducationFund" | "specialHealthFund" | "particular";
  title: string;
  subtitle?: string;
  description?: string;
  year?: number;
  amount: number;
  utilized?: number;
  status?: string;
  office?: string;
  createdAt: number;
};

// Helper to format currency
function formatAmount(amount: number): string {
  return `₱${amount.toLocaleString("en-PH")}`;
}

/**
 * Search across all data sources
 * Returns items matching the search query from all fund types
 */
export const searchAll = query({
  args: {
    query: v.optional(v.string()),
    category: v.optional(v.union(
      v.literal("all"),
      v.literal("project"),
      v.literal("twentyPercentDF"),
      v.literal("trustFund"),
      v.literal("specialEducationFund"),
      v.literal("specialHealthFund"),
      v.literal("particular")
    )),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const searchQuery = (args.query || "").toLowerCase().trim();
    const category = args.category || "all";
    const limit = args.limit || 100;

    const results: SearchableItem[] = [];

    // Search Projects (Budget Items)
    if (category === "all" || category === "project") {
      const projects = await ctx.db.query("projects").collect();
      for (const project of projects) {
        if (!project.isDeleted) {
          const matches = !searchQuery || 
            project.particulars?.toLowerCase().includes(searchQuery) ||
            project.implementingOffice?.toLowerCase().includes(searchQuery) ||
            project.status?.toLowerCase().includes(searchQuery);

          if (matches) {
            results.push({
              id: project._id,
              type: "project",
              title: project.particulars || "Untitled Project",
              subtitle: project.implementingOffice,
              year: project.year,
              amount: project.totalBudgetAllocated || 0,
              utilized: project.totalBudgetUtilized || 0,
              status: project.status,
              office: project.implementingOffice,
              createdAt: project.createdAt,
            });
          }
        }
      }
    }

    // Search 20% DF
    if (category === "all" || category === "twentyPercentDF") {
      const dfItems = await ctx.db.query("twentyPercentDF").collect();
      for (const item of dfItems) {
        if (!item.isDeleted) {
          const matches = !searchQuery || 
            item.particulars?.toLowerCase().includes(searchQuery) ||
            item.implementingOffice?.toLowerCase().includes(searchQuery) ||
            item.status?.toLowerCase().includes(searchQuery);

          if (matches) {
            results.push({
              id: item._id,
              type: "twentyPercentDF",
              title: item.particulars || "Untitled 20% DF",
              subtitle: item.implementingOffice,
              year: item.year,
              amount: item.totalBudgetAllocated || 0,
              utilized: item.totalBudgetUtilized || 0,
              status: item.status,
              office: item.implementingOffice,
              createdAt: item.createdAt,
            });
          }
        }
      }
    }

    // Search Trust Funds
    if (category === "all" || category === "trustFund") {
      const trustFunds = await ctx.db.query("trustFunds").collect();
      for (const fund of trustFunds) {
        if (!fund.isDeleted) {
          const matches = !searchQuery || 
            fund.projectTitle?.toLowerCase().includes(searchQuery) ||
            fund.officeInCharge?.toLowerCase().includes(searchQuery) ||
            fund.status?.toLowerCase().includes(searchQuery);

          if (matches) {
            results.push({
              id: fund._id,
              type: "trustFund",
              title: fund.projectTitle || "Untitled Trust Fund",
              subtitle: fund.officeInCharge,
              year: fund.year,
              amount: fund.received || 0,
              utilized: fund.utilized || 0,
              status: fund.status,
              office: fund.officeInCharge,
              createdAt: fund.createdAt,
            });
          }
        }
      }
    }

    // Search Special Education Funds
    if (category === "all" || category === "specialEducationFund") {
      const sefItems = await ctx.db.query("specialEducationFunds").collect();
      for (const item of sefItems) {
        if (!item.isDeleted) {
          const matches = !searchQuery || 
            item.projectTitle?.toLowerCase().includes(searchQuery) ||
            item.officeInCharge?.toLowerCase().includes(searchQuery) ||
            item.status?.toLowerCase().includes(searchQuery);

          if (matches) {
            results.push({
              id: item._id,
              type: "specialEducationFund",
              title: item.projectTitle || "Untitled SEF",
              subtitle: item.officeInCharge,
              year: item.year,
              amount: item.received || 0,
              utilized: item.utilized || 0,
              status: item.status,
              office: item.officeInCharge,
              createdAt: item.createdAt,
            });
          }
        }
      }
    }

    // Search Special Health Funds
    if (category === "all" || category === "specialHealthFund") {
      const shfItems = await ctx.db.query("specialHealthFunds").collect();
      for (const item of shfItems) {
        if (!item.isDeleted) {
          const matches = !searchQuery || 
            item.projectTitle?.toLowerCase().includes(searchQuery) ||
            item.officeInCharge?.toLowerCase().includes(searchQuery) ||
            item.status?.toLowerCase().includes(searchQuery);

          if (matches) {
            results.push({
              id: item._id,
              type: "specialHealthFund",
              title: item.projectTitle || "Untitled SHF",
              subtitle: item.officeInCharge,
              year: item.year,
              amount: item.received || 0,
              utilized: item.utilized || 0,
              status: item.status,
              office: item.officeInCharge,
              createdAt: item.createdAt,
            });
          }
        }
      }
    }

    // Search Particulars (Budget Particulars)
    if (category === "all" || category === "particular") {
      const particulars = await ctx.db.query("budgetParticulars").collect();
      for (const particular of particulars) {
        const matches = !searchQuery || 
          particular.code?.toLowerCase().includes(searchQuery) ||
          particular.fullName?.toLowerCase().includes(searchQuery) ||
          particular.description?.toLowerCase().includes(searchQuery) ||
          particular.category?.toLowerCase().includes(searchQuery);

        if (matches) {
          results.push({
            id: particular._id,
            type: "particular",
            title: particular.code || "Untitled",
            subtitle: particular.fullName,
            description: particular.description,
            amount: 0, // Particulars don't have amounts directly
            status: particular.isActive ? "Active" : "Inactive",
            office: particular.category,
            createdAt: particular.createdAt,
          });
        }
      }
    }

    // Sort by createdAt (newest first) and limit results
    results.sort((a, b) => b.createdAt - a.createdAt);
    return results.slice(0, limit);
  },
});

/**
 * Get counts for each category
 */
export const getCategoryCounts = query({
  args: {
    query: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const searchQuery = (args.query || "").toLowerCase().trim();

    let projectCount = 0;
    let dfCount = 0;
    let trustCount = 0;
    let educationCount = 0;
    let healthCount = 0;
    let particularCount = 0;

    // Count Projects
    const projects = await ctx.db.query("projects").collect();
    for (const project of projects) {
      if (!project.isDeleted) {
        const matches = !searchQuery || 
          project.particulars?.toLowerCase().includes(searchQuery) ||
          project.implementingOffice?.toLowerCase().includes(searchQuery);
        if (matches) projectCount++;
      }
    }

    // Count 20% DF
    const dfItems = await ctx.db.query("twentyPercentDF").collect();
    for (const item of dfItems) {
      if (!item.isDeleted) {
        const matches = !searchQuery || 
          item.particulars?.toLowerCase().includes(searchQuery) ||
          item.implementingOffice?.toLowerCase().includes(searchQuery);
        if (matches) dfCount++;
      }
    }

    // Count Trust Funds
    const trustFunds = await ctx.db.query("trustFunds").collect();
    for (const fund of trustFunds) {
      if (!fund.isDeleted) {
        const matches = !searchQuery || 
          fund.projectTitle?.toLowerCase().includes(searchQuery) ||
          fund.officeInCharge?.toLowerCase().includes(searchQuery);
        if (matches) trustCount++;
      }
    }

    // Count Special Education Funds
    const sefItems = await ctx.db.query("specialEducationFunds").collect();
    for (const item of sefItems) {
      if (!item.isDeleted) {
        const matches = !searchQuery || 
          item.projectTitle?.toLowerCase().includes(searchQuery) ||
          item.officeInCharge?.toLowerCase().includes(searchQuery);
        if (matches) educationCount++;
      }
    }

    // Count Special Health Funds
    const shfItems = await ctx.db.query("specialHealthFunds").collect();
    for (const item of shfItems) {
      if (!item.isDeleted) {
        const matches = !searchQuery || 
          item.projectTitle?.toLowerCase().includes(searchQuery) ||
          item.officeInCharge?.toLowerCase().includes(searchQuery);
        if (matches) healthCount++;
      }
    }

    // Count Particulars
    const particulars = await ctx.db.query("budgetParticulars").collect();
    for (const particular of particulars) {
      const matches = !searchQuery || 
        particular.code?.toLowerCase().includes(searchQuery) ||
        particular.fullName?.toLowerCase().includes(searchQuery);
      if (matches) particularCount++;
    }

    const totalCount = projectCount + dfCount + trustCount + educationCount + healthCount + particularCount;

    return {
      all: totalCount,
      project: projectCount,
      twentyPercentDF: dfCount,
      trustFund: trustCount,
      specialEducationFund: educationCount,
      specialHealthFund: healthCount,
      particular: particularCount,
    };
  },
});
