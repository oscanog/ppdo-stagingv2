// components/changelog/AuthorAvatar.tsx

"use client";

import { useState } from "react";
import Image from "next/image";
import { User } from "lucide-react";

interface AuthorAvatarProps {
  authorName: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

// Author name to image path mapping
const AUTHOR_IMAGES: Record<string, string> = {
  "Melvin Nogoy": "/dev/melvin.jpg",
  "Alec Quiambao": "/dev/alec.jpg",
  "Development Team": "", // No image, will show placeholder
};

// Generate initials from author name
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Size configurations
const SIZE_CONFIG = {
  sm: {
    container: "h-8 w-8",
    text: "text-xs",
    icon: "h-4 w-4",
  },
  md: {
    container: "h-10 w-10",
    text: "text-sm",
    icon: "h-5 w-5",
  },
  lg: {
    container: "h-12 w-12",
    text: "text-base",
    icon: "h-6 w-6",
  },
};

export function AuthorAvatar({ 
  authorName, 
  size = "md",
  className = "" 
}: AuthorAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const imagePath = AUTHOR_IMAGES[authorName];
  const hasImage = imagePath && !imageError;
  const initials = getInitials(authorName);
  const sizeConfig = SIZE_CONFIG[size];

  // If we have an image and it hasn't errored, show the image
  if (hasImage) {
    return (
      <div className={`${sizeConfig.container} relative rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0 ${className}`}>
        <Image
          src={imagePath}
          alt={`${authorName}'s avatar`}
          fill
          className="object-cover"
          onError={() => setImageError(true)}
          sizes={size === "sm" ? "32px" : size === "md" ? "40px" : "48px"}
        />
      </div>
    );
  }

  // Fallback: Show initials with gradient background
  return (
    <div 
      className={`${sizeConfig.container} rounded-full bg-gradient-to-br from-green-500 to-green-700 dark:from-green-600 dark:to-green-800 flex items-center justify-center text-white font-semibold flex-shrink-0 ${className}`}
      title={authorName}
    >
      {initials ? (
        <span className={sizeConfig.text}>{initials}</span>
      ) : (
        <User className={sizeConfig.icon} />
      )}
    </div>
  );
}