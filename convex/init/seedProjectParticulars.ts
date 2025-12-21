// convex/init/seedProjectParticulars.ts
import { mutation } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Seed the database with default project particulars
 * Can only be called by super_admin
 * This should be run once during initial setup
 * Can also be used to restore defaults if needed
 */
export const initializeDefaultParticulars = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if user is super admin
    const user = await ctx.db.get(userId);
    if (!user || user.role !== "super_admin") {
      throw new Error("Only super_admin can initialize default particulars");
    }

    const now = Date.now();

    // Define default project particulars with full names
    const defaultParticulars = [
      {
        code: "CONST_ROADS",
        fullName: "Construction of Roads",
        description: "New road construction projects",
        category: "Infrastructure",
        colorCode: "#424242",
        displayOrder: 1,
      },
      {
        code: "REPAIR_ROADS",
        fullName: "Repair of Roads",
        description: "Road maintenance and repair projects",
        category: "Infrastructure",
        colorCode: "#616161",
        displayOrder: 2,
      },
      {
        code: "CONST_BRIDGE",
        fullName: "Construction of Bridges",
        description: "New bridge construction projects",
        category: "Infrastructure",
        colorCode: "#795548",
        displayOrder: 3,
      },
      {
        code: "REPAIR_BRIDGE",
        fullName: "Repair of Bridges",
        description: "Bridge maintenance and repair projects",
        category: "Infrastructure",
        colorCode: "#8D6E63",
        displayOrder: 4,
      },
      {
        code: "WATER_SYSTEM",
        fullName: "Water System Development",
        description: "Water supply and distribution projects",
        category: "Utilities",
        colorCode: "#2196F3",
        displayOrder: 5,
      },
      {
        code: "DRAINAGE_SYSTEM",
        fullName: "Drainage System Development",
        description: "Drainage and flood control projects",
        category: "Utilities",
        colorCode: "#03A9F4",
        displayOrder: 6,
      },
      {
        code: "CONST_BUILDING",
        fullName: "Construction of Buildings",
        description: "New building construction projects",
        category: "Infrastructure",
        colorCode: "#FF9800",
        displayOrder: 7,
      },
      {
        code: "REPAIR_BUILDING",
        fullName: "Repair of Buildings",
        description: "Building maintenance and repair projects",
        category: "Infrastructure",
        colorCode: "#FFB74D",
        displayOrder: 8,
      },
      {
        code: "ELECTRIFICATION",
        fullName: "Electrification Projects",
        description: "Power supply and electrical infrastructure",
        category: "Utilities",
        colorCode: "#FFC107",
        displayOrder: 9,
      },
      {
        code: "HEALTH_FACILITY",
        fullName: "Health Facility Development",
        description: "Health centers and medical facility projects",
        category: "Social Services",
        colorCode: "#4CAF50",
        displayOrder: 10,
      },
      {
        code: "SCHOOL_FACILITY",
        fullName: "School Facility Development",
        description: "Educational facility projects",
        category: "Social Services",
        colorCode: "#8BC34A",
        displayOrder: 11,
      },
      {
        code: "SPORT_FACILITY",
        fullName: "Sports Facility Development",
        description: "Sports and recreation facility projects",
        category: "Social Services",
        colorCode: "#CDDC39",
        displayOrder: 12,
      },
      {
        code: "MARKET_FACILITY",
        fullName: "Market Facility Development",
        description: "Public market and trading facility projects",
        category: "Economic Development",
        colorCode: "#FF5722",
        displayOrder: 13,
      },
      {
        code: "TRANSPORT_TERMINAL",
        fullName: "Transport Terminal Development",
        description: "Bus and transport terminal projects",
        category: "Infrastructure",
        colorCode: "#9E9E9E",
        displayOrder: 14,
      },
      {
        code: "IRRIGATION_SYSTEM",
        fullName: "Irrigation System Development",
        description: "Agricultural irrigation projects",
        category: "Agriculture",
        colorCode: "#009688",
        displayOrder: 15,
      },
      {
        code: "STREET_LIGHTING",
        fullName: "Street Lighting Projects",
        description: "Public street lighting installation",
        category: "Utilities",
        colorCode: "#FFE082",
        displayOrder: 16,
      },
      {
        code: "WASTE_MANAGEMENT",
        fullName: "Waste Management Projects",
        description: "Solid waste management and disposal projects",
        category: "Environment",
        colorCode: "#66BB6A",
        displayOrder: 17,
      },
      {
        code: "DISASTER_FACILITY",
        fullName: "Disaster Response Facility",
        description: "Disaster preparedness and response facilities",
        category: "Public Safety",
        colorCode: "#F44336",
        displayOrder: 18,
      },
      {
        code: "COMM_CENTER",
        fullName: "Community Center Development",
        description: "Community halls and meeting facilities",
        category: "Social Services",
        colorCode: "#9C27B0",
        displayOrder: 19,
      },
      {
        code: "PARK_DEVELOPMENT",
        fullName: "Park and Recreation Development",
        description: "Public parks and green spaces",
        category: "Environment",
        colorCode: "#4CAF50",
        displayOrder: 20,
      },
    ];

    const insertedIds = [];

    for (const particular of defaultParticulars) {
      // Check if particular already exists
      const existing = await ctx.db
        .query("projectParticulars")
        .withIndex("code", (q) => q.eq("code", particular.code))
        .first();

      if (existing) {
        console.log(`Project particular ${particular.code} already exists, skipping`);
        continue;
      }

      // Insert the particular
      const id = await ctx.db.insert("projectParticulars", {
        code: particular.code,
        fullName: particular.fullName,
        description: particular.description,
        displayOrder: particular.displayOrder,
        isActive: true,
        isSystemDefault: true, // Mark as system default
        usageCount: 0,
        category: particular.category,
        colorCode: particular.colorCode,
        createdBy: userId,
        createdAt: now,
        updatedAt: now,
      });

      insertedIds.push(id);
      console.log(`Inserted default project particular: ${particular.code}`);
    }

    return {
      success: true,
      inserted: insertedIds.length,
      total: defaultParticulars.length,
      insertedIds,
    };
  },
});