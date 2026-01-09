"use client";

import { ReactNode } from "react";
import { useAccentColor } from "../contexts/AccentColorContext";

interface SpeedometerCardProps {
  title: string;
  value: number; // 0-100
  icon?: ReactNode;
  subtitle?: string;
  color?: "green" | "blue" | "orange" | "red";
  maxValue?: number; // Maximum value for the gauge (default 100)
}

export function SpeedometerCard({
  title,
  value, // 0-100
  icon,
  subtitle,
  color = "green",
  maxValue = 100,
}: SpeedometerCardProps) {
  // Clamp value between 0 and maxValue
  const clampedValue = Math.min(maxValue, Math.max(0, value));
  const percentage = (clampedValue / maxValue) * 100;

  // Get accent color from context
  const { accentColorValue, gradientStart, gradientEnd } = useAccentColor();

  // Calculate needle rotation for clock-like arc (top 50% of circle)
  // -90 degrees = left (9 o'clock, 0%)
  // 0 degrees = top (12 o'clock, 50%)
  // +90 degrees = right (3 o'clock, 100%)
  const needleRotation = (percentage / 100) * 180 - 90;

  // SVG dimensions - arc positioned at top like clock
  const centerX = 140;
  const centerY = 120; // Bottom center of arc (pivot point)
  const radius = 100;

  return (
    <div className="bg-[#f8f8f8] dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 hover:shadow-lg transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {icon && (
            <div 
              className="p-2 rounded-lg flex items-center justify-center [&_svg]:w-5 [&_svg]:h-5"
              style={{ 
                backgroundColor: `${accentColorValue}10`,
                color: accentColorValue,
              }}
            >
                {icon}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              {title}
            </p>
            {subtitle && (
              <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Value Display */}
      <div className="text-center mb-4">
        <p
          className="text-4xl font-bold mb-1 leading-tight"
          style={{
            fontFamily: "var(--font-cinzel), serif",
            color: accentColorValue,
          }}
        >
          {Math.round(clampedValue)}
        </p>
      </div>

      {/* Speedometer Gauge - Clock-like arc at top */}
      <div
        className="relative w-full max-w-[280px] mx-auto"
        style={{ height: "140px" }}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 280 140"
          style={{ overflow: "visible" }}
        >
          <defs>
            {/* Linear gradient from yellow/amber (left) to green (right) */}
            <linearGradient
              id={`gauge-gradient-${title.replace(/\s+/g, "-")}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor={gradientStart} />
              <stop offset="100%" stopColor={gradientEnd} />
            </linearGradient>
          </defs>

          {/* Main gauge arc - top 50% of clock (from 9 o'clock to 3 o'clock) */}
          {/* Gradient green arc */}
          <path
            d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${
              centerX + radius
            } ${centerY}`}
            fill="none"
            stroke={`url(#gauge-gradient-${title.replace(/\s+/g, "-")})`}
            strokeWidth="28"
            strokeLinecap="butt"
          />
          
          {/* Needle - rotates from pivot point at bottom center */}
          <g
            style={{ 
              transformOrigin: `${centerX}px ${centerY}px`,
              transform: `rotate(${needleRotation}deg)`,
              transition: "transform 1s ease-out",
            }}
          >
            {/* Needle line pointing upward */}
            <line
              x1={centerX}
              y1={centerY}
              x2={centerX}
              y2={centerY - radius}
              stroke="#1f2937"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Needle tip */}
            <polygon
              points={`${centerX},${centerY - radius} ${centerX - 5},${
                centerY - radius + 10
              } ${centerX + 5},${centerY - radius + 10}`}
              fill="#1f2937"
            />
          </g>

          {/* White circular pivot point at bottom center */}
          <circle
            cx={centerX}
            cy={centerY}
            r="6"
            fill="#ffffff"
            stroke="#e5e7eb"
            strokeWidth="2"
          />
          <circle cx={centerX} cy={centerY} r="3" fill="#9ca3af" />

          {/* Max value label at far right (3 o'clock position) */}
          <text
            x={centerX + radius}
            y={centerY + 15}
            fontSize="12"
            fontWeight="600"
            fill="#6b7280"
            textAnchor="middle"
          >
            {maxValue}
          </text>
        </svg>
      </div>
    </div>
  );
}

