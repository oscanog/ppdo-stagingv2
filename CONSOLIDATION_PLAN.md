# Component Consolidation Plan: DRY Principle Implementation

## Executive Summary

This plan outlines the consolidation of redundant components between:
- `app/dashboard/project/[year]/[particularId]/*` (Budget Projects)
- `components/ppdo/twenty-percent-df/*` (20% Development Fund)

**Goal**: Create a single source of truth for project management components while maintaining all existing functionality and styles.

---

## Current State Analysis

### Identified Redundancy

| Component Type | Budget Projects (`app/dashboard/project/[year]/[particularId]`) | 20% DF (`components/ppdo/twenty-percent-df`) | Similarity |
|----------------|---------------------------------------------------------------|----------------------------------------------|------------|
| **Form** | `ProjectForm.tsx` | `TwentyPercentDFForm.tsx` | ~95% |
| **Form Fields** | `components/form/*.tsx` | `components/form/*.tsx` | ~98% |
| **Form Utils** | `form/utils/formValidation.ts` | `form/utils/formValidation.ts` | ~95% |
| **Table** | `ProjectsTable.tsx` | `TwentyPercentDFTable.tsx` | ~90% |
| **Table Sub-components** | `ProjectsTable/*.tsx` | `TwentyPercentDFTable/*.tsx` | ~92% |
| **Types** | `types.ts` | `types/index.ts` | ~95% |
| **Utils** | `utils.ts` | `utils/index.ts` | ~90% |
| **Hooks** | `useParticularData.ts`, `useProjectMutations.ts` | Same hooks exist | ~85% |
| **Modals** | `ProjectShareModal.tsx`, `ProjectExpandModal.tsx` | `TwentyPercentDFShareModal.tsx`, etc. | ~80% |
| **Constants** | `constants.ts` | `constants/index.ts` | ~90% |
| **Print Adapters** | `utils/printAdapters.ts` | `utils/printAdapters.ts` | ~85% |

### Key Differences
1. **API Endpoints**: `api.projects.*` vs `api.twentyPercentDF.*`
2. **Type Names**: `Project` vs `TwentyPercentDF`
3. **Route Context**: Budget items vs standalone 20% DF entities
4. **Draft Keys**: `"project_form_draft"` vs `"twenty_percent_df_form_draft"`

---

## Target Architecture

```
components/ppdo/projects/          # CENTRALIZED LIBRARY (Single Source of Truth)
├── components/
│   ├── ProjectForm.tsx            # Generic, accepts API configuration
│   ├── ProjectsTable.tsx          # Generic, accepts API configuration
│   ├── form/                      # Generic form fields
│   ├── ProjectsTable/             # Generic table sub-components
│   └── modals/                    # Generic modals
├── hooks/
│   ├── useParticularData.ts       # Generic hook with API injection
│   └── useProjectMutations.ts     # Generic hook with API injection
├── types/
│   └── index.ts                   # Unified Project types
├── utils/
│   └── index.ts                   # Generic utilities
└── index.ts                       # Public API exports

components/ppdo/twenty-percent-df/ # ADAPTER LAYER (Thin Wrappers)
├── index.ts                       # Re-exports with 20% DF configuration
├── adapter/
│   ├── apiConfig.ts               # API endpoint mappings
│   ├── typeAdapters.ts            # Type transformations
│   └── hookWrappers.ts            # Pre-configured hooks
└── README.md                      # Migration guide

app/dashboard/project/[year]/[particularId]/  # CONSUMERS
└── page.tsx                       # Imports from @/components/ppdo/projects

app/dashboard/20_percent_df/[year]/[slug]/    # CONSUMERS  
└── page.tsx                       # Imports from @/components/ppdo/twenty-percent-df (adapter)
```

---

## Phase-by-Phase Implementation

### Phase 0: Pre-Flight Checklist ✅

**Objective**: Ensure safe refactoring environment

| Task | Status | Notes |
|------|--------|-------|
| Verify all tests pass | ⬜ | Run `npm test` |
| Create backup branch | ⬜ | `git checkout -b consolidation/phase-0` |
| Document current behavior | ⬜ | Screenshot key UI states |
| Identify API differences | ✅ | Complete (see analysis above) |

---

### Phase 1: Create Centralized Project Library 🔄

**Objective**: Establish `components/ppdo/projects` as the single source of truth

**Files to Modify/Create**:

