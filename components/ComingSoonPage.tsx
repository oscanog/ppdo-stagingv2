"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Home } from "lucide-react"

export default function ComingSoonPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center space-y-6 pb-4">
          <div className="flex justify-center">
            <svg
              width="240"
              height="180"
              viewBox="0 0 240 180"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-slate-400"
              aria-hidden="true"
            >
              {/* Construction/Development Scene */}
              {/* Ground line */}
              <line x1="20" y1="140" x2="220" y2="140" stroke="currentColor" strokeWidth="2" />

              {/* Building blocks being assembled */}
              <rect x="60" y="100" width="40" height="40" fill="#e2e8f0" stroke="currentColor" strokeWidth="2" />
              <rect x="100" y="100" width="40" height="40" fill="#cbd5e1" stroke="currentColor" strokeWidth="2" />
              <rect x="140" y="100" width="40" height="40" fill="#e2e8f0" stroke="currentColor" strokeWidth="2" />

              {/* Floating/being placed block with animation */}
              <g className="animate-bounce" style={{ animationDuration: "2s" }}>
                <rect x="100" y="50" width="40" height="40" fill="#3b82f6" stroke="#1e40af" strokeWidth="2" />
                <circle cx="120" cy="65" r="2" fill="white" opacity="0.6" />
                <circle cx="120" cy="75" r="2" fill="white" opacity="0.6" />
              </g>

              {/* Crane/construction element */}
              <path d="M120 20 L120 45" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
              <path d="M90 25 L150 25" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
              <circle cx="120" cy="20" r="4" fill="#3b82f6" />

              {/* Gear icons (representing work in progress) */}
              <g transform="translate(40, 60)">
                <circle cx="0" cy="0" r="12" fill="none" stroke="#94a3b8" strokeWidth="2" />
                <circle cx="0" cy="0" r="6" fill="#94a3b8" />
                <rect x="-2" y="-14" width="4" height="4" fill="#94a3b8" />
                <rect x="-2" y="10" width="4" height="4" fill="#94a3b8" />
                <rect x="-14" y="-2" width="4" height="4" fill="#94a3b8" />
                <rect x="10" y="-2" width="4" height="4" fill="#94a3b8" />
              </g>

              <g transform="translate(200, 90)">
                <circle cx="0" cy="0" r="10" fill="none" stroke="#94a3b8" strokeWidth="2" />
                <circle cx="0" cy="0" r="5" fill="#94a3b8" />
                <rect x="-1.5" y="-12" width="3" height="3" fill="#94a3b8" />
                <rect x="-1.5" y="9" width="3" height="3" fill="#94a3b8" />
                <rect x="-12" y="-1.5" width="3" height="3" fill="#94a3b8" />
                <rect x="9" y="-1.5" width="3" height="3" fill="#94a3b8" />
              </g>

              {/* Progress dots */}
              <circle cx="30" cy="140" r="3" fill="#10b981" />
              <circle cx="50" cy="140" r="3" fill="#94a3b8" />
              <circle cx="70" cy="140" r="3" fill="#94a3b8" />
            </svg>
          </div>

          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold text-slate-900 text-balance">Feature Coming Soon</CardTitle>
            <CardDescription className="text-base text-slate-600 text-pretty">
              This feature is currently under development and will be available in an upcoming release.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" onClick={() => router.back()} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
            <Button onClick={() => router.push("/dashboard")} className="gap-2">
              <Home className="h-4 w-4" />
              Return to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
