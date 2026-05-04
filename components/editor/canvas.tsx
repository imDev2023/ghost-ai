"use client";

import { useCallback } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  Background,
  BackgroundVariant,
  ConnectionMode,
  Panel,
  type NodeTypes,
} from "@xyflow/react";
import { useLiveblocksFlow } from "@liveblocks/react-flow";
import type { CanvasNode, CanvasEdge, ShapeDragPayload } from "@/types/canvas";
import { CanvasFlowNode } from "@/components/editor/nodes/canvas-node";
import { ShapePanel } from "@/components/editor/shape-panel";

const nodeTypes: NodeTypes = { canvasNode: CanvasFlowNode };

let nodeCounter = 0;
function generateNodeId(shape: string): string {
  return `${shape}-${Date.now()}-${++nodeCounter}`;
}

function CanvasInner() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({
      suspense: true,
      nodes: { initial: [] },
      edges: { initial: [] },
    });

  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const raw = event.dataTransfer.getData("application/json");
      if (!raw) return;

      const { shape, width, height } = JSON.parse(raw) as ShapeDragPayload;
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });

      onNodesChange([
        {
          type: "add",
          item: {
            id: generateNodeId(shape),
            type: "canvasNode",
            position: { x: position.x - width / 2, y: position.y - height / 2 },
            data: { label: "", shape },
            width,
            height,
          } as CanvasNode,
        },
      ]);
    },
    [screenToFlowPosition, onNodesChange],
  );

  return (
    <div className="w-full h-full" onDragOver={onDragOver} onDrop={onDrop}>
      <ReactFlow<CanvasNode, CanvasEdge>
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDelete={onDelete}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        style={{ background: "var(--bg-base)" }}
      >
        <Panel position="bottom-center">
          <ShapePanel />
        </Panel>
        <Background
          variant={BackgroundVariant.Dots}
          color="var(--border-default)"
          gap={24}
          size={1.5}
        />
      </ReactFlow>
    </div>
  );
}

export function Canvas() {
  return (
    <div className="w-full h-full">
      <ReactFlowProvider>
        <CanvasInner />
      </ReactFlowProvider>
    </div>
  );
}
