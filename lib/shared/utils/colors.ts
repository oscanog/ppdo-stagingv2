// lib/shared/utils/colors.ts

/**
 * Returns color class based on utilization rate
 * @param rate - Utilization rate percentage (0-100)
 * @returns Tailwind color class string
 */
export function getUtilizationColor(rate: number): string {
  if (rate >= 80) return "text-red-600 dark:text-red-400";
  if (rate >= 60) return "text-orange-600 dark:text-orange-400";
  return "text-green-600 dark:text-green-400";
}

/**
 * Returns color class based on project status value
 * @param value - Project status percentage
 * @returns Tailwind color class string
 */
export function getProjectStatusColor(value: number): string {
  if (value >= 50) return "text-green-600 dark:text-green-400";
  if (value >= 30) return "text-orange-600 dark:text-orange-400";
  return "text-zinc-600 dark:text-zinc-400";
}

/**
 * Returns color class based on budget status
 * @param status - Budget status string
 * @returns Tailwind color class string
 */
export function getStatusColor(status?: string): string {
  if (!status) return "text-zinc-600 dark:text-zinc-400";

  switch (status) {
    case "completed":
      return "text-green-600 dark:text-green-400";
    case "ongoing":
      return "text-blue-600 dark:text-blue-400";
    case "delayed":
      return "text-red-600 dark:text-red-400";
    default:
      return "text-zinc-600 dark:text-zinc-400";
  }
}

/**
 * Returns avatar background color based on name
 * @param name - User name
 * @returns Tailwind background color class
 */
export function getAvatarColor(name: string): string {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-indigo-500",
  ];
  const index =
    name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;
  return colors[index];
}