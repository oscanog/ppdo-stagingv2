# Component Architecture Overview

> Understanding the PPDO component library structure

---

## Component Library Structure

```
components/ppdo/
│
├── Core Design Principles:
│   ├── Modularity - Self-contained modules
│   ├── Reusability - Shared components
│   ├── Type Safety - Full TypeScript coverage
│   └── Consistency - Common patterns throughout
│
├── Module Organization:
│   ├── Each module has index.ts (barrel exports)
│   ├── Components grouped by functionality
│   ├── Hooks co-located with components
│   └── Types shared across module
│
└── Import Pattern:
    └── import { X } from "@/components/ppdo/module";
```

---

## Module Breakdown

### 1. Breakdown Module (`components/ppdo/breakdown`)
Manages project and fund breakdown items.

```
breakdown/
├── form/                    # Form components
│   ├── BreakdownForm.tsx   # Main form
│   ├── *Field.tsx          # Individual fields
│   └── utils/              # Form validation
├── table/                   # Table components
│   ├── BreakdownHistoryTable.tsx
│   ├── TableHeader.tsx
│   ├── TableRow.tsx
│   └── TableTotalsRow.tsx
├── kanban/                  # Kanban view
│   └── BreakdownKanban.tsx
├── shared/                  # Shared UI
│   ├── BreakdownHeader.tsx
│   ├── EntityOverviewCards.tsx
│   └── BreakdownStatsAccordion.tsx
├── hooks/                   # Custom hooks
│   ├── useTableSettings.ts
│   ├── useTableResize.ts
│   └── useColumnDragDrop.ts
├── types/                   # TypeScript types
│   └── breakdown.types.ts
├── utils/                   # Utilities
│   ├── formatters.ts
│   ├── helpers.ts
│   └── navigation.utils.ts
├── constants/               # Constants
│   └── table.constants.ts
└── lib/                     # Libraries
    └── print-adapters/
        └── BreakdownPrintAdapter.ts
```

### 2. Dashboard Module (`components/ppdo/dashboard`)
Dashboard landing and analytics components.

```
dashboard/
├── charts/                  # Data visualization
│   ├── BudgetStatusProgressList.tsx
│   ├── DashboardChartCard.tsx
│   ├── DepartmentUtilizationHorizontalBar.tsx
│   ├── ProjectActivityTimeline.tsx
│   ├── ProjectStatusVerticalBar.tsx
│   ├── TabbedPieChart.tsx
│   └── TrustFundLineChart.tsx
├── landing/                 # Fiscal year landing
│   ├── DashboardFundSelection.tsx
│   ├── FiscalYearLanding.tsx
│   └── FiscalYearLandingCard.tsx
└── summary/                 # Dashboard summary
    ├── DashboardSummary.tsx
    ├── KPICardsRow.tsx
    └── AnalyticsGrid.tsx
```

### 3. Projects Module (`components/ppdo/projects`)
Project management components.

```
projects/
├── components/
│   ├── ProjectsTable.tsx           # Main projects table
│   ├── ProjectsTable/              # Table subcomponents
│   │   ├── ColumnVisibilityMenu.tsx
│   │   ├── ProjectBulkActions.tsx
│   │   ├── ProjectCategoryFilter.tsx
│   │   ├── ProjectCategoryGroup.tsx
│   │   ├── ProjectContextMenu.tsx
│   │   ├── ProjectsTableBody.tsx
│   │   ├── ProjectsTableFooter.tsx
│   │   ├── ProjectsTableHeader.tsx
│   │   ├── ProjectsTableRow.tsx
│   │   ├── ProjectsTableToolbar.tsx
│   │   └── SortIcon.tsx
│   ├── ProjectForm.tsx             # Project form
│   ├── ProjectSummaryStats.tsx     # Statistics display
│   ├── ProjectLoadingState.tsx     # Loading skeleton
│   ├── StatusInfoCard.tsx          # Status display
│   ├── ParticularPageHeader.tsx    # Page header
│   ├── ProjectExpandModal.tsx      # Expand modal
│   ├── ProjectShareModal.tsx       # Share modal
│   ├── ProjectBulkToggleDialog.tsx # Bulk toggle
│   ├── ProjectCategoryCombobox.tsx # Category selector
│   └── ProjectParticularCombobox.tsx
├── hooks/
│   ├── useParticularAccess.ts
│   ├── useParticularData.ts
│   └── useProjectMutations.ts
├── types/
│   └── index.ts
├── utils/
│   └── index.ts
└── constants/
    └── projectSpreadsheetConfig.ts
```

