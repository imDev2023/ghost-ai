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
import { Input } from "@/components/ui/input";
import { type MockProject } from "@/lib/mock-projects";

interface RenameProjectDialogProps {
  open: boolean;
  onClose: () => void;
  project: MockProject | null;
  name: string;
  onNameChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function RenameProjectDialog({
  open,
  onClose,
  project,
  name,
  onNameChange,
  onSubmit,
  isLoading,
}: RenameProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent
        className="rounded-3xl sm:max-w-md bg-elevated border border-border-default ring-0 text-copy-primary"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-copy-primary text-base font-semibold">
            Rename Project
          </DialogTitle>
          {project && (
            <DialogDescription className="text-copy-muted">
              Renaming{" "}
              <span className="text-copy-secondary font-medium">{project.name}</span>
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="rename-project" className="text-sm font-medium text-copy-secondary">
            New name
          </label>
          <Input
            id="rename-project"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") onSubmit(); }}
            autoFocus
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <DialogClose render={<Button variant="ghost" disabled={isLoading} />}>
            Cancel
          </DialogClose>
          <Button onClick={onSubmit} disabled={!name.trim() || isLoading}>
            {isLoading ? "Saving…" : "Rename"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
