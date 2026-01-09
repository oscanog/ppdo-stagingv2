"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ExtendedSystem } from "../data/systems";
import { ProductHighlightCard } from "@/components/ui/product-card";

interface SystemCardProps {
  system: ExtendedSystem;
  index: number;
  onClick: () => void;
}

export function SystemCard({ system, index, onClick }: SystemCardProps) {
  // Get status dot color
  const getStatusDot = () => {
    const dotClass = 
      system.status === "operational" ? "bg-green-500" :
      system.status === "degraded" ? "bg-yellow-500" :
      "bg-red-500";
    
    return (
      <motion.div
        className={`w-3 h-3 rounded-full ${dotClass} shadow-lg`}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [1, 0.7, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          boxShadow: `0 0 12px ${system.status === "operational" ? "rgb(34 197 94)" : system.status === "degraded" ? "rgb(234 179 8)" : "rgb(239 68 68)"}`,
          transformStyle: "preserve-3d",
        }}
      />
    );
  };

  return (
    <article
      onClick={onClick}
      className="opacity-0 animate-fade-in-up"
      style={{
        animationDelay: `${index * 80}ms`,
        animationFillMode: "forwards",
      }}
    >
      <ProductHighlightCard
        categoryIcon={getStatusDot()}
        title={system.name}
        description={system.description}
        imageSrc={system.imageUrl || ""} // Use Thiings image if available
        imageAlt={system.name}
      />
    </article>
  );
}
