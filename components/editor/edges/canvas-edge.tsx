"use client";

import { useState, useCallback, useMemo } from "react";
import {
  getSmoothStepPath,
  EdgeLabelRenderer,
  BaseEdge,
  type EdgeProps,
} from "@xyflow/react";
import type { CanvasEdge } from "@/types/canvas";

interface CanvasEdgeData {
  label?: string;
}

export function CanvasEdge({
  id,
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
  selected,
  data,
  markerEnd,
}: EdgeProps<CanvasEdge>) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState((data as CanvasEdgeData)?.label || "");

  const edgeData = data as CanvasEdgeData | undefined;
  const label = edgeData?.label || "";

  const [edgePath, labelX, labelY] = useMemo(() => {
    return getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      borderRadius: 20,
    });
  }, [sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition]);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
    setEditValue(label);
  }, [label]);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    window.dispatchEvent(new CustomEvent("edge-label-update", { 
      detail: { edgeId: id, label: editValue } 
    }));
  }, [id, editValue]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      window.dispatchEvent(new CustomEvent("edge-label-update", { 
        detail: { edgeId: id, label: editValue } 
      }));
      setIsEditing(false);
    } else if (e.key === "Escape") {
      setIsEditing(false);
    }
  }, [id, editValue]);

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: selected ? "#00c8d4" : "rgba(255,255,255,0.4)",
          strokeWidth: selected ? 2 : 1.5,
          transition: "stroke 0.2s, stroke-width 0.2s",
        }}
      />
      <EdgeLabelRenderer>
        {isEditing ? (
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: "all",
            }}
          >
            <input
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              className="nodrag nopan px-2 py-1 text-xs bg-elevated border border-brand rounded-md outline-none text-center text-copy-primary"
              style={{ minWidth: "60px", textAlign: "center" }}
            />
          </div>
        ) : label ? (
          <div
            onDoubleClick={handleDoubleClick}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: "all",
              padding: "2px 8px",
              backgroundColor: "var(--color-elevated)",
              border: "1px solid var(--color-border-default)",
              borderRadius: "9999px",
              fontSize: "10px",
              color: "var(--color-copy-primary)",
              cursor: "pointer",
            }}
          >
            {label}
          </div>
        ) : (
          <div
            onDoubleClick={handleDoubleClick}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: "all",
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.3)",
              cursor: "pointer",
            }}
            title="Double-click to add label"
          />
        )}
      </EdgeLabelRenderer>
    </>
  );
}