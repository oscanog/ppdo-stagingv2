# Implementation Plan: Exclude Trashed Items from Dashboard Analytics

## Problem Statement

The dashboard analytics at `/dashboard/YYYY?fund=budget` currently includes items that are in the trash (where `isDeleted === true`). This causes data discrepancies between:
- The dashboard summary numbers
- The actual visible items in tables/lists
- The trash bin counts

This confuses app users who see inflated numbers that don't match the actual active data.

---

## Root Cause Analysis

### Current Implementation (BROKEN)

**File**: `convex/dashboard.ts`

The queries use `.collect()` without filtering out trashed items:

```typescript
// Line 35-37 - NO isDeleted FILTER
const projects = await ctx.db.query("projects").collect();
const budgetItems = await ctx.db.query("budgetItems").collect();
const breakdowns = await ctx.db.query("govtProjectBreakdowns").collect();

// Line 204, 216, 220, 224, 229-230 - NO isDeleted FILTER
const trustFunds = await ctx.db.query("trustFunds").collect();
const dfProjects = await ctx.db.query("twentyPercentDF").collect();
// ... etc
```

### Expected Implementation (CORRECT)

Other parts of the codebase already properly filter trashed items:

```typescript
// From convex/budgetItems.ts - CORRECT PATTERN
const items = await ctx.db
  .query("budgetItems")
  .filter((q) => q.neq(q.field("isDeleted"), true))
  .collect();

// From convex/lib/budgetAggregation.ts - CORRECT PATTERN
const items = await ctx.db
  .query("budgetItems")
  .filter((q) => q.neq(q.field("isDeleted"), true))
  .collect();
```

---

## Implementation Plan

### Phase 1: Create Helper Utilities (DRY Principle)

**File**: `convex/lib/dashboardQueries.ts` (NEW)

Create reusable query helpers for fetching active (non-deleted) records:

```typescript
/**
 * Helper functions for dashboard queries
 * All functions exclude trashed items (isDeleted === true)
 */

import { QueryCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

// Generic active record fetcher
export async function getActiveRecords<T extends string>(
  ctx: QueryCtx,
  tableName: T,
  options?: {
    limit?: number;
    filter?: (q: any) => any;
  }
): Promise<any[]> {
  let query = ctx.db
    .query(tableName)
    .filter((q) => q.neq(q.field("isDeleted"), true));

  if (options?.filter) {
    query = query.filter(options.filter);
  }

  const results = await query.collect();

  if (options?.limit) {
    return results.slice(0, options.limit);
  }

  return results;
}

// Specific entity fetchers for dashboard
export async function getActiveProjects(ctx: QueryCtx) {
  return ctx.db
    .query("projects")
    .filter((q) => q.neq(q.field("isDeleted"), true))
    .collect();
}

export async function getActiveBudgetItems(ctx: QueryCtx) {
  return ctx.db
    .query("budgetItems")
    .filter((q) => q.neq(q.field("isDeleted"), true))
    .collect();
}

export async function getActiveBreakdowns(ctx: QueryCtx) {
  return ctx.db
    .query("govtProjectBreakdowns")
    .filter((q) => q.neq(q.field("isDeleted"), true))
    .collect();
}

export async function getActiveTrustFunds(ctx: QueryCtx) {
  return ctx.db
    .query("trustFunds")
    .filter((q) => q.neq(q.field("isDeleted"), true))
    .collect();
}

export async function getActiveTwentyPercentDF(ctx: QueryCtx) {
  return ctx.db
    .query("twentyPercentDF")
    .filter((q) => q.neq(q.field("isDeleted"), true))
    .collect();
}

export async function getActiveSpecialEducationFunds(ctx: QueryCtx) {
  return ctx.db
    .query("specialEducationFunds")
    .filter((q) => q.neq(q.field("isDeleted"), true))
    .collect();
}

export async function getActiveSpecialHealthFunds(ctx: QueryCtx) {
  return ctx.db
    .query("specialHealthFunds")
    .filter((q) => q.neq(q.field("isDeleted"), true))
    .collect();
}

// Filter arrays in-memory (for already-fetched data)
export function filterActive<T extends { isDeleted?: boolean }>(items: T[]): T[] {
  return items.filter(item => !item.isDeleted);
}
```

---

### Phase 2: Update `getSummaryData` Query

**File**: `convex/dashboard.ts` (Lines 22-107)

**Changes**:

```typescript
export const getSummaryData = query({
    args: {
        includeInactive: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            return { yearStats: {} };
        }

        // BEFORE (BROKEN):
        // const projects = await ctx.db.query("projects").collect();
        // const budgetItems = await ctx.db.query("budgetItems").collect();
        // const breakdowns = await ctx.db.query("govtProjectBreakdowns").collect();

        // AFTER (FIXED):
        const projects = await ctx.db
            .query("projects")
            .filter((q) => q.neq(q.field("isDeleted"), true))
            .collect();
        
        const budgetItems = await ctx.db
            .query("budgetItems")
            .filter((q) => q.neq(q.field("isDeleted"), true))
            .collect();
        
        const breakdowns = await ctx.db
            .query("govtProjectBreakdowns")
            .filter((q) => q.neq(q.field("isDeleted"), true))
            .collect();

        // Rest of the function remains unchanged...
    }
});
```

