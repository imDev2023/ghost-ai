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
    try {
      const roomId = `${toSlug(createName)}-${createSuffix}`;
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: createName.trim(), id: roomId }),
      });
      if (!res.ok) throw new Error("Failed to create project");
      closeDialog();
      router.push(`/editor/${roomId}`);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRename() {
    if (!renameName.trim() || !targetProject) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/projects/${targetProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: renameName.trim() }),
      });
      if (!res.ok) throw new Error("Failed to rename project");
      closeDialog();
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!targetProject) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/projects/${targetProject.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete project");
      closeDialog();
      if (activeProjectId === targetProject.id) {
        router.push("/editor");
      } else {
        router.refresh();
      }
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
