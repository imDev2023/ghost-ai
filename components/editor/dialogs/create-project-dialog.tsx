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
import { toSlug } from "@/hooks/use-project-actions";

interface CreateProjectDialogProps {
  open: boolean;
  onClose: () => void;
  name: string;
  suffix: string;
  onNameChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function CreateProjectDialog({
  open,
  onClose,
  name,
  suffix,
  onNameChange,
  onSubmit,
  isLoading,
}: CreateProjectDialogProps) {
  const slug = toSlug(name);
  const roomId = slug ? `${slug}-${suffix}` : "";

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent
        className="rounded-3xl sm:max-w-md bg-elevated border border-border-default ring-0 text-copy-primary"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-copy-primary text-base font-semibold">
            New Project
          </DialogTitle>
          <DialogDescription className="text-copy-muted">
            Give your project a name to get started.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="project-name" className="text-sm font-medium text-copy-secondary">
              Project name
            </label>
            <Input
              id="project-name"
              placeholder="My Architecture"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") onSubmit(); }}
              autoFocus
              disabled={isLoading}
            />
          </div>

          {roomId && (
            <p className="text-xs text-copy-faint">
              Room ID:{" "}
              <span className="font-mono text-copy-muted">{roomId}</span>
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <DialogClose render={<Button variant="ghost" disabled={isLoading} />}>
            Cancel
          </DialogClose>
          <Button onClick={onSubmit} disabled={!name.trim() || isLoading}>
            {isLoading ? "Creating…" : "Create Project"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
