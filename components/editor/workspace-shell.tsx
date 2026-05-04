"use client";

import { useState } from "react";
import { Sparkles, BotMessageSquare } from "lucide-react";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { CreateProjectDialog } from "@/components/editor/dialogs/create-project-dialog";
import { RenameProjectDialog } from "@/components/editor/dialogs/rename-project-dialog";
import { DeleteProjectDialog } from "@/components/editor/dialogs/delete-project-dialog";
import { ShareDialog } from "@/components/editor/dialogs/share-dialog";
import { useProjectActions } from "@/hooks/use-project-actions";
import { type Project } from "@/lib/projects";
import { CanvasWrapper } from "@/components/editor/canvas-wrapper";

interface WorkspaceShellProps {
  projectName: string;
  roomId: string;
  isOwner: boolean;
  ownedProjects: Project[];
  sharedProjects: Project[];
}

export function WorkspaceShell({
  projectName,
  roomId,
  isOwner,
  ownedProjects,
  sharedProjects,
}: WorkspaceShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const {
    dialog,
    targetProject,
    createName,
    createSuffix,
    renameName,
    isLoading,
    error,
    openCreate,
    openRename,
    openDelete,
    closeDialog,
    setCreateName,
    setRenameName,
    handleCreate,
    handleRename,
    handleDelete,
  } = useProjectActions();

  return (
    <div className="h-screen bg-base">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        projectName={projectName}
        onShare={() => setIsShareOpen(true)}
        onToggleAiSidebar={() => setIsAiSidebarOpen((prev) => !prev)}
      />

      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewProject={openCreate}
        ownedProjects={ownedProjects}
        sharedProjects={sharedProjects}
        onRenameProject={openRename}
        onDeleteProject={openDelete}
        activeRoomId={roomId}
      />

      <main className="absolute inset-0 top-14">
        <CanvasWrapper roomId={roomId} />
      </main>

      <aside
        inert={!isAiSidebarOpen}
        className={`
          fixed top-14 bottom-0 right-0 w-80 bg-elevated border-l border-border-default z-40
          flex flex-col transform transition-transform duration-300 ease-in-out
          ${isAiSidebarOpen ? "translate-x-0" : "translate-x-full pointer-events-none invisible"}
        `}
      >
        <div className="flex items-start justify-between px-4 py-4 border-b border-border-default">
          <div>
            <h2 className="text-sm font-semibold text-copy-primary">AI Copilot</h2>
            <p className="text-xs text-copy-muted mt-0.5">Placeholder panel</p>
          </div>
          <Sparkles className="h-4 w-4 text-brand mt-0.5" />
        </div>

        <div className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto">
          <div className="rounded-2xl border border-border-default bg-subtle p-4 flex gap-3">
            <div className="h-8 w-8 rounded-xl bg-subtle border border-border-default flex items-center justify-center shrink-0">
              <BotMessageSquare className="h-4 w-4 text-ai-text" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-copy-primary">Chat surface pending</p>
              <p className="text-xs text-copy-muted mt-1 leading-relaxed">
                The toggle is wired. Messaging and generation are intentionally out of
                scope here.
              </p>
            </div>
          </div>

          <div className="flex-1" />

          <div className="rounded-2xl border border-border-default bg-subtle p-4">
            <p className="text-xs font-semibold text-copy-faint uppercase tracking-[0.15em] mb-2">
              Future Hooks
            </p>
            <p className="text-xs text-copy-muted leading-relaxed">
              Prompt composer, run status, and architecture guidance will attach to this
              sidebar.
            </p>
          </div>
        </div>
      </aside>

      <CreateProjectDialog
        open={dialog === "create"}
        onClose={closeDialog}
        name={createName}
        suffix={createSuffix}
        onNameChange={setCreateName}
        onSubmit={handleCreate}
        isLoading={isLoading}
        error={error}
      />

      <RenameProjectDialog
        open={dialog === "rename"}
        onClose={closeDialog}
        project={targetProject}
        name={renameName}
        onNameChange={setRenameName}
        onSubmit={handleRename}
        isLoading={isLoading}
      />

      <DeleteProjectDialog
        open={dialog === "delete"}
        onClose={closeDialog}
        project={targetProject}
        onConfirm={handleDelete}
        isLoading={isLoading}
      />

      <ShareDialog
        open={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        projectId={roomId}
        isOwner={isOwner}
      />
    </div>
  );
}
