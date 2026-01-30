"use client";

import { motion } from "framer-motion";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { DashboardChartCard } from "@/components/ppdo/dashboard/charts/DashboardChartCard";

interface DepartmentBreakdownChartProps {
    data: any[];
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"];

export function DepartmentBreakdownChart({ data }: DepartmentBreakdownChartProps) {
    // Prepare data for the pie chart
    const chartData = data.map((item) => ({
        name: item.code || item.name,
        fullName: item.name,
        value: item.allocated,
    }));

    return (
        <DashboardChartCard
            title="Department Allocation"
            subtitle="Budget distribution across top 10 departments"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="h-[350px] w-full"
            >
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={120}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: any) =>
                                new Intl.NumberFormat("en-PH", {
                                    style: "currency",
                                    currency: "PHP",
                                }).format(Number(value))
                            }
                        />
                        <Legend
                            layout="vertical"
                            align="right"
                            verticalAlign="middle"
                            formatter={(value, entry: any) => (
                                <span className="text-xs text-muted-foreground">
                                    {value}
                                </span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </motion.div>
        </DashboardChartCard>
    );
}
