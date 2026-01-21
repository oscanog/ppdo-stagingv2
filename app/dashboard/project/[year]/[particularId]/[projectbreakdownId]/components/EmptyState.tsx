// app/dashboard/project/[year]/[particularId]/[projectbreakdownId]/components/EmptyState.tsx

"use client";

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ 
  message = "No breakdown records found" 
}: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center h-64 text-zinc-500 dark:text-zinc-400">
      {message}
    </div>
  );
}