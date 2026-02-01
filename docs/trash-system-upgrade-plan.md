# Trash System Upgrade Implementation Plan

## Overview
Upgrade the trash system to show a confirmation modal with a summary of all affected items before moving to trash, handling all cascade scenarios in the hierarchy.

## Hierarchy Context
```
budgetItems (Level 1 - Grandparent)
└── projects (Level 2 - Parent)
    ├── govtProjectBreakdowns (Level 3 - Child)
    └── inspections (Level 4 - No trash)
```

---

## Phase 1: Backend Implementation (Convex)

### Task 1.1: Create `getTrashPreview` Query Endpoint

**File:** `convex/trash.ts` (new file)

**Purpose:** Calculate and return the complete cascade impact before trashing an item.

**Function Signature:**
```typescript
export const getTrashPreview = query({
  args: {
    entityType: v.union(
      v.literal("budgetItem"),
      v.literal("project"),
      v.literal("breakdown")
    ),
    entityId: v.id("budgetItems"), // Generic ID handling
  },
  handler: async (ctx, args): Promise<TrashPreviewResult> => {
    // Implementation
  },
});
```

**Return Types:**

```typescript
// Base item info
type EntityInfo = {
  id: string;
  name: string; // particulars or projectName
  type: "budgetItem" | "project" | "breakdown";
};

// Cascade counts
type CascadeCounts = {
  projects: number;
  breakdowns: number;
  inspections: number; // Not deleted but affected
  totalFinancialImpact: {
    allocated: number;
    utilized: number;
    obligated: number;
  };
};

// Detailed item list
type AffectedItem = {
  id: string;
  name: string;
  type: "project" | "breakdown";
  parentId: string;
  financials: {
    allocated?: number;
    utilized?: number;
  };
};

// Main result
export type TrashPreviewResult = {
  targetItem: EntityInfo;
  cascadeCounts: CascadeCounts;
  affectedItems: {
    projects: AffectedItem[];
    breakdowns: AffectedItem[];
  };
  warnings: string[]; // e.g., "This item has active inspections"
  canDelete: boolean; // false if blocking conditions
};
```

**Implementation Logic:**

1. **Budget Item Preview:**
   ```typescript
   // 1. Get budget item
   const budgetItem = await ctx.db.get(args.entityId);
   
   // 2. Find all projects
   const projects = await ctx.db
     .query("projects")
     .withIndex("budgetItemId", q => q.eq("budgetItemId", args.entityId))
     .filter(q => q.neq(q.field("isDeleted"), true))
     .collect();
   
   // 3. For each project, find breakdowns
   const allBreakdowns = [];
   for (const project of projects) {
     const breakdowns = await ctx.db
       .query("govtProjectBreakdowns")
       .withIndex("projectId", q => q.eq("projectId", project._id))
       .filter(q => q.neq(q.field("isDeleted"), true))
       .collect();
     allBreakdowns.push(...breakdowns);
   }
   
   // 4. Calculate totals
   return {
     targetItem: { id: budgetItem._id, name: budgetItem.particulars, type: "budgetItem" },
     cascadeCounts: {
       projects: projects.length,
       breakdowns: allBreakdowns.length,
       inspections: 0, // Not cascading to inspections
       totalFinancialImpact: calculateTotals(projects),
     },
     affectedItems: {
       projects: projects.map(p => ({...})),
       breakdowns: allBreakdowns.map(b => ({...})),
     },
     warnings: [],
     canDelete: true,
   };
   ```

### Task 1.2: Create `moveToTrashWithConfirmation` Mutation

**File:** `convex/trash.ts`

**Purpose:** Execute trash operation after confirmation (reuse existing logic).

