"use client";

import { useState } from "react";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { AiSidebar } from "@/components/editor/ai-sidebar";
import { CreateProjectDialog } from "@/components/editor/dialogs/create-project-dialog";
import { RenameProjectDialog } from "@/components/editor/dialogs/rename-project-dialog";
import { DeleteProjectDialog } from "@/components/editor/dialogs/delete-project-dialog";
import { ShareDialog } from "@/components/editor/dialogs/share-dialog";
import { StarterTemplatesModal } from "@/components/editor/starter-templates-modal";
import { type CanvasTemplate } from "@/components/editor/starter-templates";
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
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);

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
        onOpenTemplates={() => setIsTemplatesOpen(true)}
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

      <AiSidebar
        open={isAiSidebarOpen}
        onClose={() => setIsAiSidebarOpen(false)}
      />

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

      <StarterTemplatesModal
        open={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onImport={(template: CanvasTemplate) => {
          window.dispatchEvent(new CustomEvent("canvas-load-template", { detail: template }));
        }}
      />
    </div>
  );
}
