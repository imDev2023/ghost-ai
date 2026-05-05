"use client";

import { Compass, LayoutTemplate, Share2, Sparkles } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

interface EditorNavbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  projectName?: string;
  onToggleAiSidebar?: () => void;
  onShare?: () => void;
  onOpenTemplates?: () => void;
}

export function EditorNavbar({
  isSidebarOpen: _isSidebarOpen,
  onToggleSidebar,
  projectName,
  onToggleAiSidebar,
  onShare,
  onOpenTemplates,
}: EditorNavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 h-14 bg-surface border-b border-border-default flex items-center justify-between px-4 z-50">
      <button
        onClick={onToggleSidebar}
        className="flex items-center gap-2.5 hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-lg"
        aria-label="Toggle sidebar"
      >
        <div className="h-8 w-8 rounded-xl bg-elevated border border-border-default flex items-center justify-center shrink-0">
          <Compass className="h-4 w-4 text-brand" />
        </div>
        {projectName ? (
          <div className="flex flex-col text-left">
            <span className="text-sm font-semibold text-copy-primary leading-tight">{projectName}</span>
            <span className="text-xs text-copy-muted leading-tight">Workspace</span>
          </div>
        ) : null}
      </button>

      <div className="flex items-center gap-2">
        {onToggleAiSidebar && (
          <>
            {onOpenTemplates && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenTemplates}
                className="gap-1.5 text-copy-secondary hover:text-copy-primary"
              >
                <LayoutTemplate className="h-4 w-4" />
                Templates
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onShare}
              className="gap-1.5 text-copy-secondary hover:text-copy-primary"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button
              size="sm"
              onClick={onToggleAiSidebar}
              className="gap-1.5 bg-brand hover:bg-brand/90 border-0"
            >
              <Sparkles className="h-4 w-4" />
              AI
            </Button>
          </>
        )}
        <UserButton />
      </div>
    </nav>
  );
}
