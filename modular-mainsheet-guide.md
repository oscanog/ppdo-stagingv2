 Phase 1: Make MainSheet Modular (Day 1-2)
Goal: Break down MainSheet into reusable, configurable components
Step 1: Create Core Spreadsheet Components ✅
app/components/Spreadsheet/
├── SpreadsheetContainer.tsx       // Main wrapper
├── SpreadsheetHeader.tsx          // Top header with title, year, actions
├── SpreadsheetMenuBar.tsx         // File, Export, Insert menu
├── SpreadsheetFormulaBar.tsx      // Formula bar (cell reference + input)
├── SpreadsheetGrid.tsx            // The main grid (columns + rows)
├── SpreadsheetCell.tsx            // Individual cell component
├── SpreadsheetSheetTabs.tsx       // Bottom tabs
├── ExportModal.tsx                // CSV export confirmation modal
└── types.ts                       // Shared types
Step 2: Create Configuration System 🔧
typescript// app/components/Spreadsheet/config.ts

interface SpreadsheetConfig {
  // Data source
  tableName: string;                    // "budgetItems" | "projects"
  fetchQuery: string;                   // Convex API endpoint
  
  // Column definitions
  columns: ColumnDefinition[];
  
  // Features
  features: {
    enableExport: boolean;
    enablePrint: boolean;
    enableShare: boolean;
    showTotalsRow: boolean;
    showTotalsColumn: boolean;
  };
  
  // Styling
  accentColor?: string;
  title: string;
}

📋 Phase 2: Make It Reusable for Projects Table (Day 3-4)
Step 1: Create Project Spreadsheet Configuration
typescript// app/dashboard/project/budget/[particularId]/config/projectSpreadsheetConfig.ts

export const PROJECT_SPREADSHEET_CONFIG: SpreadsheetConfig = {
  tableName: "projects",
  fetchQuery: "api.projects.list",
  columns: [
    { key: "particulars", label: "PARTICULARS", type: "text" },
    { key: "implementingOffice", label: "IMPLEMENTING OFFICE", type: "text" },
    { key: "totalBudgetAllocated", label: "BUDGET ALLOCATED", type: "currency" },
    // ... etc
  ],
  features: {
    enableExport: true,
    enablePrint: true,
    enableShare: false,
    showTotalsRow: true,
    showTotalsColumn: true,
  },
  title: "Projects Breakdown"
};
Step 2: Implement Dynamic Data Fetching
typescript// app/components/Spreadsheet/hooks/useSpreadsheetData.ts

export function useSpreadsheetData(config: SpreadsheetConfig, filters?: any) {
  const data = useQuery(
    config.fetchQuery as any,
    filters || "skip"
  );
  
  return {
    data,
    isLoading: data === undefined,
  };
}

📋 Phase 3: Integration & Testing (Day 5-6)
Step 1: Replace Budget MainSheet
tsx// app/dashboard/project/budget/components/MainSheet.tsx

import { Spreadsheet } from "@/components/Spreadsheet";
import { BUDGET_SPREADSHEET_CONFIG } from "../config/budgetSpreadsheetConfig";

export default function MainSheet() {
  return (
    <Spreadsheet 
      config={BUDGET_SPREADSHEET_CONFIG}
      filters={{ year: selectedYear }}
    />
  );
}
Step 2: Add to Projects Table
tsx// app/dashboard/project/budget/[particularId]/components/ProjectSpreadsheet.tsx

import { Spreadsheet } from "@/components/Spreadsheet";
import { PROJECT_SPREADSHEET_CONFIG } from "../config/projectSpreadsheetConfig";

export default function ProjectSpreadsheet() {
  return (
    <Spreadsheet 
      config={PROJECT_SPREADSHEET_CONFIG}
      filters={{ budgetItemId }}
    />
  );
}
```

---

## 📂 **Final Folder Structure**
```
app/
├── components/
│   └── Spreadsheet/                    // ✨ NEW: Reusable spreadsheet system
│       ├── index.tsx                   // Main export
│       ├── SpreadsheetContainer.tsx
│       ├── SpreadsheetHeader.tsx
│       ├── SpreadsheetMenuBar.tsx
│       ├── SpreadsheetFormulaBar.tsx
│       ├── SpreadsheetGrid.tsx
│       ├── SpreadsheetCell.tsx
│       ├── SpreadsheetSheetTabs.tsx
│       ├── ExportModal.tsx
│       ├── hooks/
│       │   ├── useSpreadsheetData.ts
│       │   ├── useSpreadsheetState.ts
│       │   └── useKeyboardNavigation.ts
│       ├── utils/
│       │   ├── formatting.ts
│       │   ├── cellCalculations.ts
│       │   └── exportUtils.ts
│       └── types.ts
│
└── dashboard/
    └── project/
        └── budget/
            ├── components/
            │   └── MainSheet.tsx           // Uses <Spreadsheet />
            ├── config/
            │   └── budgetSpreadsheetConfig.ts
            │
            └── [particularId]/
                ├── components/
                │   └── ProjectSpreadsheet.tsx  // Uses <Spreadsheet />
                └── config/
                    └── projectSpreadsheetConfig.ts

✅ Benefits of This Approach:

🔄 Reusable - One spreadsheet component for all tables
⚙️ Configurable - Easy to add new spreadsheets via config
🧩 Modular - Each part can be updated independently
🎨 Consistent - Same UX across all spreadsheets
🚀 Scalable - Add breakdowns, departments, users spreadsheets easily