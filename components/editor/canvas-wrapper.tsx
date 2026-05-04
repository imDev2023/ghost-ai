"use client";

import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from "@liveblocks/react/suspense";
import { ErrorBoundary } from "react-error-boundary";
import { Canvas } from "@/components/editor/canvas";
import "@xyflow/react/dist/style.css";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-flow/styles.css";

interface CanvasWrapperProps {
  roomId: string;
}

export function CanvasWrapper({ roomId }: CanvasWrapperProps) {
  return (
    <div className="w-full h-full">
      <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
        <RoomProvider id={roomId} initialPresence={{ cursor: null, isThinking: false }}>
          <ErrorBoundary fallback={<CanvasError />}>
            <ClientSideSuspense fallback={<CanvasLoading />}>
              <Canvas />
            </ClientSideSuspense>
          </ErrorBoundary>
        </RoomProvider>
      </LiveblocksProvider>
    </div>
  );
}

function CanvasLoading() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <p className="text-copy-muted text-sm">Connecting to canvas…</p>
    </div>
  );
}

function CanvasError() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <p className="text-copy-muted text-sm">Failed to connect to canvas.</p>
    </div>
  );
}
