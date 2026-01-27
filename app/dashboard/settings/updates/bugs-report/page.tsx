// app/dashboard/settings/updates/bugs-report/page.tsx
"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCurrentUser } from "@/app/hooks/useCurrentUser";
import { Id } from "@/convex/_generated/dataModel";
import { useState, useRef } from "react";
import { ChevronDown, Clock, CheckCircle2, AlertCircle, Bug, Send, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// Bug Report Form Component
function BugReportForm({ user }: { user: any }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createBugReport = useMutation(api.bugReports.create);

  const submit = async () => {
    if (!title.trim() || !desc.trim()) return;
    
    if (!user) {
      alert("You must be logged in to submit a bug report.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await createBugReport({ title, description: desc });
      setTitle("");
      setDesc("");
      alert("Bug report submitted successfully!");
    } catch (error) {
      console.error("Failed to submit bug report:", error);
      alert("Failed to submit bug report. Please try again.");
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
          Bug Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className="w-full border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          placeholder="Brief summary of the bug (e.g., 'Login button not working')"
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
          placeholder="Detailed description of the bug... Include steps to reproduce, expected behavior, and actual behavior."
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
              Submit Bug Report
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// Bug Details Modal Component
function BugDetailsModal({ report, onClose }: { report: any; onClose: () => void }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "fixed":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
      case "not_fixed":
        return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "fixed":
        return <CheckCircle2 className="w-5 h-5" />;
      case "not_fixed":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "fixed":
        return "Fixed";
      case "not_fixed":
        return "Not Fixed Yet";
      default:
        return "Pending";
    }
  };

  return (
    <Dialog open={!!report} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
        {/* Fixed Header */}
        <DialogHeader className="px-6 py-5 border-b border-gray-200 dark:border-zinc-800 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-red-100 dark:bg-red-900 rounded-lg flex-shrink-0">
                <Bug className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {report?.title || "No title provided"}
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                  Submitted {new Date(report?.submittedAt).toLocaleDateString("en-US", {
                    month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
                  })}
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-6">
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">Status</label>
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(report?.status)}`}>
                {getStatusIcon(report?.status)}
                {getStatusText(report?.status)}
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">Description</label>
              <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 max-h-80 overflow-y-auto overflow-x-hidden">
                <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed break-words">
                  {report?.description || "No description provided"}
                </p>
              </div>
            </div>

            {report?.submitter && (
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 block">Submitted By</label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700">
                  <div className="flex-shrink-0 h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-base font-semibold text-blue-700 dark:text-blue-300">
                      {(() => {
                        const submitter = report.submitter;
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
                        const submitter = report.submitter;
                        if (submitter?.firstName || submitter?.lastName) {
                          const parts = [submitter.firstName, submitter.middleName, submitter.lastName, submitter.nameExtension].filter(Boolean);
                          return parts.join(" ");
                        }
                        if (submitter?.name) return submitter.name;
                        if (submitter?.email) return submitter.email;
                        return report.submittedBy;
                      })()}
                    </p>
                    {report.submitter?.email && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{report.submitter.email}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {report?.updatedAt && (
              <div className="pt-4 border-t border-gray-200 dark:border-zinc-800">
                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800/50">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-gray-900 dark:text-white mb-1">Status Updated</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      By <span className="font-medium text-gray-900 dark:text-white">{report.updater?.name || "Super Admin"}</span> on {new Date(report.updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Footer */}
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

export default function BugsReportPage() {
  const { user, isSuperAdmin } = useCurrentUser();
  const myReports = useQuery(api.bugReports.getMyReports);
  const allReports = useQuery(api.bugReports.getAll);
  const updateStatus = useMutation(api.bugReports.updateStatus);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
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

  const handleStatusChange = async (id: Id<"bugReports">, status: "fixed" | "not_fixed") => {
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
      case "fixed": return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
      case "not_fixed": return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800";
      default: return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "fixed": return <CheckCircle2 className="w-4 h-4" />;
      case "not_fixed": return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "fixed": return "Fixed";
      case "not_fixed": return "Not Fixed Yet";
      default: return "Pending";
    }
  };

  if (isSuperAdmin) {
    if (!allReports) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    return (
      <>
        {selectedReport && <BugDetailsModal report={selectedReport} onClose={() => setSelectedReport(null)} />}

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Bug Reports (Super Admin)</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and track all submitted bug reports from users</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Reports: <span className="font-semibold">{allReports.length}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                <thead className="bg-gray-50 dark:bg-zinc-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Submitter</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Bug Title</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Submitted</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-800">
                  {allReports.map((report) => (
                    <tr key={report._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer" onClick={() => setSelectedReport(report)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                              {(() => {
                                const submitter = report.submitter;
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
                                const submitter = report.submitter;
                                if (submitter?.firstName || submitter?.lastName) {
                                  const parts = [submitter.firstName, submitter.middleName, submitter.lastName, submitter.nameExtension].filter(Boolean);
                                  return parts.join(" ");
                                }
                                if (submitter?.name) return submitter.name;
                                if (submitter?.email) return submitter.email;
                                return report.submittedBy;
                              })()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 dark:text-white font-medium max-w-md truncate">
                          {report.title || "Untitled Bug Report"}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(report.status)}`}>
                          {getStatusIcon(report.status)}
                          {getStatusText(report.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {new Date(report.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="relative">
                          <button
                            ref={(el) => { buttonRefs.current[report._id] = el; }}
                            onClick={() => openDropdown === report._id ? setOpenDropdown(null) : openMenu(report._id)}
                            disabled={loading === report._id}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loading === report._id ? (
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

                          {openDropdown === report._id && menuPos && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                              <div className="fixed z-50 w-48 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-700 overflow-hidden" style={{ top: menuPos.top, left: menuPos.left }}>
                                <button onClick={() => handleStatusChange(report._id, "fixed")} className="w-full px-4 py-3 text-left text-sm hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors flex items-center gap-2 text-gray-900 dark:text-white">
                                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                                  <span className="font-medium">Fixed</span>
                                </button>
                                <div className="border-t border-gray-200 dark:border-zinc-700" />
                                <button onClick={() => handleStatusChange(report._id, "not_fixed")} className="w-full px-4 py-3 text-left text-sm hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors flex items-center gap-2 text-gray-900 dark:text-white">
                                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                                  <span className="font-medium">Not Fixed Yet</span>
                                </button>
                              </div>
                            </>
                          )}

                          {report.updatedAt && (
                            <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium">
                              Updated by {report.updater?.name || "Super Admin"}
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {allReports.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full mb-4">
                  <Bug className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No bug reports yet</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Bug reports will appear here when users submit them</p>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {selectedReport && <BugDetailsModal report={selectedReport} onClose={() => setSelectedReport(null)} />}

      <div className="space-y-8">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <Bug className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Report a Bug</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Found an issue? Let us know so we can fix it</p>
            </div>
          </div>
          <BugReportForm user={user} />
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">My Bug Reports</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track the status of your submitted bug reports</p>
          </div>

          {!myReports ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : myReports.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full mb-4">
                <Bug className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No bug reports yet</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Your submitted bug reports will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                <thead className="bg-gray-50 dark:bg-zinc-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Bug Title</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Submitted</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-800">
                  {myReports.map((report) => (
                    <tr key={report._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer" onClick={() => setSelectedReport(report)}>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 dark:text-white font-medium max-w-md truncate">
                          {report.title || "Untitled Bug Report"}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(report.status)}`}>
                          {getStatusIcon(report.status)}
                          {getStatusText(report.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {new Date(report.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {report.updatedAt ? new Date(report.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "N/A"}
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