---

### Phase 3: Update `getDashboardAnalytics` Query

**File**: `convex/dashboard.ts` (Lines 182-378)

**Changes for Fund Type Routing**:

```typescript
const fundType = args.fundType || "budget";

if (fundType === "trust") {
    // BEFORE (BROKEN):
    // const trustFunds = await ctx.db.query("trustFunds").collect();

    // AFTER (FIXED):
    const trustFunds = await ctx.db
        .query("trustFunds")
        .filter((q) => q.neq(q.field("isDeleted"), true))
        .collect();
    
    rawProjects = trustFunds;
    rawBudgetItems = trustFunds;
    
} else if (fundType === "twenty-percent-df") {
    // AFTER (FIXED):
    const dfProjects = await ctx.db
        .query("twentyPercentDF")
        .filter((q) => q.neq(q.field("isDeleted"), true))
        .collect();
    
    rawProjects = dfProjects;
    rawBudgetItems = dfProjects;
    
} else if (fundType === "education") {
    // AFTER (FIXED):
    const sefProjects = await ctx.db
        .query("specialEducationFunds")
        .filter((q) => q.neq(q.field("isDeleted"), true))
        .collect();
    
    rawProjects = sefProjects;
    rawBudgetItems = sefProjects;
    
} else if (fundType === "health") {
    // AFTER (FIXED):
    const shfProjects = await ctx.db
        .query("specialHealthFunds")
        .filter((q) => q.neq(q.field("isDeleted"), true))
        .collect();
    
    rawProjects = shfProjects;
    rawBudgetItems = shfProjects;
    
} else {
    // Default "budget"
    // AFTER (FIXED):
    rawProjects = await ctx.db
        .query("projects")
        .filter((q) => q.neq(q.field("isDeleted"), true))
        .collect();
    
    rawBudgetItems = await ctx.db
        .query("budgetItems")
        .filter((q) => q.neq(q.field("isDeleted"), true))
        .collect();
}

// Also fix breakdowns query (Line 236):
// BEFORE:
// allBreakdowns = await ctx.db.query("govtProjectBreakdowns").collect();

// AFTER:
allBreakdowns = await ctx.db
    .query("govtProjectBreakdowns")
    .filter((q) => q.neq(q.field("isDeleted"), true))
    .collect();
```

---

### Phase 4: Update `getDepartmentHierarchy` Query

**File**: `convex/dashboard.ts` (Lines 384-450)

```typescript
// BEFORE (Line 403):
// let budgetItems = await ctx.db.query("budgetItems").collect();

// AFTER:
let budgetItems = await ctx.db
    .query("budgetItems")
    .filter((q) => q.neq(q.field("isDeleted"), true))
    .collect();
```

---

### Phase 5: Update Search Queries

**File**: `convex/dashboard.ts` (Lines 600-680)

Update all search queries to exclude trashed items:

```typescript
// Search Projects (Line 644)
// BEFORE:
// const projects = await ctx.db.query("projects").collect();

// AFTER:
const projects = await ctx.db
    .query("projects")
    .filter((q) => q.neq(q.field("isDeleted"), true))
    .collect();

// Search Budgets (Line 662)
// BEFORE:
// const budgets = await ctx.db.query("budgetItems").collect();

// AFTER:
const budgets = await ctx.db
    .query("budgetItems")
    .filter((q) => q.neq(q.field("isDeleted"), true))
    .collect();
```

---

### Phase 6: Add Data Integrity Verification

**File**: `convex/dashboard.ts` (Add to return value)

Add metadata to help debug data consistency:

```typescript
return {
    metrics,
    departmentBreakdown,
    officeBreakdown,
    timeSeriesData,
    recentActivities,
    chartData,
    topCategories,
    filters: {
        appliedFilters: args,
        resultCount: {
            projects: allProjects.length,
            budgetItems: allBudgetItems.length,
        }
    },
    // NEW: Add metadata for debugging
    _metadata: {
        excludesTrashed: true,
        queryTimestamp: Date.now(),
        // Optional: include counts of trashed items for comparison
        trashedCounts: {
            projects: rawProjectsAll.filter(p => p.isDeleted).length,
            budgetItems: rawBudgetItemsAll.filter(b => b.isDeleted).length,
        }
    }
};
```

---

### Phase 7: Add Regression Tests

**File**: `convex/__tests__/dashboard.test.ts` (NEW)

