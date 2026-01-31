# PPDO Components Documentation

> Reusable component library for the Provincial Planning and Development Office (Philippines)

---

## Table of Contents

1. [Architecture Overview](./01-architecture-overview.md)
2. [Breakdown Components](./02-breakdown-components.md)
3. [Dashboard Components](./03-dashboard-components.md)
4. [Projects Components](./04-projects-components.md)
5. [Funds Components](./05-funds-components.md)
6. [Table Components](./06-table-components.md)
7. [Shared Components](./07-shared-components.md)
8. [Static Components](./08-static-components.md)
9. [Component Patterns](./09-component-patterns.md)

---

## Quick Start

### Import Patterns

```typescript
// Barrel imports (preferred)
import {
  BreakdownForm,
  BreakdownHistoryTable,
  useTableSettings,
} from "@/components/ppdo/breakdown";

import {
  DashboardChartCard,
  KPICardsRow,
} from "@/components/ppdo/dashboard";

import {
  ProjectForm,
  ProjectsTable,
} from "@/components/ppdo/projects";
```

---

## Component Categories

```
components/ppdo/
│
├── breakdown/           # Project/Fund breakdown components
│   ├── form/           # Breakdown form fields
│   ├── table/          # Breakdown data tables
│   ├── kanban/         # Kanban board view
│   ├── shared/         # Shared breakdown UI
│   ├── hooks/          # Custom hooks
│   ├── types/          # TypeScript types
│   └── utils/          # Utilities
│
├── dashboard/          # Dashboard landing & analytics
│   ├── charts/         # Data visualization
│   ├── landing/        # Fiscal year landing
│   └── summary/        # Dashboard summary
│
├── fiscal-years/       # Fiscal year shared components
│
├── funds/              # Trust Funds, SEF, SHF components
│
├── projects/           # Project management components
│
├── shared/             # Cross-module shared components
│   ├── kanban/         # Reusable kanban
│   └── toolbar/        # Shared toolbar
│
├── static/             # Landing page (marketing) components
│
├── table/              # Table system components
│   ├── implementing-office/
│   ├── print-preview/
│   └── toolbar/
│
├── twenty-percent-df/  # 20% Development Fund components
│
└── [standalone files]  # Individual components
    ├── LoadingState.tsx
    ├── BaseShareModal.tsx
    └── ...
```

---

## Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    COMPONENT HIERARCHY                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  PAGE LEVEL                          │   │
│  │  (app/dashboard/.../page.tsx)                        │   │
│  └────────────────────┬────────────────────────────────┘   │
│                       │                                     │
│  ┌────────────────────▼────────────────────────────────┐   │
│  │               MODULE COMPONENTS                      │   │
│  │  (components/ppdo/breakdown, projects, funds)        │   │
│  └────────────────────┬────────────────────────────────┘   │
│                       │                                     │
│  ┌────────────────────▼────────────────────────────────┐   │
│  │               SHARED COMPONENTS                      │   │
│  │  (components/ppdo/shared, table)                     │   │
│  └────────────────────┬────────────────────────────────┘   │
│                       │                                     │
│  ┌────────────────────▼────────────────────────────────┐   │
│  │                 UI COMPONENTS                        │   │
│  │  (components/ui - shadcn/ui base)                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Features

### 1. Modular Architecture
Each module (breakdown, projects, funds) is self-contained with:
- Components
- Hooks
- Types
- Utilities
- Constants

### 2. Table System
Comprehensive table system with:
- Sorting
- Filtering
- Column resize
- Column reorder
- Print preview
- Bulk actions

### 3. Form System
Standardized forms with:
- React Hook Form
- Zod validation
- Field components
- Auto-calculation
- Budget validation

### 4. Print System
Canvas-based print preview with:
- PDF generation
- Template system
- Draft saving

---

## Related Documentation

- [Dashboard Docs](../../app/dashboard/_docs/README.md)
- [Project README](../../../README.md)

---

*Maintained by: Product & Documentation Lead*  
*Part of: PPDO Next.js + Convex Project*
