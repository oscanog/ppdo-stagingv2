"use client";

import { EmailFolder } from "../types";
import { useAccentColor } from "../../../contexts/AccentColorContext";

interface FolderTabsProps {
  currentFolder: EmailFolder;
  unreadCount: number;
  onFolderChange: (folder: EmailFolder) => void;
}

export function FolderTabs({
  currentFolder,
  unreadCount,
  onFolderChange,
}: FolderTabsProps) {
  const { accentColorValue } = useAccentColor();

  return (
    <div className="flex border-b border-zinc-200 dark:border-zinc-800">
      <button
        onClick={() => onFolderChange("inbox")}
        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
          currentFolder === "inbox"
            ? "text-white"
            : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
        }`}
        style={
          currentFolder === "inbox"
            ? {
                backgroundColor: accentColorValue,
                borderBottomColor: accentColorValue,
              }
            : { borderBottomColor: "transparent" }
        }
      >
        Inbox {unreadCount > 0 && `(${unreadCount})`}
      </button>
      <button
        onClick={() => onFolderChange("sent")}
        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
          currentFolder === "sent"
            ? "text-white"
            : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
        }`}
        style={
          currentFolder === "sent"
            ? {
                backgroundColor: accentColorValue,
                borderBottomColor: accentColorValue,
              }
            : { borderBottomColor: "transparent" }
        }
      >
        Sent
      </button>
      <button
        onClick={() => onFolderChange("drafts")}
        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
          currentFolder === "drafts"
            ? "text-white"
            : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
        }`}
        style={
          currentFolder === "drafts"
            ? {
                backgroundColor: accentColorValue,
                borderBottomColor: accentColorValue,
              }
            : { borderBottomColor: "transparent" }
        }
      >
        Drafts
      </button>
    </div>
  );
}

