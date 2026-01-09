import {
  LucideIcon,
  Users,
  FileText,
  BarChart3,
  Mail,
  Database,
  Plug,
  CreditCard,
  Shield,
  Folder,
  Bell,
  Search,
  ClipboardList,
  Building,
  ClipboardCheck,
  Calendar,
  MapPin,
  Camera,
  Newspaper,
} from "lucide-react";

export interface System {
  id: string;
  name: string;
  description: string;
  status: "operational" | "degraded" | "down";
  lastUpdated: string;
  icon: string;
  iconComponent?: LucideIcon; // Lucide icon component
  iconUrl?: string; // Optional URL for Thiings icons
  iconType?: "emoji" | "image" | "component"; // Icon type
  imageUrl?: string; // Optional URL for Thiings product images
}

export interface ExtendedSystem extends System {
  details?: {
    metrics: { label: string; value: string }[];
    recentActivity: string[];
    configuration: Record<string, string>;
  };
}

export const SYSTEMS: ExtendedSystem[] = [
  {
    id: "1",
    name: "Citizen Services Portal",
    description:
      "Manage citizen requests, permits, and public service applications",
    status: "operational",
    lastUpdated: "2 minutes ago",
    icon: "👥",
    iconComponent: Users,
    iconType: "component",
    imageUrl:
      "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-6ipGyREPRJaRU9dSvyGA3W6iWYv6eo.png&w=1000&q=75",
  },
  {
    id: "2",
    name: "Records Management",
    description:
      "Digital document repository for government records and archives",
    status: "operational",
    lastUpdated: "5 minutes ago",
    icon: "📝",
    iconComponent: FileText,
    iconType: "component",
    imageUrl:
      "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-MeWalWtgMogfGNdI7y4UxcGoF7NOH0.png&w=1000&q=75",
  },
  {
    id: "3",
    name: "Public Dashboard",
    description: "Real-time metrics and transparency data for public access",
    status: "operational",
    lastUpdated: "1 minute ago",
    icon: "📊",
    iconComponent: BarChart3,
    iconType: "component",
    imageUrl:
      "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-fSMgViPMUbS0kVcbqdCIHuTbarLfB5.png&w=1000&q=75",
  },
  {
    id: "4",
    name: "Communication Hub",
    description: "Official announcements, newsletters, and public notices",
    status: "degraded",
    lastUpdated: "15 minutes ago",
    icon: "📧",
    iconComponent: Mail,
    iconType: "component",
    imageUrl:
      "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-ojyJBpIQ9Ktog9Md3IseRIXqSlExpm.png&w=1000&q=75",
  },
  {
    id: "5",
    name: "Data Center",
    description: "Secure storage and management of provincial databases",
    status: "operational",
    lastUpdated: "30 seconds ago",
    icon: "💾",
    iconComponent: Database,
    iconType: "component",
    imageUrl:
      "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-ln5qjyBuSTwiqEjpl5Bj2Qin3KZ3u7.png&w=1000&q=75",
    details: {
      metrics: [
        { label: "Active Users", value: "2,847" },
        { label: "Response Time", value: "8ms" },
        { label: "Storage Used", value: "156GB / 2TB" },
        { label: "Backup Status", value: "Current" },
        { label: "Uptime", value: "99.97%" },
        { label: "Daily Visitors", value: "4,231" },
      ],
      recentActivity: [
        "Citizen data backed up successfully",
        "Automated backup completed at 01:00 UTC",
        "System optimization deployed",
        "Storage expanded to accommodate growth",
        "Query performance improved by 35%",
      ],
      configuration: {
        Database: "PostgreSQL 15.3",
        Pool: "200 connections",
        Replication: "Primary-Replica (5 nodes)",
        Backup: "Daily (retention: 90 days)",
        Cache: "Redis (16GB)",
        Monitoring: "24/7",
      },
    },
  },
  {
    id: "6",
    name: "Public Wi-Fi Network",
    description: "Municipal wireless infrastructure and access management",
    status: "operational",
    lastUpdated: "3 minutes ago",
    icon: "🔌",
    iconComponent: Plug,
    iconType: "component",
    imageUrl:
      "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-VXaWfLCXlsRCXSbioAplHuPLkfoqWe.png&w=1000&q=75",
  },
  {
    id: "7",
    name: "Payment Gateway",
    description: "Online payment processing for taxes, fees, and services",
    status: "operational",
    lastUpdated: "1 minute ago",
    icon: "💳",
    iconComponent: CreditCard,
    iconType: "component",
    imageUrl:
      "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-titY0MnoTTy4kgtO3ajj75ynNgi8xw.png&w=1000&q=75",
  },
  {
    id: "8",
    name: "Security Monitoring",
    description: "Facility security, access control, and surveillance systems",
    status: "operational",
    lastUpdated: "10 seconds ago",
    icon: "🔒",
    iconComponent: Shield,
    iconType: "component",
    imageUrl:
      "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-L9f3fRm8mk869kOwMCThXgHsGNWKjJ.png&w=1000&q=75",
  },
  {
    id: "9",
    name: "Document Repository",
    description: "Centralized storage for all provincial documents and files",
    status: "down",
    lastUpdated: "1 hour ago",
    icon: "📁",
    iconComponent: Folder,
    iconType: "component",
    imageUrl:
      "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-lT3KbmTJUVq5ImvYJyyeCDuvO3VBy0.png&w=1000&q=75",
  },
  {
    id: "10",
    name: "Public Notifications",
    description: "SMS alerts, email updates, and citizen notifications",
    status: "operational",
    lastUpdated: "45 seconds ago",
    icon: "🔔",
    iconComponent: Bell,
    iconType: "component",
    imageUrl:
      "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-CK4odMSKWdmIj0ueBtNq9HOZR6Fbgv.png&w=1000&q=75",
  },
  {
    id: "11",
    name: "Search & Discovery",
    description: "Public search engine for services, forms, and information",
    status: "operational",
    lastUpdated: "2 minutes ago",
    icon: "🔍",
    iconComponent: Search,
    iconType: "component",
    imageUrl:
      "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-52p9Ub8JEM1ahgmDoRazWouxX7h1DZ.png&w=1000&q=75",
  },
  {
    id: "12",
    name: "Compliance Tracker",
    description:
      "Audit logs and compliance monitoring for government operations",
    status: "operational",
    lastUpdated: "5 seconds ago",
    icon: "📋",
    iconComponent: ClipboardList,
    iconType: "component",
    imageUrl:
      "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-1d6k7fhkOwst6P3HlPcXuc47oTpbMt.png&w=1000&q=75",
  },
];
