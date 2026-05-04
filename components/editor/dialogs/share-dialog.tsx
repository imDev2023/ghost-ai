"use client";

import { useState, useEffect, useCallback } from "react";
import { Copy, Check, X, Plus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Collaborator {
  email: string;
  name: string | null;
  avatar: string | null;
}

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  isOwner: boolean;
}

export function ShareDialog({ open, onClose, projectId, isOwner }: ShareDialogProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [removingEmail, setRemovingEmail] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCollaborators = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`);
      if (!res.ok) throw new Error();
      setCollaborators(await res.json());
    } catch {
      setError("Failed to load collaborators");
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (open) fetchCollaborators();
  }, [open, fetchCollaborators]);

  async function handleInvite() {
    const email = inviteEmail.trim();
    if (!email) return;
    setIsInviting(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.status === 409) { setError("Already a collaborator"); return; }
      if (!res.ok) throw new Error();
      const added: Collaborator = await res.json();
      setCollaborators((prev) => [...prev, added]);
      setInviteEmail("");
    } catch {
      setError("Failed to invite collaborator");
    } finally {
      setIsInviting(false);
    }
  }

  async function handleRemove(email: string) {
    setRemovingEmail(email);
    try {
      await fetch(
        `/api/projects/${projectId}/collaborators/${encodeURIComponent(email)}`,
        { method: "DELETE" }
      );
      setCollaborators((prev) => prev.filter((c) => c.email !== email));
    } finally {
      setRemovingEmail(null);
    }
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent
        className="rounded-3xl sm:max-w-md bg-elevated border border-border-default ring-0 text-copy-primary"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-copy-primary font-semibold">
            Share Project
          </DialogTitle>
        </DialogHeader>

        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2"
          onClick={handleCopyLink}
        >
          {copied ? (
            <Check className="h-4 w-4 text-success" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {copied ? "Copied!" : "Copy link"}
        </Button>

        {isOwner && (
          <div className="flex gap-2">
            <Input
              placeholder="Invite by email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleInvite(); }}
              className="flex-1"
              disabled={isInviting}
            />
            <Button
              onClick={handleInvite}
              disabled={isInviting || !inviteEmail.trim()}
              size="icon"
            >
              {isInviting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}

        {error && <p className="text-error text-xs">{error}</p>}

        <div className="flex flex-col gap-1">
          <p className="text-xs text-copy-faint uppercase tracking-wider mb-1">
            Collaborators ({collaborators.length})
          </p>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-copy-faint" />
            </div>
          ) : collaborators.length === 0 ? (
            <p className="text-copy-faint text-sm py-2">No collaborators yet</p>
          ) : (
            collaborators.map((c) => (
              <div key={c.email} className="flex items-center gap-3 py-2 px-1">
                <div className="h-8 w-8 rounded-full bg-subtle flex items-center justify-center overflow-hidden shrink-0">
                  {c.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.avatar}
                      alt={c.name ?? c.email}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-copy-muted">
                      {(c.name ?? c.email)[0].toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  {c.name && (
                    <p className="text-sm text-copy-primary truncate">{c.name}</p>
                  )}
                  <p className="text-xs text-copy-muted truncate">{c.email}</p>
                </div>
                {isOwner && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleRemove(c.email)}
                    disabled={removingEmail === c.email}
                    aria-label={`Remove ${c.email}`}
                  >
                    {removingEmail === c.email ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <X className="h-3.5 w-3.5" />
                    )}
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
