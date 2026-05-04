"use client";

import { X, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Project } from "@/lib/projects";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewProject: () => void;
  ownedProjects: Project[];
  sharedProjects: Project[];
  onRenameProject: (project: Project) => void;
  onDeleteProject: (project: Project) => void;
  activeRoomId?: string;
}

function ProjectItem({
  project,
  onRename,
  onDelete,
  isActive,
}: {
  project: Project;
  onRename?: () => void;
  onDelete?: () => void;
  isActive?: boolean;
}) {
  return (
    <div className={`group flex items-center justify-between rounded-xl px-3 py-2 hover:bg-subtle transition-colors cursor-pointer ${isActive ? "bg-subtle ring-1 ring-border-subtle" : ""}`}>
      <div className="flex flex-col min-w-0">
        <span className="text-sm text-copy-primary truncate">{project.name}</span>
        <span className="text-xs text-copy-faint font-mono truncate">{project.id}</span>
      </div>

      {project.isOwned && onRename && onDelete && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => { e.stopPropagation(); onRename(); }}
            aria-label="Rename project"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            aria-label="Delete project"
            className="hover:text-error"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}

export function ProjectSidebar({
  isOpen,
  onClose,
  onNewProject,
  ownedProjects,
  sharedProjects,
  onRenameProject,
  onDeleteProject,
  activeRoomId,
}: ProjectSidebarProps) {
  return (
    <>
      {/* Mobile backdrop scrim */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        inert={!isOpen}
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
              <TabsList
                variant="line"
                className="w-full rounded-none border-b border-border-default px-4 h-10"
              >
                <TabsTrigger
                  value="my-projects"
                  className="flex-1 text-copy-muted data-active:text-brand [&::after]:bg-brand!"
                >
                  My Projects
                </TabsTrigger>
                <TabsTrigger
                  value="shared"
                  className="flex-1 text-copy-muted data-active:text-brand [&::after]:bg-brand!"
                >
                  Shared
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1">
                <TabsContent value="my-projects" className="px-2 py-3 mt-0">
                  {ownedProjects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <p className="text-copy-muted text-sm">No projects yet</p>
                      <p className="text-copy-faint text-xs mt-1">
                        Create your first project to get started
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-0.5">
                      {ownedProjects.map((project) => (
                        <ProjectItem
                          key={project.id}
                          project={project}
                          isActive={project.id === activeRoomId}
                          onRename={() => onRenameProject(project)}
                          onDelete={() => onDeleteProject(project)}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="shared" className="px-2 py-3 mt-0">
                  {sharedProjects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <p className="text-copy-muted text-sm">No shared projects</p>
                      <p className="text-copy-faint text-xs mt-1">
                        Projects shared with you will appear here
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-0.5">
                      {sharedProjects.map((project) => (
                        <ProjectItem
                          key={project.id}
                          project={project}
                          isActive={project.id === activeRoomId}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>

          {/* Footer with New Project button */}
          <div className="p-4 border-t border-border-default">
            <Button className="w-full" variant="default" onClick={onNewProject}>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