### 4. Funds Module (`components/ppdo/funds`)
Trust Funds, SEF, SHF components.

```
funds/
├── components/
│   ├── FundsTable.tsx
│   ├── FundsPageHeader.tsx
│   ├── FundsStatistics.tsx
│   ├── FundsKanban.tsx
│   ├── context-menu/
│   │   └── FundsContextMenu.tsx
│   ├── modals/
│   │   └── PrintOrientationModal.tsx
│   ├── table/
│   │   ├── FundsTableBody.tsx
│   │   ├── FundsTableHeader.tsx
│   │   ├── FundsTableRow.tsx
│   │   └── FundsTableTotalRow.tsx
│   └── toolbar/
│       └── FundsTableToolbar.tsx
├── form/
│   └── FundForm.tsx
├── hooks/
│   ├── useFundsData.ts
│   ├── useFundsMutations.ts
│   ├── useFundsPrintDraft.ts
│   ├── useTableFilter.ts
│   ├── useTableSelection.ts
│   ├── useTableSort.ts
│   ├── useColumnResize.ts
│   └── useColumnWidths.ts
├── types/
│   └── index.ts
├── utils/
│   └── index.ts
├── constants/
│   └── index.ts
└── lib/
    └── print-adapters/
        └── FundsPrintAdapter.ts
```

### 5. Table Module (`components/ppdo/table`)
Reusable table system components.

```
table/
├── implementing-office/     # Office selector
│   ├── ImplementingOfficeSelector.tsx
│   ├── components/
│   ├── hooks/
│   ├── types.ts
│   ├── utils.ts
│   └── constants.ts
├── print-preview/           # Print system
│   ├── PrintPreviewModal.tsx
│   ├── PrintPreviewToolbar.tsx
│   ├── ColumnVisibilityPanel.tsx
│   ├── DocumentTitleEditor.tsx
│   ├── PageOrientationTab.tsx
│   ├── TemplateSelector.tsx
│   ├── TemplateApplicationModal.tsx
│   ├── table-borders/
│   │   └── TableBorderOverlay.tsx
│   └── table-resize/        # Resize system
│       ├── TableResizeHandle.tsx
│       ├── TableResizeOverlay.tsx
│       ├── DimensionTooltip.tsx
│       └── types.ts
└── toolbar/                 # Toolbar system
    ├── TableToolbar.tsx
    ├── BudgetTableToolbar.tsx
    ├── BudgetColumnVisibilityMenu.tsx
    ├── TableToolbarBulkActions.tsx
    ├── adapters/
    │   ├── BudgetTableToolbar.tsx
    │   ├── FundsTableToolbar.tsx
    │   └── ProjectsTableToolbar.tsx
    └── types.ts
```

### 6. Shared Module (`components/ppdo/shared`)
Cross-module reusable components.

```
shared/
├── kanban/                  # Reusable kanban
│   ├── KanbanBoard.tsx
│   ├── KanbanColumn.tsx
│   ├── KanbanCard.tsx
│   ├── SortableKanbanCard.tsx
│   └── KanbanFieldVisibilityMenu.tsx
└── toolbar/
    └── StatusVisibilityMenu.tsx
```

### 7. Static Module (`components/ppdo/static`)
Landing page (marketing) components.

