// app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/constants/table.constants.ts

import { ColumnConfig } from "../types/breakdown.types";

export const TABLE_IDENTIFIER = "govtProjectBreakdowns";

export const DEFAULT_ROW_HEIGHT = 48;

export const MIN_COLUMN_WIDTH = 80;

export const MIN_ROW_HEIGHT = 32;

export const TABLE_HEIGHT = "700px";

export const DEFAULT_COLUMNS: ColumnConfig[] = [
  { 
    key: "projectTitle", 
    label: "Project Name", 
    width: 260, 
    type: "text", 
    align: "left" 
  },
  { 
    key: "implementingOffice", 
    label: "Implementing Office", 
    width: 180, 
    type: "text", 
    align: "left" 
  },
  { 
    key: "allocatedBudget", 
    label: "Allocated Budget", 
    width: 140, 
    type: "currency", 
    align: "right" 
  },
  { 
    key: "obligatedBudget", 
    label: "Obligated Budget", 
    width: 140, 
    type: "currency", 
    align: "right" 
  },
  { 
    key: "budgetUtilized", 
    label: "Budget Utilized", 
    width: 140, 
    type: "currency", 
    align: "right" 
  },
  { 
    key: "utilizationRate", 
    label: "Utilization Rate", 
    width: 140, 
    type: "number", 
    align: "right" 
  },
  { 
    key: "balance", 
    label: "Balance", 
    width: 140, 
    type: "currency", 
    align: "right" 
  },
  { 
    key: "dateStarted", 
    label: "Date Started", 
    width: 130, 
    type: "date", 
    align: "left" 
  },
  { 
    key: "targetDate", 
    label: "Target Date", 
    width: 130, 
    type: "date", 
    align: "left" 
  },
  { 
    key: "completionDate", 
    label: "Completion Date", 
    width: 130, 
    type: "date", 
    align: "left" 
  },
  { 
    key: "projectAccomplishment", 
    label: "Project Accomplishment%", 
    width: 90, 
    type: "number", 
    align: "right" 
  },
  { 
    key: "status", 
    label: "Status", 
    width: 130, 
    type: "status", 
    align: "center" 
  },
  { 
    key: "remarks", 
    label: "Remarks", 
    width: 220, 
    type: "text", 
    align: "left" 
  },
];

export const CURRENCY_FORMAT_OPTIONS: Intl.NumberFormatOptions = {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 0,
};

export const LOCALE = "en-PH";