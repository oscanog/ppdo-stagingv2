// app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/components/TableHeader.tsx

"use client";

import { GripVertical } from "lucide-react";
import { ColumnConfig } from "../types/breakdown.types";

interface TableHeaderProps {
  columns: ColumnConfig[];
  gridTemplateColumns: string;
  canEditLayout: boolean;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (index: number) => void;
  onStartResize: (e: React.MouseEvent, index: number) => void;
}

export function TableHeader({
  columns,
  gridTemplateColumns,
  canEditLayout,
  onDragStart,
  onDragOver,
  onDrop,
  onStartResize,
}: TableHeaderProps) {
  return (
    <div
      className="sticky top-0 z-10 grid outline-1 outline-gray-500/30 border dark:bg-zinc-800"
      style={{ gridTemplateColumns }}
    >
      {/* Row Number Column */}
      <div className="text-center py-3 border-r text-xs text-zinc-600 dark:text-zinc-300">
        #
      </div>

      {/* Data Columns */}
      {columns.map((column, index) => (
        <div
          key={column.key}
          draggable={canEditLayout}
          onDragStart={() => onDragStart(index)}
          onDragOver={onDragOver}
          onDrop={() => onDrop(index)}
          className={`relative px-3 py-3 border-r flex items-center gap-2 text-zinc-700 dark:text-zinc-300 ${
            canEditLayout ? "cursor-move" : ""
          }`}
        >
          {canEditLayout && <GripVertical className="w-3 h-3 text-zinc-400" />}
          
          <span className="flex-1 truncate text-sm font-medium">
            {column.label}
          </span>

          {canEditLayout && (
            <div
              className="absolute right-0 top-0 h-full w-1 cursor-col-resize"
              onMouseDown={e => onStartResize(e, index)}
            />
          )}
        </div>
      ))}

      {/* Actions Column */}
      <div className="text-center py-3 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
        Actions
      </div>
    </div>
  );
}