"use client";

import { useOthers } from "@liveblocks/react";
import { useAuth, UserButton } from "@clerk/nextjs";

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function PresenceAvatarGroup() {
  const { userId } = useAuth();
  const others = useOthers();

  // Exclude current user — the same Clerk account may be present from another tab
  const collaborators = others.filter((o) => o.id !== userId);
  const visible = collaborators.slice(0, 5);
  const overflow = collaborators.length - 5;

  return (
    <div className="flex items-center gap-2">
      {collaborators.length > 0 && (
        <>
          <div className="flex items-center">
            {visible.map((other, i) => {
              const name = other.info?.name ?? "Collaborator";
              const avatar = other.info?.avatar ?? null;
              const color = other.info?.color ?? "#808090";

              return (
                <div
                  key={other.connectionId}
                  title={name}
                  className="relative shrink-0"
                  style={{ marginLeft: i > 0 ? -8 : 0, zIndex: visible.length - i }}
                >
                  {avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatar}
                      alt={name}
                      className="w-8 h-8 rounded-full object-cover"
                      style={{ boxShadow: "0 0 0 2px #111114" }}
                    />
                  ) : (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold text-white"
                      style={{
                        backgroundColor: color,
                        boxShadow: "0 0 0 2px #111114",
                      }}
                    >
                      {getInitials(name)}
                    </div>
                  )}
                </div>
              );
            })}
            {overflow > 0 && (
              <div
                className="w-8 h-8 rounded-full bg-elevated border border-border-default flex items-center justify-center text-[10px] font-semibold text-copy-muted shrink-0"
                style={{ marginLeft: -8, boxShadow: "0 0 0 2px #111114" }}
              >
                +{overflow}
              </div>
            )}
          </div>
          <div className="w-px h-5 bg-border-default" />
        </>
      )}
      <UserButton />
    </div>
  );
}
