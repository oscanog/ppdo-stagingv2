// app/components/Spreadsheet/SpreadsheetMenuBar.tsx

"use client";

import { Button } from "@/components/ui/button";
import { SpreadsheetMenuBarProps } from "./types";

export function SpreadsheetMenuBar({ onExport }: SpreadsheetMenuBarProps) {
  return (
    <div className="flex items-center gap-1 border-b border-gray-200 bg-white px-4 py-1 text-sm">
      <Button variant="ghost" className="h-8 px-3 text-sm font-normal text-gray-700 hover:bg-gray-100">
        File
      </Button>
      {onExport && (
        <Button 
          variant="ghost" 
          className="h-8 px-3 text-sm font-normal text-gray-700 hover:bg-gray-100"
          onClick={onExport}
        >
          Export
        </Button>
      )}
      <Button variant="ghost" className="h-8 px-3 text-sm font-normal text-gray-700 hover:bg-gray-100">
        Insert
      </Button>
    </div>
  );
}