# Breakdown Cleanup Implementation Guide

## Quick Summary

**Scope**: Delete ~17 redundant files in `app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/` that duplicate the centralized library at `components/ppdo/breakdown/`.

**Risk Level**: LOW - The page.tsx already imports from centralized library.

**Estimated Time**: 2-3 hours

---

## Pre-Flight Checklist

Before starting cleanup:

```bash
# 1. Create backup branch
git checkout -b backup/breakdown-cleanup
git checkout -b consolidation/breakdown-cleanup

# 2. Verify current state builds
cd c:\ppdo\ppdo-next
npm run build

# 3. Run TypeScript check
npx tsc --noEmit --skipLibCheck
```

Expected: Both commands should pass successfully.

---

## Phase 1: File Analysis

Verify which files are safe to delete by checking imports:

```bash
# Check if page.tsx imports from local components
grep -r "from \"\.\/components\"" app/dashboard/project/\[year\]/\[particularId\]/\[projectbreakdownId\]/page.tsx

# Check for local type imports
grep -r "from \"\.\/types\"" app/dashboard/project/\[year\]/\[particularId\]/\[projectbreakdownId\]/page.tsx

# Check for local utils imports
grep -r "from \"\.\/utils\"" app/dashboard/project/\[year\]/\[particularId\]/\[projectbreakdownId\]/page.tsx
```

Expected: No matches (or only `StatusChainCard` and `page-helpers`)

---

## Phase 2: File Deletion

### Step 2.1: Delete Component Files (Except StatusChainCard)

```powershell
# Navigate to directory
cd "c:\ppdo\ppdo-next\app\dashboard\project\[year]\[particularId]\[projectbreakdownId]\components"

# Delete duplicate components
Remove-Item -Path "BreakdownForm.tsx" -Force
Remove-Item -Path "BreakdownHistoryTable.tsx" -Force
Remove-Item -Path "EmptyState.tsx" -Force
Remove-Item -Path "ImplementingOfficeSelector.tsx" -Force
Remove-Item -Path "TableHeader.tsx" -Force
Remove-Item -Path "TableRow.tsx" -Force
Remove-Item -Path "TableToolbar.tsx" -Force
Remove-Item -Path "TableTotalsRow.tsx" -Force

# Verify StatusChainCard still exists
Get-ChildItem
# Expected: Only StatusChainCard.tsx
```

### Step 2.2: Delete Constants

```powershell
# Navigate and delete constants folder
cd "c:\ppdo\ppdo-next\app\dashboard\project\[year]\[particularId]\[projectbreakdownId]"
Remove-Item -Path "constants" -Recurse -Force
```

### Step 2.3: Delete Hooks

```powershell
# Delete hooks folder
Remove-Item -Path "hooks" -Recurse -Force
```

### Step 2.4: Delete Types

```powershell
# Delete types folder
Remove-Item -Path "types" -Recurse -Force
```

### Step 2.5: Delete Utils (Keep page-helpers.ts)

```powershell
# Navigate to utils
cd "utils"

# Delete duplicate utils
Remove-Item -Path "formatters.ts" -Force
Remove-Item -Path "helpers.ts" -Force
Remove-Item -Path "navigation.utils.ts" -Force

# Keep only page-helpers.ts
Get-ChildItem
# Expected: Only page-helpers.ts
```

---

## Phase 3: Verification

### Step 3.1: TypeScript Compilation

```bash
cd c:\ppdo\ppdo-next
npx tsc --noEmit --skipLibCheck
```

Expected: No errors

### Step 3.2: Build Test

```bash
npm run build
```

Expected: Build succeeds

### Step 3.3: File Structure Check

```powershell
cd "c:\ppdo\ppdo-next\app\dashboard\project\[year]\[particularId]\[projectbreakdownId]"
Get-ChildItem -Recurse
```

Expected structure:
```
├── components/
│   └── StatusChainCard.tsx
├── utils/
│   └── page-helpers.ts
└── page.tsx
```

---

## Phase 4: Testing Checklist