#### 1.1 Create Generic Types (`components/ppdo/projects/types/index.ts`)
```typescript
// Unified Project interface that works for both Budget Projects and 20% DF
export interface Project {
  id: string;
  particulars: string;
  implementingOffice: string;
  categoryId?: string | Id<"projectCategories">;
  departmentId?: string | Id<"departments">;
  totalBudgetAllocated: number;
  obligatedBudget?: number;
  totalBudgetUtilized: number;
  utilizationRate: number;
  projectCompleted: number;
  projectDelayed: number;
  projectsOngoing?: number;
  remarks?: string;
  year?: number;
  status?: "completed" | "ongoing" | "delayed";
  targetDateCompletion?: number;
  isPinned?: boolean;
  pinnedAt?: number;
  pinnedBy?: string | Id<"users">;
  budgetItemId?: string | Id<"budgetItems">;
  projectManagerId?: string | Id<"users">;
  _creationTime?: number;
  autoCalculateBudgetUtilized?: boolean;
  // 20% DF specific fields (optional)
  twentyPercentDFId?: string | Id<"twentyPercentDF">;
}

// Generic form data interface
export interface ProjectFormData {
  particulars: string;
  implementingOffice: string;
  categoryId?: string | Id<"projectCategories">;
  departmentId?: string | Id<"departments">;
  totalBudgetAllocated: number;
  obligatedBudget?: number;
  totalBudgetUtilized: number;
  remarks?: string;
  year?: number;
  targetDateCompletion?: number;
  isPinned?: boolean;
  pinnedAt?: number;
  pinnedBy?: string | Id<"users">;
  budgetItemId?: string | Id<"budgetItems">;
  projectManagerId?: string | Id<"users">;
  _creationTime?: number;
  autoCalculateBudgetUtilized?: boolean;
}

// API Configuration type for generic hooks
export interface ProjectApiConfig {
  list: any;           // Convex query for listing projects
  get: any;            // Convex query for getting single project
  create: any;         // Convex mutation for creating
  update: any;         // Convex mutation for updating
  delete: any;         // Convex mutation for deleting
  togglePin: any;      // Convex mutation for pinning
  bulkMoveToTrash: any;
  bulkUpdateCategory: any;
  toggleAutoCalculate: any;
  bulkToggleAutoCalculate: any;
}
```

#### 1.2 Create API Configuration Files

**For Budget Projects** (`components/ppdo/projects/api/budgetProjectApi.ts`):
```typescript
import { api } from "@/convex/_generated/api";
import { ProjectApiConfig } from "../types";

export const budgetProjectApi: ProjectApiConfig = {
  list: api.projects.list,
  get: api.projects.get,
  create: api.projects.create,
  update: api.projects.update,
  delete: api.projects.moveToTrash,
  togglePin: api.projects.togglePin,
  bulkMoveToTrash: api.projects.bulkMoveToTrash,
  bulkUpdateCategory: api.projects.bulkUpdateCategory,
  toggleAutoCalculate: api.projects.toggleAutoCalculate,
  bulkToggleAutoCalculate: api.projects.bulkToggleAutoCalculate,
};
```

**For 20% DF** (`components/ppdo/projects/api/twentyPercentDfApi.ts`):
```typescript
import { api } from "@/convex/_generated/api";
import { ProjectApiConfig } from "../types";

export const twentyPercentDfApi: ProjectApiConfig = {
  list: api.twentyPercentDF.list,
  get: api.twentyPercentDF.get,
  create: api.twentyPercentDF.create,
  update: api.twentyPercentDF.update,
  delete: api.twentyPercentDF.moveToTrash,
  togglePin: api.twentyPercentDF.togglePin,
  bulkMoveToTrash: api.twentyPercentDF.bulkMoveToTrash,
  bulkUpdateCategory: api.twentyPercentDF.bulkUpdateCategory,
  toggleAutoCalculate: api.twentyPercentDF.toggleAutoCalculateFinancials,
  bulkToggleAutoCalculate: api.twentyPercentDF.bulkToggleAutoCalculate,
};
```

#### 1.3 Refactor Generic Hooks