```typescript
import { test, expect } from "@jest/globals";
import { getDashboardAnalytics, getSummaryData } from "../dashboard";

describe("Dashboard Analytics - Trash Exclusion", () => {
    test("should exclude trashed projects from metrics", async () => {
        // Setup: Create active and trashed projects
        // ...
        
        const result = await getDashboardAnalytics(ctx, {
            fundType: "budget",
            fiscalYearId: "test-year-id"
        });
        
        // Verify trashed projects not counted
        expect(result.metrics.totalProjects).toBe(expectedActiveCount);
    });
    
    test("should exclude trashed budget items from financial totals", async () => {
        // Setup: Create active and trashed budget items with different amounts
        // ...
        
        const result = await getDashboardAnalytics(ctx, {
            fundType: "budget"
        });
        
        // Verify trashed item amounts not included
        expect(result.metrics.totalBudgetAllocated).toBe(expectedActiveTotal);
    });
    
    test("should exclude trashed items across all fund types", async () => {
        const fundTypes = ["budget", "trust", "twenty-percent-df", "education", "health"];
        
        for (const fundType of fundTypes) {
            const result = await getDashboardAnalytics(ctx, { fundType });
            
            // Verify no trashed items in results
            const allItems = [...result._metadata.trashedCounts];
            expect(allItems.every(count => count === 0)).toBe(true);
        }
    });
});
```

---

## Alternative: In-Memory Filtering (Quick Fix)

If database query changes are not feasible immediately, use in-memory filtering:

```typescript
// Quick fix pattern (less efficient but works immediately)
const projects = (await ctx.db.query("projects").collect())
    .filter(p => !p.isDeleted);

const budgetItems = (await ctx.db.query("budgetItems").collect())
    .filter(b => !b.isDeleted);
```

**⚠️ Warning**: This is less efficient as it loads all records (including trashed) into memory before filtering. Use database-level filtering for production.

---

## Implementation Checklist

### Step 1: Update `convex/dashboard.ts`
- [ ] Line 35-37: Add `isDeleted` filter to `getSummaryData`
- [ ] Line 204: Add filter for `trustFunds` query
- [ ] Line 216: Add filter for `twentyPercentDF` query
- [ ] Line 220: Add filter for `specialEducationFunds` query
- [ ] Line 224: Add filter for `specialHealthFunds` query
- [ ] Line 229-230: Add filters for default `projects` and `budgetItems` queries
- [ ] Line 236: Add filter for `govtProjectBreakdowns` query
- [ ] Line 403: Add filter for `getDepartmentHierarchy` budgetItems
- [ ] Line 644: Add filter for search projects
- [ ] Line 662: Add filter for search budgets

### Step 2: TypeScript Validation
- [ ] Run `npx convex dev` to check for type errors
- [ ] Run `npx tsc --noEmit` to verify TypeScript compilation

### Step 3: Testing
- [ ] Test dashboard with `?fund=budget`
- [ ] Test dashboard with `?fund=trust`
- [ ] Test dashboard with `?fund=twenty-percent-df`
- [ ] Test dashboard with `?fund=education`
- [ ] Test dashboard with `?fund=health`
- [ ] Verify trashed items don't appear in counts
- [ ] Verify active items still appear correctly

### Step 4: UI Verification
- [ ] Compare dashboard numbers with table view
- [ ] Compare dashboard numbers with trash bin count
- [ ] Verify "Total Projects" matches actual visible projects

---

## Expected Results After Fix

### Before Fix (INCORRECT)
```
Dashboard shows:
- Total Projects: 150 (includes 25 trashed)
- Total Budget: ₱50,000,000 (includes ₱10,000,000 trashed)

Trash Bin shows:
- Trashed Projects: 25

Actual visible projects in table: 125
User confusion: "Why does dashboard say 150 but I only see 125?"
```

### After Fix (CORRECT)
```
Dashboard shows:
- Total Projects: 125 (active only)
- Total Budget: ₱40,000,000 (active only)

Trash Bin shows:
- Trashed Projects: 25

Actual visible projects in table: 125
User clarity: "Dashboard matches what I see!"
```

---

## Related Files to Review

These files already properly exclude trashed items and can be used as reference:

1. `convex/budgetItems.ts` - Lines 26, 222, 239
2. `convex/lib/budgetAggregation.ts` - Line 25
3. `convex/lib/projectAggregation.ts` - Line 26
4. `convex/govtProjects.ts` - Lines 384, 393, 664, 669
5. `convex/fiscalYears.ts` - Lines 259, 266, 275
6. `convex/trash.ts` - Lines 104, 118

---

## Performance Considerations

1. **Indexes**: All tables have `isDeleted` indexes for efficient filtering
2. **Query Plan**: Convex query optimizer will use the index when filtering on `isDeleted`
3. **Memory**: Database-level filtering prevents loading trashed records into memory
4. **Network**: Less data transferred from database to application

---

## Rollback Plan

If issues occur after deployment:

1. Revert the specific commits changing `convex/dashboard.ts`
2. Redeploy with `npx convex deploy`
3. Monitor error rates and user reports

---

## Communication Plan

After deployment, communicate to users:

> **Dashboard Data Accuracy Improvement**
> 
> We've updated the dashboard to exclude deleted/trashed items from summary statistics. 
> You may notice that some numbers have decreased - this is expected and reflects the 
> true count of active records. Previously, trashed items were incorrectly included in 
> totals. The trash bin still shows your deleted items and they can be restored at any time.