### Functional Tests

| Feature | Test Steps | Expected Result |
|---------|------------|-----------------|
| Page Load | Navigate to breakdown page | Page loads without errors |
| Breakdown List | View breakdown history | Table displays correctly |
| Add Breakdown | Click "Add" button | Form opens |
| Edit Breakdown | Click "Edit" on row | Form opens with data |
| Delete Breakdown | Click "Delete" | Confirmation modal appears |
| Table Resize | Drag column border | Column resizes |
| Column Drag | Drag column header | Column reorders |
| Print | Click print button | Print dialog opens |
| StatusChainCard | Verify card displays | Shows project status chain |

### Regression Tests

- [ ] Breadcrumbs work correctly
- [ ] Back button navigates correctly
- [ ] Recalculate button works
- [ ] Activity log displays
- [ ] Trash bin modal opens

---

## Phase 5: Commit & Document

### Commit Changes

```bash
cd c:\ppdo\ppdo-next
git add -A
git commit -m "cleanup: Remove redundant breakdown components

Delete ~17 duplicate files from app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/
that were shadowing the centralized library at components/ppdo/breakdown/

Files removed:
- components/BreakdownForm.tsx
- components/BreakdownHistoryTable.tsx
- components/EmptyState.tsx
- components/ImplementingOfficeSelector.tsx
- components/TableHeader.tsx
- components/TableRow.tsx
- components/TableToolbar.tsx
- components/TableTotalsRow.tsx
- constants/ (folder)
- hooks/ (folder)
- types/ (folder)
- utils/formatters.ts
- utils/helpers.ts
- utils/navigation.utils.ts

Files kept:
- components/StatusChainCard.tsx (project-specific)
- utils/page-helpers.ts (page-specific)
- page.tsx (entry point)

Verification:
- TypeScript compilation passes
- Build succeeds
- All functionality preserved"
```

### Update Documentation

Add note to `CONSOLIDATION_COMPLETE.md`:

```markdown
## Breakdown Consolidation (Phase 2)

Date: [Current Date]
Branch: consolidation/breakdown-cleanup

### Summary
Cleaned up redundant breakdown components in project breakdown page.

### Files Removed
- 17 duplicate files
- ~3,500 lines of redundant code

### Impact
- No functional changes
- Reduced maintenance burden
- Single source of truth maintained
```

---

## Rollback Plan

If issues occur:

```bash
# Revert to backup branch
git checkout backup/breakdown-cleanup

# Or revert specific commit
git revert HEAD
```

---

## Troubleshooting

### Issue: TypeScript errors after deletion

**Cause**: Some imports still reference deleted files

**Solution**: Check page.tsx and StatusChainCard.tsx for local imports

```bash
# Find all local imports
grep -r "from \"\.\//" app/dashboard/project/\[year\]/\[particularId\]/\[projectbreakdownId\]/
```

### Issue: Missing functionality

**Cause**: Deleted file had unique code

**Solution**: Restore specific file and evaluate integration

### Issue: Build fails

**Cause**: Webpack/vite caching

**Solution**:
```bash
rm -rf .next
rm -rf node_modules/.cache
npm run build
```

---

## Verification Commands Summary

```bash
# Full verification pipeline
cd c:\ppdo\ppdo-next

# 1. TypeScript
npx tsc --noEmit --skipLibCheck

# 2. Build
npm run build

# 3. Check file count
Get-ChildItem -LiteralPath "app/dashboard/project/[year]/[particularId]/[projectbreakdownId]" -Recurse | Measure-Object

# Expected: ~5 files (page.tsx, StatusChainCard.tsx, page-helpers.ts, and projectId folder)
```

---

## Success Metrics

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| Files in breakdown folder | ~25 | ~5 | ✅ 5 |
| TypeScript errors | 0 | 0 | ✅ 0 |
| Build success | Yes | Yes | ✅ Yes |
| Functionality | Full | Full | ✅ Full |

---

*Guide Version: 1.0*  
*Ready for Implementation*
