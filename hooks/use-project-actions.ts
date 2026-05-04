"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { type Project } from "@/lib/projects";

export { type Project };

type DialogType = "create" | "rename" | "delete" | null;

export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function shortSuffix(): string {
  return Math.random().toString(36).slice(2, 8);
}

export function useProjectActions(activeProjectId?: string) {
  const router = useRouter();
  const [dialog, setDialog] = useState<DialogType>(null);
  const [targetProject, setTargetProject] = useState<Project | null>(null);
  const [createName, setCreateName] = useState("");
  const [createSuffix, setCreateSuffix] = useState("");
  const [renameName, setRenameName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openCreate() {
    setCreateName("");
    setCreateSuffix(shortSuffix());
    setDialog("create");
  }

  function openRename(project: Project) {
    setTargetProject(project);
    setRenameName(project.name);
    setDialog("rename");
  }

  function openDelete(project: Project) {
    setTargetProject(project);
    setDialog("delete");
  }

  function closeDialog() {
    setDialog(null);
    setTargetProject(null);
    setCreateName("");
    setCreateSuffix("");
    setRenameName("");
  }

  async function handleCreate() {
    if (!createName.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const roomId = `${toSlug(createName)}-${createSuffix}`;
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: createName.trim(), id: roomId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "Failed to create project");
      }
      closeDialog();
      router.push(`/editor/${roomId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRename() {
    if (!renameName.trim() || !targetProject) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${targetProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: renameName.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "Failed to rename project");
      }
      closeDialog();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to rename project");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!targetProject) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${targetProject.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "Failed to delete project");
      }
      closeDialog();
      if (activeProjectId === targetProject.id) {
        router.push("/editor");
      } else {
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project");
    } finally {
      setIsLoading(false);
    }
  }

  return {
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
  };
}
