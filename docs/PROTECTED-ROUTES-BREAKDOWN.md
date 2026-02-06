# Protected Dashboard Routes - Complete Breakdown

> Documentation for all 5 protected fund management routes in `app/(private)/dashboard/(protected)/`

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [20% Development Fund](#20-development-fund)
3. [Project](#project)
4. [Special Education Funds](#special-education-funds)
5. [Special Health Funds](#special-health-funds)
6. [Trust Funds](#trust-funds)
7. [Shared Components Matrix](#shared-components-matrix)
8. [Toolbar Actions Summary](#toolbar-actions-summary)

---

## Architecture Overview

### Common Patterns Across All Routes

All 5 routes follow a **3-level navigation hierarchy**:

```
Level 0: Landing Page (Fiscal Years)
    └── Level 1: Year Page (Main Table/List)
            └── Level 2: Breakdown Detail Page (History Records)
```

### Shared Component Libraries

| Library | Location | Used By |
|---------|----------|---------|
| Fiscal Years | `components/ppdo/fiscal-years/` | All 5 routes |
| Funds | `components/ppdo/funds/` | Trust, Special Education, Special Health |
| Breakdown | `components/ppdo/breakdown/` | All 5 routes |
| Twenty Percent DF | `components/ppdo/twenty-percent-df/` | 20% DF |
| Table Toolbar | `components/ppdo/table/toolbar/` | All 5 routes |

### API Architecture (Convex)

Each fund type has dedicated API endpoints:
- `api.{fundType}.list` - List all items
- `api.{fundType}.get` - Get single item
- `api.{fundType}.create` - Create item
- `api.{fundType}.update` - Update item
- `api.{fundType}.moveToTrash` - Soft delete
- `api.{fundType}Breakdowns.getBreakdowns` - Get breakdown history

---

## 20% Development Fund

### Directory Structure

```
app/(private)/dashboard/(protected)/20_percent_df/
├── page.tsx                                    [Landing - Fiscal Years]
├── [year]/
│   ├── page.tsx                               [Year View - Table]
│   ├── components/
│   │   └── TwentyPercentDFYearHeader.tsx
│   └── [slug]/
│       └── page.tsx                           [Breakdown Detail]
```

### Page Breakdown

#### Landing Page (`page.tsx`)
**Component:** `TwentyPercentDFLanding`

| Feature | Description |
|---------|-------------|
| Fiscal Year Cards | Expandable cards showing year statistics |
| Statistics | Fund count, total allocated, utilized, balance, avg utilization |
| Actions | Add year, delete year, open latest |

**Queries Used:**
- `api.fiscalYears.list`
- `api.twentyPercentDF.list`

---

#### Year Page (`[year]/page.tsx`)
**Component:** `YearTwentyPercentDFPage`

| Feature | Description |
|---------|-------------|
| Statistics Cards | Allocated, Utilized, Obligated, Utilization Rate |
| Main Table | Category-grouped projects with CRUD |
| View Modes | Table only (no Kanban) |

**Key Components:**
- `TwentyPercentDFYearHeader`
- `TwentyPercentDFStatistics`
- `TwentyPercentDFTable`

---

#### Breakdown Page (`[year]/[slug]/page.tsx`)
**Component:** `TwentyPercentDFBreakdownPage`

| Feature | Description |
|---------|-------------|
| Overview Cards | Budget, status, implementing office |
| Breakdown Table | Historical records with add/edit/delete |
| Auto-Calculate | Toggle for financial auto-computation |

**Key Components:**
- `BreakdownHeader`
- `EntityOverviewCards`
- `BreakdownStatsAccordion`
- `BreakdownHistoryTable`

---

### Table Component Details

**Component:** `TwentyPercentDFTable`
**Location:** `components/ppdo/twenty-percent-df/components/TwentyPercentDFTable.tsx`

#### Columns

| ID | Label | Sortable | Filterable |
|----|-------|----------|------------|
| `particulars` | Particulars | Yes | No |
| `implementingOffice` | Implementing Office | No | Yes |
| `year` | Year | No | Yes |
| `status` | Status | No | Yes |
| `totalBudgetAllocated` | Allocated Budget | Yes | No |
| `obligatedBudget` | Obligated Budget | Yes | No |
| `totalBudgetUtilized` | Utilized Budget | Yes | No |
| `utilizationRate` | Utilization Rate | Yes | No |
| `projectCompleted` | Completed | Yes | No |
| `projectDelayed` | Delayed | Yes | No |
| `projectsOngoing` | Ongoing | Yes | No |
| `remarks` | Remarks | No | No |

#### Toolbar Actions

| Action | Description | Admin Only |
|--------|-------------|------------|
| Search | Filter by particulars, office, status | No |
| Add New | Create new 20% DF item | No |
| Column Visibility | Toggle columns on/off | No |
| Export CSV | Download filtered data | No |
| Print Preview | Print with settings | No |
| Bulk Delete | Move selected to trash | Yes |
| Bulk Category Change | Update category for multiple | Yes |
| Bulk Toggle Auto-Calc | Toggle auto-calculation | Yes |
| Share | Access management | No |
| Trash | View deleted items | No |

#### Context Menu Actions

- Pin/Unpin
- View Activity Log
- Change Category
- Edit
- Delete
- Toggle Auto-Calculate

---

## Project

### Directory Structure

```
app/(private)/dashboard/(protected)/project/
├── page.tsx                              [Level 0: Fiscal Years]
├── _components/
│   └── FiscalYearModal.tsx
├── _docs/                               [Documentation]
├── [year]/
│   └── page.tsx                         [Level 1: Budget Items]
├── [year]/[particularId]/
│   └── page.tsx                         [Level 2: Projects]
├── [year]/[particularId]/[projectbreakdownId]/
│   ├── page.tsx                         [Level 3: Breakdowns]
│   ├── _components/
│   │   └── StatusChainCard.tsx
│   └── _lib/
│       └── page-helpers.ts
└── [year]/[particularId]/[projectbreakdownId]/[inspectionId]/
    ├── page.tsx                         [Level 4: Inspection Detail]
    ├── data.ts
    ├── utils.ts
    └── _types/
        └── inspection.ts
```

### Page Breakdown (4-Level Hierarchy)

#### Level 0: Landing Page (`page.tsx`)
**Component:** `ProjectDashboardLanding`

| Feature | Description |
|---------|-------------|
| Fiscal Year Cards | Year selection with project stats |
| Statistics | Projects, breakdowns, budget items per year |
| Progress | Overall progress indicator |

---

#### Level 1: Budget Items (`[year]/page.tsx`)
**Component:** `YearBudgetPage`

| Feature | Description |
|---------|-------------|
| Statistics Cards | Allocated, Utilized, Obligated |
| Budget Table | Budget tracking with CRUD |
| Expand Modal | Full-screen view |

**Key Components:**
- `YearBudgetPageHeader`
- `BudgetStatistics`
- `BudgetTrackingTable`

---

#### Level 2: Projects (`[year]/[particularId]/page.tsx`)
**Component:** `ParticularProjectsPage`

| Feature | Description |
|---------|-------------|
| Category Grouping | Projects grouped by category |
| Status Cards | Status breakdown by type |
| Projects Table | Main table with CRUD |

**Key Components:**
- `ParticularPageHeader`
- `StatusInfoCard`
- `ProjectSummaryStats`
- `ProjectsTable`

---

#### Level 3: Breakdowns (`[year]/[particularId]/[projectbreakdownId]/page.tsx`)
**Component:** `ProjectBreakdownPage`

| Feature | Description |
|---------|-------------|
| Status Chain | 4-level status visualization |
| Breakdown Table | Historical records |
| Recalculate | Manual status recalculation |

**Status Chain Levels:**
1. MOA (Memorandum of Agreement)
2. PCIC (Pre-Construction/Implementation Check)
3. Delivery (Physical Delivery)
4. Liquidation (Final Settlement)

---

#### Level 4: Inspection (`[inspectionId]/page.tsx`)
**Component:** `BreakdownDetailPage`

| Tab | Content |
|-----|---------|
| Inspection | Inspection records with media |
| Financial | Hierarchical financial breakdown |
| Remarks | Comments/remarks thread |
| Analytics | Charts and visualizations |

---

### Unique Features

- **Status Chain Card:** Visual progression MOA → PCIC → Delivery → Liquidation
- **Status Calculation Rules:**
  - Priority 1: Any "ongoing" → parent = ongoing
  - Priority 2: Any "delayed" (no ongoing) → parent = delayed
  - Priority 3: All "completed" → parent = completed

---

## Special Education Funds

### Directory Structure

```
app/(private)/dashboard/(protected)/special-education-funds/
├── page.tsx                          [Landing - Fiscal Years]
├── [year]/
│   ├── page.tsx                      [Year View - Table/Kanban]
│   └── [slug]/
│       └── page.tsx                  [Breakdown Detail]
```

### Page Breakdown

#### Landing Page (`page.tsx`)
**Component:** `SpecialEducationFundsLanding`

| Feature | Description |
|---------|-------------|
| Fiscal Year Cards | Year selection with statistics |
| Statistics | Fund count, items, received, utilized, balance |
| Expandable Cards | Click to reveal detailed stats |

---

#### Year Page (`[year]/page.tsx`)
**Component:** `YearSpecialEducationFundsPage`

| Feature | Description |
|---------|-------------|
| View Toggle | Table ↔ Kanban (Ctrl+Shift+V) |
| Statistics | Received, utilized, balance, status breakdown |
| Table/Kanban | Main data view with CRUD |

**Key Components (Shared from `funds/`):**
- `FundsPageHeader`
- `FundsStatistics`
- `FundsTable`
- `FundsKanban`
- `FundsExpandModal`
- `FundsShareModal`

---

#### Breakdown Page (`[year]/[slug]/page.tsx`)
**Component:** `SpecialEducationFundBreakdownPage`

| Feature | Description |
|---------|-------------|
| Overview Cards | Budget, utilized, balance, status |
| Stats Accordion | Offices, locations, status counts |
| History Table | Breakdown records with CRUD |

**Key Components (Shared from `breakdown/`):**
- `BreakdownHeader`
- `EntityOverviewCards`
- `BreakdownStatsAccordion`
- `BreakdownHistoryTable`
- `BreakdownForm`

---

### Table Component Details

**Uses Shared:** `FundsTable` from `components/ppdo/funds/`

#### Columns

| ID | Label | Resizable |
|----|-------|-----------|
| `projectTitle` | Project Title | Yes |
| `officeInCharge` | Office In-Charge | No |
| `status` | Status | No |
| `dateReceived` | Date Received | No |
| `received` | Received | No |
| `obligatedPR` | Obligated PR | No |
| `utilized` | Utilized | No |
| `utilizationRate` | Utilization % | No |
| `balance` | Balance | No |
| `remarks` | Remarks | Yes |

#### Status Options

| Value | Label | Dot Color |
|-------|-------|-----------|
| `not_available` | N/A | zinc-400 |
| `on_process` | On Process | amber-500 |
| `ongoing` | Ongoing | zinc-500 |
| `completed` | Completed | zinc-600 |

---

## Special Health Funds

### Directory Structure

```
app/(private)/dashboard/(protected)/special-health-funds/
├── page.tsx                     [Landing - Fiscal Years]
├── [year]/
│   ├── page.tsx                [Year View - Table/Kanban]
│   └── [slug]/
│       └── page.tsx            [Breakdown Detail]
```

### Page Breakdown

*Structure identical to Special Education Funds*

#### Landing Page (`page.tsx`)
**Component:** `SpecialHealthFundsLanding`

---

#### Year Page (`[year]/page.tsx`)
**Component:** `YearSpecialHealthFundsPage`

| Feature | Description |
|---------|-------------|
| View Toggle | Table ↔ Kanban (Ctrl+Shift+V) |
| Statistics | Received, utilized, balance, status breakdown |
| Share | Access management with pending badge |

---

#### Breakdown Page (`[year]/[slug]/page.tsx`)
**Component:** `SpecialHealthFundBreakdownPage`

| Feature | Description |
|---------|-------------|
| Auto-Calculate Toggle | Financial auto-computation |
| Status Dropdown | Per-row status change |
| Activity Log | Entity history tracking |

---

### Table & Toolbar

*Uses same shared components as Special Education Funds:*
- `FundsTable`
- `FundsTableToolbar` (via adapter)
- Same column definitions
- Same status options

---

## Trust Funds

### Directory Structure

```
app/(private)/dashboard/(protected)/trust-funds/
├── page.tsx                              [Landing - Fiscal Years]
├── [year]/
│   ├── page.tsx                          [Year View - Table/Kanban]
│   ├── components/
│   │   ├── TrustFundsTable.tsx           [Legacy - Deprecated]
│   │   ├── TrustFundTableToolbar.tsx     [Adapter Re-export]
│   │   ├── TrustFundForm.tsx
│   │   ├── TrustFundStatistics.tsx
│   │   ├── YearTrustFundsPageHeader.tsx
│   │   └── hooks/
│   │       ├── useTrustFundData.ts       [Legacy - Deprecated]
│   │       └── useTrustFundMutations.ts  [Legacy - Deprecated]
│   └── [slug]/
│       └── page.tsx                      [Breakdown Detail]
```

### Page Breakdown

#### Landing Page (`page.tsx`)
**Component:** `TrustFundsLanding`

| Feature | Description |
|---------|-------------|
| Fiscal Year Cards | Year selection with trust fund stats |
| Statistics | Count, received, utilized, balance, avg utilization |
| Actions | Add year, delete year, open latest |

---

#### Year Page (`[year]/page.tsx`)
**Component:** `YearTrustFundsPage`

| Feature | Description |
|---------|-------------|
| View Toggle | Table ↔ Kanban (Ctrl+Shift+V) |
| Statistics | 5 cards (received, utilized, balance, projects, rate) |
| Share Modal | Access request management |
| Expand Modal | Spreadsheet view |

**Uses Shared Components:**
- `useFundsData` (generic hook)
- `useFundsMutations` (generic hook)
- `FundsPageHeader`
- `FundsStatistics`
- `FundsTable`

---

#### Breakdown Page (`[year]/[slug]/page.tsx`)
**Component:** `TrustFundBreakdownPage`

| Feature | Description |
|---------|-------------|
| Breadcrumb Nav | Year-formatted navigation |
| Overview Cards | Financial metrics |
| Auto-Calculate | Toggle with confirmation |
| History Table | Breakdown records with status |

---

### Legacy vs Shared Components

| Component | Status | Replaced By |
|-----------|--------|-------------|
| `TrustFundsTable` | Deprecated | `FundsTable` |
| `useTrustFundData` | Deprecated | `useFundsData` |
| `useTrustFundMutations` | Deprecated | `useFundsMutations` |
| `TrustFundTableToolbar` | Active | Re-exports from adapter |
| `TrustFundForm` | Active | Used directly |
| `TrustFundStatistics` | Active | Used directly |

---

## Shared Components Matrix

### Which Route Uses Which Shared Components

| Component | 20% DF | Project | Sp. Education | Sp. Health | Trust |
|-----------|--------|---------|---------------|------------|-------|
| `FiscalYearHeader` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `FiscalYearCard` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `FiscalYearModal` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `FiscalYearDeleteDialog` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `FiscalYearEmptyState` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `FundsTable` | ❌ | ❌ | ✅ | ✅ | ✅ |
| `FundsPageHeader` | ❌ | ❌ | ✅ | ✅ | ✅ |
| `FundsStatistics` | ❌ | ❌ | ✅ | ✅ | ✅ |
| `FundsKanban` | ❌ | ❌ | ✅ | ✅ | ✅ |
| `BreakdownHeader` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `EntityOverviewCards` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `BreakdownStatsAccordion` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `BreakdownHistoryTable` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `BreakdownForm` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `TrashBinModal` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `TrashConfirmationModal` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `ActivityLogSheet` | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## Toolbar Actions Summary

### Common Toolbar Actions (All Routes)

| Action | Icon | Keyboard | Description |
|--------|------|----------|-------------|
| Search | 🔍 | - | Filter by text |
| Add New | ➕ | - | Create new item |
| Column Visibility | 👁️ | - | Toggle columns |
| Export CSV | 📥 | - | Download data |
| Print | 🖨️ | Ctrl+P | Print/preview |
| Trash | 🗑️ | - | View deleted |
| Activity Log | 📋 | - | View history |

### Route-Specific Actions

| Action | 20% DF | Project | Sp. Education | Sp. Health | Trust |
|--------|--------|---------|---------------|------------|-------|
| Kanban View | ❌ | ❌ | ✅ | ✅ | ✅ |
| Share Modal | ✅ | ❌ | ✅ | ✅ | ✅ |
| Expand Modal | ✅ | ✅ | ✅ | ✅ | ✅ |
| Bulk Category | ✅ | ❌ | ❌ | ❌ | ❌ |
| Bulk Auto-Calc | ✅ | ❌ | ❌ | ❌ | ❌ |
| Status Chain | ❌ | ✅ | ❌ | ❌ | ❌ |
| Recalculate | ❌ | ✅ | ❌ | ❌ | ❌ |

### Context Menu Actions (Right-Click)

| Action | Description | All Routes |
|--------|-------------|------------|
| Pin/Unpin | Move to top | ✅ |
| View Activity Log | Entity history | ✅ |
| Edit | Open edit form | ✅ |
| Delete | Move to trash | ✅ |
| Change Status | Quick status update | ✅ |
| Change Category | 20% DF only | 20% DF |
| Toggle Auto-Calc | Toggle computation | 20% DF |

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      USER INTERACTION                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     PAGE COMPONENT                           │
│  ┌─────────────────┐  ┌──────────────────┐                  │
│  │  Route Params   │  │  State Management │                  │
│  │  (year, slug)   │  │  (modals, views)  │                  │
│  └─────────────────┘  └──────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  DATA HOOKS     │ │  UI COMPONENTS  │ │  MUTATIONS      │
│                 │ │                 │ │                 │
│ useFundsData    │ │ FundsTable      │ │ useFundsMutations│
│ useEntityStats  │ │ BreakdownTable  │ │ create/update   │
│ useEntityMeta   │ │ Statistics      │ │ moveToTrash     │
└─────────────────┘ └─────────────────┘ └─────────────────┘
              │               │               │
              └───────────────┼───────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     CONVEX BACKEND                           │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │  Queries    │  │  Mutations  │  │  Real-time  │          │
│  │  .list()    │  │  .create()  │  │  Subscriptions│         │
│  │  .get()     │  │  .update()  │  │              │          │
│  │  .stats()   │  │  .trash()   │  │              │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

---

## Quick Reference: API Endpoints

| Fund Type | List | Get | Create | Update | Trash | Breakdowns |
|-----------|------|-----|--------|--------|-------|------------|
| 20% DF | `twentyPercentDF.list` | `twentyPercentDF.get` | `twentyPercentDF.create` | `twentyPercentDF.update` | `twentyPercentDF.moveToTrash` | `twentyPercentDFBreakdowns.*` |
| Project | `budgetItems.list` | `budgetItems.get` | `budgetItems.create` | `budgetItems.update` | `budgetItems.moveToTrash` | `govtProjects.*` |
| Sp. Education | `specialEducationFunds.list` | `specialEducationFunds.get` | `specialEducationFunds.create` | `specialEducationFunds.update` | `specialEducationFunds.moveToTrash` | `specialEducationFundBreakdowns.*` |
| Sp. Health | `specialHealthFunds.list` | `specialHealthFunds.get` | `specialHealthFunds.create` | `specialHealthFunds.update` | `specialHealthFunds.moveToTrash` | `specialHealthFundBreakdowns.*` |
| Trust | `trustFunds.list` | `trustFunds.get` | `trustFunds.create` | `trustFunds.update` | `trustFunds.moveToTrash` | `trustFundBreakdowns.*` |

---

*Generated: 2026-02-05*
