"use client";

import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  variant?: "default" | "bordered" | "elevated";
}

export function StatsCard({
  title,
  value,
  icon,
  description,
  variant = "default",
}: StatsCardProps) {
  const variantClasses = {
    default: "bg-[#f8f8f8] dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800",
    bordered: "bg-[#f8f8f8] dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700",
    elevated: "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg",
  };

  return (
    <div className={`rounded-xl p-5 ${variantClasses[variant]} hover:shadow-md transition-all duration-200`}>
      {icon && (
        <div className="mb-3 text-zinc-600 dark:text-zinc-400">
          {icon}
        </div>
      )}
      <div>
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
          {title}
        </p>
        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-1" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
        {description && (
          <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

