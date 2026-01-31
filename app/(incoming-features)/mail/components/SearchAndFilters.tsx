"use client";

import { EmailFilter } from "../types";
import { useAccentColor } from "../../../../contexts/AccentColorContext";

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filter: EmailFilter;
  onFilterChange: (filter: EmailFilter) => void;
}

export function SearchAndFilters({
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
}: SearchAndFiltersProps) {
  const { accentColorValue } = useAccentColor();

  return (
    <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        {/* Search */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search emails..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 transition-all"
            style={
              {
                "--tw-ring-color": accentColorValue,
              } as React.CSSProperties
            }
            onFocus={(e) => {
              e.currentTarget.style.borderColor = accentColorValue;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "";
            }}
          />
          <svg
            className="absolute left-3 top-2.5 w-5 h-5 text-zinc-400 dark:text-zinc-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onFilterChange("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "all"
                ? "text-white"
                : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            style={
              filter === "all" ? { backgroundColor: accentColorValue } : {}
            }
          >
            All
          </button>
          <button
            onClick={() => onFilterChange("unread")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "unread"
                ? "text-white"
                : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            style={
              filter === "unread" ? { backgroundColor: accentColorValue } : {}
            }
          >
            Unread
          </button>
          <button
            onClick={() => onFilterChange("starred")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "starred"
                ? "text-white"
                : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            style={
              filter === "starred" ? { backgroundColor: accentColorValue } : {}
            }
          >
            Starred
          </button>
        </div>
      </div>
    </div>
  );
}

