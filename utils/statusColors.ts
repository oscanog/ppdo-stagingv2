import { System } from "../data/systems";

export function getStatusColor(status: System["status"]) {
  switch (status) {
    case "operational":
      return "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 dark:border-emerald-500/20";
    case "degraded":
      return "bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30 dark:border-amber-500/20";
    case "down":
      return "bg-rose-500/20 text-rose-700 dark:text-rose-400 border-rose-500/30 dark:border-rose-500/20";
  }
}

