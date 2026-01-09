"use client";

import { useMemo } from "react";
import { useAccentColor } from "../contexts/AccentColorContext";

interface BarDatum {
  label: string;
  value: number; // 0..max
}

interface BarChartCardProps {
  title: string;
  subtitle?: string;
  data: BarDatum[];
  max?: number; // default 100
  className?: string;
}

export function BarChartCard({
  title,
  subtitle,
  data,
  max = 100,
  className,
}: BarChartCardProps) {
  const { accentColorValue } = useAccentColor();
  const computedMax = useMemo(() => {
    if (!data.length) return max;
    return Math.max(max, ...data.map((d) => d.value));
  }, [data, max]);

  return (
    <div
      className={`bg-[#f8f8f8] dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 ${
        className ?? ""
      }`}
    >
      <div className="mb-4">
        <h3
          className="text-lg font-semibold text-zinc-900 dark:text-zinc-100"
          style={{ fontFamily: "var(--font-cinzel), serif" }}
        >
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{subtitle}</p>
        )}
      </div>

      <div className="w-full overflow-x-auto">
        <div className="min-w-[480px]">
          <div className="flex items-end gap-4 h-48">
            {data.map((d) => {
              const heightPct = Math.max(
                0,
                Math.min(100, (d.value / computedMax) * 100)
              );
              return (
                <div key={d.label} className="flex-1 min-w-0">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-md h-40 flex items-end">
                      <div
                        className="w-full rounded-md"
                        style={{
                          height: `${heightPct}%`,
                          backgroundColor: accentColorValue,
                        }}
                      />
                    </div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400 truncate w-full text-center">
                      {d.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
