# Inspection Components Migration - Quick Guide

## Quick Summary

Move 25 components from route folder to centralized `components/ppdo/inspection/`.

**Estimated Time**: 4 hours  
**Files to Move**: 25  
**Risk Level**: Low

---

## Step 1: Create Folder Structure

```bash
# Create directories
mkdir -p components/ppdo/inspection/components/{financial,inspection,tabs,modals}
mkdir -p components/ppdo/inspection/{types,utils,constants,hooks}
```

---

## Step 2: Migrate Files

### Batch 1: Core Files (Types, Utils, Data)

```bash
# Copy and update imports
cp "app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/[inspectionId]/components/types.ts" "components/ppdo/inspection/types/index.ts"
cp "app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/[inspectionId]/components/utils.ts" "components/ppdo/inspection/utils/index.ts"
cp "app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/[inspectionId]/data.ts" "components/ppdo/inspection/constants/index.ts"
cp "app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/[inspectionId]/components/mockData.ts" "components/ppdo/inspection/constants/mockData.ts"
```

### Batch 2: UI Components

```bash
# Simple UI components
cp "app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/[inspectionId]/components/Card.tsx" "components/ppdo/inspection/components/Card.tsx"
cp "app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/[inspectionId]/components/StatCard.tsx" "components/ppdo/inspection/components/StatCard.tsx"
cp "app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/[inspectionId]/components/TransactionCard.tsx" "components/ppdo/inspection/components/TransactionCard.tsx"
```

### Batch 3: Financial Components

```bash
# Financial breakdown components
cp "app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/[inspectionId]/components/FinancialBreakdownCard.tsx" "components/ppdo/inspection/components/financial/FinancialBreakdownCard.tsx"
cp "app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/[inspectionId]/components/FinancialBreakdownHeader.tsx" "components/ppdo/inspection/components/financial/FinancialBreakdownHeader.tsx"
cp "app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/[inspectionId]/components/FinancialBreakdownMain.tsx" "components/ppdo/inspection/components/financial/FinancialBreakdownMain.tsx"
cp "app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/[inspectionId]/components/FinancialBreakdownTable.tsx" "components/ppdo/inspection/components/financial/FinancialBreakdownTable.tsx"
cp "app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/[inspectionId]/components/FinancialBreakdownTabs.tsx" "components/ppdo/inspection/components/financial/FinancialBreakdownTabs.tsx"
cp "app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/[inspectionId]/components/FinancialBreakdownItemForm.tsx" "components/ppdo/inspection/components/financial/FinancialBreakdownItemForm.tsx"
```

### Batch 4: Inspection Components

```bash
# Inspection-specific components
cp "app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/[inspectionId]/components/InspectionContextMenu.tsx" "components/ppdo/inspection/components/inspection/InspectionContextMenu.tsx"
cp "app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/[inspectionId]/components/InspectionGalleryModal.tsx" "components/ppdo/inspection/components/inspection/InspectionGalleryModal.tsx"
cp "app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/[inspectionId]/components/InspectionsDataTable.tsx" "components/ppdo/inspection/components/inspection/InspectionsDataTable.tsx"
cp "app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/[inspectionId]/components/InspectionViewToggle.tsx" "components/ppdo/inspection/components/inspection/InspectionViewToggle.tsx"
```

### Batch 5: Tabs

```bash
# Tab content components
cp "app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/[inspectionId]/components/tabs/AnalyticsContent.tsx" "components/ppdo/inspection/components/tabs/AnalyticsContent.tsx"
cp "app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/[inspectionId]/components/tabs/InspectionContent.tsx" "components/ppdo/inspection/components/tabs/InspectionContent.tsx"
cp "app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/[inspectionId]/components/tabs/OverviewContent.tsx" "components/ppdo/inspection/components/tabs/OverviewContent.tsx"
cp "app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/[inspectionId]/components/tabs/RemarksContent.tsx" "components/ppdo/inspection/components/tabs/RemarksContent.tsx"
```

### Batch 6: Modals

```bash
# Modal components
cp "app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/[inspectionId]/components/modals/InspectionDetailsModal.tsx" "components/ppdo/inspection/components/modals/InspectionDetailsModal.tsx"
cp "app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/[inspectionId]/components/modals/NewInspectionForm.tsx" "components/ppdo/inspection/components/modals/NewInspectionForm.tsx"
cp "app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/[inspectionId]/components/modals/NewRemarkModal.tsx" "components/ppdo/inspection/components/modals/NewRemarkModal.tsx"
```

### Batch 7: Other Components

```bash
# Remaining components
cp "app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/[inspectionId]/components/RemarksSection.tsx" "components/ppdo/inspection/components/RemarksSection.tsx"
```