**Function Signature:**
```typescript
export const moveToTrashWithConfirmation = mutation({
  args: {
    entityType: v.union(v.literal("budgetItem"), v.literal("project"), v.literal("breakdown")),
    entityId: v.string(),
    reason: v.optional(v.string()),
    confirmedCascade: v.boolean(), // User confirmed they saw the preview
  },
  handler: async (ctx, args) => {
    // Validate user confirmed
    if (!args.confirmedCascade) {
      throw new Error("User must confirm cascade preview before deleting");
    }
    
    // Delegate to existing trash functions
    switch (args.entityType) {
      case "budgetItem":
        return await moveBudgetItemToTrash(ctx, args.entityId, args.reason);
      case "project":
        return await moveProjectToTrash(ctx, args.entityId, args.reason);
      case "breakdown":
        return await moveBreakdownToTrash(ctx, args.entityId, args.reason);
    }
  },
});
```

### Task 1.3: Create `getRestorePreview` Query Endpoint

**File:** `convex/trash.ts`

**Purpose:** Preview what will be restored (for restore confirmation modal).

**Return Type:**
```typescript
export type RestorePreviewResult = {
  targetItem: EntityInfo;
  cascadeRestoreCounts: {
    projects: number;
    breakdowns: number;
  };
  orphanedItems: {
    // Items that will be "orphaned" (active children of deleted parent)
    projects: EntityInfo[];
  };
  parentStatus: {
    budgetItemId?: string;
    budgetItemName?: string;
    isParentDeleted: boolean;
  };
  warnings: string[];
  canRestore: boolean;
};
```

**Scenarios to Handle:**

1. **Restoring Budget Item:** Show all children that will be restored
2. **Restoring Project:** 
   - Check if parent budget item is deleted (orphan warning)
   - Show breakdowns that will be restored
3. **Restoring Breakdown:**
   - Check if parent project is deleted
   - Show warning if parent chain broken

---

## Phase 2: Frontend Components

### Task 2.1: Create `TrashConfirmationModal` Component

**File:** `components/modals/TrashConfirmationModal.tsx`

**Purpose:** Show cascade summary before moving to trash.

**Props:**
```typescript
interface TrashConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason?: string) => void;
  onCancel: () => void;
  previewData: TrashPreviewResult | null;
  isLoading: boolean;
  entityType: "budgetItem" | "project" | "breakdown";
  entityName: string;
}
```

**UI Sections:**

1. **Header:**
   - Icon: Trash2 with warning color
   - Title: "Move to Trash"
   - Subtitle: "Review affected items before confirming"

2. **Target Item Card:**
   ```
   ┌─────────────────────────────────────┐
   │ 🗂️  Budget Item: GAD 2025          │
   │    ID: k57eavzkpm7yrjz...          │
   └─────────────────────────────────────┘
   ```

3. **Cascade Impact Summary (Key Section):**
   ```
   ┌─────────────────────────────────────┐
   │  📊 AFFECTED ITEMS                  │
   │                                     │
   │  Projects:        5 items           │
   │  Breakdowns:      23 items          │
   │  Inspections:     8 (not deleted)   │
   │                                     │
   │  💰 FINANCIAL IMPACT                │
   │  Allocated:  ₱476,281,784          │
   │  Utilized:   ₱248,976,479          │
   │  Obligated:  ₱150,000,000          │
   └─────────────────────────────────────┘
   ```

4. **Detailed List (Collapsible):**
   - Accordion showing list of affected projects
   - Each project shows its breakdowns
   - Checkbox to "show financial details"

5. **Warnings Section:**
   - Amber alert box for any warnings
   - e.g., "⚠️ This budget item has projects with active inspections"

6. **Reason Input (Optional):**
   - Text area for deletion reason
   - Placeholder: "Reason for deletion (optional)"

7. **Footer Buttons:**
   - "Cancel" (outline)
   - "Move to Trash" (destructive red)

**Loading State:**
- Show skeleton while previewData is null
- Spinner with text "Calculating affected items..."

### Task 2.2: Create `RestoreConfirmationModal` Component

