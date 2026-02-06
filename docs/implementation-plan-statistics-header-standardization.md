# Implementation Plan: Statistics Summary Header Standardization

## Overview
Standardize all table pages to use the same UI/UX styling as the "Budget Tracking 2025" reference page for consistent app-wide styling.

## Reference Design (From Image)
The reference design consists of:

### 1. Header Section Pattern
```
┌─────────────────────────────────────────────────────────────────┐
│ [Icon Box]  Title (Cinzel Font)                    [Action Btn] │
│             Description/Subtitle                                │
└─────────────────────────────────────────────────────────────────┘
```
- **Icon Box**: Rounded-lg container with colored background (e.g., `bg-amber-100`)
- **Title**: Large text with Cinzel font family
- **Subtitle**: Smaller text describing the page purpose
- **Action Button**: Activity Log button on the right

### 2. Statistics Cards Pattern
```
┌─────────────────────────────────────────────────────────────────┐
│ ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│ │ Stat 1      │  │ Stat 3      │  │ Stat 5                  │  │
│ │             │  │             │  │ + Status Breakdown      │  │
│ ├─────────────┤  ├─────────────┤  │   • Completed: X        │  │
│ │ Stat 2      │  │ Stat 4      │  │   • Ongoing: X          │  │
│ │             │  │             │  │   • Delayed: X          │  │
│ └─────────────┘  └─────────────┘  │   ─────────────         │  │
│                                    │   Total: X              │  │
│                                   └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Layout**: 3-column grid on desktop
- Column 1 & 2: Two stacked stat cards each
- Column 3: One tall card with status breakdown sub-content

**Standard 5 Statistics**:
1. Total Budget Allocated (Currency)
2. Average Utilization Rate (Percentage)
3. Total Budget Utilized (Currency)
4. Total Obligated Budget (Currency)
5. Total Particulars/Projects (Count + Status Breakdown)

---

## Pages to Update

### ✅ Already Compliant
1. **Budget Tracking** (`project/[year]/page.tsx`)
   - Uses `YearBudgetPageHeader` with icon pattern
   - Uses `BudgetStatistics` with correct 3-column layout
   - Status breakdown: Completed, Ongoing, Delayed

### 🔧 Needs Updates

#### 1. 20% Development Fund (`20_percent_df/[year]/page.tsx`)
**Current State**:
- ✅ Header: `TwentyPercentDFYearHeader` already has icon pattern
- ✅ Statistics: `TwentyPercentDFStatistics` already has correct 3-column layout
- ⚠️ Minor: Icon color consistency check needed

**Action**: Verify icon colors match reference (amber-100/amber-700)

---

#### 2. Trust Funds (`trust-funds/[year]/page.tsx`)
**Current State**:
- ❌ Header: `FundsPageHeader` - NO icon pattern
- ❌ Statistics: `FundsStatistics` - Different layout (Received/Utilized/Balance/Rate/Projects)

**Required Changes**:
1. **Update `FundsPageHeader`**:
   - Add icon box with `Wallet` or `Landmark` icon
   - Use `bg-blue-100 dark:bg-blue-900/30` + `text-blue-700 dark:text-blue-300`
   - Add description subtitle

2. **Create new `FundsStatisticsV2`** matching BudgetStatistics pattern:
   - Change from: Total Received, Total Utilized, Total Balance, Utilization Rate, Total Projects
   - Change to: Total Budget Allocated, Total Budget Utilized, Total Obligated Budget, Average Utilization Rate, Total Particulars
   - Use 3-column grid layout with stacked cards
   - Add status breakdown in 3rd column (On Process, Ongoing, Completed)

---

#### 3. Special Education Funds (`special-education-funds/[year]/page.tsx`)
**Current State**: Same as Trust Funds

**Required Changes**: Same as Trust Funds
- Use `GraduationCap` icon with `bg-indigo-100 dark:bg-indigo-900/30`

---

#### 4. Special Health Funds (`special-health-funds/[year]/page.tsx`)
**Current State**: Same as Trust Funds

**Required Changes**: Same as Trust Funds
- Use `Heart` or `HeartPulse` icon with `bg-rose-100 dark:bg-rose-900/30`

---

#### 5. Project Particulars Page (`project/[year]/[particularId]/page.tsx`)
**Current State**:
- ✅ Header: `ParticularPageHeader` already has icon pattern (Folder icon)
- ❌ Statistics: `ProjectSummaryStats` - Different layout (4 cards in a row)
- ❌ Extra: `StatusInfoCard` - Additional card not in reference

**Required Changes**:
1. **Update `ProjectSummaryStats`** to match `BudgetStatistics`:
   - Change from 4-column grid to 3-column with stacked cards
   - Add: Total Budget Allocated, Total Budget Utilized, Total Obligated Budget, Average Utilization Rate, Total Projects
   - Add status breakdown in 3rd column

2. **Remove or integrate `StatusInfoCard`**:
   - Option A: Remove it (strict adherence to reference)
   - Option B: Keep but ensure visual consistency

---

#### 6. Breakdown Pages (Project, Trust Fund, SEF, SHF, 20% DF)
**Files**:
- `project/[year]/[particularId]/[projectbreakdownId]/page.tsx`
- `trust-funds/[year]/[slug]/page.tsx`
- `special-education-funds/[year]/[slug]/page.tsx`
- `special-health-funds/[year]/[slug]/page.tsx`
- `20_percent_df/[year]/[slug]/page.tsx`

**Current State**:
- ❌ Header: `BreakdownHeader` - NO icon pattern
- ❌ Statistics: `EntityOverviewCards` + `BreakdownStatsAccordion` - Completely different layout

**Required Changes**:
1. **Update `BreakdownHeader`**:
   - Add icon box pattern based on entity type:
     - Project: `Folder` icon with `bg-blue-100`
     - Trust Fund: `Wallet` icon with `bg-emerald-100`
     - SEF: `GraduationCap` icon with `bg-indigo-100`
     - SHF: `HeartPulse` icon with `bg-rose-100`
     - 20% DF: `PieChart` icon with `bg-amber-100`

2. **Create `BreakdownStatistics` component**:
   - Match `BudgetStatistics` layout (3-column grid)
   - Show: Total Breakdown Records, Total Allocated, Total Utilized, Average Utilization, Completion Rate, Total Status Distribution
   - Remove the accordion pattern

3. **Simplify or remove `EntityOverviewCards`**:
   - Option A: Remove (strict adherence)
   - Option B: Integrate minimal info into header

---

## Color Scheme by Page Type

| Page Type | Icon | Background | Text | Status Colors |
|-----------|------|------------|------|---------------|
| Budget Tracking | Calendar | amber-100 | amber-700 | Gray scale (zinc-700/600/500) |
| 20% DF | PieChart | amber-100 | amber-700 | Gray scale |
| Trust Funds | Wallet | emerald-100 | emerald-700 | Gray scale |
| Special Education | GraduationCap | indigo-100 | indigo-700 | Gray scale |
| Special Health | HeartPulse | rose-100 | rose-700 | Gray scale |
| Projects | Folder | blue-100 | blue-700 | Gray scale |

---

## Component Architecture

### New Shared Components to Create

1. **`components/ppdo/shared/PageHeaderWithIcon.tsx`**
   - Reusable header with icon box pattern
   - Props: icon, iconBgClass, iconTextClass, title, description, year, actionButton

2. **`components/ppdo/shared/StandardStatisticsGrid.tsx`**
   - Reusable 3-column statistics grid
   - Props: stats array, statusBreakdown, statusConfig

3. **`components/ppdo/shared/StatCard.tsx`**
   - Individual stat card component
   - Props: label, value, subContent (optional)

### Updated Components

1. **`FundsPageHeader`** → Add icon pattern
2. **`FundsStatistics`** → Match BudgetStatistics layout
3. **`ProjectSummaryStats`** → Match BudgetStatistics layout
4. **`BreakdownHeader`** → Add icon pattern

---

## Implementation Phases

### Phase 1: Create Shared Components
1. Create `PageHeaderWithIcon` component
2. Create `StandardStatisticsGrid` component
3. Refactor `BudgetStatistics` to use shared components

### Phase 2: Update Funds Pages
1. Update `FundsPageHeader` with icon pattern
2. Update `FundsStatistics` to match standard layout
3. Apply to Trust Funds, SEF, SHF pages

### Phase 3: Update Project Particulars Page
1. Update `ProjectSummaryStats` to match standard layout
2. Review `StatusInfoCard` necessity

### Phase 4: Update 20% DF Page
1. Verify icon colors match reference
2. Minor adjustments if needed

### Phase 5: Update Breakdown Pages
1. Update `BreakdownHeader` with icon pattern
2. Create `BreakdownStatistics` component
3. Simplify statistics display

### Phase 6: QA Testing
1. Visual comparison with reference
2. Responsive design testing
3. Dark mode verification

---

## Files to Modify

### Components
```
components/ppdo/funds/components/FundsPageHeader.tsx
components/ppdo/funds/components/FundsStatistics.tsx
components/ppdo/projects/components/ProjectSummaryStats.tsx
components/ppdo/projects/components/ParticularPageHeader.tsx
components/ppdo/breakdown/shared/BreakdownHeader.tsx
components/ppdo/twenty-percent-df/components/TwentyPercentDFYearHeader.tsx
components/ppdo/11_project_plan/components/BudgetStatistics.tsx
components/ppdo/11_project_plan/components/YearBudgetPageHeader.tsx
```

### Pages
```
app/(private)/dashboard/(protected)/trust-funds/[year]/page.tsx
app/(private)/dashboard/(protected)/special-education-funds/[year]/page.tsx
app/(private)/dashboard/(protected)/special-health-funds/[year]/page.tsx
app/(private)/dashboard/(protected)/20_percent_df/[year]/page.tsx
app/(private)/dashboard/(protected)/project/[year]/[particularId]/page.tsx
app/(private)/dashboard/(protected)/project/[year]/[particularId]/[projectbreakdownId]/page.tsx
app/(private)/dashboard/(protected)/trust-funds/[year]/[slug]/page.tsx
app/(private)/dashboard/(protected)/special-education-funds/[year]/[slug]/page.tsx
app/(private)/dashboard/(protected)/special-health-funds/[year]/[slug]/page.tsx
app/(private)/dashboard/(protected)/20_percent_df/[year]/[slug]/page.tsx
```

### New Files
```
components/ppdo/shared/PageHeaderWithIcon.tsx
components/ppdo/shared/StandardStatisticsGrid.tsx
components/ppdo/shared/StatCard.tsx
components/ppdo/breakdown/shared/BreakdownStatistics.tsx
```

---

## Design Specifications

### Header Section
```css
/* Icon Container */
.p-3.rounded-lg.bg-amber-100.dark:bg-amber-900/30

