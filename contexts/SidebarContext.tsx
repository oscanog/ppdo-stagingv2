"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SidebarContextType {
  isMinimized: boolean;
  toggleMinimize: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isMinimized, setIsMinimized] = useState(false);

  // Load minimized state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarMinimized");
    if (savedState !== null) {
      setIsMinimized(savedState === "true");
    }
  }, []);

  // Save minimized state to localStorage
  const toggleMinimize = () => {
    const newState = !isMinimized;
    setIsMinimized(newState);
    localStorage.setItem("sidebarMinimized", String(newState));
  };

  return (
    <SidebarContext.Provider value={{ isMinimized, toggleMinimize }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

