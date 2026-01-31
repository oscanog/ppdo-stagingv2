"use client";

import { Email, EmailFolder, EmailFilter } from "../types";
import { EmailItem } from "./EmailItem";
import { FolderTabs } from "./FolderTabs";
import { SearchAndFilters } from "./SearchAndFilters";

interface EmailListProps {
  emails: Email[];
  folder: EmailFolder;
  filter: EmailFilter;
  searchQuery: string;
  selectedEmail: Email | null;
  unreadCount: number;
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalEmails: number;
  onEmailSelect: (email: Email) => void;
  onToggleStar: (emailId: number) => void;
  onFolderChange: (folder: EmailFolder) => void;
  onFilterChange: (filter: EmailFilter) => void;
  onSearchChange: (query: string) => void;
  onPageChange: (page: number) => void;
}

export function EmailList({
  emails,
  folder,
  filter,
  searchQuery,
  selectedEmail,
  unreadCount,
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalEmails,
  onEmailSelect,
  onToggleStar,
  onFolderChange,
  onFilterChange,
  onSearchChange,
  onPageChange,
}: EmailListProps) {
  return (
    <div className={`${selectedEmail ? "hidden lg:block" : ""} flex-1`}>
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <FolderTabs
          currentFolder={folder}
          unreadCount={unreadCount}
          onFolderChange={onFolderChange}
        />

        <SearchAndFilters
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          filter={filter}
          onFilterChange={onFilterChange}
        />

        {/* Email List */}
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800 max-h-[600px] overflow-y-auto">
          {emails.length > 0 ? (
            emails.map((email) => (
              <EmailItem
                key={email.id}
                email={email}
                folder={folder}
                isSelected={selectedEmail?.id === email.id}
                onSelect={onEmailSelect}
                onToggleStar={onToggleStar}
              />
            ))
          ) : (
            <div className="p-8 text-center">
              <svg
                className="w-12 h-12 mx-auto mb-3 text-zinc-400 dark:text-zinc-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                No emails found
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
              >
                Previous
              </button>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
              >
                Next
              </button>
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              Showing {startIndex + 1}-{Math.min(endIndex, totalEmails)} of{" "}
              {totalEmails} emails
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

