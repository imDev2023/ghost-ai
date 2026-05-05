"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  Background,
  BackgroundVariant,
  ConnectionMode,
  Panel,
  MarkerType,
  type NodeTypes,
  type EdgeTypes,
} from "@xyflow/react";
import { useLiveblocksFlow } from "@liveblocks/react-flow";
import { useUndo, useRedo, useCanUndo, useCanRedo, useOthers, useUpdateMyPresence } from "@liveblocks/react";
import { PresenceAvatarGroup } from "@/components/editor/presence-avatars";
import type { CanvasNode, CanvasEdge, ShapeDragPayload, CanvasShape, NodeColor } from "@/types/canvas";
import type { CanvasTemplate } from "@/components/editor/starter-templates";
import { CanvasFlowNode } from "@/components/editor/nodes/canvas-node";
import { CanvasEdge as CanvasEdgeComponent } from "@/components/editor/edges/canvas-edge";
import { ShapePanel } from "@/components/editor/shape-panel";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { Minus, Plus, RotateCcw, RotateCw, Maximize2 } from "lucide-react";

interface DragPreview {
  shape: CanvasShape;
  width: number;
  height: number;
  x: number;
  y: number;
}

interface EditingNode {
  id: string;
  label: string;
}

const edgeTypes: EdgeTypes = {
  canvasEdge: (props) => <CanvasEdgeComponent {...props} />
};

let pendingDragPayload: ShapeDragPayload | null = null;
export function setDragPayload(p: ShapeDragPayload | null) { pendingDragPayload = p; }

let nodeCounter = 0;
function generateNodeId(shape: string): string {
  return `${shape}-${Date.now()}-${++nodeCounter}`;
}

function DragPreviewShape({ shape, width, height }: { shape: CanvasShape; width: number; height: number }) {
  const baseStyle: React.CSSProperties = {
    pointerEvents: "none",
    opacity: 0.7,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "var(--color-elevated)",
    border: "1px dashed var(--color-border-strong)",
    color: "var(--color-copy-muted)",
    fontSize: "12px",
  };

  if (shape === "rectangle") {
    return <div style={{ width, height, ...baseStyle, borderRadius: "8px" }} />;
  }
  if (shape === "pill") {
    return <div style={{ width, height, ...baseStyle, borderRadius: "9999px" }} />;
  }
  if (shape === "circle") {
    return <div style={{ width, height, ...baseStyle, borderRadius: "50%" }} />;
  }
  if (shape === "diamond") {
    return (
      <svg width={width} height={height} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
        <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="var(--color-elevated)" stroke="var(--color-border-strong)" strokeWidth="1" strokeDasharray="4" />
      </svg>
    );
  }
  if (shape === "hexagon") {
    return (
      <svg width={width} height={height} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
        <path d="M25 2 L75 2 L98 50 L75 98 L25 98 L2 50 Z" fill="var(--color-elevated)" stroke="var(--color-border-strong)" strokeWidth="1" strokeDasharray="4" />
      </svg>
    );
  }
  if (shape === "cylinder") {
    return (
      <svg width={width} height={height} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
        <path d="M6,18 L6,82 Q50,98 94,82 L94,18 Q50,34 6,18 Z M6,18 Q50,2 94,18 Q50,34 6,18" fill="var(--color-elevated)" stroke="var(--color-border-strong)" strokeWidth="1" strokeDasharray="4" />
      </svg>
    );
  }
  return null;
}