```
static/
├── PPDOBanner.tsx          # Hero banner
├── PPDOAbout.tsx           # About section
├── PPDOFeatures.tsx        # Features grid
└── PPDOActivities.tsx      # Activities showcase
```

### 8. Fiscal Years Module (`components/ppdo/fiscal-years`)
Shared fiscal year components.

```
fiscal-years/
├── FiscalYearCard.tsx
├── FiscalYearHeader.tsx
├── FiscalYearEmptyState.tsx
├── FiscalYearModal.tsx
└── FiscalYearDeleteDialog.tsx
```

### 9. Twenty Percent DF Module (`components/ppdo/twenty-percent-df`)
20% Development Fund components (similar to projects).

---

## Component Composition Pattern

### Example: Building a Breakdown Page

```tsx
// Page composition using PPDO components
import {
  BreakdownHeader,
  EntityOverviewCards,
  BreakdownStatsAccordion,
  BreakdownHistoryTable,
  BreakdownForm,
  useTableSettings,
} from "@/components/ppdo/breakdown";

export default function BreakdownPage() {
  const tableSettings = useTableSettings();
  
  return (
    <div className="space-y-6">
      {/* Header with navigation */}
      <BreakdownHeader
        title="Project Breakdowns"
        breadcrumbs={[...]}
      />
      
      {/* Overview cards */}
      <EntityOverviewCards
        entity={projectData}
        stats={calculateStats()}
      />
      
      {/* Stats accordion */}
      <BreakdownStatsAccordion
        budgetAllocated={1000000}
        budgetUtilized={750000}
        breakdownsCount={15}
      />
      
      {/* Data table */}
      <BreakdownHistoryTable
        breakdowns={breakdowns}
        settings={tableSettings}
      />
      
      {/* Add/Edit form */}
      <BreakdownForm
        onSubmit={handleSubmit}
        budgetLimit={remainingBudget}
      />
    </div>
  );
}
```

---

## Design Patterns

### 1. Container/Presentational
```tsx
// Container (handles data)
export function BudgetContainer() {
  const data = useQuery(api.budgetItems.list, {});
  return <BudgetTable data={data} />;
}

// Presentational (pure UI)
export function BudgetTable({ data }: BudgetTableProps) {
  return <table>...</table>;
}
```

### 2. Compound Components
```tsx
// Table with related components
<ProjectsTable>
  <ProjectsTable.Header />
  <ProjectsTable.Body />
  <ProjectsTable.Footer />
</ProjectsTable>
```

### 3. Render Props
```tsx
<KanbanBoard
  renderCard={(item) => <KanbanCard item={item} />}
  renderColumn={(column) => <KanbanColumn column={column} />}
/>
```

### 4. Custom Hooks
```tsx
// Logic extraction into hooks
function useBudgetData(year: number) {
  const data = useQuery(api.budgetItems.getByYear, { year });
  const mutations = useBudgetMutations();
  return { data, ...mutations };
}
```

---

## Type Definitions

### Common Types Pattern
```typescript
// types/index.ts
export interface BaseEntity {
  _id: string;
  _creationTime: number;
  isActive: boolean;
}

export interface WithBudget {
  budgetAllocated: number;
  budgetUtilized: number;
  budgetBalance: number;
}

export interface WithStatus {
  status: StatusType;
  statusHistory: StatusChange[];
}
```

---

## Export Patterns

### Barrel Export (index.ts)
```typescript
// Good: Organized barrel exports
// components/ppdo/breakdown/index.ts

// Components
export { BreakdownForm } from "./form/BreakdownForm";
export { BreakdownHistoryTable } from "./table/BreakdownHistoryTable";

// Hooks
export { useTableSettings } from "./hooks/useTableSettings";

// Types
export type { Breakdown, BreakdownFormValues } from "./types";

// Utils
export { formatCurrency, formatDate } from "./utils";
```

---

## Related Documentation

- [Breakdown Components](./02-breakdown-components.md)
- [Dashboard Components](./03-dashboard-components.md)
- [Component Patterns](./09-component-patterns.md)
