// app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/components/TableRow.tsx

"use client";

import { Edit, Trash2 } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { Breakdown, ColumnConfig } from "../types/breakdown.types";
import { formatCellValue } from "../utils/formatters";
import { DEFAULT_ROW_HEIGHT } from "../constants/table.constants";

interface TableRowProps {
  breakdown: Breakdown;
  index: number;
  columns: ColumnConfig[];
  gridTemplateColumns: string;
  rowHeight: number;
  canEditLayout: boolean;
  onRowClick: (breakdown: Breakdown, event: React.MouseEvent) => void;
  onEdit?: (breakdown: Breakdown) => void;
  onDelete?: (id: string) => void;
  onStartRowResize: (e: React.MouseEvent, rowId: string) => void;
}

export function TableRow({
  breakdown,
  index,
  columns,
  gridTemplateColumns,
  rowHeight,
  canEditLayout,
  onRowClick,
  onEdit,
  onDelete,
  onStartRowResize,
}: TableRowProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          className="grid border-b hover:bg-zinc-50 dark:hover:bg-zinc-800 relative bg-white dark:bg-zinc-900 cursor-pointer transition-colors"
          style={{ gridTemplateColumns, height: rowHeight }}
          onClick={(e) => onRowClick(breakdown, e)}
        >
          {/* Row Number */}
          <div className="text-center border-r text-xs py-2 text-zinc-600 dark:text-zinc-400 relative">
            {index + 1}
            {canEditLayout && (
              <div
                className="absolute bottom-0 left-0 right-0 h-1 cursor-row-resize"
                onMouseDown={e => onStartRowResize(e, breakdown._id)}
              />
            )}
          </div>

          {/* Data Cells */}
          {columns.map(column => (
            <div
              key={column.key}
              className={`px-3 py-2 truncate border-r text-zinc-700 dark:text-zinc-300 ${
                column.align === 'right' ? 'text-right' :
                column.align === 'center' ? 'text-center' : 'text-left'
              }`}
            >
              {formatCellValue(breakdown[column.key], column, breakdown)}
            </div>
          ))}

          {/* Actions */}
          <div className="flex items-center justify-center gap-2">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(breakdown);
                }}
                className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(breakdown._id);
                }}
                className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600 dark:text-red-400 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent className="w-56">
        <ContextMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onRowClick(breakdown, e as any);
          }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span>View Details</span>
        </ContextMenuItem>

        {onEdit && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onEdit(breakdown);
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Breakdown</span>
            </ContextMenuItem>
          </>
        )}

        {onDelete && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete(breakdown._id);
              }}
              className="flex items-center gap-2 cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
              <span>Move to Trash</span>
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}