// app/components/spreadsheet/SpreadsheetCell.tsx

"use client";

import { useCallback } from "react";
import { SpreadsheetCellProps } from "./types";

export function SpreadsheetCell({
  cellKey,
  isSelected,
  isEditing,
  cellData,
  onClick,
  onDoubleClick,
  onChange,
  onBlur,
  dataCellAttr,
  isDisabled,
  isTotalRow,
}: SpreadsheetCellProps) {
  const inputRef = useCallback((node: HTMLInputElement | null) => {
    if (node && isEditing && !isDisabled) {
      node.focus();
      node.select();
    }
  }, [isEditing, isDisabled]);

  return (
    <div
      className={`relative h-[21px] w-[100px] border-b border-r border-gray-300 ${
        isSelected && !isDisabled ? "ring-2 ring-blue-500 ring-inset" : ""
      } ${isTotalRow ? "bg-gray-100 dark:bg-gray-800" : ""} ${
        isDisabled ? "cursor-not-allowed" : "cursor-cell"
      }`}
      onClick={isDisabled ? undefined : onClick}
      onDoubleClick={isDisabled ? undefined : onDoubleClick}
      data-cell={dataCellAttr}
    >
      {isEditing && !isDisabled ? (
        <input
          ref={inputRef}
          type="text"
          value={cellData[cellKey] || ""}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={isDisabled}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "Tab") {
              e.preventDefault();
              onBlur();
            }
            if (e.key === "Escape") {
              e.preventDefault();
              onBlur();
            }
          }}
          className="h-full w-full border-none px-1 text-xs outline-none"
        />
      ) : (
        <div className={`flex h-full items-center px-1 text-xs ${
          isTotalRow ? "font-bold text-gray-900 dark:text-gray-100" : "text-gray-900"
        }`}>
          {cellData[cellKey] || ""}
        </div>
      )}
      {isSelected && !isEditing && !isDisabled && (
        <div className="absolute bottom-0 right-0 h-1.5 w-1.5 bg-blue-500" />
      )}
    </div>
  );
}