---

## Step 3: Update Import Paths in Moved Files

Files need their import paths updated from relative to centralized:

### Example: FinancialBreakdownCard.tsx

**Before:**
```typescript
import { Card, CardContent } from "@/components/ui/card";
import { Doc } from "@/convex/_generated/dataModel";
```

**After:**
```typescript
// Same imports - no changes needed for @/ aliases
import { Card, CardContent } from "@/components/ui/card";
import { Doc } from "@/convex/_generated/dataModel";
```

### Example: Components importing from types.ts

**Before:**
```typescript
import { FinancialBreakdownItem } from "./types";
```

**After:**
```typescript
import { FinancialBreakdownItem } from "@/components/ppdo/inspection/types";
```

---

## Step 4: Create index.ts

Create `components/ppdo/inspection/index.ts`:

```typescript
// Financial Components
export { FinancialBreakdownCard } from "./components/financial/FinancialBreakdownCard";
export { FinancialBreakdownHeader } from "./components/financial/FinancialBreakdownHeader";
export { FinancialBreakdownMain } from "./components/financial/FinancialBreakdownMain";
export { FinancialBreakdownTable } from "./components/financial/FinancialBreakdownTable";
export { FinancialBreakdownTabs } from "./components/financial/FinancialBreakdownTabs";
export { FinancialBreakdownItemForm } from "./components/financial/FinancialBreakdownItemForm";

// Inspection Components
export { InspectionContextMenu } from "./components/inspection/InspectionContextMenu";
export { InspectionGalleryModal } from "./components/inspection/InspectionGalleryModal";
export { InspectionsDataTable } from "./components/inspection/InspectionsDataTable";
export { InspectionViewToggle } from "./components/inspection/InspectionViewToggle";

// Tab Components
export { AnalyticsContent } from "./components/tabs/AnalyticsContent";
export { InspectionContent } from "./components/tabs/InspectionContent";
export { OverviewContent } from "./components/tabs/OverviewContent";
export { RemarksContent } from "./components/tabs/RemarksContent";

// Modal Components
export { InspectionDetailsModal } from "./components/modals/InspectionDetailsModal";
export { NewInspectionForm } from "./components/modals/NewInspectionForm";
export { NewRemarkModal } from "./components/modals/NewRemarkModal";

// UI Components
export { Card } from "./components/Card";
export { StatCard } from "./components/StatCard";
export { TransactionCard } from "./components/TransactionCard";
export { RemarksSection } from "./components/RemarksSection";

// Types
export type {
  FinancialBreakdownItem,
  InspectionItem,
  InspectionFormData,
  RemarkItem,
  FinancialBreakdownTabsProps,
  CardProps,
  StatCardProps,
  TransactionCardProps,
  OverviewContentProps,
  InspectionContentProps,
  RemarksContentProps,
  NewInspectionFormProps,
  InspectionDetailsModalProps,
} from "./types";

// Utilities
export {
  // Add utility exports here
} from "./utils";

// Constants
export {
  // Add constant exports here
} from "./constants";
```

---

## Step 5: Update page.tsx

**Before:**
```typescript
import { FinancialBreakdownCard } from "./components/FinancialBreakdownCard";
import { FinancialBreakdownHeader, tabs } from "./components/FinancialBreakdownHeader";
import { FinancialBreakdownMain } from "./components/FinancialBreakdownMain";
import { Card } from "./components/Card";
```

**After:**
```typescript
import {
  FinancialBreakdownCard,
  FinancialBreakdownHeader,
  FinancialBreakdownMain,
  Card,
} from "@/components/ppdo/inspection";
```

---

## Step 6: Clean Up

Delete old files after verification:

```bash
# Remove old components folder
Remove-Item -LiteralPath "c:\ppdo\ppdo-next\app\dashboard\project\[year]\[particularId]\[projectbreakdownId]\[inspectionId]\components" -Recurse -Force

# Remove old data.ts and utils.ts
Remove-Item -LiteralPath "c:\ppdo\ppdo-next\app\dashboard\project\[year]\[particularId]\[projectbreakdownId]\[inspectionId]\data.ts" -Force
Remove-Item -LiteralPath "c:\ppdo\ppdo-next\app\dashboard\project\[year]\[particularId]\[projectbreakdownId]\[inspectionId]\utils.ts" -Force
```

---

## Step 7: Verification

```bash
# TypeScript check
cd c:\ppdo\ppdo-next
npx tsc --noEmit --skipLibCheck

# Build test
npm run build

# Check git status
git status
```

---

## Rollback

If issues occur:

```bash
# Restore from backup
git checkout backup/inspection-migration

# Or revert commit
git revert HEAD
```

---

*Quick Guide Version: 1.0*
