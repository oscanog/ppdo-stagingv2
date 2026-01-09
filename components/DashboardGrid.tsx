"use client";

import { useMemo } from "react";
import { ExtendedSystem } from "../data/systems";
import { SystemCard } from "./SystemCard";

interface DashboardGridProps {
  systems: ExtendedSystem[];
  onCardClick: (system: ExtendedSystem) => void;
  searchQuery?: string;
}

export function DashboardGrid({
  systems,
  onCardClick,
  searchQuery = "",
}: DashboardGridProps) {
  const filteredSystems = useMemo(() => {
    if (!searchQuery.trim()) return systems;

    const query = searchQuery.toLowerCase();
    return systems.filter(
      (system) =>
        system.name.toLowerCase().includes(query) ||
        system.description.toLowerCase().includes(query) ||
        system.status.toLowerCase().includes(query)
    );
  }, [systems, searchQuery]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Page Title Section */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          System Dashboard
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          Monitor and manage all systems
        </p>
      </div>

      {/* Systems Grid */}
      {filteredSystems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSystems.map((system, index) => (
            <SystemCard
              key={system.id}
              system={system}
              index={index}
              onClick={() => onCardClick(system)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            No systems found matching &quot;{searchQuery}&quot;
          </p>
        </div>
      )}
    </div>
  );
}