/* Icon */
.w-6.h-6.text-amber-700.dark:text-amber-300

/* Title */
.text-3xl.sm:text-4xl.font-semibold
font-family: var(--font-cinzel), serif

/* Description */
.text-sm.text-zinc-600.dark:text-zinc-400.mt-1
```

### Statistics Grid
```css
/* Container */
.grid.grid-cols-1.md:grid-cols-2.lg:grid-cols-3.gap-4.mb-6

/* Stat Card */
Card > CardContent.py-6.px-6

/* Label */
.text-sm.font-medium.text-zinc-600.dark:text-zinc-400

/* Value */
.text-2xl.font-bold.text-zinc-900.dark:text-zinc-100
```

### Status Breakdown (3rd Column)
```css
/* Container */
.mt-3.flex.flex-col.gap-1.text-xs.text-zinc-500

/* Status Dot */
.w-1.5.h-1.5.rounded-full.bg-zinc-700/600/500

/* Divider */
.h-px.bg-zinc-200.dark:bg-zinc-700.my-1

/* Total Row */
.font-medium.text-zinc-700.dark:text-zinc-300
```

---

## Acceptance Criteria

- [ ] All table pages use consistent header with icon box pattern
- [ ] All table pages use 3-column statistics grid layout
- [ ] All stat cards use consistent typography (label: text-sm, value: text-2xl bold)
- [ ] Status breakdown shows in 3rd column with gray dot indicators
- [ ] Dark mode styling is consistent across all pages
- [ ] Responsive design works on mobile (stacks to single column)
- [ ] Activity Log button is positioned consistently on all pages
- [ ] Show/Hide Details toggle is available on all relevant pages

---

## Notes

1. **Strict Adherence**: Remove extra components that don't match the reference design (e.g., `StatusInfoCard`, `EntityOverviewCards` accordion)

2. **Icon Consistency**: Use Lucide icons consistently:
   - Calendar for Budget/20% DF
   - Wallet/Landmark for Trust Funds
   - GraduationCap for SEF
   - HeartPulse for SHF
   - Folder for Projects

3. **Color Consistency**: All status indicators in statistics should use gray scale (zinc) like the reference, not colored dots

4. **Typography**: Always use Cinzel font for titles

5. **Spacing**: Use consistent `mb-6` spacing between sections
