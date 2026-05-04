"use client";

import { useState } from "react";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { CreateProjectDialog } from "@/components/editor/dialogs/create-project-dialog";
import { RenameProjectDialog } from "@/components/editor/dialogs/rename-project-dialog";
import { DeleteProjectDialog } from "@/components/editor/dialogs/delete-project-dialog";
import { ShareDialog } from "@/components/editor/dialogs/share-dialog";
import { useProjectActions } from "@/hooks/use-project-actions";
import { type Project } from "@/lib/projects";

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
    <div className="h-screen flex flex-col bg-base overflow-hidden">
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

      <div className="flex-1 mt-14 flex overflow-hidden">
        <main className="flex-1 bg-base flex items-center justify-center">
          <p className="text-copy-faint text-sm">Canvas coming soon</p>
        </main>

        {isAiSidebarOpen && (
          <aside className="w-80 bg-elevated border-l border-border-default flex items-center justify-center shrink-0">
            <p className="text-copy-faint text-sm">AI chat coming soon</p>
          </aside>
        )}
      </div>

      <CreateProjectDialog
        open={dialog === "create"}
        onClose={closeDialog}
        name={createName}
        suffix={createSuffix}
        onNameChange={setCreateName}
        onSubmit={handleCreate}
        isLoading={isLoading}
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
