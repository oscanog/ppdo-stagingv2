//app\dashboard\settings\updates\layout.tsx

"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import BadgeBubble from "../components/BadgeBubble";

function Nav() {
  const reports = useQuery(api.bugReports.getAll);
  const bugReports = reports?.filter(r => r.status === "pending").length || 0;
  const suggestions = 3; // placeholder, can add suggestions table later

  return (
    <nav className="flex gap-6 border-b pb-4">
      <Link href="/settings/updates">Overview</Link>
      <Link href="/settings/updates/changelogs">Changelogs</Link>

      <Link href="/settings/updates/bugs-report" className="relative">
        Bugs
        <BadgeBubble count={bugReports} />
      </Link>

      <Link href="/settings/updates/suggestions" className="relative">
        Suggestions
        <BadgeBubble count={suggestions} />
      </Link>
    </nav>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-6 space-y-6">
      
      {children}
    </div>
  );
}