**`useProjectData.ts`** - Generic hook that accepts API config:
```typescript
"use client";

import { useQuery } from "convex/react";
import { Project, ProjectApiConfig } from "../types";

interface UseProjectDataOptions {
  parentId?: string;
  particular?: string;
  apiConfig: ProjectApiConfig;
  transformProject: (raw: any) => Project;
}

export function useProjectData({
  parentId,
  particular,
  apiConfig,
  transformProject,
}: UseProjectDataOptions) {
  // Implementation uses apiConfig.list instead of hardcoded api.projects.list
  const projects = useQuery(
    apiConfig.list,
    parentId ? { budgetItemId: parentId as any } : "skip"
  );
  
  const transformedProjects = projects?.map(transformProject) ?? [];
  
  return {
    projects: transformedProjects,
    isLoading: projects === undefined,
  };
}
```

#### 1.4 Refactor ProjectForm to Accept API Config

Make `ProjectForm` accept:
- `apiConfig: ProjectApiConfig` - API endpoints to use
- `draftKey: string` - LocalStorage key for drafts
- `entityType: string` - For display labels

---

### Phase 2: Create TwentyPercentDF Adapter Layer 🔄

**Objective**: Create thin wrappers that use the centralized library with 20% DF configuration

**Files to Create**:

#### 2.1 Adapter Configuration (`components/ppdo/twenty-percent-df/adapter/config.ts`)
```typescript
import { twentyPercentDfApi } from "@/components/ppdo/projects/api/twentyPercentDfApi";
import { ProjectApiConfig } from "@/components/ppdo/projects/types";

export const TWENTY_PERCENT_DF_CONFIG = {
  api: twentyPercentDfApi,
  draftKey: "twenty_percent_df_form_draft",
  entityType: "twentyPercentDF",
  entityLabel: "20% Development Fund",
  entityLabelPlural: "20% Development Fund Items",
  routes: {
    base: "/dashboard/20_percent_df",
  },
};
```

#### 2.2 Type Adapters (`components/ppdo/twenty-percent-df/adapter/typeAdapters.ts`)
```typescript
import { Project } from "@/components/ppdo/projects/types";
import { TwentyPercentDF } from "../types";

// Transform 20% DF to generic Project
export function toProject(twentyPercentDF: TwentyPercentDF): Project {
  return {
    ...twentyPercentDF,
    id: twentyPercentDF.id,
    categoryId: twentyPercentDF.categoryId as string,
  };
}

// Transform generic Project to 20% DF
export function fromProject(project: Project): TwentyPercentDF {
  return {
    ...project,
    id: project.id,
    categoryId: project.categoryId as any,
  };
}
```

#### 2.3 Wrapper Components

**`TwentyPercentDFTable.tsx`** (Adapter):
```typescript
"use client";

import { ProjectsTable as GenericProjectsTable } from "@/components/ppdo/projects/components/ProjectsTable";
import { TWENTY_PERCENT_DF_CONFIG } from "./adapter/config";
import { toProject } from "./adapter/typeAdapters";
import { TwentyPercentDFTableProps } from "./types";

export function TwentyPercentDFTable(props: TwentyPercentDFTableProps) {
  // Transform 20% DF items to generic Projects
  const projects = props.items.map(toProject);
  
  return (
    <GenericProjectsTable
      {...props}
      projects={projects}
      apiConfig={TWENTY_PERCENT_DF_CONFIG.api}
      entityType={TWENTY_PERCENT_DF_CONFIG.entityType}
    />
  );
}
```

---

### Phase 3: Update Dashboard Route Imports 🔄

**Objective**: Update `app/dashboard/project/[year]/[particularId]/page.tsx` to use centralized library

**Current Import**:
```typescript
import {
  ProjectsTable,
  ParticularPageHeader,
  // ... etc
} from "@/components/ppdo/projects";
```

**Required Changes**:
- Verify all imports resolve correctly
- Update hook usage if signature changed
- Test all functionality

---

### Phase 4: Update 20% DF Route Imports 🔄

**Objective**: Update `app/dashboard/20_percent_df/[year]/[slug]/page.tsx` to use adapter layer

**Current State**: Uses inline components
**Target State**: Uses adapter components from `components/ppdo/twenty-percent-df`

---

### Phase 5: Testing & Validation 🔄

#### 5.1 Functional Testing Checklist

