// convex/lib/statusValidation.ts

/**
 * STATUS PRIORITY CALCULATION
 * 
 * Rules:
 * 1. If there's at least one "ongoing" → status = "ongoing"
 * 2. Else if there's at least one "delayed" → status = "delayed" 
 * 3. Else if there's at least one "completed" → status = "completed"
 * 4. Else (no items) → status = "ongoing" (default)
 */

/**
 * Calculate status from an array of items with status
 */
export function calculateAggregateStatus<T extends { status?: "completed" | "delayed" | "ongoing" }>(
  items: T[]
): "completed" | "delayed" | "ongoing" {
  if (items.length === 0) {
    return "ongoing";
  }

  let hasOngoing = false;
  let hasDelayed = false;
  let hasCompleted = false;

  for (const item of items) {
    const status = item.status;
    if (status === "ongoing") {
      hasOngoing = true;
    } else if (status === "delayed") {
      hasDelayed = true;
    } else if (status === "completed") {
      hasCompleted = true;
    }
  }

  // Apply priority rules
  if (hasOngoing) return "ongoing";
  if (hasDelayed) return "delayed";
  if (hasCompleted) return "completed";
  
  return "ongoing"; // Default fallback
}

/**
 * Count statuses in an array
 */
export function countStatuses<T extends { status?: "completed" | "delayed" | "ongoing" }>(
  items: T[]
): { completed: number; delayed: number; ongoing: number } {
  return items.reduce(
    (acc, item) => {
      const status = item.status;
      if (status === "completed") acc.completed++;
      else if (status === "delayed") acc.delayed++;
      else if (status === "ongoing") acc.ongoing++;
      return acc;
    },
    { completed: 0, delayed: 0, ongoing: 0 }
  );
}

/**
 * Validate status string
 */
export function isValidStatus(status: string): status is "completed" | "delayed" | "ongoing" {
  return status === "completed" || status === "delayed" || status === "ongoing";
}