"use client";

import { useEffect, useCallback } from "react";

interface UseKeyboardShortcutsOptions {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

function isTypingInInput(): boolean {
  const activeElement = document.activeElement;
  if (!activeElement) return false;
  
  const tagName = activeElement.tagName.toLowerCase();
  if (tagName === "input") return true;
  if (tagName === "textarea") return true;
  if (tagName === "select") return true;
  if ((activeElement as HTMLElement).isContentEditable) return true;
  
  const role = activeElement.getAttribute("role");
  if (role === "textbox" || role === "combobox") return true;
  
  return false;
}

export function useKeyboardShortcuts({
  onZoomIn,
  onZoomOut,
  onUndo,
  onRedo,
}: UseKeyboardShortcutsOptions) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isTypingInInput()) return;

    const isMeta = e.metaKey || e.ctrlKey;
    
    if (e.key === "+" || e.key === "=") {
      e.preventDefault();
      onZoomIn?.();
    } else if (e.key === "-") {
      e.preventDefault();
      onZoomOut?.();
    } else if (isMeta && e.key.toLowerCase() === "z" && !e.shiftKey) {
      e.preventDefault();
      onUndo?.();
    } else if (isMeta && e.key.toLowerCase() === "z" && e.shiftKey) {
      e.preventDefault();
      onRedo?.();
    } else if (isMeta && e.key.toLowerCase() === "y") {
      e.preventDefault();
      onRedo?.();
    }
  }, [onZoomIn, onZoomOut, onUndo, onRedo]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}