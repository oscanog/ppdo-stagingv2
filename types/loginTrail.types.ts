// types/loginTrail.types.ts

import { Id } from "@/convex/_generated/dataModel";

export type LoginAttemptStatus = "success" | "failed" | "suspicious" | "blocked";

export interface LoginAttempt {
  id: Id<"loginAttempts">;
  userId?: Id<"users">;
  userName: string;
  userEmail: string;
  timestamp: number;
  status: LoginAttemptStatus;
  ipAddress: string;
  location: string;
  device: string;
  browser: string;
  riskScore?: number;
  flaggedForReview?: boolean;
  failureReason?: string;
  isPinned: boolean;
}

export interface LoginTrailFilters {
  status: "all" | LoginAttemptStatus;
  searchTerm: string;
  startDate: string;
  endDate: string;
  ipAddress: string;
  location: string;
  showPinnedOnly: boolean;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface LoginTrailResponse {
  attempts: LoginAttempt[];
  pagination: PaginationInfo;
}

export interface BlockedIP {
  _id: Id<"blockedIPs">;
  ipAddress: string;
  reason: string;
  blockedBy: Id<"users">;
  blockedAt: number;
  isActive: boolean;
  attemptId?: Id<"loginAttempts">;
  notes?: string;
  expiresAt?: number;
}

export interface BlockedEmail {
  _id: Id<"blockedEmails">;
  email: string;
  reason: string;
  blockedBy: Id<"users">;
  blockedAt: number;
  isActive: boolean;
  attemptId?: Id<"loginAttempts">;
  notes?: string;
  expiresAt?: number;
}