**File:** `components/modals/RestoreConfirmationModal.tsx`

**Purpose:** Show restore preview with orphan warnings.

**Props:**
```typescript
interface RestoreConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  previewData: RestorePreviewResult | null;
  isLoading: boolean;
}
```

**UI Sections:**

1. **Header:**
   - Icon: RotateCcw
   - Title: "Restore from Trash"

2. **Target Item Card:**
   - Show item being restored

3. **Cascade Restore Summary:**
   - "Will restore X projects and Y breakdowns"

4. **Orphan Warning (Critical):**
   ```
   ┌─────────────────────────────────────┐
   │  ⚠️ PARENT ITEM DELETED             │
   │                                     │
   │  This project belongs to:           │
   │  Budget Item "20% DF" (DELETED)     │
   │                                     │
   │  Options:                           │
   │  ○ Restore parent budget item too   │
   │  ○ Keep as orphaned project         │
   └─────────────────────────────────────┘
   ```

5. **Footer Buttons:**
   - "Cancel"
   - "Restore" (green)

### Task 2.3: Create `TrashSummaryCard` Component

**File:** `components/trash/TrashSummaryCard.tsx`

**Purpose:** Reusable card for showing cascade counts.

**Props:**
```typescript
interface TrashSummaryCardProps {
  title: string;
  icon: React.ReactNode;
  counts: {
    label: string;
    value: number;
    color?: string;
  }[];
  financials?: {
    allocated: number;
    utilized: number;
    obligated?: number;
  };
}
```

---

## Phase 3: Integration & Hook Updates

### Task 3.1: Create `useTrashConfirmation` Hook

**File:** `hooks/useTrashConfirmation.ts`

**Purpose:** Manage trash confirmation flow state.

```typescript
export function useTrashConfirmation() {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [pendingTrashItem, setPendingTrashItem] = useState<{
    type: "budgetItem" | "project" | "breakdown";
    id: string;
    name: string;
  } | null>(null);
  
  // Fetch preview data
  const previewData = useQuery(
    api.trash.getTrashPreview,
    pendingTrashItem
      ? { entityType: pendingTrashItem.type, entityId: pendingTrashItem.id }
      : "skip"
  );
  
  const moveToTrashMutation = useMutation(api.trash.moveToTrashWithConfirmation);
  
  const initiateTrash = (type: string, id: string, name: string) => {
    setPendingTrashItem({ type, id, name });
    setIsConfirmationOpen(true);
  };
  
  const confirmTrash = async (reason?: string) => {
    if (!pendingTrashItem) return;
    
    await moveToTrashMutation({
      entityType: pendingTrashItem.type,
      entityId: pendingTrashItem.id,
      reason,
      confirmedCascade: true,
    });
    
    // Reset state
    setIsConfirmationOpen(false);
    setPendingTrashItem(null);
  };
  
  return {
    isConfirmationOpen,
    setIsConfirmationOpen,
    pendingTrashItem,
    previewData,
    initiateTrash,
    confirmTrash,
  };
}
```

### Task 3.2: Update Existing Components

**Files to Update:**

1. **Budget Items Table/Card:**
   - Change delete button to call `initiateTrash("budgetItem", id, name)`
   - Instead of direct delete

2. **Projects Table/Card:**
   - Same for projects

3. **Breakdowns Table/Card:**
   - Same for breakdowns

---

## Phase 4: All Scenario Handling

### Scenario Matrix: UI/UX Behavior

| Scenario | Modal Content | Warnings | Actions |
|----------|---------------|----------|---------|
| **Budget Item** with projects + breakdowns | Show 2-level cascade tree | "X projects and Y breakdowns will be moved to trash" | Cancel, Move to Trash |
| **Budget Item** with no projects | "No child items" | None | Cancel, Move to Trash |
| **Project** with breakdowns | Show breakdowns list | "X breakdowns will be moved to trash" | Cancel, Move to Trash |
| **Project** with inspections | Show breakdowns + note | "⚠️ This project has X inspections that will remain active" | Cancel, Move to Trash |
| **Breakdown** (leaf) | "Single item" | None | Cancel, Move to Trash |
| **Bulk Delete** (multiple items) | Show aggregate counts | "Multiple items selected" | Cancel, Move Selected to Trash |

