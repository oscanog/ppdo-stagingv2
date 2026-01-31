export interface Email {
  id: number;
  from: string;
  to: string;
  subject: string;
  preview: string;
  body: string;
  time: string;
  date: Date;
  isRead: boolean;
  isStarred: boolean;
  folder: "inbox" | "sent" | "drafts";
  category?: string;
  replyTo?: number; // ID of email being replied to
}

export type EmailFolder = "inbox" | "sent" | "drafts";
export type EmailFilter = "all" | "unread" | "starred";

export interface ComposeData {
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  body: string;
}
