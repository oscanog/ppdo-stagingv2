"use client";

import { useRef } from "react";

import { motion } from "framer-motion";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { DashboardChartCard } from "@/components/ppdo/dashboard/charts/DashboardChartCard";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";

interface BudgetData {
    allocated: number;
    obligated: number;
    disbursed: number;
    remaining: number;
}

interface EnhancedBudgetChartProps {
    data: BudgetData;
}

export function EnhancedBudgetChart({ data }: EnhancedBudgetChartProps) {
    const chartRef = useRef<HTMLDivElement>(null);

    const chartData = [
        {
            name: "Budget",
            Allocated: data.allocated,
            Obligated: data.obligated,
            Disbursed: data.disbursed,
            Remaining: data.remaining,
        },
    ];

    const handleExport = async () => {
        if (!chartRef.current) return;

        const canvas = await html2canvas(chartRef.current);
        const link = document.createElement("a");
        link.download = `budget-chart-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
    };

    return (
        <DashboardChartCard
            title="Budget Overview"
            subtitle="Allocation, obligation, and disbursement status"
            className="relative"
        >
            <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 z-10"
                onClick={handleExport}
            >
                <Download className="h-4 w-4" />
            </Button>

            <motion.div
                ref={chartRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis
                            tickFormatter={(value) =>
                                `₱${(value / 1_000_000).toFixed(1)}M`
                            }
                        />
                        <Tooltip
                            formatter={(value: any) =>
                                new Intl.NumberFormat("en-PH", {
                                    style: "currency",
                                    currency: "PHP",
                                }).format(Number(value))
                            }
                            contentStyle={{
                                backgroundColor: "white",
                                border: "none",
                                borderRadius: "8px",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                            }}
                        />
                        <Legend />
                        <Bar dataKey="Allocated" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Obligated" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Disbursed" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Remaining" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>
        </DashboardChartCard>
    );
}