"use client";

import { useState, useEffect, useCallback } from "react";
import { Link2, Check, X, Mail, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PersonEntry {
  email: string;
  name: string | null;
  avatar: string | null;
  role: "owner" | "collaborator";
}

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  isOwner: boolean;
}

export function ShareDialog({ open, onClose, projectId, isOwner }: ShareDialogProps) {
  const [people, setPeople] = useState<PersonEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [removingEmail, setRemovingEmail] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPeople = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`);
      if (!res.ok) throw new Error();
      setPeople(await res.json());
    } catch {
      setError("Failed to load collaborators");
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (open) fetchPeople();
  }, [open, fetchPeople]);

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
      const added = await res.json();
      setPeople((prev) => [...prev, { ...added, role: "collaborator" as const }]);
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
      setPeople((prev) => prev.filter((p) => p.email !== email));
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
        className="rounded-3xl sm:max-w-lg bg-elevated border border-border-default ring-0 text-copy-primary p-0 gap-0 overflow-hidden"
      >
        <div className="px-6 pt-6 pb-5">
          <DialogHeader>
            <DialogTitle className="text-copy-primary font-semibold text-lg">
              Share project
            </DialogTitle>
            <DialogDescription className="text-copy-muted text-sm leading-relaxed">
              Invite collaborators, copy the workspace link, and manage access.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="h-px bg-border-default" />

        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Workspace link */}
          <div className="rounded-2xl border border-border-default bg-subtle p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-copy-primary">Workspace link</p>
              <p className="text-xs text-copy-muted mt-0.5">
                Share a direct link with teammates after you grant them access.
              </p>
            </div>
            <Button
              onClick={handleCopyLink}
              variant="outline"
              size="sm"
              className="shrink-0 bg-base border-border-subtle text-copy-primary hover:bg-surface hover:text-copy-primary gap-1.5"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-success" />
              ) : (
                <Link2 className="h-3.5 w-3.5" />
              )}
              {copied ? "Copied!" : "Copy link"}
            </Button>
          </div>

          {/* Invite (owner only) */}
          {isOwner && (
            <div className="rounded-2xl border border-border-default bg-subtle px-4 py-3 flex items-center gap-3">
              <Mail className="h-4 w-4 text-copy-muted shrink-0" />
              <Input
                placeholder="teammate@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleInvite(); }}
                className="flex-1 border-0 bg-transparent px-0 h-auto focus-visible:ring-0 focus-visible:border-transparent placeholder:text-copy-faint text-sm"
                disabled={isInviting}
              />
              <Button
                onClick={handleInvite}
                disabled={isInviting || !inviteEmail.trim()}
                size="sm"
                className="shrink-0"
              >
                {isInviting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Invite"}
              </Button>
            </div>
          )}

          {error && <p className="text-error text-xs">{error}</p>}

          {/* People with access */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-copy-primary">People with access</h3>
              <span className="text-xs text-copy-muted">{people.length} total</span>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-copy-faint" />
              </div>
            ) : people.length === 0 ? (
              <p className="text-copy-faint text-sm py-2">No people yet</p>
            ) : (
              <div className="flex flex-col gap-2">
                {people.map((person) => (
                  <div
                    key={person.email}
                    className="rounded-2xl border border-border-default bg-subtle p-3 flex items-center gap-3"
                  >
                    <div className="h-10 w-10 rounded-full bg-elevated border border-border-default flex items-center justify-center overflow-hidden shrink-0">
                      {person.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={person.avatar}
                          alt={person.name ?? person.email}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-medium text-copy-muted">
                          {(person.name ?? person.email)[0].toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      {person.name && (
                        <p className="text-sm font-medium text-copy-primary truncate">
                          {person.name}
                        </p>
                      )}
                      <p className={cn(
                        "truncate",
                        person.name ? "text-xs text-copy-muted" : "text-sm text-copy-primary"
                      )}>
                        {person.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {person.role === "owner" && (
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-dim text-brand border border-brand/20 tracking-wide">
                          OWNER
                        </span>
                      )}
                      {isOwner && person.role === "collaborator" && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleRemove(person.email)}
                          disabled={removingEmail === person.email}
                          aria-label={`Remove ${person.email}`}
                        >
                          {removingEmail === person.email ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <X className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
