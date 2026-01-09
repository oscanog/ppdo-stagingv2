"use client";

import { Email, EmailFolder } from "../types";
import { useAccentColor } from "../../../contexts/AccentColorContext";

interface EmailDetailProps {
  email: Email;
  folder: EmailFolder;
  onClose: () => void;
  onReply: (email: Email) => void;
  onDelete: (emailId: number) => void;
  onToggleStar: (emailId: number) => void;
  onEditDraft: (email: Email) => void;
}

export function EmailDetail({
  email,
  folder,
  onClose,
  onReply,
  onDelete,
  onToggleStar,
  onEditDraft,
}: EmailDetailProps) {
  const { accentColorValue } = useAccentColor();

  if (folder === "inbox") {
    return (
      <div className="lg:w-1/2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => onToggleStar(email.id)}
                  className="shrink-0"
                >
                  <svg
                    className={`w-5 h-5 ${
                      email.isStarred
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
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  {email.subject}
                </h2>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  From:
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {email.from}
                </p>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  To:
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {email.to}
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 mb-4">
                <span>{email.time}</span>
                {email.category && (
                  <span
                    className="px-2 py-0.5 rounded font-medium"
                    style={{
                      backgroundColor: accentColorValue + "20",
                      color: accentColorValue,
                    }}
                  >
                    {email.category}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onReply(email)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-md text-white"
                  style={{ backgroundColor: accentColorValue }}
                >
                  Reply
                </button>
                <button
                  onClick={() => onDelete(email.id)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                >
                  Delete
                </button>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Close"
            >
              <svg
                className="w-5 h-5 text-zinc-600 dark:text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-zinc-900 dark:text-zinc-100 whitespace-pre-wrap">
              {email.body}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (folder === "sent") {
    return (
      <div className="lg:w-1/2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                {email.subject}
              </h2>
              <div className="flex items-center gap-2 mb-4">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  To:
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {email.to}
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 mb-4">
                <span>{email.time}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Close"
            >
              <svg
                className="w-5 h-5 text-zinc-600 dark:text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-zinc-900 dark:text-zinc-100 whitespace-pre-wrap">
              {email.body}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Drafts folder
  return (
    <div className="lg:w-1/2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              {email.subject}
            </h2>
            <div className="flex items-center gap-2 mb-4">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                To:
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {email.to || "(No recipient)"}
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 mb-4">
              <span>{email.time}</span>
            </div>
            <button
              onClick={() => onEditDraft(email)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-md text-white"
              style={{ backgroundColor: accentColorValue }}
            >
              Continue Editing
            </button>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Close"
          >
            <svg
              className="w-5 h-5 text-zinc-600 dark:text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-zinc-900 dark:text-zinc-100 whitespace-pre-wrap">
            {email.body}
          </p>
        </div>
      </div>
    </div>
  );
}

