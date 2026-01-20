// app/components/Spreadsheet/SpreadsheetGrid.tsx

"use client";

import { SpreadsheetCell } from "./SpreadsheetCell";
import { SpreadsheetGridProps } from "./types";
import { getCellKey } from "./utils/formatting";

export function SpreadsheetGrid({
  columns,
  rows,
  columnHeaders,
  selectedCell,
  cellData,
  editingCell,
  totalRowNumber,
  onCellClick,
  onCellDoubleClick,
  onCellChange,
  onEditingCellChange,
}: SpreadsheetGridProps) {
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex flex-1 flex-col overflow-auto">
        {/* Column Letters */}
        <div className="sticky top-0 z-20 flex bg-[#f8f9fa]">
          <div className="sticky left-0 z-30 h-[30px] w-[46px] border-b border-r border-gray-300 bg-[#f8f9fa]" />
          {columns.map((col) => (
            <div
              key={col}
              className="flex h-[30px] w-[100px] items-center justify-center border-b border-r border-gray-300 bg-[#f8f9fa] text-xs font-medium text-gray-700"
            >
              {col}
            </div>
          ))}
        </div>

        {/* Column Headers */}
        <div className="sticky top-[30px] z-20 flex bg-[#f8f9fa]">
          <div className="sticky left-0 z-30 h-[30px] w-[46px] border-b border-r border-gray-300 bg-[#f8f9fa]" />
          {columnHeaders.map((header, index) => (
            <div
              key={`header-${index}`}
              className="flex h-[30px] w-[100px] items-center justify-center border-b border-r border-gray-300 bg-[#f8f9fa] px-1 text-[10px] font-semibold text-gray-700 uppercase"
            >
              {header}
            </div>
          ))}
        </div>

        {/* Rows */}
        {rows.map((row) => {
          const isTotalRow = row === totalRowNumber;
          
          return (
            <div key={row} className="flex">
              {/* Row Header */}
              <div className={`sticky left-0 z-10 flex h-[21px] w-[46px] items-center justify-center border-b border-r border-gray-300 text-xs text-gray-700 ${
                isTotalRow ? "bg-gray-100 dark:bg-gray-800 font-bold" : "bg-[#f8f9fa]"
              }`}>
                {row}
              </div>

              {/* Cells */}
              {columns.map((col, colIndex) => {
                const cellKey = getCellKey(row, colIndex, columns);
                const isSelected = selectedCell.row === row && selectedCell.col === colIndex;
                const isEditing = editingCell === cellKey;

                return (
                  <SpreadsheetCell
                    key={cellKey}
                    cellKey={cellKey}
                    isSelected={isSelected}
                    isEditing={isEditing}
                    cellData={cellData}
                    onClick={() => onCellClick(row, colIndex)}
                    onDoubleClick={() => onCellDoubleClick(row, colIndex)}
                    onChange={(value) => onCellChange(row, colIndex, value)}
                    onBlur={() => onEditingCellChange(null)}
                    dataCellAttr={cellKey}
                    isDisabled={isTotalRow}
                    isTotalRow={isTotalRow}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}