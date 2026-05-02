"use client";

import { PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditorNavbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function EditorNavbar({ isSidebarOpen, onToggleSidebar }: EditorNavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 h-14 bg-surface border-b border-border-default flex items-center justify-between px-4 z-50">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <PanelLeftOpen className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="flex items-center">
        {/* Center section - empty for now */}
      </div>

      <div className="flex items-center gap-2">
        {/* Right section - empty for now */}
      </div>
    </nav>
  );
}
