// app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/utils/navigation.utils.ts

import { Breakdown } from "../types/breakdown.types";
import { createBreakdownSlug } from "./helpers";

export interface NavigationParams {
  particularId: string;
  projectbreakdownId: string;
}

/**
 * Builds the URL path for viewing breakdown details
 */
export function buildBreakdownDetailPath(
  breakdown: Breakdown,
  params: NavigationParams
): string {
  const { particularId, projectbreakdownId } = params;
  const breakdownSlug = createBreakdownSlug(breakdown);
  
  return `/dashboard/project/budget/${particularId}/${projectbreakdownId}/${breakdownSlug}`;
}

/**
 * Logs breakdown navigation for debugging
 */
export function logBreakdownNavigation(breakdown: Breakdown): void {
  console.log('Breakdown clicked:', {
    _id: breakdown._id,
    projectId: breakdown.projectId,
    projectTitle: breakdown.projectTitle,
    allKeys: Object.keys(breakdown)
  });
}