function CanvasInner() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({
      suspense: true,
      nodes: { initial: [] },
      edges: { initial: [] },
    });

  const { screenToFlowPosition, flowToScreenPosition, zoomIn, zoomOut, fitView } = useReactFlow();
  const [dragPreview, setDragPreview] = useState<DragPreview | null>(null);
  const [editingNode, setEditingNode] = useState<EditingNode | null>(null);

  const undo = useUndo();
  const redo = useRedo();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  const updateMyPresence = useUpdateMyPresence();
  const others = useOthers();

  useKeyboardShortcuts({
    onZoomIn: () => zoomIn({ duration: 200 }),
    onZoomOut: () => zoomOut({ duration: 200 }),
    onUndo: undo,
    onRedo: redo,
  });

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
    updateMyPresence({ cursor: position });
  }, [screenToFlowPosition, updateMyPresence]);

  const handleMouseLeave = useCallback(() => {
    updateMyPresence({ cursor: null });
  }, [updateMyPresence]);

  const handleStartEdit = useCallback((nodeId: string, currentLabel: string) => {
    setEditingNode({ id: nodeId, label: currentLabel });
  }, []);

  const handleEndEdit = useCallback((newLabel: string) => {
    if (editingNode && newLabel !== editingNode.label) {
      const node = nodes.find(n => n.id === editingNode.id);
      if (node) {
        onNodesChange([
          {
            type: "replace",
            id: node.id,
            item: { ...node, data: { ...node.data, label: newLabel } },
          },
        ]);
      }
    }
    setEditingNode(null);
  }, [editingNode, nodes, onNodesChange]);

  const handleCancelEdit = useCallback(() => {
    setEditingNode(null);
  }, []);

  const handleColorChange = useCallback((nodeId: string, color: NodeColor) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      onNodesChange([
        {
          type: "replace",
          id: node.id,
          item: { 
            ...node, 
            data: { 
              ...node.data, 
              backgroundColor: color.background, 
              textColor: color.text 
            } 
          },
        },
      ]);
    }
  }, [nodes, onNodesChange]);

  const memoizedNodeTypes = useMemo<NodeTypes>(() => ({
    canvasNode: (props) => (
      <CanvasFlowNode
        {...props}
        editingNodeId={editingNode?.id}
        onStartEdit={handleStartEdit}
        onEndEdit={handleEndEdit}
        onCancelEdit={handleCancelEdit}
        onColorChange={handleColorChange}
      />
    ),
  }), [editingNode, handleStartEdit, handleEndEdit, handleCancelEdit, handleColorChange]);

  const handleEdgeLabelChange = useCallback((edgeId: string, newLabel: string) => {
    const edge = edges.find(e => e.id === edgeId);
    if (edge) {
      onEdgesChange([
        {
          type: "replace",
          id: edge.id,
          item: { 
            ...edge, 
            data: { 
              ...edge.data, 
              label: newLabel 
            } 
          },
        },
      ]);
    }
  }, [edges, onEdgesChange]);

  useEffect(() => {
    const handleEdgeLabelUpdate = (e: CustomEvent<{ edgeId: string; label: string }>) => {
      handleEdgeLabelChange(e.detail.edgeId, e.detail.label);
    };
    window.addEventListener("edge-label-update", handleEdgeLabelUpdate as EventListener);
    return () => window.removeEventListener("edge-label-update", handleEdgeLabelUpdate as EventListener);
  }, [handleEdgeLabelChange]);

  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  useEffect(() => {
    nodesRef.current = nodes;
    edgesRef.current = edges;
  }, [nodes, edges]);

  useEffect(() => {
    const handler = (ev: CustomEvent<CanvasTemplate>) => {
      const template = ev.detail;
      const currentNodes = nodesRef.current;
      const currentEdges = edgesRef.current;
      onNodesChange([
        ...currentNodes.map((nd) => ({ type: "remove" as const, id: nd.id })),
        ...template.nodes.map((nd) => ({ type: "add" as const, item: nd })),
      ]);
      onEdgesChange([
        ...currentEdges.map((ed) => ({ type: "remove" as const, id: ed.id })),
        ...template.edges.map((ed) => ({ type: "add" as const, item: ed })),
      ]);
      setTimeout(() => fitView({ duration: 300, padding: 0.15 }), 150);
    };
    window.addEventListener("canvas-load-template", handler as EventListener);
    return () => window.removeEventListener("canvas-load-template", handler as EventListener);
  }, [onNodesChange, onEdgesChange, fitView]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setDragPreview(null);
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && editingNode) {
        setEditingNode(null);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [editingNode]);

  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      const hasType = (e as unknown as { dataTransfer?: { types: string[] } }).dataTransfer?.types.includes("application/json");
      if (!hasType || !pendingDragPayload) return;
      const { shape, width, height } = pendingDragPayload;
      setDragPreview({ shape, width, height, x: e.clientX, y: e.clientY });
    };

    const handleDrag = (e: DragEvent) => {
      if (!dragPreview) return;
      setDragPreview(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null);
    };

    const handleDragLeave = (e: DragEvent) => {
      if (e.relatedTarget === null) {
        setDragPreview(null);
      }
    };

    const handleDrop = () => {
      setDragPreview(null);
    };

    document.addEventListener("dragenter", handleDragEnter);
    document.addEventListener("drag", handleDrag);
    document.addEventListener("dragleave", handleDragLeave);
    document.addEventListener("drop", handleDrop);

    return () => {
      document.removeEventListener("dragenter", handleDragEnter);
      document.removeEventListener("drag", handleDrag);
      document.removeEventListener("dragleave", handleDragLeave);
      document.removeEventListener("drop", handleDrop);
    };
  }, [dragPreview]);

  return (
    <div className="w-full h-full" onDragOver={onDragOver} onDrop={onDrop}>
      <ReactFlow<CanvasNode, CanvasEdge>
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDelete={onDelete}
        nodeTypes={memoizedNodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{
          type: "canvasEdge",
          markerEnd: { type: MarkerType.ArrowClosed, color: "rgba(255,255,255,0.4)" },
        }}
        connectionMode={ConnectionMode.Loose}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        fitView
        style={{ background: "var(--bg-base)" }}
      >
        <Panel position="top-right" style={{ margin: "12px" }}>
          <PresenceAvatarGroup />
        </Panel>
        <Panel position="bottom-left">
          <div className="flex items-center gap-1 px-3 py-1.5 bg-elevated border border-border-default rounded-full shadow-lg">
            <button
              onClick={() => zoomOut({ duration: 200 })}
              className="h-7 w-7 flex items-center justify-center rounded-full text-copy-muted hover:text-copy-primary hover:bg-subtle transition-colors"
              title="Zoom out"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              onClick={() => fitView({ duration: 200 })}
              className="h-7 w-7 flex items-center justify-center rounded-full text-copy-muted hover:text-copy-primary hover:bg-subtle transition-colors"
              title="Fit view"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => zoomIn({ duration: 200 })}
              className="h-7 w-7 flex items-center justify-center rounded-full text-copy-muted hover:text-copy-primary hover:bg-subtle transition-colors"
              title="Zoom in"
            >
              <Plus className="h-4 w-4" />
            </button>
            <div className="w-px h-5 bg-border-default mx-1" />
            <button
              onClick={undo}
              disabled={!canUndo}
              className={`h-7 w-7 flex items-center justify-center rounded-full transition-colors ${
                canUndo 
                  ? "text-copy-muted hover:text-copy-primary hover:bg-subtle" 
                  : "text-copy-faint opacity-50 cursor-not-allowed"
              }`}
              title="Undo"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className={`h-7 w-7 flex items-center justify-center rounded-full transition-colors ${
                canRedo 
                  ? "text-copy-muted hover:text-copy-primary hover:bg-subtle" 
                  : "text-copy-faint opacity-50 cursor-not-allowed"
              }`}
              title="Redo"
            >
              <RotateCw className="h-4 w-4" />
            </button>
          </div>
        </Panel>
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
      {dragPreview && (
        <div
          style={{
            position: "fixed",
            left: dragPreview.x - dragPreview.width / 2,
            top: dragPreview.y - dragPreview.height / 2,
            pointerEvents: "none",
            zIndex: 9999,
          }}
        >
          <DragPreviewShape shape={dragPreview.shape} width={dragPreview.width} height={dragPreview.height} />
        </div>
      )}
      {others.map((other) => {
        if (!other.presence.cursor) return null;
        const { x, y } = flowToScreenPosition(other.presence.cursor);
        const name = other.info?.name ?? "Collaborator";
        const color = other.info?.color ?? "#808090";
        return (
          <div
            key={other.connectionId}
            style={{
              position: "fixed",
              left: x,
              top: y,
              pointerEvents: "none",
              zIndex: 9998,
              transform: "translate(-2px, -2px)",
            }}
          >
            <svg width="14" height="18" viewBox="0 0 14 18" fill="none" style={{ display: "block" }}>
              <path
                d="M0 0 L0 17 L4 13 L6.5 19 L8.5 18 L6 12 L11 12 Z"
                fill={color}
                stroke="rgba(0,0,0,0.45)"
                strokeWidth="0.5"
                strokeLinejoin="round"
              />
            </svg>
            <div
              style={{
                position: "absolute",
                left: 14,
                top: 0,
                background: color,
                color: "#fff",
                fontSize: 10,
                fontWeight: 600,
                lineHeight: 1.5,
                padding: "1px 6px",
                borderRadius: 4,
                whiteSpace: "nowrap",
              }}
            >
              {name}
            </div>
          </div>
        );
      })}
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