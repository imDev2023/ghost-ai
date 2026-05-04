"use client";

import { PanelLeftOpen, PanelLeftClose, BotMessageSquare, Share2 } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

interface EditorNavbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  projectName?: string;
  onToggleAiSidebar?: () => void;
  onShare?: () => void;
}

export function EditorNavbar({
  isSidebarOpen,
  onToggleSidebar,
  projectName,
  onToggleAiSidebar,
  onShare,
}: EditorNavbarProps) {
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
        {projectName && (
          <span className="text-sm font-medium text-copy-primary">{projectName}</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {onToggleAiSidebar && (
          <>
            <Button variant="ghost" size="sm" onClick={onShare}>
              <Share2 className="h-4 w-4 mr-1.5" />
              Share
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleAiSidebar}
              aria-label="Toggle AI sidebar"
            >
              <BotMessageSquare className="h-5 w-5" />
            </Button>
          </>
        )}
        <UserButton />
      </div>
    </nav>
  );
}
