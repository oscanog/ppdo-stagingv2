# Rename [projectId] to [inspectionId] - Implementation Plan

## Executive Summary

Rename the folder `app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/[projectId]` to `[inspectionId]` for better semantic clarity and maintainability. This page is for inspection detail views, not project details.

---

## Current State Analysis

### Current Route Structure
```
/dashboard/project/[year]/[particularId]/[projectbreakdownId]/[projectId]
│       │       │      │              │                │           │
│       │       │      │              │                │           └── ❌ Misleading: Actually breakdown ID
│       │       │      │              │                └── Breakdown slug
│       │       │      │              └── Project slug (misnamed)
│       │       │      └── Particular ID
│       │       └── Year
│       └── Route group
└── App root
```

### The Problem
1. **Misleading naming**: `[projectId]` parameter actually contains the **breakdown ID/slug**, not a project ID
2. **Semantic confusion**: The page shows inspection details, not project details
3. **Maintenance burden**: Developers expect `projectId` to contain a project ID

### Evidence from Code
```typescript
// page.tsx line 51:
const breakdownSlug = decodeLabel(params.projectId as string); 
// ^^^ Comment says: "This is actually breakdown slug!"

// The URL structure is:
// /project/2024/Budget/[project-slug]/[breakdown-slug]
//                    ^projectbreakdownId  ^projectId (misleading!)
```

---

## Target State

### Proposed Route Structure
```
/dashboard/project/[year]/[particularId]/[projectbreakdownId]/[inspectionId]
│       │       │      │              │                │           │
│       │       │      │              │                │           └── ✅ Clear: Inspection/Breakdown ID
│       │       │      │              │                └── Inspection breakdown slug
│       │       │      │              └── Project slug (to be renamed in future)
│       │       │      └── Particular ID
│       │       └── Year
│       └── Route group
└── App root
```

---

## Scope of Changes

### Files Affected

