// app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/components/TableToolbar.tsx

"use client";

import { Search, Trash2 } from "lucide-react";

interface TableToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onPrint: () => void;
  onAdd?: () => void;
  onOpenTrash?: () => void;
  accentColor: string;
}

export function TableToolbar({
  search,
  onSearchChange,
  onPrint,
  onAdd,
  onOpenTrash,
  accentColor,
}: TableToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-3 p-4 border-b shrink-0">
      {/* Search Input */}
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
          placeholder="Search..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        {onOpenTrash && (
          <button
            onClick={onOpenTrash}
            className="cursor-pointer px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-lg hover:scale-105 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-800"
            title="View Recycle Bin"
          >
            <div className="flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Recycle Bin</span>
            </div>
          </button>
        )}

        <button
          onClick={onPrint}
          className="cursor-pointer px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-md bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-600"
          title="Print"
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" 
              />
            </svg>
            <span className="hidden sm:inline">Print</span>
          </div>
        </button>

        {onAdd && (
          <button
            onClick={onAdd}
            className="cursor-pointer px-3 sm:px-4 py-2 rounded text-white font-medium flex-1 sm:flex-none"
            style={{ backgroundColor: accentColor }}
          >
            <span className="hidden sm:inline">Add Record</span>
            <span className="sm:hidden">Add</span>
          </button>
        )}
      </div>
    </div>
  );
}