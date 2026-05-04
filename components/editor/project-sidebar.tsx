"use client";

import { X, Plus, Pencil, Trash2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
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
    <div
      className={`group flex items-center gap-2 rounded-xl px-3 py-2.5 hover:bg-subtle transition-colors cursor-pointer ${
        isActive ? "bg-subtle" : ""
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full shrink-0 transition-colors ${
          isActive ? "bg-brand" : "bg-transparent"
        }`}
      />
      <span className="flex-1 text-sm text-copy-primary truncate">{project.name}</span>
      {project.isOwned && onRename && onDelete && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.stopPropagation();
              onRename();
            }}
            aria-label="Rename project"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
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
  const { user } = useUser();
  const userInitial =
    user?.firstName?.[0] ??
    user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ??
    "?";
  const userAvatar = user?.imageUrl;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        inert={!isOpen}
        className={`
          fixed top-14 bottom-0 left-0 w-72 bg-elevated border-r border-border-default z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full pointer-events-none invisible"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
            <h2 className="text-base font-semibold text-copy-primary">Projects</h2>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <Tabs defaultValue="my-projects" className="flex-1 flex flex-col h-full gap-0">
              <div className="px-3 py-3">
                <TabsList className="w-full rounded-full bg-base border border-border-default p-1 h-9">
                  <TabsTrigger
                    value="my-projects"
                    className="flex-1 rounded-full text-xs font-medium text-copy-muted
                      data-active:bg-surface data-active:text-copy-primary data-active:shadow-sm
                      dark:data-active:bg-surface dark:data-active:text-copy-primary dark:data-active:border-transparent"
                  >
                    My Projects
                  </TabsTrigger>
                  <TabsTrigger
                    value="shared"
                    className="flex-1 rounded-full text-xs font-medium text-copy-muted
                      data-active:bg-surface data-active:text-copy-primary data-active:shadow-sm
                      dark:data-active:bg-surface dark:data-active:text-copy-primary dark:data-active:border-transparent"
                  >
                    Shared
                  </TabsTrigger>
                </TabsList>
              </div>

              <ScrollArea className="flex-1">
                <TabsContent value="my-projects" className="px-2 pb-2 mt-0">
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

                <TabsContent value="shared" className="px-2 pb-2 mt-0">
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

          {/* Footer */}
          <div className="p-3 border-t border-border-default flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-subtle border border-border-default flex items-center justify-center overflow-hidden shrink-0">
              {userAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={userAvatar} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <span className="text-xs font-semibold text-copy-muted">{userInitial}</span>
              )}
            </div>
            <Button
              className="flex-1 bg-brand hover:bg-brand/90 border-0 gap-1.5"
              onClick={onNewProject}
            >
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
