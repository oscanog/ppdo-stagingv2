// lib/shared/utils/csv.ts

import { TableColumn } from "../types/table.types";

/**
 * Generates CSV content from data
 * @param data - Array of data objects
 * @param columns - Column definitions
 * @param hiddenColumns - Set of hidden column IDs
 * @returns CSV string
 */
export function generateCSV<T>(
  data: T[],
  columns: TableColumn[],
  hiddenColumns: Set<string>
): string {
  const visibleCols = columns.filter((col) => !hiddenColumns.has(col.id));

  if (visibleCols.length === 0) {
    throw new Error("No columns are visible to export");
  }

  const headers = visibleCols.map((c) => c.label).join(",");
  const rows = data.map((item) => {
    return visibleCols
      .map((col) => {
        let val = (item as any)[col.id];
        if (val === undefined || val === null) return "";
        if (typeof val === "number" && col.id.includes("Rate")) {
          return val.toFixed(2);
        }
        if (typeof val === "string") {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      })
      .join(",");
  });

  return [headers, ...rows].join("\n");
}

/**
 * Downloads CSV file
 * @param csvContent - CSV string content
 * @param filename - Filename for download
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}