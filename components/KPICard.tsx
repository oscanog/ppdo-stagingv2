"use client";

import { ReactNode } from "react";
import { useAccentColor } from "../contexts/AccentColorContext";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
}

export function KPICard({
  title,
  value,
  icon,
  trend,
  subtitle,
}: KPICardProps) {
  const { accentColorValue } = useAccentColor();

  return (
    <div className="bg-[#f8f8f8] dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div
          className="p-3 rounded-lg flex items-center justify-center [&_svg]:w-6 [&_svg]:h-6"
          style={{
            backgroundColor: `${accentColorValue}10`,
            color: accentColorValue,
          }}
        >
          {icon}
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              trend.isPositive
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            <svg
              className={`w-4 h-4 ${!trend.isPositive ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
          {title}
        </p>
        <p
          className="text-3xl font-bold mb-1"
          style={{
            fontFamily: "var(--font-cinzel), serif",
            color: accentColorValue,
          }}
        >
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
        {subtitle && (
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

