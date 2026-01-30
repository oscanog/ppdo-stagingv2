"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DashboardFilters } from "@/hooks/useDashboardFilters";
import { DashboardSkeleton } from "@/components/analytics/DashboardSkeleton";
import { KPICardsRow } from "@/components/ppdo/dashboard/summary/KPICardsRow";
import { EnhancedBudgetChart } from "@/components/analytics/EnhancedBudgetChart";
import { TimeSeriesChart } from "@/components/analytics/TimeSeriesChart";
import { DepartmentBreakdownChart } from "@/components/analytics/DepartmentBreakdownChart";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DashboardContentProps {
    filters: DashboardFilters;
    year?: string;
}

export function DashboardContent({ filters, year }: DashboardContentProps) {
    // Get fiscal year ID first to ensure we have one
    const fiscalYears = useQuery(api.fiscalYears.list, {});

    // Resolve fiscal year ID
    const fiscalYearId = filters.fiscalYearId || (
        year && fiscalYears
            ? fiscalYears.find(fy => fy.year === parseInt(year))?._id
            : undefined
    );

    // Prepare query args avoiding extra fields
    const shouldSkip = !fiscalYearId && (!fiscalYears || fiscalYears.length === 0);

    // Destructure to separate flat date fields from the rest
    const { startDate, endDate, ...otherFilters } = filters;

    // Construct API arguments
    const queryArgs = shouldSkip ? "skip" : {
        ...otherFilters,
        fiscalYearId,
        dateRange: (startDate && endDate) ? { start: startDate, end: endDate } : undefined,
    };

    const analytics = useQuery(
        api.dashboard.getDashboardAnalytics,
        queryArgs
    );

    if (!analytics) {
        return <DashboardSkeleton />;
    }

    const { metrics, chartData, timeSeriesData, departmentBreakdown } = analytics;

    return (
        <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* KPI Cards */}
            <KPICardsRow
                totalProjects={metrics.totalProjects}
                ongoing={metrics.ongoingProjects}
                completed={metrics.completedProjects}
                delayed={metrics.delayedProjects}
            />

            {/* Top Row: Budget & Time Series */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <EnhancedBudgetChart data={chartData.budgetOverview} />
                <TimeSeriesChart data={timeSeriesData} />
            </div>

            {/* Bottom Row: Department Breakdown & Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DepartmentBreakdownChart data={departmentBreakdown} />

                {/* Status Distribution (New Small Chart) */}
                <StatusDistributionChart data={chartData.statusDistribution} />
            </div>
        </motion.div>
    );
}

function StatusDistributionChart({ data }: { data: Record<string, number> }) {
    const total = Object.values(data).reduce((acc, curr) => acc + curr, 0);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800"
        >
            <h3 className="text-lg font-semibold mb-4">Project Status Distribution</h3>
            <div className="space-y-4">
                {Object.entries(data).map(([status, count]) => {
                    const percentage = total > 0 ? (count / total) * 100 : 0;
                    return (
                        <div key={status} className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="capitalize">{status}</span>
                                <span className="font-medium">{count}</span>
                            </div>
                            <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    className={cn(
                                        "h-full rounded-full",
                                        status === "completed" ? "bg-emerald-500" :
                                            status === "ongoing" ? "bg-blue-500" :
                                                status === "delayed" ? "bg-red-500" : "bg-zinc-400"
                                    )}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}
