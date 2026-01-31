# Rename [projectId] to [inspectionId] - Summary

## Overview

This document summarizes the plan to rename the route parameter from `[projectId]` to `[inspectionId]` for better semantic clarity.

---

## The Problem

### Current Confusing Structure

```
URL: /dashboard/project/2024/Budget/[project-slug]/[breakdown-slug]
                                                    │
                                                    └── Route param: [projectId]
                                                        Actual value: Breakdown ID
                                                        
Problem: Parameter name suggests it contains a Project ID,
but it actually contains a Breakdown/Inspection ID!
```

### Evidence from Code Comments

```typescript
// page.tsx line 51:
const breakdownSlug = decodeLabel(params.projectId as string); 
// Comment: "This is actually breakdown slug!"
```

The comment itself admits the naming is wrong!

---

## The Solution

### New Clear Structure

```
URL: /dashboard/project/2024/Budget/[project-slug]/[breakdown-slug]
                                                    │
                                                    └── Route param: [inspectionId]
                                                        Actual value: Breakdown/Inspection ID
```

### Why "inspectionId"?

1. **Semantic accuracy**: The page displays inspection details
2. **Domain alignment**: The breakdown record contains inspection data
3. **Future-proofing**: Aligns with potential future Inspection module
4. **Developer clarity**: No confusion about what the parameter contains

---

## Comparison with Previous Work

| Aspect | Projects Consolidation | Breakdown Cleanup | **This Rename** |
|--------|------------------------|-------------------|-----------------|
| Type | Code deduplication | Code cleanup | **Refactoring** |
| Complexity | High | Low | **Medium** |
| Files Changed | 60+ | 16 | **~25** |
| Code Removed | ~9,600 lines | ~3,000 lines | **0 lines** |
| Breaking Change | No | No | **Yes** ⚠️ |
| Risk Level | Medium | Low | **Medium** |
| Estimated Time | 46 hours | 2 hours | **3 hours** |

---

## Impact Analysis

### What Changes

| Item | Before | After |
|------|--------|-------|
| **Folder name** | `[projectId]` | `[inspectionId]` |
| **Route param** | `params.projectId` | `params.inspectionId` |
| **URL segment** | `.../[projectId]` | `.../[inspectionId]` |

### What Stays the Same

| Item | Status |
|------|--------|
| Component logic | ✅ Unchanged |
| API calls | ✅ Unchanged |
| Database schema | ✅ Unchanged |
| Props (projectId) | ✅ Unchanged (actual project ID) |
| Styling | ✅ Unchanged |
| Functionality | ✅ Unchanged |

---

## Breaking Change Management

### The Problem

Existing URLs will break:
- User bookmarks
- Browser history
- Shared links
- External references

### The Solution: Redirect

Add a redirect route to handle old URLs:

```typescript
// app/.../[projectId]/route.ts
export function GET(request, { params }) {
  const { year, particularId, projectbreakdownId, projectId } = params;
  redirect(`/dashboard/project/${year}/${particularId}/${projectbreakdownId}/${projectId}`);
}
```

This ensures:
- ✅ Old bookmarks work
- ✅ No 404 errors
- ✅ SEO preserved
- ✅ Seamless user experience

---

## File Changes Required

### Functional Changes (3 files)
1. **page.tsx** - Update `params.projectId` → `params.inspectionId`
2. **RemarksContent.tsx** - Update params access
3. **[projectId]/route.ts** - Add redirect (new file)

### Comment Updates (20+ files)
All files with header comments referencing the old path

### Documentation Updates (5 files)
- 02-route-structure.md
- 06-project-detail.md
- README.md
- 02-routing-structure.md
- 04-module-projects.md

---

## Implementation Options

### Option A: Simple Rename (Breaking)

**Pros:**
- Clean, no legacy code
- Simple implementation

**Cons:**
- Breaks existing bookmarks
- May confuse users with old links

### Option B: Rename with Redirect (Recommended)

**Pros:**
- Backward compatible
- No broken bookmarks
- Better user experience

**Cons:**
- Slightly more complex
- One extra file to maintain

**Recommendation**: Option B

---

## Testing Strategy

### Critical Path Tests
```
1. Navigate to breakdown list
2. Click on a breakdown
3. Verify URL shows /[inspectionId]
4. Verify page loads correctly
5. Test all tabs
6. Test back button
```

### Backward Compatibility Tests
```
1. Navigate to old URL /[projectId]
2. Verify redirect to /[inspectionId]
3. Verify no 404 errors
```

---

## Migration Guide for Developers

### If you have hardcoded URLs in your code:

**Before:**
```typescript
router.push(`/dashboard/project/${year}/${particularId}/${breakdownId}/${projectId}`);
```

**After:**
```typescript
router.push(`/dashboard/project/${year}/${particularId}/${breakdownId}/${inspectionId}`);
```

### If you reference the route parameter:

**Before:**
```typescript
const { projectId } = params; // Actually contains breakdown slug
```

**After:**
```typescript
const { inspectionId } = params; // Clearly indicates breakdown/inspection
```

---

## Future Considerations

### Potential Next Steps

1. **Rename [projectbreakdownId]** → `[breakdownId]`
   - Current: `.../[particularId]/[projectbreakdownId]/[inspectionId]`
   - Target: `.../[particularId]/[breakdownId]/[inspectionId]`

2. **Rename [particularId]** → `[budgetItemId]`
   - More semantic clarity

3. **Extract Inspection Module**
   - Move inspection components to `components/ppdo/inspection/`
   - Follow the pattern of `components/ppdo/breakdown/`

---

## Success Criteria

- [ ] Folder renamed from `[projectId]` to `[inspectionId]`
- [ ] TypeScript compilation passes (0 errors)
- [ ] Production build succeeds
- [ ] Page functionality preserved
- [ ] Navigation works correctly
- [ ] Redirect in place (if Option B)
- [ ] Documentation updated
- [ ] No visual regressions

---

## Conclusion

This rename improves code maintainability by:
1. Making route parameters semantically accurate
2. Reducing developer confusion
3. Aligning with domain language
4. Setting foundation for future Inspection module

**Recommendation**: Proceed with Option B (Rename with Redirect) for best user experience.

---

*Summary Version: 1.0*  
*Created: 2026-01-31*
