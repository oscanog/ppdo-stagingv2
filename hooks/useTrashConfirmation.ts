import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";

export type PendingTrashItem = {
  type: "budgetItem" | "project" | "breakdown";
  id: string;
  name: string;
};

export type TrashPreviewResult = {
  targetItem: {
    id: string;
    name: string;
    type: "budgetItem" | "project" | "breakdown";
  };
  cascadeCounts: {
    projects: number;
    breakdowns: number;
    inspections: number;
    totalFinancialImpact: {
      allocated: number;
      utilized: number;
      obligated: number;
    };
  };
  affectedItems: {
    projects: Array<{
      id: string;
      name: string;
      type: "project";
      financials: { allocated: number; utilized: number; obligated?: number };
    }>;
    breakdowns: Array<{
      id: string;
      name: string;
      type: "breakdown";
      parentId: string;
      financials: { allocated?: number; utilized?: number };
    }>;
  };
  warnings: string[];
  canDelete: boolean;
};

export function useTrashConfirmation() {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [pendingTrashItem, setPendingTrashItem] = useState<PendingTrashItem | null>(null);

  const previewData = useQuery(
    api.trash.getTrashPreview,
    pendingTrashItem && isConfirmationOpen
      ? {
          entityType: pendingTrashItem.type,
          entityId: pendingTrashItem.id,
        }
      : "skip"
  );

  const isLoading = previewData === undefined && isConfirmationOpen;

  const moveToTrashMutation = useMutation(api.trash.moveToTrashWithConfirmation);

  const initiateTrash = (type: "budgetItem" | "project" | "breakdown", id: string, name: string) => {
    setPendingTrashItem({ type, id, name });
    setIsConfirmationOpen(true);
  };

  const confirmTrash = async (reason?: string) => {
    if (!pendingTrashItem) return;

    try {
      await moveToTrashMutation({
        entityType: pendingTrashItem.type,
        entityId: pendingTrashItem.id,
        reason,
        confirmedCascade: true,
      });

      toast.success(`${pendingTrashItem.name} moved to trash`);
      reset();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to move to trash: ${errorMessage}`);
    }
  };

  const cancelTrash = () => {
    setIsConfirmationOpen(false);
    // Don't reset pending item immediately - let animation finish
    setTimeout(() => {
      setPendingTrashItem(null);
    }, 300);
  };

  const reset = () => {
    setIsConfirmationOpen(false);
    setPendingTrashItem(null);
  };

  return {
    // State
    isConfirmationOpen,
    setIsConfirmationOpen,
    pendingTrashItem,

    // Data
    previewData: previewData as TrashPreviewResult | null,
    isLoading,

    // Actions
    initiateTrash,
    confirmTrash,
    cancelTrash,

    // Reset
    reset,
  };
}
