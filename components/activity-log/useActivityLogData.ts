// components/ActivityLogSheet/useActivityLogData.ts

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMemo } from "react";
import { UnifiedActivityLog, ActivityLogType } from "./types";

interface UseActivityLogDataProps {
  type: ActivityLogType;
  entityId?: string;
  budgetItemId?: string;
  projectName?: string;
  implementingOffice?: string;
  actionFilter: string;
  loadedCount: number;
}

export function useActivityLogData({
  type,
  entityId,
  budgetItemId,
  projectName,
  implementingOffice,
  actionFilter,
  loadedCount,
}: UseActivityLogDataProps) {
  // ============================================================================
  // TRUST FUND ACTIVITIES
  // ============================================================================
  const trustFundActivitiesAll = useQuery(
    api.trustFundActivities.list,
    type === "trustFund" && entityId === "all"
      ? { 
          limit: loadedCount,
          action: actionFilter !== "all" ? actionFilter : undefined 
        }
      : "skip"
  );

  const trustFundActivitiesSingle = useQuery(
    api.trustFundActivities.getByTrustFundId,
    type === "trustFund" && entityId && entityId !== "all"
      ? { 
          trustFundId: entityId as Id<"trustFunds">,
          limit: loadedCount 
        }
      : "skip"
  );

  // ============================================================================
  // PROJECT ACTIVITIES
  // ============================================================================
  const projectActivities = useQuery(
    api.projectActivities.getByProject,
    type === "project" && entityId
      ? { projectId: entityId as Id<"projects">, limit: loadedCount }
      : "skip"
  );

  // ============================================================================
  // BUDGET ITEM ACTIVITIES
  // ============================================================================
  const budgetActivities = useQuery(
    api.budgetItemActivities.getByBudgetItem,
    type === "budgetItem" && (entityId || budgetItemId)
      ? { 
          budgetItemId: (entityId || budgetItemId) as Id<"budgetItems">, 
          limit: loadedCount 
        }
      : "skip"
  );

  // ============================================================================
  // BREAKDOWN ACTIVITIES
  // ============================================================================
  const breakdownActivitiesSingle = useQuery(
    api.govtProjectActivities.getBreakdownActivities,
    type === "breakdown" && entityId
      ? { breakdownId: entityId as Id<"govtProjectBreakdowns">, limit: loadedCount }
      : "skip"
  );

  const breakdownActivitiesProjectOffice = useQuery(
    api.govtProjectActivities.getProjectOfficeActivities,
    type === "breakdown" && projectName && implementingOffice
      ? {
          projectName,
          implementingOffice,
          action: actionFilter !== "all" ? actionFilter as any : undefined,
        }
      : "skip"
  );

  // ============================================================================
  // TRANSFORM DATA
  // ============================================================================
  const activities: UnifiedActivityLog[] = useMemo(() => {
    let rawActivities: any[] = [];

    // Trust Fund Activities
    if (type === "trustFund") {
      if (entityId === "all") {
        rawActivities = trustFundActivitiesAll || [];
      } else {
        rawActivities = trustFundActivitiesSingle || [];
      }

      return rawActivities.map((activity) => ({
        _id: activity._id,
        action: activity.action,
        timestamp: activity.timestamp,
        performedByName: activity.performedByName,
        performedByEmail: activity.performedByEmail,
        performedByRole: activity.performedByRole,
        reason: activity.reason,
        changedFields: activity.changedFields,
        changeSummary: activity.changeSummary,
        previousValues: activity.previousValues,
        newValues: activity.newValues,
        // Trust Fund specific fields
        projectTitle: activity.projectTitle,
        officeInCharge: activity.officeInCharge,
      }));
    }

    // Project Activities
    if (type === "project") {
      rawActivities = projectActivities || [];

      return rawActivities.map((activity) => ({
        _id: activity._id,
        action: activity.action,
        timestamp: activity.timestamp,
        performedByName: activity.performedByName,
        performedByEmail: activity.performedByEmail,
        performedByRole: activity.performedByRole,
        reason: activity.reason,
        changedFields: activity.changedFields,
        changeSummary: activity.changeSummary,
        previousValues: activity.previousValues,
        newValues: activity.newValues,
        particulars: activity.particulars,
        implementingOffice: activity.implementingOffice,
      }));
    }

    // Budget Item Activities
    if (type === "budgetItem") {
      rawActivities = budgetActivities || [];

      return rawActivities.map((activity) => ({
        _id: activity._id,
        action: activity.action,
        timestamp: activity.timestamp,
        performedByName: activity.performedByName,
        performedByEmail: activity.performedByEmail,
        performedByRole: activity.performedByRole,
        reason: activity.reason,
        changedFields: activity.changedFields,
        changeSummary: activity.changeSummary,
        previousValues: activity.previousValues,
        newValues: activity.newValues,
        particulars: activity.particulars,
      }));
    }

    // Breakdown Activities
    if (type === "breakdown") {
      if (projectName && implementingOffice) {
        rawActivities = breakdownActivitiesProjectOffice || [];
      } else {
        rawActivities = breakdownActivitiesSingle || [];
      }

      return rawActivities.map((activity) => ({
        _id: activity._id,
        action: activity.action,
        timestamp: activity.timestamp,
        performedByName: activity.performedByName,
        performedByEmail: activity.performedByEmail,
        performedByRole: activity.performedByRole,
        reason: activity.reason,
        changedFields: activity.changedFields,
        changeSummary: activity.changeSummary,
        previousValues: activity.previousValues,
        newValues: activity.newValues,
        projectName: activity.projectName,
        implementingOffice: activity.implementingOffice,
        municipality: activity.municipality,
        barangay: activity.barangay,
        district: activity.district,
      }));
    }

    return [];
  }, [
    type,
    entityId,
    projectName,
    implementingOffice,
    trustFundActivitiesAll,
    trustFundActivitiesSingle,
    projectActivities,
    budgetActivities,
    breakdownActivitiesSingle,
    breakdownActivitiesProjectOffice,
  ]);

  // ============================================================================
  // LOADING STATE
  // ============================================================================
  const isLoading = useMemo(() => {
    if (type === "trustFund") {
      if (entityId === "all") {
        return trustFundActivitiesAll === undefined;
      }
      return trustFundActivitiesSingle === undefined;
    }

    if (type === "project") {
      return projectActivities === undefined;
    }

    if (type === "budgetItem") {
      return budgetActivities === undefined;
    }

    if (type === "breakdown") {
      if (projectName && implementingOffice) {
        return breakdownActivitiesProjectOffice === undefined;
      }
      return breakdownActivitiesSingle === undefined;
    }

    return false;
  }, [
    type,
    entityId,
    projectName,
    implementingOffice,
    trustFundActivitiesAll,
    trustFundActivitiesSingle,
    projectActivities,
    budgetActivities,
    breakdownActivitiesSingle,
    breakdownActivitiesProjectOffice,
  ]);

  // ============================================================================
  // HAS MORE TO LOAD
  // ============================================================================
  const hasMoreToLoad = useMemo(() => {
    // For now, assume there's more to load if we got exactly the limit
    // This is a simple heuristic - adjust based on your needs
    return activities.length >= loadedCount;
  }, [activities.length, loadedCount]);

  return {
    activities,
    isLoading,
    hasMoreToLoad,
  };
}