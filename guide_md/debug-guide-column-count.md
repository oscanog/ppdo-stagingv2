# 🐛 Bug Fix Guide: Column Visibility Panel Counter Not Updating

## Problem Summary
The column visibility counter in the sidebar panel is **NOT updating reactively** when users toggle column visibility. The counter should show "9/10" when one column is hidden, but it stays at "9/10" even after showing the column again (should be "10/10").

---

## Current Behavior (BROKEN ❌)
1. User clicks eye icon to hide "Budget Allocated" column
2. Counter shows: **9/10** ✅ (correct)
3. User clicks eye icon again to show the column
4. Counter STILL shows: **9/10** ❌ (should be 10/10)

## Expected Behavior (WHAT WE NEED ✅)
1. User clicks eye icon to hide column
2. Counter shows: **9/10**
3. User clicks eye icon to show column
4. Counter updates to: **10/10** ← THIS IS BROKEN

---

## Root Cause Analysis

### What IS Working ✅
- Console logs show the calculation is **CORRECT**:
  ```
  First click:  hiddenColumns: 1, visibleColumns: 9  ✅
  Second click: hiddenColumns: 0, visibleColumns: 10 ✅
  ```
- The `hiddenColumns` Set is updating correctly
- The column hiding/showing on canvas works perfectly
- The eye icon toggles correctly (Eye ↔ EyeOff)

### What's NOT Working ❌
- The UI counter text "9/10" is **not re-rendering** when the Set changes
- React is not detecting the `hiddenColumns` Set as changed
- The `TableGroup` component's `useMemo` recalculates correctly, but the component doesn't re-render

### Why It's Failing
**React doesn't detect Set mutations as state changes** because Sets are reference types. Even though we create a new Set with `new Set(prev)`, React's shallow comparison might not trigger re-renders in child components.

---

## Technical Context

### Files Involved
1. **`PrintPreviewModal.tsx`** - Parent component managing `hiddenCanvasColumns` state
2. **`ColumnVisibilityPanel.tsx`** - The sidebar panel component
3. **`TableGroup` component** (inside ColumnVisibilityPanel.tsx) - Shows the counter

### State Flow
```
PrintPreviewModal (state)
  ↓ hiddenCanvasColumns: Set<string>
ColumnVisibilityPanel (prop)
  ↓ hiddenColumns: Set<string>
TableGroup (prop)
  ↓ useMemo calculates count
  ✗ UI doesn't update (BROKEN HERE)
```

### Current Implementation (What We Tried)
```typescript
// PrintPreviewModal.tsx
const [hiddenCanvasColumns, setHiddenCanvasColumns] = useState<Set<string>>(new Set());

const handleToggleCanvasColumn = useCallback((tableId: string, columnKey: string) => {
  setHiddenCanvasColumns(prev => {
    const next = new Set(prev); // Creates NEW Set
    const fullKey = `${tableId}.${columnKey}`;
    
    if (next.has(fullKey)) {
      next.delete(fullKey);
    } else {
      next.add(fullKey);
    }
    
    return next; // Returns new Set reference
  });
  state.setIsDirty(true);
}, [state]);

// TableGroup component
const { visibleCount, totalCount } = useMemo(() => {
  let hidden = 0;
  
  table.columns.forEach(col => {
    const fullKey = `${table.tableId}.${col.key}`;
    if (hiddenColumns.has(fullKey)) {
      hidden++;
    }
  });
  
  return {
    visibleCount: table.columns.length - hidden,
    totalCount: table.columns.length
  };
}, [table.tableId, table.columns, hiddenColumns]);

// JSX renders:
<span>{visibleCount}/{totalCount}</span>
```

**We also tried:**
- Adding `hiddenColumns.size` as a primitive tracker ❌ Didn't work
- Changing component key to force remount ❌ Didn't work
- Multiple useMemo dependency variations ❌ Didn't work

---

## Solution Requirements

### ⚠️ CRITICAL: Do NOT Break These
- **Existing column hide/show functionality** - Works perfectly, don't touch it
- **Canvas element filtering and redistribution** - Works perfectly, don't touch it
- **Eye icon toggle states** - Works perfectly, don't touch it
- **Bulk "Show All" / "Hide All" buttons** - Works perfectly, don't touch it
- **Keyboard shortcuts (Ctrl+B)** - Works perfectly, don't touch it
- **Panel collapse/expand** - Works perfectly, don't touch it
- **All existing styles and animations** - Don't change any Tailwind classes

### ✅ What You MUST Fix
**Only fix the counter display reactivity.** The counter badge showing "X/Y" in the TableGroup header must update immediately when columns are toggled.

---

## Recommended Approach (Best Practice)

### Option 1: Convert Set to Array for Reactivity ⭐ RECOMMENDED
Instead of passing a Set, convert it to an array or use a version number:

```typescript
// In PrintPreviewModal.tsx
const [hiddenColumnsVersion, setHiddenColumnsVersion] = useState(0);

const handleToggleCanvasColumn = useCallback((tableId: string, columnKey: string) => {
  setHiddenCanvasColumns(prev => {
    const next = new Set(prev);
    const fullKey = `${tableId}.${columnKey}`;
    
    if (next.has(fullKey)) {
      next.delete(fullKey);
    } else {
      next.add(fullKey);
    }
    
    return next;
  });
  setHiddenColumnsVersion(v => v + 1); // Increment version to trigger re-render
  state.setIsDirty(true);
}, [state]);

// Pass version to ColumnVisibilityPanel
<ColumnVisibilityPanel
  hiddenColumnsVersion={hiddenColumnsVersion} // NEW prop
  // ... other props
/>

// In TableGroup useMemo dependencies
}, [table.tableId, table.columns, hiddenColumns, hiddenColumnsVersion]);
```

