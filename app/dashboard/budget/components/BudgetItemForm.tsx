// app/dashboard/budget/components/BudgetItemForm.tsx

"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAccentColor } from "../../contexts/AccentColorContext";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Calculator, AlertCircle, Info, PlusCircle, MinusCircle } from "lucide-react";
import { BudgetParticularCombobox } from "./BudgetParticularCombobox";

interface BudgetItem {
  id: string;
  particular: string;
  totalBudgetAllocated: number;
  obligatedBudget?: number;
  totalBudgetUtilized: number;
  utilizationRate: number;
  projectCompleted: number;
  projectDelayed: number;
  projectsOnTrack: number;
  year?: number;
  status?: "completed" | "ongoing" | "delayed";
}

const FORM_STORAGE_KEY = "budget_item_form_draft";

const noWhitespaceString = z
  .string()
  .min(1, { message: "This field is required." })
  .refine((val) => val.trim().length > 0, {
    message: "Whitespace only is not allowed.",
  })
  .refine((val) => val === val.trim(), {
    message: "Leading or trailing whitespace is not allowed.",
  })
  .refine((val) => !/\s/.test(val), {
    message: "Whitespace is not allowed.",
  });

// ✅ Updated Schema: removed cross-field refinements here to allow flexible input
const budgetItemSchema = z.object({
  particular: noWhitespaceString,
  totalBudgetAllocated: z.number().min(0, {
    message: "Must be 0 or greater.",
  }),
  obligatedBudget: z.number().min(0).optional().or(z.literal(0)),
  // ✅ Utilized is optional/0 allowed
  totalBudgetUtilized: z.number().min(0).optional().or(z.literal(0)),
  year: z.number().int().min(2000).max(2100).optional().or(z.literal(0)),
});

type BudgetItemFormValues = z.infer<typeof budgetItemSchema>;

interface BudgetItemFormProps {
  item?: BudgetItem | null;
  onSave: (item: Omit<BudgetItem, "id" | "utilizationRate" | "projectCompleted" | "projectDelayed" | "projectsOnTrack" | "status">) => void;
  onCancel: () => void;
}

