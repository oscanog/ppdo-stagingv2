// app/dashboard/settings/suggestions/page.tsx
"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCurrentUser } from "@/app/hooks/useCurrentUser";
import { Id } from "@/convex/_generated/dataModel";
import { useState, useRef } from "react";
import { ChevronDown, Clock, CheckCircle2, AlertCircle, Lightbulb, Send, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// Suggestion Form Component
function SuggestionForm({ user }: { user: any }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createSuggestion = useMutation(api.suggestions.create);

  const submit = async () => {
    if (!title.trim() || !desc.trim()) return;

    if (!user) {
      alert("You must be logged in to submit a suggestion.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createSuggestion({ title, description: desc });
      setTitle("");
      setDesc("");
      alert("Suggestion submitted successfully!");
    } catch (error) {
      console.error("Failed to submit suggestion:", error);
      alert("Failed to submit suggestion. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      submit();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Suggestion Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className="w-full border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          placeholder="Brief summary of your suggestion (e.g., 'Add dark mode toggle')"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          className="w-full min-h-[140px] border border-gray-300 dark:border-zinc-700 rounded-lg p-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-y transition-all"
          placeholder="Detailed description of your suggestion... Include how it would work and why it would be beneficial."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isSubmitting}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {desc.length} characters · Press Cmd/Ctrl + Enter to submit
        </p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={submit}
          disabled={!title.trim() || !desc.trim() || isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit Suggestion
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// Suggestion Details Modal Component
function SuggestionDetailsModal({ suggestion, onClose }: { suggestion: any; onClose: () => void }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "acknowledged":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
      case "to_review":
        return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800";
      case "denied":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "acknowledged":
        return <CheckCircle2 className="w-5 h-5" />;
      case "to_review":
        return <Clock className="w-5 h-5" />;
      case "denied":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "acknowledged":
        return "Acknowledged";
      case "to_review":
        return "To Review";
      case "denied":
        return "Denied";
      default:
        return "Pending";
    }
  };

  return (
    <Dialog open={!!suggestion} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-5 border-b border-gray-200 dark:border-zinc-800 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-blue-100 dark:bg-blue-900 rounded-lg flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {suggestion?.title || "No title provided"}
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                  Submitted {new Date(suggestion?.submittedAt).toLocaleDateString("en-US", {
                    month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
                  })}
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-6">
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">Status</label>
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(suggestion?.status)}`}>
                {getStatusIcon(suggestion?.status)}
                {getStatusText(suggestion?.status)}
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">Description</label>
              <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 max-h-80 overflow-y-auto overflow-x-hidden">
                <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed break-words">
                  {suggestion?.description || "No description provided"}
                </p>
              </div>
            </div>

            {suggestion?.submitter && (
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 block">Submitted By</label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700">
                  <div className="flex-shrink-0 h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-base font-semibold text-blue-700 dark:text-blue-300">
                      {(() => {
                        const submitter = suggestion.submitter;
                        if (submitter?.firstName) return submitter.firstName.charAt(0).toUpperCase();
                        if (submitter?.name) return submitter.name.charAt(0).toUpperCase();
                        if (submitter?.email) return submitter.email.charAt(0).toUpperCase();
                        return "?";
                      })()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {(() => {
                        const submitter = suggestion.submitter;
                        if (submitter?.firstName || submitter?.lastName) {
                          const parts = [submitter.firstName, submitter.middleName, submitter.lastName, submitter.nameExtension].filter(Boolean);
                          return parts.join(" ");
                        }
                        if (submitter?.name) return submitter.name;
                        if (submitter?.email) return submitter.email;
                        return suggestion.submittedBy;
                      })()}
                    </p>
                    {suggestion.submitter?.email && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{suggestion.submitter.email}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {suggestion?.updatedAt && (
              <div className="pt-4 border-t border-gray-200 dark:border-zinc-800">
                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800/50">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-gray-900 dark:text-white mb-1">Status Updated</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      By <span className="font-medium text-gray-900 dark:text-white">{suggestion.updater?.name || "Super Admin"}</span> on {new Date(suggestion.updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-gray-200 dark:border-zinc-800 flex-shrink-0 bg-gray-50 dark:bg-zinc-900">
          <button 
            onClick={onClose} 
            className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors border border-gray-300 dark:border-zinc-600 shadow-sm"
          >
            Close
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function SuggestionsPage() {
  const { user, isSuperAdmin } = useCurrentUser();
  const mySuggestions = useQuery(api.suggestions.getMySuggestions);
  const allSuggestions = useQuery(api.suggestions.getAll);
  const updateStatus = useMutation(api.suggestions.updateStatus);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<any | null>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);

  const openMenu = (id: string) => {
    const btn = buttonRefs.current[id];
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + 8,
      left: rect.right - 192,
    });
    setOpenDropdown(id);
  };

  const handleStatusChange = async (id: Id<"suggestions">, status: "pending" | "acknowledged" | "to_review" | "denied") => {
    setLoading(id);
    try {
      await updateStatus({ id, status });
    } finally {
      setLoading(null);
      setOpenDropdown(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "acknowledged": return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
      case "to_review": return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800";
      case "denied": return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
      default: return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "acknowledged": return <CheckCircle2 className="w-4 h-4" />;
      case "to_review": return <Clock className="w-4 h-4" />;
      case "denied": return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "acknowledged": return "Acknowledged";
      case "to_review": return "To Review";
      case "denied": return "Denied";
      default: return "Pending";
    }
  };

  if (isSuperAdmin) {
    if (!allSuggestions) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    return (
      <>
        {selectedSuggestion && <SuggestionDetailsModal suggestion={selectedSuggestion} onClose={() => setSelectedSuggestion(null)} />}

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Suggestions (Super Admin)</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and track all submitted suggestions from users</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Suggestions: <span className="font-semibold">{allSuggestions.length}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                <thead className="bg-gray-50 dark:bg-zinc-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Submitter</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Suggestion Title</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Submitted</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-800">
                  {allSuggestions.map((suggestion) => (
                    <tr key={suggestion._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer" onClick={() => setSelectedSuggestion(suggestion)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                              {(() => {
                                const submitter = suggestion.submitter;
                                if (submitter?.firstName) return submitter.firstName.charAt(0).toUpperCase();
                                if (submitter?.name) return submitter.name.charAt(0).toUpperCase();
                                if (submitter?.email) return submitter.email.charAt(0).toUpperCase();
                                return "?";
                              })()}
                            </span>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {(() => {
                                const submitter = suggestion.submitter;
                                if (submitter?.firstName || submitter?.lastName) {
                                  const parts = [submitter.firstName, submitter.middleName, submitter.lastName, submitter.nameExtension].filter(Boolean);
                                  return parts.join(" ");
                                }
                                if (submitter?.name) return submitter.name;
                                if (submitter?.email) return submitter.email;
                                return suggestion.submittedBy;
                              })()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 dark:text-white font-medium max-w-md truncate">
                          {suggestion.title || "Untitled Suggestion"}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(suggestion.status)}`}>
                          {getStatusIcon(suggestion.status)}
                          {getStatusText(suggestion.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {new Date(suggestion.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="relative">
                          <button
                            ref={(el) => { buttonRefs.current[suggestion._id] = el; }}
                            onClick={() => openDropdown === suggestion._id ? setOpenDropdown(null) : openMenu(suggestion._id)}
                            disabled={loading === suggestion._id}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loading === suggestion._id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Updating...
                              </>
                            ) : (
                              <>
                                Set Status
                                <ChevronDown className="w-4 h-4" />
                              </>
                            )}
                          </button>

                          {openDropdown === suggestion._id && menuPos && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                              <div className="fixed z-50 w-48 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-700 overflow-hidden" style={{ top: menuPos.top, left: menuPos.left }}>
                                <button onClick={() => handleStatusChange(suggestion._id, "pending")} className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-900/20 transition-colors flex items-center gap-2 text-gray-900 dark:text-white">
                                  <Clock className="w-4 h-4 text-gray-600" />
                                  <span className="font-medium">Pending</span>
                                </button>
                                <div className="border-t border-gray-200 dark:border-zinc-700" />
                                <button onClick={() => handleStatusChange(suggestion._id, "acknowledged")} className="w-full px-4 py-3 text-left text-sm hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors flex items-center gap-2 text-gray-900 dark:text-white">
                                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                                  <span className="font-medium">Acknowledged</span>
                                </button>
                                <div className="border-t border-gray-200 dark:border-zinc-700" />
                                <button onClick={() => handleStatusChange(suggestion._id, "to_review")} className="w-full px-4 py-3 text-left text-sm hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors flex items-center gap-2 text-gray-900 dark:text-white">
                                  <Clock className="w-4 h-4 text-yellow-600" />
                                  <span className="font-medium">To Review</span>
                                </button>
                                <div className="border-t border-gray-200 dark:border-zinc-700" />
                                <button onClick={() => handleStatusChange(suggestion._id, "denied")} className="w-full px-4 py-3 text-left text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2 text-gray-900 dark:text-white">
                                  <AlertCircle className="w-4 h-4 text-red-600" />
                                  <span className="font-medium">Denied</span>
                                </button>
                              </div>
                            </>
                          )}
                          {suggestion.updatedAt && (
                            <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium">
                              Updated by {suggestion.updater?.name || "Super Admin"}
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {allSuggestions.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full mb-4">
                  <Lightbulb className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No suggestions yet</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Suggestions will appear here when users submit them</p>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {selectedSuggestion && <SuggestionDetailsModal suggestion={selectedSuggestion} onClose={() => setSelectedSuggestion(null)} />}

      <div className="space-y-8">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Submit a Suggestion</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Have an idea to improve the system? Let us know</p>
            </div>
          </div>
          <SuggestionForm user={user} />
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">My Suggestions</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track the status of your submitted suggestions</p>
          </div>

          {!mySuggestions ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : mySuggestions.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full mb-4">
                <Lightbulb className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No suggestions yet</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Your submitted suggestions will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                <thead className="bg-gray-50 dark:bg-zinc-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Suggestion Title</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Submitted</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-800">
                  {mySuggestions.map((suggestion) => (
                    <tr key={suggestion._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer" onClick={() => setSelectedSuggestion(suggestion)}>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 dark:text-white font-medium max-w-md truncate">
                          {suggestion.title || "Untitled Suggestion"}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(suggestion.status)}`}>
                          {getStatusIcon(suggestion.status)}
                          {getStatusText(suggestion.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {new Date(suggestion.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {suggestion.updatedAt ? new Date(suggestion.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}