### Option 2: Use Array Instead of Set
```typescript
const [hiddenCanvasColumns, setHiddenCanvasColumns] = useState<string[]>([]);

const handleToggleCanvasColumn = useCallback((tableId: string, columnKey: string) => {
  setHiddenCanvasColumns(prev => {
    const fullKey = `${tableId}.${columnKey}`;
    
    if (prev.includes(fullKey)) {
      return prev.filter(k => k !== fullKey); // New array
    } else {
      return [...prev, fullKey]; // New array
    }
  });
  state.setIsDirty(true);
}, [state]);

// Convert to Set only where needed for O(1) lookup
const hiddenColumnsSet = useMemo(() => new Set(hiddenCanvasColumns), [hiddenCanvasColumns]);
```

### Option 3: Force Re-render with Key Prop
```typescript
// In ColumnVisibilityPanel
const hiddenKeysString = useMemo(() => 
  Array.from(hiddenColumns).sort().join(','), 
  [hiddenColumns]
);

// Use as dependency
}, [table, hiddenKeysString]);
```

---

## Implementation Steps

### Step 1: Diagnose First
Add this temporary logging to verify the issue:
```typescript
// In TableGroup component
useEffect(() => {
  console.log('🔄 TableGroup re-rendered', {
    visibleCount,
    totalCount,
    hiddenColumnsSize: hiddenColumns.size
  });
}, [visibleCount, totalCount, hiddenColumns]);
```

Check if the component re-renders but the values don't change, or if it doesn't re-render at all.

### Step 2: Choose Best Solution
Based on diagnosis, pick the cleanest approach that:
- Ensures React detects state changes
- Maintains O(1) Set lookup performance for filtering
- Doesn't require refactoring all existing code

### Step 3: Implement Minimally
- **Only modify state management** for reactivity tracking
- **Keep all existing logic** for column filtering, redistribution, etc.
- **Test the counter** updates immediately on toggle

### Step 4: Clean Up
- Remove console.logs after confirming fix works
- Ensure no performance regressions
- Verify smooth UX transitions

---

## Testing Checklist

After implementing the fix, manually verify:

1. **Counter Updates**
   - [ ] Shows "10/10" initially (all visible)
   - [ ] Shows "9/10" after hiding one column
   - [ ] Shows "10/10" after showing it again
   - [ ] Shows "8/10" after hiding two columns
   - [ ] Updates immediately (no delay)

2. **Existing Features Still Work**
   - [ ] Columns hide/show on canvas correctly
   - [ ] Table width redistributes properly
   - [ ] Borders adjust automatically
   - [ ] Eye icons toggle correctly
   - [ ] "Show All" button works
   - [ ] "Hide All" button works
   - [ ] Panel collapse/expand works
   - [ ] Ctrl+B keyboard shortcut works

3. **Performance**
   - [ ] No lag when toggling columns
   - [ ] No unnecessary re-renders
   - [ ] Smooth animations maintained

---

## Code Context

### Current File Structure
```
app/dashboard/project/[year]/components/
├── PrintPreviewModal.tsx          ← Parent component with state
├── ColumnVisibilityPanel.tsx      ← Panel component
│   ├── ColumnVisibilityPanel      ← Main panel
│   ├── TableGroup                 ← Counter display (BROKEN)
│   └── ColumnItem                 ← Eye toggle buttons
└── ... (other files)
```

### Key Data Flow
```typescript
// Column key format
const fullKey = `${tableId}.${columnKey}`;
// Example: "main-table.budgetAllocated"

// Hidden columns stored as Set
hiddenCanvasColumns = Set<string> {
  "main-table.budgetAllocated",
  "main-table.obligatedBudget"
}

// Counter calculation
visibleCount = totalColumns - hiddenColumns.size
// Example: 10 - 2 = 8
```

---

## Success Criteria

**The fix is successful when:**
1. ✅ Counter shows correct count immediately after toggle
2. ✅ All existing features continue working unchanged
3. ✅ No console errors or warnings
4. ✅ Smooth user experience (no jank, no delays)
5. ✅ Code follows React best practices for state management

---

## Additional Notes

- **Performance is critical**: We're dealing with print preview of large tables
- **User expects instant feedback**: Counter must update immediately when clicking eye icon
- **Don't over-engineer**: Keep the solution simple and maintainable
- **localStorage works fine**: The issue is NOT with persistence, only with React reactivity

---

## Questions to Ask Yourself

1. Is React detecting the state change? (Add useEffect to verify)
2. Is the useMemo recalculating? (Add console.log inside useMemo)
3. Is the component re-rendering? (Add console.log in component body)
4. Are we comparing references correctly? (Set vs primitive types)
5. What's the minimal change needed to fix just the counter?

---

## Expected Deliverable

**Provide updated code for:**
1. `PrintPreviewModal.tsx` (if state management needs adjustment)
2. `ColumnVisibilityPanel.tsx` (if props or component logic needs adjustment)

**With:**
- ✅ Clear comments explaining the fix
- ✅ Only the necessary changes (don't refactor unrelated code)
- ✅ No breaking changes to existing features
- ✅ Best practice React patterns for state reactivity

---

**Good luck! Remember: You're a senior UI/UX developer. Keep it clean, simple, and user-focused. The user should see the counter update instantly with zero lag. 🎯**