export function BudgetItemForm({
  item,
  onSave,
  onCancel,
}: BudgetItemFormProps) {
  const { accentColorValue } = useAccentColor();
  
  // ✅ State to toggle utilized budget visibility
  const [showUtilizedInput, setShowUtilizedInput] = useState(
    !!item && item.totalBudgetUtilized > 0
  );

  const getSavedDraft = () => {
    if (item) return null;
    try {
      const saved = localStorage.getItem(FORM_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Error loading form draft:", error);
    }
    return null;
  };

  const savedDraft = getSavedDraft();

  const form = useForm<BudgetItemFormValues>({
    resolver: zodResolver(budgetItemSchema),
    defaultValues: savedDraft || {
      particular: item?.particular || "",
      totalBudgetAllocated: item?.totalBudgetAllocated || 0,
      obligatedBudget: item?.obligatedBudget || undefined,
      totalBudgetUtilized: item?.totalBudgetUtilized || 0,
      year: item?.year || undefined,
    },
  });

  const formValues = form.watch();

  useEffect(() => {
    if (!item) {
      const timer = setTimeout(() => {
        try {
          localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formValues));
        } catch (error) {
          console.error("Error saving form draft:", error);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [formValues, item]);

  const totalBudgetAllocated = form.watch("totalBudgetAllocated");
  const obligatedBudget = form.watch("obligatedBudget");
  const totalBudgetUtilized = form.watch("totalBudgetUtilized") || 0;

  const utilizationRate =
    totalBudgetAllocated > 0
      ? (totalBudgetUtilized / totalBudgetAllocated) * 100
      : 0;

  // ✅ Inline Checks (Visual Only)
  const isBudgetExceeded = totalBudgetUtilized > totalBudgetAllocated;
  const isObligatedExceeded = obligatedBudget && obligatedBudget > totalBudgetAllocated;

  const getUtilizationColor = () => {
    if (utilizationRate > 100) return "text-red-600 dark:text-red-400 font-bold";
    if (utilizationRate >= 80) return "text-red-600 dark:text-red-400";
    if (utilizationRate >= 60) return "text-orange-600 dark:text-orange-400";
    return "text-green-600 dark:text-green-400";
  };

  function onSubmit(values: BudgetItemFormValues) {
    const cleanedValues = {
      ...values,
      obligatedBudget: values.obligatedBudget && values.obligatedBudget > 0 ? values.obligatedBudget : undefined,
      totalBudgetUtilized: values.totalBudgetUtilized || 0, // Ensure 0 if undefined
      year: values.year && values.year > 0 ? values.year : undefined,
    };

    if (!item) {
      try {
        localStorage.removeItem(FORM_STORAGE_KEY);
      } catch (error) {
        console.error("Error clearing form draft:", error);
      }
    }
    onSave(cleanedValues as any);
  }

  const handleCancel = () => {
    if (!item) {
      try {
        localStorage.removeItem(FORM_STORAGE_KEY);
      } catch (error) {
        console.error("Error clearing form draft:", error);
      }
    }
    onCancel();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="particular"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-700 dark:text-zinc-300">
                Particular
              </FormLabel>
              <FormControl>
                <BudgetParticularCombobox
                  value={field.value}
                  onChange={field.onChange}
                  disabled={!!item}
                  error={form.formState.errors.particular?.message}
                />
              </FormControl>
              {item && (
                <FormDescription className="text-zinc-500 dark:text-zinc-400">
                  Particular cannot be changed after creation
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-700 dark:text-zinc-300">
                Year <span className="text-xs text-zinc-500">(Optional)</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. 2024"
                  min="2000"
                  max="2100"
                  className="bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => {
                    const value = e.target.value.trim();
                    field.onChange(value ? parseInt(value) : undefined);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            name="totalBudgetAllocated"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-700 dark:text-zinc-300">
                  Total Budget Allocated
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="0"
                    min="0"
                    step="0.01"
                    className="bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value.trim();
                      field.onChange(parseFloat(value) || 0);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="obligatedBudget"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-700 dark:text-zinc-300">
                  Obligated Budget <span className="text-xs text-zinc-500">(Optional)</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="0"
                    min="0"
                    step="0.01"
                    className={`bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 ${
                      isObligatedExceeded
                        ? "border-red-500 dark:border-red-500 focus-visible:ring-red-500"
                        : "border-zinc-300 dark:border-zinc-700"
                    }`}
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = e.target.value.trim();
                      field.onChange(value ? parseFloat(value) : undefined);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ✅ Toggle for Utilized Budget */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
             <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                    const nextState = !showUtilizedInput;
                    setShowUtilizedInput(nextState);
                    if (!nextState) {
                        form.setValue("totalBudgetUtilized", 0);
                    }
                }}
                className="text-xs flex items-center gap-2"
             >
                {showUtilizedInput ? (
                    <><MinusCircle className="w-3 h-3" /> Hide Utilized Budget</>
                ) : (
                    <><PlusCircle className="w-3 h-3" /> Input Utilized Budget</>
                )}
             </Button>
          </div>

          {showUtilizedInput && (
            <FormField
                name="totalBudgetUtilized"
                render={({ field }) => (
                <FormItem className="animate-in fade-in slide-in-from-top-2 duration-200">
                    <FormLabel className="text-zinc-700 dark:text-zinc-300">
                    Total Budget Utilized
                    </FormLabel>
                    <FormControl>
                    <Input
                        placeholder="0"
                        min="0"
                        step="0.01"
                        className={`bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 ${
                        isBudgetExceeded
                            ? "border-red-500 dark:border-red-500 focus-visible:ring-red-500"
                            : "border-zinc-300 dark:border-zinc-700"
                        }`}
                        {...field}
                        onChange={(e) => {
                        const value = e.target.value.trim();
                        field.onChange(parseFloat(value) || 0);
                        }}
                    />
                    </FormControl>
                    {isBudgetExceeded && (
                        <p className="text-xs text-red-500 mt-1">
                            Warning: Utilized budget exceeds allocated budget.
                        </p>
                    )}
                    <FormMessage />
                </FormItem>
                )}
            />
          )}
        </div>

        {/* Warnings */}
        {isObligatedExceeded && totalBudgetAllocated > 0 && (
          <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                Obligated Budget Exceeded
              </p>
              <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-0.5">
                Obligated budget ({obligatedBudget?.toFixed(2)}) cannot exceed allocated amount ({totalBudgetAllocated.toFixed(2)})
              </p>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-lg">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <p className="font-medium">Automatic Project Metrics & Status</p>
            <p className="mt-1 opacity-90">
              Project counts and status are automatically calculated from individual projects.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <Button
            type="button"
            onClick={handleCancel}
            variant="ghost"
            className="text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="text-white"
            style={{ backgroundColor: accentColorValue }}
          >
            {item ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}