# Implementation Plan: Breakdown Pages Statistics Header Standardization

## Overview
Standardize all breakdown pages (Project, Trust Fund, SEF, SHF, 20% DF) to use the same UI/UX styling as the "Budget Tracking 2025" reference page.

## Current State Analysis

From the screenshot and code review, breakdown pages currently have:

### Current Components (TO BE REMOVED/REPLACED)
1. **BreakdownHeader** - Has back link, title (NO icon box), action buttons
2. **StatusChainCard** (Projects only) - Large blue card with status chain
3. **EntityOverviewCards** - Grid of small info cards (Office, Budget, Status)
4. **BreakdownStatsAccordion** - Accordion with detailed statistics
5. **AutoCalcConfirmationModal** - Modal for auto-calculation toggle

### Target Design (Reference: Budget Tracking 2025)
```
┌─────────────────────────────────────────────────────────────────┐
│ [← Back]                                                        │
│ [Icon]  Title (Cinzel Font)            [Hide] [Recalc] [Log]   │
│         Description                                             │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│ │ Total       │  │ Total       │  │ Total Breakdowns        │  │
│ │ Allocated   │  │ Utilized    │  │ + Status Breakdown      │  │
│ │             │  │             │  │   • Completed: X        │  │
│ ├─────────────┤  ├─────────────┤  │   • Ongoing: X          │  │
│ │ Avg Util    │  │ Total       │  │   • Delayed: X          │  │
│ │ Rate        │  │ Obligated   │  │   ─────────────         │  │
│ └─────────────┘  └─────────────┘  │   Total: X              │  │
│                                   └─────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│ [BREAKDOWN HISTORY TABLE]                                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Implementation Plan

### Phase 1: Create BreakdownStatistics Component

**New File**: `components/ppdo/breakdown/shared/BreakdownStatistics.tsx`

Using the `StandardStatisticsGrid` shared component:

```typescript
interface BreakdownStatisticsProps {
  totalAllocated: number;
  totalUtilized: number;
  totalObligated: number;
  averageUtilizationRate: number;
  totalBreakdowns: number;
  statusCounts: {
    completed: number;
    ongoing: number;
    delayed: number;
  };
}
```

**Statistics Mapping**:
| Position | Label | Value Source |
|----------|-------|--------------|
| Col 1, Card 1 | Total Allocated Budget | Parent Entity's totalBudgetAllocated/received |
| Col 1, Card 2 | Average Utilization Rate | Calculated from breakdowns |
| Col 2, Card 1 | Total Utilized Budget | Sum of breakdown utilizedBudget |
| Col 2, Card 2 | Total Obligated Budget | Sum of breakdown obligatedBudget |
| Col 3 | Total Breakdown Records | Count + Status breakdown |

---

### Phase 2: Update BreakdownHeader Component

**File**: `components/ppdo/breakdown/shared/BreakdownHeader.tsx`

**Changes**:
1. Add icon box pattern using `PageHeaderWithIcon` shared component
2. Add entity type-based icon configuration:
   - **Project**: `Folder` icon + `bg-blue-100` / `text-blue-700`
   - **Trust Fund**: `Wallet` icon + `bg-emerald-100` / `text-emerald-700`
   - **SEF**: `GraduationCap` icon + `bg-indigo-100` / `text-indigo-700`
   - **SHF**: `HeartPulse` icon + `bg-rose-100` / `text-rose-700`
   - **20% DF**: `PieChart` icon + `bg-amber-100` / `text-amber-700`

3. Keep back link, action buttons (Hide Details, Recalculate, Activity Log)
4. Remove the collapsible `showHeader` functionality for the title (keep it always visible)

---

### Phase 3: Update Project Breakdown Page

**File**: `app/(private)/dashboard/(protected)/project/[year]/[particularId]/[projectbreakdownId]/page.tsx`

**Remove**:
- `StatusChainCard` import and usage
- `EntityOverviewCards` import and usage
- `BreakdownStatsAccordion` import and usage

**Add**:
- `BreakdownStatistics` component

**Statistics Data Mapping**:
```typescript
const breakdownStatistics = {
  totalAllocated: project?.totalBudgetAllocated || 0,
  totalUtilized: stats?.totalUtilizedBudget || 0,
  totalObligated: project?.obligatedBudget || 0,
  averageUtilizationRate: stats?.averageUtilizationRate || 0,
  totalBreakdowns: breakdownHistory?.length || 0,
  statusCounts: stats?.statusCounts || { completed: 0, ongoing: 0, delayed: 0 }
};
```

---

### Phase 4: Update Trust Fund Breakdown Page

**File**: `app/(private)/dashboard/(protected)/trust-funds/[year]/[slug]/page.tsx`

**Remove**:
- `EntityOverviewCards` import and usage
- `BreakdownStatsAccordion` import and usage
- `AutoCalcConfirmationModal` usage (keep import if needed elsewhere)

**Add**:
- `BreakdownStatistics` component

**Statistics Data Mapping**:
```typescript
const breakdownStatistics = {
  totalAllocated: trustFund?.received || 0,
  totalUtilized: stats?.totalUtilizedBudget || 0,
  totalObligated: trustFund?.obligatedPR || 0,
  averageUtilizationRate: stats?.averageUtilizationRate || 0,
  totalBreakdowns: breakdownHistory?.length || 0,
  statusCounts: stats?.statusCounts || { completed: 0, ongoing: 0, delayed: 0 }
};
```

---

### Phase 5: Update Special Education Fund Breakdown Page

**File**: `app/(private)/dashboard/(protected)/special-education-funds/[year]/[slug]/page.tsx`

Same changes as Trust Fund Breakdown Page.

**Icon**: `GraduationCap` + indigo colors

---

### Phase 6: Update Special Health Fund Breakdown Page

**File**: `app/(private)/dashboard/(protected)/special-health-funds/[year]/[slug]/page.tsx`

Same changes as Trust Fund Breakdown Page.

**Icon**: `HeartPulse` + rose colors

---

### Phase 7: Update 20% DF Breakdown Page

**File**: `app/(private)/dashboard/(protected)/20_percent_df/[year]/[slug]/page.tsx`

Same changes as Project Breakdown Page (uses similar structure).

**Icon**: `PieChart` + amber colors

---

## Components to Modify/Create

### New Components
| Component | Path | Purpose |
|-----------|------|---------|
| `BreakdownStatistics` | `components/ppdo/breakdown/shared/BreakdownStatistics.tsx` | 3-column statistics grid |

### Modified Components
| Component | Path | Changes |
|-----------|------|---------|
| `BreakdownHeader` | `components/ppdo/breakdown/shared/BreakdownHeader.tsx` | Add icon box pattern |

### Removed from Breakdown Pages (No longer needed)
| Component | Reason |
|-----------|--------|
| `StatusChainCard` | Not in reference design |
| `EntityOverviewCards` | Replaced by standard statistics |
| `BreakdownStatsAccordion` | Replaced by standard statistics |
| `AutoCalcConfirmationModal` | Remove from page (can keep component) |

---

## Files to Update

### Breakdown Page Files
```
app/(private)/dashboard/(protected)/project/[year]/[particularId]/[projectbreakdownId]/page.tsx
app/(private)/dashboard/(protected)/trust-funds/[year]/[slug]/page.tsx
app/(private)/dashboard/(protected)/special-education-funds/[year]/[slug]/page.tsx
app/(private)/dashboard/(protected)/special-health-funds/[year]/[slug]/page.tsx
app/(private)/dashboard/(protected)/20_percent_df/[year]/[slug]/page.tsx
```

### Component Files
```
components/ppdo/breakdown/shared/BreakdownHeader.tsx (modify)
components/ppdo/breakdown/shared/BreakdownStatistics.tsx (create)
components/ppdo/breakdown/index.ts (export new component)
```

---

## Detailed Changes by Page

### 1. Project Breakdown Page

**Current Structure**:
```tsx
<BreakdownHeader />
{showHeader && <StatusChainCard />}
{showHeader && <EntityOverviewCards />}
{showHeader && <BreakdownStatsAccordion />}
<BreakdownHistoryTable />
```

**New Structure**:
```tsx
<BreakdownHeader 
  icon={Folder}
  iconBgClass="bg-blue-100 dark:bg-blue-900/30"
  iconTextClass="text-blue-700 dark:text-blue-300"
