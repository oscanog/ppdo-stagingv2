# Rename [projectId] to [inspectionId] - Quick Implementation Guide

## Quick Summary

Rename route parameter from `[projectId]` to `[inspectionId]` for semantic clarity.

**Risk Level**: MEDIUM (requires redirect for backward compatibility)
**Estimated Time**: 3 hours
**Files to Modify**: ~25

---

## Step-by-Step Commands

### Step 1: Create Branches

```bash
cd c:\ppdo\ppdo-next
git checkout -b backup/rename-projectid-to-inspectionid
git checkout -b refactor/rename-projectid-to-inspectionid
```

### Step 2: Rename Folder

```powershell
cd "c:\ppdo\ppdo-next\app\dashboard\project\[year]\[particularId]\[projectbreakdownId]"
Rename-Item -LiteralPath "[projectId]" -NewName "[inspectionId]"
```

### Step 3: Update page.tsx

File: `app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/[inspectionId]/page.tsx`

```typescript
// Line 1: Update comment
// BEFORE:
// app/dashboard/project/budget/[particularId]/[projectbreakdownId]/[projectId]/page.tsx
// AFTER:
// app/dashboard/project/budget/[particularId]/[projectbreakdownId]/[inspectionId]/page.tsx

// Line 51: Update params access
// BEFORE:
const breakdownSlug = decodeLabel(params.projectId as string);
// AFTER:
const breakdownSlug = decodeLabel(params.inspectionId as string);
```

### Step 4: Update RemarksContent.tsx

File: `app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/[inspectionId]/components/tabs/RemarksContent.tsx`

```typescript
// Line 28: Update params access
// BEFORE:
const projectIdFromParams = params.projectId as string;
// AFTER:
const inspectionIdFromParams = params.inspectionId as string;

// Line 29: Update variable reference
// BEFORE:
const projectId = (propProjectId || projectIdFromParams) as Id<"projects">;
// AFTER:
const projectId = (propProjectId || inspectionIdFromParams) as Id<"projects">;
```

### Step 5: Update File Header Comments

Run PowerShell script to update all file headers:

```powershell
$oldPattern = "projectId]"
$newPattern = "inspectionId]"

Get-ChildItem -Path "c:\ppdo\ppdo-next\app\dashboard\project\[year]\[particularId]\[projectbreakdownId]\[inspectionId]" -Recurse -File | Where-Object { $_.Extension -match "\.(ts|tsx)$" } | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -match $oldPattern) {
        $newContent = $content -replace $oldPattern, $newPattern
        Set-Content $_.FullName -Value $newContent
        Write-Host "Updated: $($_.FullName)"
    }
}
```

### Step 6: Create Redirect (Recommended)

Create new file: `app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/[projectId]/route.ts`

```typescript
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export function GET(
  request: NextRequest,
  { params }: { 
    params: { 
      year: string; 
      particularId: string; 
      projectbreakdownId: string; 
      projectId: string 
    } 
  }
) {
  const { year, particularId, projectbreakdownId, projectId } = params;
  redirect(`/dashboard/project/${year}/${particularId}/${projectbreakdownId}/${projectId}`);
}
```

### Step 7: Update Documentation

Files to update:
1. `app/dashboard/project/docs/02-route-structure.md`
2. `app/dashboard/project/docs/06-project-detail.md`
3. `app/dashboard/project/docs/README.md`
4. `app/dashboard/docs/02-routing-structure.md`
5. `app/dashboard/docs/04-module-projects.md`

Search and replace:
```
/dashboard/project/[year]/[particularId]/[projectbreakdownId]/[projectId]
```
to:
```
/dashboard/project/[year]/[particularId]/[projectbreakdownId]/[inspectionId]
```

---

## Verification Commands

```bash
# TypeScript check
cd c:\ppdo\ppdo-next
npx tsc --noEmit --skipLibCheck

# Build test
npm run build

# Git status
git status
```

---

## Testing Checklist

### Critical Path
- [ ] Navigate to `/dashboard/project/2024/[particular]/[breakdown]/[inspection]`
- [ ] Page loads without errors
- [ ] Breadcrumbs show correctly
- [ ] Tabs (Overview, Inspection, Remarks, Analytics) work
- [ ] Back button navigates to breakdown list

### Backward Compatibility (if redirect added)
- [ ] Old URL `/[projectId]` redirects to `/[inspectionId]`
- [ ] No 404 errors

---

## Commit Message

```bash
git add -A
git commit -m "refactor: Rename [projectId] to [inspectionId] for clarity

Rename route parameter from [projectId] to [inspectionId] to better reflect
that this page displays inspection/breakdown details, not project details.

Changes:
- Renamed folder: [projectId] → [inspectionId]
- Updated params.projectId → params.inspectionId in page.tsx
- Updated params access in RemarksContent.tsx
- Updated file header comments
- Updated documentation
- Added redirect from old route (backward compatibility)

Breaking Change: URLs changed from /[projectId] to /[inspectionId]
Migration: Old URLs redirect automatically (if redirect added)"
```

---

## Rollback

If issues occur:

```bash
# Revert to backup
git checkout backup/rename-projectid-to-inspectionid

# Or revert commit
git revert HEAD
```

---

## Troubleshooting

### Issue: TypeScript errors after rename

**Solution**: Check for any missed `params.projectId` references

```bash
grep -r "params\.projectId" app/dashboard/project/\[year\]/\[particularId\]/\[projectbreakdownId\]/\[inspectionId\]/
```

### Issue: Build fails

**Solution**: Clear Next.js cache

```bash
rm -rf .next
npm run build
```

### Issue: Navigation broken

**Solution**: Check navigation.utils.ts and any router.push calls

```bash
grep -r "router\.push.*projectId" app/
grep -r "buildBreakdownDetailPath" app/
```

---

*Quick Guide Version: 1.0*
