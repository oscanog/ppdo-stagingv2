"use client";

import { useState, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAccentColor } from "../../../../contexts/AccentColorContext";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronDown, MapPin, FileText, PlusCircle, MinusCircle, AlertTriangle } from "lucide-react";
import { ImplementingOfficeSelector } from "./ImplementingOfficeSelector";
import { BudgetViolationModal } from "../../../components/BudgetViolationModal";

// 1. Updated Schema: Flexible inputs (optional/0 allowed) to let the Modal handle the logic
const breakdownSchema = z.object({
  projectName: z.string().min(1, { message: "Project name is required." }),
  implementingOffice: z.string().min(1, { message: "Implementing office is required." }),
  projectTitle: z.string().optional(),
  allocatedBudget: z.number().min(0, { message: "Must be 0 or greater." }).optional(),
  obligatedBudget: z.number().min(0).optional(),
  budgetUtilized: z.number().min(0).optional(),
  utilizationRate: z.number().min(0).max(100).optional(),
  balance: z.number().optional(),
  dateStarted: z.number().optional(),
  targetDate: z.number().optional(),
  completionDate: z.number().optional(),
  projectAccomplishment: z.number().min(0).max(100).optional(),
  status: z.enum(["completed", "ongoing", "delayed"]).optional(),
  remarks: z.string().optional(),
  district: z.string().optional(),
  municipality: z.string().optional(),
  barangay: z.string().optional(),
  reportDate: z.number().optional(),
  batchId: z.string().optional(),
  fundSource: z.string().optional(),
});

type BreakdownFormValues = z.infer<typeof breakdownSchema>;

interface Breakdown {
  _id: string;
  projectName: string;
  implementingOffice: string;
  projectId?: string;
  projectTitle?: string;
  allocatedBudget?: number;
  obligatedBudget?: number;
  budgetUtilized?: number;
  utilizationRate?: number;
  balance?: number;
  dateStarted?: number;
  targetDate?: number;
  completionDate?: number;
  projectAccomplishment?: number;
  status?: "completed" | "ongoing" | "delayed";
  remarks?: string;
  district?: string;
  municipality?: string;
  barangay?: string;
  reportDate?: number;
  batchId?: string;
  fundSource?: string;
}

interface BreakdownFormProps {
  breakdown?: Breakdown | null;
  onSave: (breakdown: Omit<Breakdown, "_id">) => void;
  onCancel: () => void;
  defaultProjectName?: string;
  defaultImplementingOffice?: string;
  projectId?: string; // Passed from parent page
}

