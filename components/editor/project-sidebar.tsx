"use client";

import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        aria-hidden={!isOpen}
        className={`
          fixed top-14 bottom-0 left-0 w-80 bg-elevated border-r border-border-default z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full pointer-events-none invisible"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
            <h2 className="text-lg font-semibold text-copy-primary">Projects</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Tabs content area */}
          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="my-projects" className="h-full flex flex-col">
              <TabsList className="w-full rounded-none border-b border-border-default bg-transparent px-4 pt-3">
                <TabsTrigger value="my-projects" className="flex-1">
                  My Projects
                </TabsTrigger>
                <TabsTrigger value="shared" className="flex-1">
                  Shared
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1">
                <TabsContent value="my-projects" className="px-4 py-6 mt-0">
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-copy-muted text-sm">
                      No projects yet
                    </p>
                    <p className="text-copy-faint text-xs mt-1">
                      Create your first project to get started
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="shared" className="px-4 py-6 mt-0">
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-copy-muted text-sm">
                      No shared projects
                    </p>
                    <p className="text-copy-faint text-xs mt-1">
                      Projects shared with you will appear here
                    </p>
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>

          {/* Footer with New Project button */}
          <div className="p-4 border-t border-border-default">
            <Button className="w-full" variant="default">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
