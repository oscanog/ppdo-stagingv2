"use client";

import { ComposeData } from "../types";
import { useAccentColor } from "../../../../contexts/AccentColorContext";

interface ComposeModalProps {
  composeData: ComposeData;
  onDataChange: (data: ComposeData) => void;
  onClose: () => void;
  onSend: () => void;
  onSaveDraft: () => void;
}

export function ComposeModal({
  composeData,
  onDataChange,
  onClose,
  onSend,
  onSaveDraft,
}: ComposeModalProps) {
  const { accentColorValue } = useAccentColor();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            New Message
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
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
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              To
            </label>
            <input
              type="email"
              value={composeData.to}
              onChange={(e) =>
                onDataChange({ ...composeData, to: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 transition-all"
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
              placeholder="Recipient email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              CC (optional)
            </label>
            <input
              type="email"
              value={composeData.cc}
              onChange={(e) =>
                onDataChange({ ...composeData, cc: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 transition-all"
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
              placeholder="CC email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              BCC (optional)
            </label>
            <input
              type="email"
              value={composeData.bcc}
              onChange={(e) =>
                onDataChange({ ...composeData, bcc: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 transition-all"
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
              placeholder="BCC email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Subject
            </label>
            <input
              type="text"
              value={composeData.subject}
              onChange={(e) =>
                onDataChange({ ...composeData, subject: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 transition-all"
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
              placeholder="Subject"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Message
            </label>
            <textarea
              value={composeData.body}
              onChange={(e) =>
                onDataChange({ ...composeData, body: e.target.value })
              }
              rows={10}
              className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 transition-all resize-none"
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
              placeholder="Type your message here..."
            />
          </div>
        </div>
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end gap-2">
          <button
            onClick={onSaveDraft}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
          >
            Save Draft
          </button>
          <button
            onClick={onSend}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-md text-white"
            style={{ backgroundColor: accentColorValue }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

