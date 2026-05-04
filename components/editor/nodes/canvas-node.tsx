"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { CanvasNode } from "@/types/canvas";

export function CanvasFlowNode({ data, selected, width, height }: NodeProps<CanvasNode>) {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div
        style={{ width, height }}
        className={[
          "flex items-center justify-center rounded-xl",
          "border bg-elevated border-border-default",
          "text-copy-primary text-sm font-medium px-3 py-2",
          selected ? "ring-2 ring-brand" : "",
        ].join(" ")}
      >
        <span className="truncate max-w-full">{data.label}</span>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}
