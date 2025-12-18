// app/dashboard/components/account/AccountModal.tsx

"use client"

import { useState } from "react"
import { X, User, Shield, Sliders, Plus, Monitor, MoreHorizontal, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

type TabType = "profile" | "security" | "preferences"

export function AccountModal() {
  const [activeTab, setActiveTab] = useState<TabType>("profile")

  return (
    <div className="flex w-full max-w-5xl overflow-hidden rounded-lg border bg-card shadow-lg">
      {/* Sidebar */}
      <div className="w-64 border-r bg-muted/30 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Account</h2>
          <p className="text-sm text-muted-foreground">Manage your account info.</p>
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === "profile"
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            <User className="h-4 w-4" />
            Profile
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === "security"
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            <Shield className="h-4 w-4" />
            Security
          </button>

          <button
            onClick={() => setActiveTab("preferences")}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === "preferences"
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            <Sliders className="h-4 w-4" />
            Preferences
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header with close button */}
        <div className="flex items-center justify-between border-b p-6">
          <h3 className="text-xl font-semibold">
            {activeTab === "profile" && "Profile details"}
            {activeTab === "security" && "Security"}
            {activeTab === "preferences" && "Preferences"}
          </h3>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "profile" && <ProfileContent />}
          {activeTab === "security" && <SecurityContent />}
          {activeTab === "preferences" && <PreferencesContent />}
        </div>
      </div>
    </div>
  )
}

function ProfileContent() {
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [firstName, setFirstName] = useState("Melvin")
  const [lastName, setLastName] = useState("Nogoy")

  if (isEditingProfile) {
    return (
      <div className="mx-auto max-w-md space-y-6 rounded-lg border p-6">
        <h4 className="text-lg font-semibold">Update profile</h4>

        {/* Avatar Upload Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/diverse-user-avatars.png" />
              <AvatarFallback>MN</AvatarFallback>
            </Avatar>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                Upload
              </Button>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                Remove
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Recommended size 1:1, up to 10MB.</p>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">First name</label>
            <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Last name</label>
            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setIsEditingProfile(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsEditingProfile(false)}>Save</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Profile Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Profile</span>
          <Avatar className="h-12 w-12">
            <AvatarImage src="/diverse-user-avatars.png" />
            <AvatarFallback>MN</AvatarFallback>
          </Avatar>
          <span className="font-medium">
            {firstName} {lastName}
          </span>
        </div>
        <Button
          variant="link"
          className="text-indigo-600 hover:text-indigo-700"
          onClick={() => setIsEditingProfile(true)}
        >
          Update profile
        </Button>
      </div>

      {/* Email Addresses */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Email addresses</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm">m.viner001@gmail.com</span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">Primary</span>
          <Button variant="ghost" size="icon" className="ml-auto h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Phone Numbers */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Phone numbers</span>
        </div>
        <Button variant="link" className="gap-2 p-0 text-indigo-600 hover:text-indigo-700">
          <Plus className="h-4 w-4" />
          Add phone number
        </Button>
      </div>
    </div>
  )
}

function SecurityContent() {
  return (
    <div className="space-y-8">
      {/* Password */}
      <div className="flex items-center justify-between border-b pb-6">
        <span className="font-medium">Password</span>
        <Button variant="link" className="text-indigo-600 hover:text-indigo-700">
          Set password
        </Button>
      </div>

      {/* Active devices */}
      <div className="space-y-4 border-b pb-6">
        <span className="font-medium">Active devices</span>
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-foreground">
            <Monitor className="h-6 w-6 text-background" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">Windows</span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">This device</span>
            </div>
            <p className="text-sm text-muted-foreground">Chrome 143.0.0.0</p>
            <p className="text-sm text-muted-foreground">203.160.168.110 (Makati City, PH)</p>
            <p className="text-sm text-muted-foreground">Today at 6:58 AM</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function PreferencesContent() {
  return (
    <div className="space-y-8">
      {/* Appearance */}
      <div className="flex items-center justify-between">
        <span className="font-medium">Appearance</span>
        <Select defaultValue="light">
          <SelectTrigger className="w-48">
            <Sun className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