| Category | Count | Files |
|----------|-------|-------|
| **Page files** | 5 | page.tsx, data.ts, utils.ts, components/types.ts, components/utils.ts |
| **Components** | 20+ | All components in components/ folder |
| **Documentation** | 4 | docs/*.md files |
| **Navigation utils** | 1 | components/ppdo/breakdown/utils/navigation.utils.ts |
| **Comments** | ~50 | File header comments |

### Detailed File List

#### Must Update (Functional Changes)
1. `app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/[projectId]/page.tsx`
   - Line 51: `params.projectId` → `params.inspectionId`
   - Line 1: Update comment

2. `app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/[projectId]/components/tabs/RemarksContent.tsx`
   - Line 28: `params.projectId` → `params.inspectionId`

3. `components/ppdo/breakdown/utils/navigation.utils.ts`
   - Update route building logic if needed

#### Must Update (Comments Only)
All files with header comments:
- `data.ts`
- `utils.ts`
- `components/utils.ts`
- `components/types.ts`
- `components/TransactionCard.tsx`
- `components/Card.tsx`
- `components/StatCard.tsx`
- `components/RemarksSection.tsx`
- `components/FinancialBreakdownCard.tsx`
- `components/FinancialBreakdownTabs.tsx`
- `components/FinancialBreakdownTable.tsx`
- `components/FinancialBreakdownMain.tsx`
- `components/FinancialBreakdownItemForm.tsx`
- `components/mockData.ts`
- `components/tabs/*.tsx` (4 files)
- `components/modals/*.tsx` (3 files)

#### Documentation Updates
- `app/dashboard/project/docs/02-route-structure.md`
- `app/dashboard/project/docs/06-project-detail.md`
- `app/dashboard/project/docs/README.md`
- `app/dashboard/docs/02-routing-structure.md`
- `app/dashboard/docs/04-module-projects.md`

---

## Implementation Strategy

### Phase 1: Preparation

1. **Create backup branch**
   ```bash
   git checkout -b backup/rename-projectid-to-inspectionid
   git checkout -b refactor/rename-projectid-to-inspectionid
   ```

2. **Verify current build**
   ```bash
   npm run build
   npx tsc --noEmit
   ```

### Phase 2: Rename Folder

```powershell
# Navigate to parent directory
cd "app\dashboard\project\[year]\[particularId]\[projectbreakdownId]"

# Rename folder
Rename-Item -LiteralPath "[projectId]" -NewName "[inspectionId]"
```

### Phase 3: Update Code References

#### 3.1 Update page.tsx
```typescript
// BEFORE (line 51):
const breakdownSlug = decodeLabel(params.projectId as string);

// AFTER:
const breakdownSlug = decodeLabel(params.inspectionId as string);
```

#### 3.2 Update RemarksContent.tsx
```typescript
// BEFORE (line 28):
const projectIdFromParams = params.projectId as string;

// AFTER:
const inspectionIdFromParams = params.inspectionId as string;
```

#### 3.3 Update File Header Comments
Update all 20+ file headers from:
```typescript
// app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/[projectId]/page.tsx
```
to:
```typescript
// app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/[inspectionId]/page.tsx
```

### Phase 4: Update Documentation

Update all documentation files to reflect the new route:

```markdown
# BEFORE:
**Route:** `/dashboard/project/[year]/[particularId]/[projectbreakdownId]/[projectId]`

# AFTER:
**Route:** `/dashboard/project/[year]/[particularId]/[projectbreakdownId]/[inspectionId]`
```

### Phase 5: Verification

1. **TypeScript compilation**
   ```bash
   npx tsc --noEmit --skipLibCheck
   ```

2. **Build test**
   ```bash
   npm run build
   ```

3. **Route testing**
   - Navigate to breakdown page
   - Click on a breakdown to view inspection details
   - Verify URL shows `/[inspectionId]`
   - Verify page loads correctly

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Broken navigation links | Medium | High | Update navigation.utils.ts |
| External bookmarks broken | High | Medium | Add redirect or accept breaking change |
| TypeScript errors | Low | Medium | Compilation check |
| Runtime errors | Low | High | Manual testing |

### Breaking Changes

⚠️ **WARNING**: This is a **breaking change** for:
- Existing bookmarks
- Browser history
- Shared links

**Mitigation Options**:
1. **Option A**: Accept breaking change (notify users)
2. **Option B**: Add Next.js redirect (recommended)

#### Recommended: Add Redirect

Create `app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/[projectId]/route.ts`:

```typescript
import { redirect } from 'next/navigation';

export function GET(
  request: Request,
  { params }: { params: { year: string; particularId: string; projectbreakdownId: string; projectId: string } }
) {
  const { year, particularId, projectbreakdownId, projectId } = params;
  redirect(`/dashboard/project/${year}/${particularId}/${projectbreakdownId}/${projectId}`);
}
```

---

## Testing Checklist

### Functional Tests
- [ ] Breakdown detail page loads with new URL
- [ ] Navigation from breakdown table works
- [ ] Breadcrumbs display correctly
- [ ] Back button works
- [ ] Tab navigation works (Overview, Inspection, Remarks, Analytics)
- [ ] Inspection gallery works
- [ ] New inspection form works
- [ ] New remark form works
- [ ] Financial breakdown displays correctly

### Regression Tests
- [ ] Other fund types (Trust Funds, etc.) not affected
- [ ] 20% DF breakdown pages work
- [ ] Special Education Fund breakdown pages work
- [ ] Special Health Fund breakdown pages work

---

## Rollback Plan

If issues occur:

```bash
# Revert folder rename
cd "app/dashboard/project/[year]/[particularId]/[projectbreakdownId]"
Rename-Item -LiteralPath "[inspectionId]" -NewName "[projectId]"

# Revert code changes
git checkout backup/rename-projectid-to-inspectionid
```

---

## Timeline Estimate

| Phase | Duration |
|-------|----------|
| Preparation | 30 min |
| Folder rename | 5 min |
| Code updates | 1 hour |
| Documentation updates | 30 min |
| Testing | 1 hour |
| **Total** | **~3 hours** |

---

## Success Criteria

- [ ] Folder renamed to `[inspectionId]`
- [ ] TypeScript compilation passes (0 errors)
- [ ] Production build succeeds
- [ ] All inspection detail functionality works
- [ ] Navigation from breakdown table works
- [ ] Documentation updated
- [ ] Redirect in place (optional but recommended)

---

## Notes

1. **Variable naming**: Internal variable names like `breakdownSlug` don't need to change - only the route parameter name
2. **Database IDs**: No database changes needed - this is purely a URL/route change
3. **API calls**: No API endpoint changes needed
4. **Component props**: Props like `projectId` passed to components don't need to change (they represent actual project IDs)

---

## Related Future Work

Consider also renaming:
- `[projectbreakdownId]` → `[breakdownId]` for consistency
- Particular route segments for clarity

These can be done in separate PRs to minimize risk.

---

*Plan Version: 1.0*  
*Created: 2026-01-31*  
*Status: Ready for Implementation*
