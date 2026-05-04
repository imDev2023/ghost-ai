"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type Project } from "@/lib/projects";

interface DeleteProjectDialogProps {
  open: boolean;
  onClose: () => void;
  project: Project | null;
  onConfirm: () => void;
  isLoading: boolean;
}

export function DeleteProjectDialog({
  open,
  onClose,
  project,
  onConfirm,
  isLoading,
}: DeleteProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent
        className="rounded-3xl sm:max-w-md bg-elevated border border-border-default ring-0 text-copy-primary"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-copy-primary text-base font-semibold">
            Delete Project
          </DialogTitle>
          {project && (
            <DialogDescription className="text-copy-muted">
              <span className="text-copy-secondary font-medium">{project.name}</span> will be
              permanently deleted. This cannot be undone.
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="flex items-center justify-end gap-2 pt-2">
          <DialogClose render={<Button variant="ghost" disabled={isLoading} />}>
            Cancel
          </DialogClose>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Deleting…" : "Delete Project"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