### Scenario Matrix: Restore

| Scenario | Modal Content | Warnings | Actions |
|----------|---------------|----------|---------|
| **Budget Item** restore | Show all children to restore | None | Cancel, Restore |
| **Project** restore (parent active) | Show breakdowns to restore | None | Cancel, Restore |
| **Project** restore (parent deleted) | Show breakdowns | "⚠️ Parent budget item is deleted" | Cancel, Restore Project Only, Restore Parent Too |
| **Breakdown** restore (parent active) | Single item | None | Cancel, Restore |
| **Breakdown** restore (parent deleted) | Single item | "⚠️ Parent project is deleted" | Cancel, Restore Anyway |

---

## Phase 5: Testing Scenarios

### Backend Tests

1. **Preview Accuracy:**
   - Create budget item with 3 projects, each with 5 breakdowns
   - Call getTrashPreview
   - Verify counts: 3 projects, 15 breakdowns

2. **Cascade Execution:**
   - Delete budget item
   - Verify all children marked isDeleted
   - Verify metrics recalculated

3. **Orphan Detection:**
   - Delete budget item
   - Try restore project (without parent)
   - Verify getRestorePreview shows parent deleted

### Frontend Tests

1. **Modal Display:**
   - Click delete on budget item
   - Verify modal shows loading then preview
   - Verify numbers match backend

2. **Confirmation Flow:**
   - Click delete
   - Review preview
   - Click cancel (should not delete)
   - Click delete again
   - Confirm (should delete)

3. **Edge Cases:**
   - Empty cascade (no children) - should show "No affected items"
   - Large cascade (100+ items) - should handle pagination/virtualization
   - Network error - should show error message

---

## Implementation Timeline

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| Phase 1 | Backend: getTrashPreview, moveToTrashWithConfirmation, getRestorePreview | 4-6 hours |
| Phase 2 | Frontend: TrashConfirmationModal, RestoreConfirmationModal, TrashSummaryCard | 6-8 hours |
| Phase 3 | Integration: useTrashConfirmation hook, update existing components | 4-6 hours |
| Phase 4 | Testing: All scenarios, edge cases | 4-6 hours |
| **Total** | | **18-26 hours** |

---

## Files to Create/Modify

### New Files
```
convex/
└── trash.ts (NEW - main trash logic with previews)

components/
└── modals/
    ├── TrashConfirmationModal.tsx (NEW)
    └── RestoreConfirmationModal.tsx (NEW)
└── trash/
    ├── TrashSummaryCard.tsx (NEW)
    └── AffectedItemsList.tsx (NEW - collapsible tree)

hooks/
└── useTrashConfirmation.ts (NEW)
```

### Modified Files
```
convex/
├── budgetItems.ts (refactor to use trash.ts)
├── projects.ts (refactor to use trash.ts)
└── govtProjects.ts (refactor to use trash.ts)

components/
└── tables/
    ├── BudgetItemsTable.tsx (update delete button)
    ├── ProjectsTable.tsx (update delete button)
    └── BreakdownsTable.tsx (update delete button)
```

---

## Success Criteria

1. ✅ User sees preview of all affected items before trashing
2. ✅ Financial impact is clearly displayed
3. ✅ All cascade scenarios are handled
4. ✅ Orphan warnings shown on restore
5. ✅ User can cancel at any point
6. ✅ Idempotent operations (safe to retry)
7. ✅ Loading states handled gracefully

---

*Plan Version: 1.0*
*Focus: Backend First, Then Frontend*
*Priority: High (Data Safety)*
