"use client";

import { Email, EmailFolder } from "../types";
import { useAccentColor } from "../../../../contexts/AccentColorContext";

interface EmailItemProps {
  email: Email;
  folder: EmailFolder;
  isSelected: boolean;
  onSelect: (email: Email) => void;
  onToggleStar: (emailId: number) => void;
}

export function EmailItem({
  email,
  folder,
  isSelected,
  onSelect,
  onToggleStar,
}: EmailItemProps) {
  const { accentColorValue } = useAccentColor();

  return (
    <div
      className={`p-4 cursor-pointer transition-colors ${isSelected
          ? "bg-zinc-100 dark:bg-zinc-800"
          : "hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
        }`}
      onClick={() => onSelect(email)}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleStar(email.id);
          }}
          className="shrink-0 mt-1"
        >
          <svg
            className={`w-5 h-5 ${email.isStarred
                ? "fill-yellow-400 text-yellow-400"
                : "text-zinc-400 dark:text-zinc-500"
              }`}
            fill={email.isStarred ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p
              className={`text-sm font-semibold truncate ${!email.isRead
                  ? "text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-600 dark:text-zinc-400"
                }`}
            >
              {folder === "sent" ? email.to : email.from}
            </p>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              {email.category && (
                <span
                  className="px-2 py-0.5 rounded text-xs font-medium"
                  style={{
                    backgroundColor: accentColorValue + "20",
                    color: accentColorValue,
                  }}
                >
                  {email.category}
                </span>
              )}
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {email.time}
              </span>
            </div>
          </div>
          <p
            className={`text-sm truncate mb-1 ${!email.isRead
                ? "font-medium text-zinc-900 dark:text-zinc-100"
                : "text-zinc-600 dark:text-zinc-400"
              }`}
          >
            {email.subject}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
            {email.preview}
          </p>
        </div>

        {!email.isRead && (
          <div
            className="w-2 h-2 rounded-full shrink-0 mt-2"
            style={{ backgroundColor: accentColorValue }}
          />
        )}
      </div>
    </div>
  );
}

