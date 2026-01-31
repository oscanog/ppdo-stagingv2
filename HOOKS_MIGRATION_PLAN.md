# Hooks Migration Plan: app/hooks → hooks/

## Overview

Migrate hooks from `app/hooks/` to `hooks/` (project root) to follow Next.js project structure best practices. This separates reusable hooks from App Router-specific code.

---

## Current State

### Source: `app/hooks/`
| File | Purpose | Dependencies |
|------|---------|--------------|
| `index.ts` | Barrel exports | Internal exports |
| `use-debounce.ts` | Debounce utility | None |
| `useCurrentUser.ts` | Current user data | `@/convex/_generated/api` ✅ |
| `usePermissions.ts` | RBAC permissions | `../../convex/_generated/api` ❌ (relative) |
| `useTableColumnVisibility.ts` | Table column visibility | None |
| `useTableSearch.ts` | Table search | None |
| `useTableSelection.ts` | Table selection | None |

### Destination: `hooks/`
| File | Purpose |
|------|---------|
| `index.ts` | Currently minimal |
| `useDashboardFilters.ts` | Dashboard filtering |

---

## Migration Strategy

### Phase 1: Move Hook Files (No Import Changes)

```
app/hooks/use-debounce.ts → hooks/use-debounce.ts
app/hooks/useCurrentUser.ts → hooks/useCurrentUser.ts
app/hooks/usePermissions.ts → hooks/usePermissions.ts
app/hooks/useTableColumnVisibility.ts → hooks/useTableColumnVisibility.ts
app/hooks/useTableSearch.ts → hooks/useTableSearch.ts
app/hooks/useTableSelection.ts → hooks/useTableSelection.ts
```

### Phase 2: Fix Import Paths

#### Critical Fix Required

**File: `hooks/usePermissions.ts`**
```typescript
// BEFORE (relative path - WILL BREAK)
import { api } from "../../convex/_generated/api";

// AFTER (absolute path - CORRECT)
import { api } from "@/convex/_generated/api";
```

#### Verified OK (No Changes Needed)
- `useCurrentUser.ts` - Already uses `@/` alias ✅
- `use-debounce.ts` - No external dependencies ✅
- Table hooks - No external dependencies ✅

### Phase 3: Merge Barrel Exports

**File: `hooks/index.ts`** (merge both)
```typescript
/**
 * Custom Hooks Index
 * 
 * Shared hooks for use across the application.
 */

// Existing hooks
export { useDashboardFilters } from "./useDashboardFilters";

// Migrated from app/hooks/
export { useDebounce } from "./use-debounce";
export { useCurrentUser } from "./useCurrentUser";
export { usePermissions } from "./usePermissions";
export {
  useTableSearch,
  type UseTableSearchOptions,
  type UseTableSearchReturn,
} from "./useTableSearch";
export {
  useTableSelection,
  type UseTableSelectionOptions,
  type UseTableSelectionReturn,
} from "./useTableSelection";
export {
  useTableColumnVisibility,
  type UseTableColumnVisibilityOptions,
  type UseTableColumnVisibilityReturn,
} from "./useTableColumnVisibility";
```

### Phase 4: Create Compatibility Layer (Optional)

**File: `app/hooks/index.ts`** (keep temporarily)
```typescript
/**
 * @deprecated Import from '@/hooks' instead
 * This file will be removed in a future update
 */
export * from "@/hooks";
```

---

## Security & Auth Considerations

### Auth Hooks (`useCurrentUser`, `usePermissions`)

**Security Specialist Review Required:**

1. **useCurrentUser** - Returns user role, auth status
   - ✅ Uses Convex's `api.auth.getCurrentUser` 
   - ✅ Returns computed `isAdmin`, `isSuperAdmin`, `isInspector` flags
   - ⚠️ Ensure role checks are consistent with RBAC definitions

2. **usePermissions** - Returns permission checks
   - ✅ Uses `api.permissions.getUserPermissions`
   - ✅ Provides `hasPermission`, `hasAnyPermission`, `hasAllPermissions` helpers
   - ⚠️ **CRITICAL**: Must fix import path from `../../` to `@/`

### RBAC Alignment Check

Ensure these hooks align with `convex/lib/rbac.ts` permissions:
```typescript
// RBAC permissions from convex/lib/rbac.ts
export type Permission =
  | "budget:read" | "budget:create" | "budget:update" | "budget:delete"
  | "project:read" | "project:create" | "project:update" | "project:delete"
  | "user:read" | "user:create" | "user:update" | "user:delete"
  | "admin:full";
```

---

## Consumer Impact Analysis

### Files Importing from `app/hooks/`

Need to update imports from:
```typescript
import { useCurrentUser } from "@/app/hooks";
```

To:
```typescript
import { useCurrentUser } from "@/hooks";
```

### Search Pattern
```bash
grep -r "from \"@/app/hooks\"" --include="*.ts" --include="*.tsx" .
grep -r "from \"../hooks\"" --include="*.ts" --include="*.tsx" .
grep -r "from \"../../hooks\"" --include="*.ts" --include="*.tsx" .
```

---

## Testing Checklist

### Pre-Migration
- [ ] Run build to verify current state passes
- [ ] Document all files importing from `app/hooks/`

### Post-Migration
- [ ] Fix `usePermissions.ts` import path
- [ ] Update `hooks/index.ts` barrel exports
- [ ] Run TypeScript check: `npx tsc --noEmit`
- [ ] Run build: `npm run build`
- [ ] Test auth flows (login, permissions)
- [ ] Test table functionality (search, selection, column visibility)

### Security Verification
- [ ] Verify `useCurrentUser` returns correct role info
- [ ] Verify `usePermissions` checks work correctly
- [ ] Ensure no authentication bypass introduced

---

## Rollback Plan

If issues occur:
1. Restore `app/hooks/` from git
2. Revert import changes in consuming files
3. Rebuild and verify

---

## Documentation Updates

Update these files post-migration:
1. `README.md` - Document hooks location
2. `.claude/agents/frontend-react-specialist.md` - Update key files section
3. Any internal docs referencing hook locations

---

## Execution Timeline

| Phase | Task | Estimated Time |
|-------|------|----------------|
| 1 | Move hook files | 5 min |
| 2 | Fix import paths | 10 min |
| 3 | Merge barrel exports | 10 min |
| 4 | Update consumers | 20 min |
| 5 | Test & verify | 15 min |
| **Total** | | **~1 hour** |

---

## Approval Required

- [ ] **Frontend/React Specialist** - Review hook patterns
- [ ] **Security/Auth Specialist** - Review auth hooks alignment
- [ ] **Product/Documentation Lead** - Approve documentation updates

---

*Plan prepared following PPDO project standards and Next.js best practices.*
