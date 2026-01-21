// app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/hooks/useTableSettings.ts

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ColumnConfig, RowHeights } from "../types/breakdown.types";
import { 
  DEFAULT_COLUMNS, 
  TABLE_IDENTIFIER 
} from "../constants/table.constants";
import { mergeColumnSettings, safeJsonParse } from "../utils/helpers";

export function useTableSettings() {
  const [columns, setColumns] = useState<ColumnConfig[]>(DEFAULT_COLUMNS);
  const [rowHeights, setRowHeights] = useState<RowHeights>({});

  // Query settings
  const settings = useQuery(api.tableSettings.getSettings, { 
    tableIdentifier: TABLE_IDENTIFIER 
  });
  const saveSettings = useMutation(api.tableSettings.saveSettings);

  // Check user permissions
  const currentUser = useQuery(api.users.current);
  const canEditLayout = currentUser?.role === "super_admin" || currentUser?.role === "admin";

  // Load settings when they change
  useEffect(() => {
    if (!settings?.columns) return;

    const mergedColumns = mergeColumnSettings(settings.columns, DEFAULT_COLUMNS);
    setColumns(mergedColumns);

    if (settings.customRowHeights) {
      const heights = safeJsonParse<RowHeights>(settings.customRowHeights, {});
      setRowHeights(heights);
    }
  }, [settings]);

  // Save layout to database
  const saveLayout = useCallback(
    (cols: ColumnConfig[], heights: RowHeights) => {
      if (!canEditLayout) return;

      saveSettings({
        tableIdentifier: TABLE_IDENTIFIER,
        columns: cols.map(c => ({
          fieldKey: c.key,
          width: c.width,
          isVisible: true,
        })),
        customRowHeights: JSON.stringify(heights),
      }).catch(console.error);
    },
    [saveSettings, canEditLayout]
  );

  return {
    columns,
    setColumns,
    rowHeights,
    setRowHeights,
    canEditLayout,
    saveLayout,
  };
}