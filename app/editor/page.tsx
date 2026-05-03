"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { CreateProjectDialog } from "@/components/editor/dialogs/create-project-dialog";
import { RenameProjectDialog } from "@/components/editor/dialogs/rename-project-dialog";
import { DeleteProjectDialog } from "@/components/editor/dialogs/delete-project-dialog";
import { Button } from "@/components/ui/button";
import { useProjectDialogs } from "@/hooks/use-project-dialogs";

export default function EditorPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {
    dialog,
    targetProject,
    createName,
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
  } = useProjectDialogs();

  return (
    <div className="h-screen flex flex-col bg-base overflow-hidden">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewProject={openCreate}
        onRenameProject={openRename}
        onDeleteProject={openDelete}
      />

      <main className="flex-1 mt-14 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center px-4">
          <h1 className="text-2xl font-semibold text-copy-primary">
            Create a project or open an existing one
          </h1>
          <p className="text-copy-muted max-w-sm">
            Start a new architecture workspace, or choose a project from the sidebar.
          </p>
          <Button onClick={openCreate} className="mt-2">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </main>

      <CreateProjectDialog
        open={dialog === "create"}
        onClose={closeDialog}
        name={createName}
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
    </div>
  );
}