export function BreakdownForm({
  breakdown,
  onSave,
  onCancel,
  defaultProjectName,
  defaultImplementingOffice,
  projectId,
}: BreakdownFormProps) {
  const { accentColorValue } = useAccentColor();
  
  // 2. States for UI interactions
  const [showUtilizedInput, setShowUtilizedInput] = useState(
    !!breakdown && (breakdown.budgetUtilized || 0) > 0
  );
  const [showViolationModal, setShowViolationModal] = useState(false);
  const [pendingValues, setPendingValues] = useState<BreakdownFormValues | null>(null);

  // Helper: Date conversions
  const dateToTimestamp = (dateString: string) => dateString ? new Date(dateString).getTime() : undefined;
  const timestampToDate = (timestamp?: number) => timestamp ? new Date(timestamp).toISOString().split("T")[0] : "";

  // 3. Fetch Parent Project & Sibling Data to calculate availability
  const effectiveProjectId = projectId || breakdown?.projectId;
  
  const projectData = useQuery(
    api.projects.getForValidation, 
    effectiveProjectId ? { id: effectiveProjectId as Id<"projects"> } : "skip"
  );
  
  const siblings = useQuery(
    api.govtProjects.getProjectBreakdowns,
    effectiveProjectId ? { projectId: effectiveProjectId as Id<"projects"> } : "skip"
  );

  // Initialize Form
  const form = useForm<BreakdownFormValues>({
    resolver: zodResolver(breakdownSchema),
    defaultValues: {
      projectName: breakdown?.projectName || defaultProjectName || "",
      implementingOffice: breakdown?.implementingOffice || defaultImplementingOffice || "",
      projectTitle: breakdown?.projectTitle || "",
      allocatedBudget: breakdown?.allocatedBudget || undefined,
      obligatedBudget: breakdown?.obligatedBudget || undefined,
      budgetUtilized: breakdown?.budgetUtilized || undefined,
      utilizationRate: breakdown?.utilizationRate || undefined,
      balance: breakdown?.balance || undefined,
      dateStarted: breakdown?.dateStarted || undefined,
      targetDate: breakdown?.targetDate || undefined,
      completionDate: breakdown?.completionDate || undefined,
      projectAccomplishment: breakdown?.projectAccomplishment || undefined,
      status: breakdown?.status || undefined,
      remarks: breakdown?.remarks || "",
      district: breakdown?.district || "",
      municipality: breakdown?.municipality || "",
      barangay: breakdown?.barangay || "",
      reportDate: breakdown?.reportDate || Date.now(),
      batchId: breakdown?.batchId || "",
      fundSource: breakdown?.fundSource || "",
    },
  });

  // 4. Watch fields for real-time validation calculations
  const currentAllocated = form.watch("allocatedBudget") || 0;
  const currentUtilized = form.watch("budgetUtilized") || 0;
  
  // Logic: Does this breakdown's utilization exceed its own allocation?
  const isOverSelfUtilized = currentUtilized > currentAllocated;

  // Logic: Does this breakdown's allocation exceed Parent Project's available budget?
  const parentAvailability = useMemo(() => {
    // Default safe values while loading
    if (!projectData || !siblings) {
      return { available: 0, isExceeded: false, diff: 0, parentTotal: 0 };
    }
    
    // ✅ FIX: Use parent project's ALLOCATED budget, not totalBudgetAllocated
    const parentTotal = projectData.totalBudgetAllocated;
    
    // Filter out the current breakdown if editing (to avoid double counting its old value)
    const otherSiblings = breakdown 
      ? siblings.filter(s => s._id !== breakdown._id) 
      : siblings;
      
    // Sum allocated budget of all other siblings
    const siblingUsed = otherSiblings.reduce((sum, s) => sum + (s.allocatedBudget || 0), 0);
    
    // Calculate what's left for THIS breakdown
    const available = parentTotal - siblingUsed;
    
    // Check if user input exceeds availability
    const isExceeded = currentAllocated > available;
    
    return { 
      available, 
      isExceeded, 
      diff: currentAllocated - available,
      parentTotal 
    };
  }, [projectData, siblings, breakdown, currentAllocated]);

  // 5. Submit Handler
  function onSubmit(values: BreakdownFormValues) {
    // Check constraints
    const isOverParent = parentAvailability.isExceeded;
    const isOverSelf = (values.budgetUtilized || 0) > (values.allocatedBudget || 0);

    // If ANY violation exists, interrupt save and show Modal
    if (isOverParent || isOverSelf) {
        setPendingValues(values);
        setShowViolationModal(true);
        return; // STOP here
    }

    // If clean, proceed to save
    onSave(values as any);
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <Form {...form}>
        <div className="space-y-6">
          
          {/* --- SECTION 1: Basic Info --- */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 rounded-full" style={{ backgroundColor: accentColorValue }} />
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Basic Information
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                name="implementingOffice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-700 dark:text-zinc-300">
                      Implementing Office <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <ImplementingOfficeSelector
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="projectTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-700 dark:text-zinc-300">
                      Project Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Multi-Purpose Building..."
                        className="bg-white dark:bg-zinc-900"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* --- SECTION 2: Financial Information --- */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 rounded-full" style={{ backgroundColor: accentColorValue }} />
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Financial Information
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Allocated Budget - With Parent Violation Logic */}
              <FormField
                name="allocatedBudget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-700 dark:text-zinc-300">
                      Allocated Budget
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        min="0"
                        step="0.01"
                        className={`bg-white dark:bg-zinc-900 ${
                          parentAvailability.isExceeded 
                            ? "border-red-500 focus-visible:ring-red-500" 
                            : "border-zinc-300 dark:border-zinc-700"
                        }`}
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.trim();
                          field.onChange(value ? parseFloat(value) : undefined);
                        }}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    {/* ✅ FIXED: Inline Error for Parent Violation */}
                    {parentAvailability.isExceeded && projectData && (
                      <div className="flex items-start gap-1 mt-1 text-xs text-red-600 font-medium animate-in slide-in-from-top-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>
                          Warning: Amount exceeds parent project availability ({formatCurrency(parentAvailability.available)})
                        </span>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Obligated Budget */}
              <FormField
                name="obligatedBudget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-700 dark:text-zinc-300">
                      Obligated Budget
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        min="0"
                        step="0.01"
                        className="bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.trim();
                          field.onChange(value ? parseFloat(value) : undefined);
                        }}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Utilized Budget - Hidden by default */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                 <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        const nextState = !showUtilizedInput;
                        setShowUtilizedInput(nextState);
                        if (!nextState) {
                            form.setValue("budgetUtilized", 0);
                        }
                    }}
                    className="text-xs flex items-center gap-2 h-8"
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
                    name="budgetUtilized"
                    render={({ field }) => (
                    <FormItem className="animate-in fade-in slide-in-from-top-2 duration-200">
                        <FormLabel className="text-zinc-700 dark:text-zinc-300">
                          Budget Utilized
                        </FormLabel>
                        <FormControl>
                        <Input
                            type="number"
                            placeholder="0"
                            min="0"
                            step="0.01"
                            className={`bg-white dark:bg-zinc-900 ${
                              isOverSelfUtilized
                                ? "border-orange-500 focus-visible:ring-orange-500"
                                : "border-zinc-300 dark:border-zinc-700"
                            }`}
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value.trim();
                              field.onChange(value ? parseFloat(value) : undefined);
                            }}
                            value={field.value ?? ""}
                        />
                        </FormControl>
                        {/* Inline Warning for Self Utilization Violation */}
                        {isOverSelfUtilized && (
                            <p className="text-xs text-orange-600 mt-1 font-medium">
                                ⚠️ Warning: Utilized amount exceeds allocated budget.
                            </p>
                        )}
                        <FormMessage />
                    </FormItem>
                    )}
                />
              )}
            </div>
          </div>

          {/* --- SECTION 3: Progress & Status --- */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 rounded-full" style={{ backgroundColor: accentColorValue }} />
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Status & Progress
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                name="projectAccomplishment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-700 dark:text-zinc-300">
                      Accomplishment (%)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        min="0"
                        max="100"
                        step="0.1"
                        className="bg-white dark:bg-zinc-900"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.trim();
                          field.onChange(value ? parseFloat(value) : undefined);
                        }}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-700 dark:text-zinc-300">
                      Status
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white dark:bg-zinc-900">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="delayed">Delayed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* --- Accordion: Additional Info (Dates, Location, etc) --- */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="additional-info" className="border rounded-lg px-4">
              <AccordionTrigger className="py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Additional Information
                  </span>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <MapPin className="h-3 w-3" /> Location & Dates
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-6">
                
                {/* Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField
                    name="dateStarted"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Date Started</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            value={timestampToDate(field.value)}
                            onChange={(e) => field.onChange(dateToTimestamp(e.target.value))}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="targetDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Target Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            value={timestampToDate(field.value)}
                            onChange={(e) => field.onChange(dateToTimestamp(e.target.value))}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="completionDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Completion Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            value={timestampToDate(field.value)}
                            onChange={(e) => field.onChange(dateToTimestamp(e.target.value))}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">District</FormLabel>
                        <Input {...field} value={field.value || ""} />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="municipality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Municipality</FormLabel>
                        <Input {...field} value={field.value || ""} />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="barangay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Barangay</FormLabel>
                        <Input {...field} value={field.value || ""} />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Remarks */}
                <FormField
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Remarks</FormLabel>
                      <Textarea 
                        {...field} 
                        value={field.value || ""} 
                        className="resize-none" 
                        rows={2} 
                      />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <Button
              type="button"
              onClick={onCancel}
              variant="ghost"
              className="text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={form.handleSubmit(onSubmit)}
              className="text-white"
              style={{ backgroundColor: accentColorValue }}
            >
              {breakdown ? "Update Breakdown" : "Create Breakdown"}
            </Button>
          </div>
        </div>
      </Form>

      {/* 6. UNIFIED VIOLATION MODAL */}
      <BudgetViolationModal 
        isOpen={showViolationModal}
        onClose={() => {
            setShowViolationModal(false);
            setPendingValues(null);
        }}
        onConfirm={() => {
            if(pendingValues) onSave(pendingValues as any);
            setShowViolationModal(false);
            setPendingValues(null);
        }}
        allocationViolation={{
            hasViolation: parentAvailability.isExceeded,
            message: "Project Breakdown allocated budget exceeds Parent Project budget availability.",
            details: [{
                label: "Parent Project Available",
                amount: pendingValues?.allocatedBudget || 0,
                limit: parentAvailability.available,
                diff: parentAvailability.diff
            }]
        }}
        utilizationViolation={{
            hasViolation: (pendingValues?.budgetUtilized || 0) > (pendingValues?.allocatedBudget || 0),
            message: "The utilized budget exceeds the allocated budget you are setting for this breakdown.",
            details: [{
                label: "Self Allocation",
                amount: pendingValues?.budgetUtilized || 0,
                limit: pendingValues?.allocatedBudget || 0,
                diff: (pendingValues?.budgetUtilized || 0) - (pendingValues?.allocatedBudget || 0)
            }]
        }}
      />
    </>
  );
}