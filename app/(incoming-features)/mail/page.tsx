"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAccentColor } from "@/contexts/AccentColorContext";
import { Email, EmailFolder, EmailFilter, ComposeData } from "./types";
import { mockEmails, userEmail } from "./data";
import { EmailList } from "./components/EmailList";
import { EmailDetail } from "./components/EmailDetail";
import { ComposeModal } from "./components/ComposeModal";
import { ReplyModal } from "./components/ReplyModal";

let nextEmailId = 9;

export default function MailPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<EmailFilter>("all");
  const [folder, setFolder] = useState<EmailFolder>("inbox");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showCompose, setShowCompose] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [replyToEmail, setReplyToEmail] = useState<Email | null>(null);
  const [composeData, setComposeData] = useState<ComposeData>({
    to: "",
    cc: "",
    bcc: "",
    subject: "",
    body: "",
  });
  const router = useRouter();
  const { accentColorValue } = useAccentColor();

  useEffect(() => {
    const auth = localStorage.getItem("authenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
    } else {
      router.push("/");
    }
  }, [router]);

  const filteredEmails = useMemo(() => {
    let filtered = emails.filter((email) => email.folder === folder);

    if (filter === "unread") {
      filtered = filtered.filter((email) => !email.isRead);
    } else if (filter === "starred") {
      filtered = filtered.filter((email) => email.isStarred);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (email) =>
          email.from.toLowerCase().includes(query) ||
          email.to.toLowerCase().includes(query) ||
          email.subject.toLowerCase().includes(query) ||
          email.preview.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [emails, folder, filter, searchQuery]);

  const totalPages = Math.ceil(filteredEmails.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEmails = filteredEmails.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [folder, filter, searchQuery]);

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    setEmails((prev) =>
      prev.map((e) => (e.id === email.id ? { ...e, isRead: true } : e))
    );
  };

  const handleToggleStar = (emailId: number) => {
    setEmails((prev) =>
      prev.map((e) =>
        e.id === emailId ? { ...e, isStarred: !e.isStarred } : e
      )
    );
  };

  const handleDelete = (emailId: number) => {
    setEmails((prev) => prev.filter((e) => e.id !== emailId));
    if (selectedEmail?.id === emailId) {
      setSelectedEmail(null);
    }
  };

  const handleCompose = () => {
    setComposeData({
      to: "",
      cc: "",
      bcc: "",
      subject: "",
      body: "",
    });
    setShowCompose(true);
    setShowReply(false);
    setReplyToEmail(null);
  };

  const handleReply = (email: Email) => {
    setReplyToEmail(email);
    setComposeData({
      to: email.from,
      cc: "",
      bcc: "",
      subject: `Re: ${email.subject}`,
      body: `\n\n--- Original Message ---\nFrom: ${email.from}\nDate: ${email.time}\n\n${email.body}`,
    });
    setShowReply(true);
    setShowCompose(false);
  };

  const handleSend = () => {
    if (!composeData.to.trim() || !composeData.subject.trim()) {
      alert("Please fill in at least To and Subject fields");
      return;
    }

    const newEmail: Email = {
      id: nextEmailId++,
      from: userEmail,
      to: composeData.to,
      subject: composeData.subject,
      preview: composeData.body.substring(0, 50) + "...",
      body: composeData.body,
      time: "Just now",
      date: new Date(),
      isRead: true,
      isStarred: false,
      folder: replyToEmail ? "inbox" : "sent",
      replyTo: replyToEmail?.id,
    };

    setEmails((prev) => [newEmail, ...prev]);
    setComposeData({
      to: "",
      cc: "",
      bcc: "",
      subject: "",
      body: "",
    });
    setShowCompose(false);
    setShowReply(false);
    setReplyToEmail(null);
    setSelectedEmail(null);

    alert(
      replyToEmail ? "Reply sent successfully!" : "Email sent successfully!"
    );
  };

  const handleSaveDraft = () => {
    if (!composeData.to.trim() && !composeData.subject.trim()) {
      return;
    }

    const draftEmail: Email = {
      id: nextEmailId++,
      from: userEmail,
      to: composeData.to,
      subject: composeData.subject || "(No Subject)",
      preview: composeData.body.substring(0, 50) + "...",
      body: composeData.body,
      time: "Just now",
      date: new Date(),
      isRead: true,
      isStarred: false,
      folder: "drafts",
      replyTo: replyToEmail?.id,
    };

    setEmails((prev) => [draftEmail, ...prev]);
    setComposeData({
      to: "",
      cc: "",
      bcc: "",
      subject: "",
      body: "",
    });
    setShowCompose(false);
    setShowReply(false);
    setReplyToEmail(null);
    alert("Draft saved!");
  };

  const handleFolderChange = (newFolder: EmailFolder) => {
    setFolder(newFolder);
    setSelectedEmail(null);
  };

  const handleEditDraft = (email: Email) => {
    setComposeData({
      to: email.to,
      cc: "",
      bcc: "",
      subject: email.subject,
      body: email.body,
    });
    setShowCompose(true);
    setSelectedEmail(null);
  };

  const unreadCount = emails.filter(
    (e) => e.folder === "inbox" && !e.isRead
  ).length;

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Page Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-3xl sm:text-4xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1"
              style={{ fontFamily: "var(--font-cinzel), serif" }}
            >
              Mail
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Manage your emails and communications
            </p>
          </div>
          <button
            onClick={handleCompose}
            className="px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md text-white"
            style={{ backgroundColor: accentColorValue }}
          >
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Compose</span>
            </div>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <EmailList
          emails={paginatedEmails}
          folder={folder}
          filter={filter}
          searchQuery={searchQuery}
          selectedEmail={selectedEmail}
          unreadCount={unreadCount}
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          totalEmails={filteredEmails.length}
          onEmailSelect={handleEmailClick}
          onToggleStar={handleToggleStar}
          onFolderChange={handleFolderChange}
          onFilterChange={setFilter}
          onSearchChange={setSearchQuery}
          onPageChange={setCurrentPage}
        />

        {selectedEmail && (
          <EmailDetail
            email={selectedEmail}
            folder={folder}
            onClose={() => setSelectedEmail(null)}
            onReply={handleReply}
            onDelete={handleDelete}
            onToggleStar={handleToggleStar}
            onEditDraft={handleEditDraft}
          />
        )}
      </div>

      {showCompose && (
        <ComposeModal
          composeData={composeData}
          onDataChange={setComposeData}
          onClose={() => {
            setShowCompose(false);
            setComposeData({
              to: "",
              cc: "",
              bcc: "",
              subject: "",
              body: "",
            });
          }}
          onSend={handleSend}
          onSaveDraft={handleSaveDraft}
        />
      )}

      {showReply && replyToEmail && (
        <ReplyModal
          replyToEmail={replyToEmail}
          composeData={composeData}
          onDataChange={setComposeData}
          onClose={() => {
            setShowReply(false);
            setReplyToEmail(null);
            setComposeData({
              to: "",
              cc: "",
              bcc: "",
              subject: "",
              body: "",
            });
          }}
          onSend={handleSend}
        />
      )}
    </>
  );
}