/>
{showDetails && <BreakdownStatistics />}
<BreakdownHistoryTable />
```

### 2. Fund Breakdown Pages (Trust, SEF, SHF)

**Current Structure**:
```tsx
<BreakdownHeader />
<EntityOverviewCards />
<AutoCalcConfirmationModal />
{showHeader && <BreakdownStatsAccordion />}
<BreakdownHistoryTable />
```

**New Structure**:
```tsx
<BreakdownHeader 
  icon={Wallet/GraduationCap/HeartPulse}
  iconBgClass="..."
  iconTextClass="..."
/>
{showDetails && <BreakdownStatistics />}
<BreakdownHistoryTable />
```

---

## Color Scheme for Breakdown Pages

| Entity Type | Icon | Background | Text | Status Dots |
|-------------|------|------------|------|-------------|
| Project | Folder | blue-100 | blue-700 | zinc-700/600/500 |
| Trust Fund | Wallet | emerald-100 | emerald-700 | zinc-700/600/500 |
| SEF | GraduationCap | indigo-100 | indigo-700 | zinc-700/600/500 |
| SHF | HeartPulse | rose-100 | rose-700 | zinc-700/600/500 |
| 20% DF | PieChart | amber-100 | amber-700 | zinc-700/600/500 |

---

## Acceptance Criteria

- [ ] All breakdown pages use icon box header pattern
- [ ] All breakdown pages use 3-column statistics grid
- [ ] StatusChainCard removed from Project breakdown page
- [ ] EntityOverviewCards removed from all breakdown pages
- [ ] BreakdownStatsAccordion removed from all breakdown pages
- [ ] Standard 5 statistics displayed (Allocated, Utilized, Obligated, Rate, Count)
- [ ] Status breakdown shows Completed/Ongoing/Delayed with gray dots
- [ ] Dark mode styling consistent
- [ ] Responsive design works on mobile
- [ ] Back navigation works correctly
- [ ] Activity Log button positioned consistently

---

## Migration Strategy

1. **Phase 1**: Create `BreakdownStatistics` component
2. **Phase 2**: Update `BreakdownHeader` with icon support
3. **Phase 3**: Update Project breakdown page (test thoroughly)
4. **Phase 4**: Update Trust Fund breakdown page
5. **Phase 5**: Update SEF breakdown page
6. **Phase 6**: Update SHF breakdown page
7. **Phase 7**: Update 20% DF breakdown page
8. **Phase 8**: QA testing across all pages

---

## Notes

1. **Data Consistency**: Ensure `useEntityStats` hook provides correct data for statistics
2. **Obligated Budget**: For funds, use `obligatedPR` field; for projects, use `obligatedBudget`
3. **Auto-Calc Toggle**: Can be moved to a settings menu or kept as a subtle toggle
4. **Status Colors**: All status indicators use gray scale (zinc) for consistency
5. **Cinzel Font**: Ensure all titles use `font-family: var(--font-cinzel), serif`

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Users missing StatusChain info | Medium | The status is still shown in the statistics card |
| Users missing EntityOverviewCards | Low | Same info available in statistics grid |
| Auto-calc toggle less visible | Low | Can be moved to table toolbar |
| Data calculation errors | High | Thoroughly test stats hook integration |
