// app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/components/TableTotalsRow.tsx

"use client";

import { ColumnConfig, ColumnTotals } from "../types/breakdown.types";
import { formatCurrency, formatPercentage } from "../utils/formatters";

interface TableTotalsRowProps {
  columns: ColumnConfig[];
  totals: ColumnTotals;
  gridTemplateColumns: string;
}

export function TableTotalsRow({
  columns,
  totals,
  gridTemplateColumns,
}: TableTotalsRowProps) {
  return (
    <div
      className="grid border-t-2 border-zinc-300 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-800 sticky bottom-0"
      style={{ gridTemplateColumns }}
    >
      {/* Empty Row Number Cell */}
      <div className="text-center border-r text-xs py-3 font-bold text-zinc-700 dark:text-zinc-300">
        {/* Empty */}
      </div>

      {/* Column Totals */}
      {columns.map(column => {
        let cellContent = "";
        
        if (column.type === "currency" && totals[column.key] !== undefined) {
          cellContent = formatCurrency(totals[column.key]);
        } else if (column.type === "number" && totals[column.key] !== undefined) {
          cellContent = formatPercentage(totals[column.key]);
        }

        return (
          <div
            key={column.key}
            className={`px-3 py-3 border-r font-bold text-zinc-700 dark:text-zinc-300 ${
              column.align === 'right' ? 'text-right' :
              column.align === 'center' ? 'text-center' : 'text-left'
            }`}
          >
            {cellContent}
          </div>
        );
      })}

      {/* Total Label */}
      <div className="flex items-center justify-center font-bold text-zinc-700 dark:text-zinc-300">
        TOTAL
      </div>
    </div>
  );
}