| Feature | Budget Projects | 20% DF | Notes |
|---------|-----------------|--------|-------|
| **View List** | ⬜ | ⬜ | Data displays correctly |
| **Add New** | ⬜ | ⬜ | Form opens, validates, saves |
| **Edit** | ⬜ | ⬜ | Form pre-fills, updates save |
| **Delete** | ⬜ | ⬜ | Confirmation, moves to trash |
| **Pin/Unpin** | ⬜ | ⬜ | Stays at top, persists |
| **Category Filter** | ⬜ | ⬜ | Groups display correctly |
| **Search** | ⬜ | ⬜ | Filters work correctly |
| **Sort** | ⬜ | ⬜ | All sort columns work |
| **Column Visibility** | ⬜ | ⬜ | Show/hide columns |
| **Bulk Actions** | ⬜ | ⬜ | Select all, delete, category |
| **Print Preview** | ⬜ | ⬜ | Data exports correctly |
| **Share Modal** | ⬜ | ⬜ | Copy link works |
| **Expand Modal** | ⬜ | ⬜ | Full-screen view works |
| **Budget Violation** | ⬜ | ⬜ | Warning shows when over |
| **Auto-calculate Toggle** | ⬜ | ⬜ | Switch works, persists |
| **Form Draft** | ⬜ | ⬜ | Auto-saves, restores |
| **Activity Log** | ⬜ | ⬜ | Shows history |

#### 5.2 Visual Regression Testing

| Element | Budget Projects | 20% DF | Notes |
|---------|-----------------|--------|-------|
| **Colors** | ⬜ | ⬜ | No style changes |
| **Spacing** | ⬜ | ⬜ | No layout shifts |
| **Typography** | ⬜ | ⬜ | Fonts unchanged |
| **Animations** | ⬜ | ⬜ | Transitions work |
| **Responsive** | ⬜ | ⬜ | Mobile/tablet views |

#### 5.3 Performance Testing

| Metric | Budget Projects | 20% DF | Target |
|--------|-----------------|--------|--------|
| **Initial Load** | ⬜ | ⬜ | < 2s |
| **Filter/Sort** | ⬜ | ⬜ | < 100ms |
| **Form Open** | ⬜ | ⬜ | < 200ms |

---

### Phase 6: Cleanup & Documentation 🔄

#### 6.1 Remove Duplicated Files

After successful testing, remove:
- `app/dashboard/project/[year]/[particularId]/components/` (except page-specific)
- `app/dashboard/project/[year]/[particularId]/hooks/`
- `app/dashboard/project/[year]/[particularId]/types.ts`
- `app/dashboard/project/[year]/[particularId]/utils.ts`
- `app/dashboard/project/[year]/[particularId]/constants.ts`

#### 6.2 Update Documentation

- Update `AGENTS.md` with new component structure
- Update import patterns in documentation
- Add migration guide for future developers

---

## Risk Mitigation

### High-Risk Areas

| Risk | Impact | Mitigation |
|------|--------|------------|
| API endpoint mismatch | 🔴 High | Thoroughly document all API differences |
| Type incompatibility | 🔴 High | Create comprehensive type adapters |
| State management issues | 🟡 Medium | Test all interactions thoroughly |
| Style regressions | 🟡 Medium | Visual regression testing |
| Draft data loss | 🔴 High | Maintain same draft keys |

### Rollback Plan

1. Keep backup branch: `backup/pre-consolidation`
2. Each phase in separate branch: `consolidation/phase-{n}`
3. If issues found, revert to previous phase branch

---

## Agent Responsibilities

### UI/UX Designer Agent
- Verify no visual regressions
- Ensure accessibility maintained
- Validate responsive behavior

### Frontend/React Specialist Agent
- Implement generic components
- Create adapter layer
- Update imports in route files
- Ensure TypeScript strict compliance

### QA/Testing Agent
- Create comprehensive test plan
- Execute functional testing
- Perform visual regression testing
- Document any issues found

---

## Success Criteria

✅ All existing functionality preserved
✅ No visual regressions
✅ Code duplication reduced by >80%
✅ All tests passing
✅ Performance maintained or improved
✅ Documentation updated

---

## Timeline Estimate

| Phase | Estimated Time | Dependencies |
|-------|---------------|--------------|
| Phase 0 | 2 hours | - |
| Phase 1 | 16 hours | Phase 0 |
| Phase 2 | 8 hours | Phase 1 |
| Phase 3 | 4 hours | Phase 1 |
| Phase 4 | 4 hours | Phase 2 |
| Phase 5 | 8 hours | Phase 3, 4 |
| Phase 6 | 4 hours | Phase 5 |
| **Total** | **46 hours** | - |

---

*Document Version: 1.0*
*Created: 2026-01-31*
*Status: Draft - Ready for Review*
