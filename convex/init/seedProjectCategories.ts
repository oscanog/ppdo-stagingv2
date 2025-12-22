// convex/init/seedProjectCategories.ts

import { mutation } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Seed the database with default project categories
 * Can only be called by super_admin
 * This should be run once during initial setup
 * Can also be used to restore defaults if needed
 * 
 * SAFE TO RUN MULTIPLE TIMES - Will skip existing categories
 */
export const initializeDefaultCategories = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if user is super admin
    const user = await ctx.db.get(userId);
    if (!user || user.role !== "super_admin") {
      throw new Error("Only super_admin can initialize default categories");
    }

    const now = Date.now();

    // Define the 36 default project categories
    const defaultCategories = [
      {
        code: "SOCIAL_SERVICES",
        fullName: "Social Services",
        description: "General social service programs and projects",
        colorCode: "#FF6B9D",
        iconName: "users",
        displayOrder: 1,
      },
      {
        code: "ECONOMIC_SERVICES",
        fullName: "Economic Services",
        description: "Economic development and livelihood programs",
        colorCode: "#4CAF50",
        iconName: "trending-up",
        displayOrder: 2,
      },
      {
        code: "INFRASTRUCTURE_SERVICES",
        fullName: "Infrastructure Services",
        description: "Infrastructure development and maintenance projects",
        colorCode: "#FF9800",
        iconName: "construction",
        displayOrder: 3,
      },
      {
        code: "ENVIRONMENTAL_MGMT",
        fullName: "Environmental Management",
        description: "Environmental protection and conservation programs",
        colorCode: "#4CAF50",
        iconName: "leaf",
        displayOrder: 4,
      },
      {
        code: "HEALTH_SERVICES",
        fullName: "Health Services",
        description: "Healthcare programs and medical services",
        colorCode: "#F44336",
        iconName: "heart",
        displayOrder: 5,
      },
      {
        code: "EDUCATION_SERVICES",
        fullName: "Education Services",
        description: "Educational programs and school support",
        colorCode: "#2196F3",
        iconName: "book-open",
        displayOrder: 6,
      },
      {
        code: "SOCIAL_WELFARE_DEV",
        fullName: "Social Welfare & Development",
        description: "Social welfare programs and community development",
        colorCode: "#9C27B0",
        iconName: "heart-handshake",
        displayOrder: 7,
      },
      {
        code: "HOUSING_SETTLEMENTS",
        fullName: "Housing & Human Settlements",
        description: "Housing projects and resettlement programs",
        colorCode: "#795548",
        iconName: "home",
        displayOrder: 8,
      },
      {
        code: "CULTURE_SPORTS_REC",
        fullName: "Culture, Sports & Recreation",
        description: "Cultural preservation, sports, and recreational activities",
        colorCode: "#E91E63",
        iconName: "trophy",
        displayOrder: 9,
      },
      {
        code: "AGRICULTURE_FISHERIES",
        fullName: "Agriculture & Fisheries",
        description: "Agricultural development and fisheries programs",
        colorCode: "#8BC34A",
        iconName: "wheat",
        displayOrder: 10,
      },
      {
        code: "TRADE_INDUSTRY_INV",
        fullName: "Trade, Industry & Investment",
        description: "Trade promotion, industrial development, and investment facilitation",
        colorCode: "#607D8B",
        iconName: "briefcase",
        displayOrder: 11,
      },
      {
        code: "TOURISM_DEVELOPMENT",
        fullName: "Tourism Development",
        description: "Tourism promotion and destination development",
        colorCode: "#00BCD4",
        iconName: "plane",
        displayOrder: 12,
      },
      {
        code: "LABOR_EMPLOYMENT",
        fullName: "Labor & Employment",
        description: "Employment programs and labor welfare services",
        colorCode: "#3F51B5",
        iconName: "briefcase",
        displayOrder: 13,
      },
      {
        code: "TRANSPORTATION",
        fullName: "Transportation",
        description: "Transportation infrastructure and services",
        colorCode: "#9E9E9E",
        iconName: "truck",
        displayOrder: 14,
      },
      {
        code: "WATER_SANITATION",
        fullName: "Water Supply & Sanitation",
        description: "Water supply systems and sanitation facilities",
        colorCode: "#03A9F4",
        iconName: "droplet",
        displayOrder: 15,
      },
      {
        code: "ENERGY_ELECTRIFICATION",
        fullName: "Energy & Electrification",
        description: "Energy projects and rural electrification",
        colorCode: "#FFC107",
        iconName: "zap",
        displayOrder: 16,
      },
      {
        code: "ICT",
        fullName: "Information & Communications Technology",
        description: "ICT infrastructure and digital transformation projects",
        colorCode: "#673AB7",
        iconName: "wifi",
        displayOrder: 17,
      },
      {
        code: "DRRM",
        fullName: "Disaster Risk Reduction & Management",
        description: "Disaster preparedness, response, and recovery programs",
        colorCode: "#FF5722",
        iconName: "shield",
        displayOrder: 18,
      },
      {
        code: "CLIMATE_CHANGE",
        fullName: "Climate Change Adaptation & Mitigation",
        description: "Climate change programs and environmental resilience",
        colorCode: "#009688",
        iconName: "cloud",
        displayOrder: 19,
      },
      {
        code: "PUBLIC_SAFETY_SECURITY",
        fullName: "Public Safety & Security",
        description: "Public safety measures and security programs",
        colorCode: "#F44336",
        iconName: "shield-alert",
        displayOrder: 20,
      },
      {
        code: "PEACE_ORDER",
        fullName: "Peace & Order",
        description: "Peace and order maintenance programs",
        colorCode: "#795548",
        iconName: "shield-check",
        displayOrder: 21,
      },
      {
        code: "GOVERNANCE_ADMIN",
        fullName: "Governance & Administration",
        description: "Governance improvement and administrative efficiency programs",
        colorCode: "#607D8B",
        iconName: "building",
        displayOrder: 22,
      },
      {
        code: "LEGISLATIVE_SUPPORT",
        fullName: "Legislative Support",
        description: "Legislative services and support programs",
        colorCode: "#5C6BC0",
        iconName: "file-text",
        displayOrder: 23,
      },
      {
        code: "FINANCIAL_MGMT",
        fullName: "Financial Management",
        description: "Financial management and revenue generation programs",
        colorCode: "#4CAF50",
        iconName: "dollar-sign",
        displayOrder: 24,
      },
      {
        code: "PLANNING_DEVELOPMENT",
        fullName: "Planning & Development",
        description: "Development planning and coordination programs",
        colorCode: "#FF9800",
        iconName: "map",
        displayOrder: 25,
      },
      {
        code: "RESEARCH_STATISTICS",
        fullName: "Research, Statistics & Data Management",
        description: "Research programs and statistical data management",
        colorCode: "#9C27B0",
        iconName: "bar-chart",
        displayOrder: 26,
      },
      {
        code: "ASSET_PROPERTY_MGMT",
        fullName: "Asset & Property Management",
        description: "Asset management and property administration",
        colorCode: "#795548",
        iconName: "package",
        displayOrder: 27,
      },
      {
        code: "PROCUREMENT_LOGISTICS",
        fullName: "Procurement & Logistics",
        description: "Procurement services and logistics management",
        colorCode: "#607D8B",
        iconName: "shopping-cart",
        displayOrder: 28,
      },
      {
        code: "HR_DEVELOPMENT",
        fullName: "Human Resource Development",
        description: "Human resource training and development programs",
        colorCode: "#E91E63",
        iconName: "users",
        displayOrder: 29,
      },
      {
        code: "LEGAL_SERVICES",
        fullName: "Legal Services",
        description: "Legal assistance and advisory services",
        colorCode: "#3F51B5",
        iconName: "scale",
        displayOrder: 30,
      },
      {
        code: "CITIZEN_PARTICIPATION",
        fullName: "Citizen Participation & Transparency",
        description: "Programs promoting citizen engagement and government transparency",
        colorCode: "#00BCD4",
        iconName: "users",
        displayOrder: 31,
      },
      {
        code: "EXTERNAL_RELATIONS",
        fullName: "Inter-LGU & External Relations",
        description: "Inter-governmental relations and external partnerships",
        colorCode: "#673AB7",
        iconName: "globe",
        displayOrder: 32,
      },
      {
        code: "GENDER_DEVELOPMENT",
        fullName: "Gender & Development",
        description: "Gender equality and women empowerment programs",
        colorCode: "#FF6B9D",
        iconName: "users",
        displayOrder: 33,
      },
      {
        code: "YOUTH_DEVELOPMENT",
        fullName: "Youth Development",
        description: "Youth empowerment and development programs",
        colorCode: "#FFC107",
        iconName: "star",
        displayOrder: 34,
      },
      {
        code: "SENIOR_PWD_SERVICES",
        fullName: "Senior Citizens & PWD Services",
        description: "Programs for senior citizens and persons with disabilities",
        colorCode: "#9C27B0",
        iconName: "heart",
        displayOrder: 35,
      },
      {
        code: "INDIGENOUS_PEOPLES",
        fullName: "Indigenous Peoples Affairs",
        description: "Programs supporting indigenous peoples communities",
        colorCode: "#795548",
        iconName: "users",
        displayOrder: 36,
      },
      {
        code: "URBAN_DEVELOPMENT",
        fullName: "Urban Development",
        description: "Urban planning and city development programs",
        colorCode: "#607D8B",
        iconName: "building",
        displayOrder: 37,
      },
      {
        code: "RURAL_DEVELOPMENT",
        fullName: "Rural Development",
        description: "Rural area development and improvement programs",
        colorCode: "#8BC34A",
        iconName: "tractor",
        displayOrder: 38,
      },
    ];

    const insertedIds = [];
    const skippedCodes = [];

    for (const category of defaultCategories) {
      // Check if category already exists
      const existing = await ctx.db
        .query("projectCategories")
        .withIndex("code", (q) => q.eq("code", category.code))
        .first();

      if (existing) {
        console.log(`Category ${category.code} already exists, skipping`);
        skippedCodes.push(category.code);
        continue;
      }

      // Insert the category
      const id = await ctx.db.insert("projectCategories", {
        code: category.code,
        fullName: category.fullName,
        description: category.description,
        colorCode: category.colorCode,
        iconName: category.iconName,
        displayOrder: category.displayOrder,
        isActive: true,
        isSystemDefault: true, // Mark as system default
        usageCount: 0,
        createdBy: userId,
        createdAt: now,
        updatedAt: now,
      });

      insertedIds.push(id);
      console.log(`Inserted default category: ${category.code}`);
    }

    return {
      success: true,
      inserted: insertedIds.length,
      skipped: skippedCodes.length,
      total: defaultCategories.length,
      insertedIds,
      skippedCodes,
    };
  },
});