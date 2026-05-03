"use client";

import { useState } from "react";
import { type MockProject } from "@/lib/mock-projects";

type DialogType = "create" | "rename" | "delete" | null;

export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function useProjectDialogs() {
  const [dialog, setDialog] = useState<DialogType>(null);
  const [targetProject, setTargetProject] = useState<MockProject | null>(null);
  const [createName, setCreateName] = useState("");
  const [renameName, setRenameName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function openCreate() {
    setCreateName("");
    setDialog("create");
  }

  function openRename(project: MockProject) {
    setTargetProject(project);
    setRenameName(project.name);
    setDialog("rename");
  }

  function openDelete(project: MockProject) {
    setTargetProject(project);
    setDialog("delete");
  }

  function closeDialog() {
    setDialog(null);
    setTargetProject(null);
    setCreateName("");
    setRenameName("");
  }

  function handleCreate() {
    if (!createName.trim()) return;
    setIsLoading(true);
    // No persistence — mock only
    setTimeout(() => {
      setIsLoading(false);
      closeDialog();
    }, 400);
  }

  function handleRename() {
    if (!renameName.trim() || !targetProject) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      closeDialog();
    }, 400);
  }

  function handleDelete() {
    if (!targetProject) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      closeDialog();
    }, 400);
  }

  return {
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
  };
}
