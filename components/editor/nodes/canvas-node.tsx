"use client";

import { useState, useRef, useEffect } from "react";
import { Handle, Position, NodeResizeControl, type NodeProps } from "@xyflow/react";
import type { CanvasNode, CanvasShape, NodeColor } from "@/types/canvas";
import { NODE_COLORS } from "@/types/canvas";

const handleStyle: React.CSSProperties = {
  width: 8,
  height: 8,
  backgroundColor: "#fff",
  border: "2px solid #2a2a30",
  borderRadius: "50%",
};


interface CanvasFlowNodeProps extends NodeProps<CanvasNode> {
  editingNodeId?: string;
  onStartEdit?: (nodeId: string, currentLabel: string) => void;
  onEndEdit?: (newLabel: string) => void;
  onCancelEdit?: () => void;
  onColorChange?: (nodeId: string, color: NodeColor) => void;
}

function ColorToolbar({ 
  nodeId, 
  selected,
  backgroundColor,
  onSelect,
}: { 
  nodeId: string;
  selected: boolean;
  backgroundColor?: string;
  onSelect: (color: NodeColor) => void;
}) {
  const [isHovered, setIsHovered] = useState<string | null>(null);

  if (!selected) return null;

  const activeColor = NODE_COLORS.find(c => c.background === backgroundColor) || NODE_COLORS[0];

  return (
    <div 
      className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-1 px-2 py-1 bg-elevated border border-border-default rounded-lg shadow-lg"
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {NODE_COLORS.map((color) => (
        <button
          key={color.name}
          onClick={() => onSelect(color)}
          onMouseEnter={() => setIsHovered(color.name)}
          onMouseLeave={() => setIsHovered(null)}
          className="w-4 h-4 rounded-full transition-all"
          style={{ 
            backgroundColor: color.background,
            border: activeColor.name === color.name ? `2px solid ${color.text}` : "1px solid rgba(255,255,255,0.2)",
            boxShadow: isHovered === color.name ? `0 0 4px ${color.text}` : "none",
          }}
          title={color.name}
        />
      ))}
    </div>
  );
}

type ShapeProps = {
  shape: CanvasShape | undefined;
  width: number | undefined;
  height: number | undefined;
  selected: boolean;
  label: string;
  isEditing: boolean;
  backgroundColor?: string;
  textColor?: string;
  onStartEdit: () => void;
};

function CSSShape({ shape, width, height, selected, label, isEditing, backgroundColor, textColor, onStartEdit }: ShapeProps) {
  const baseClasses = [
    "flex items-center justify-center",
    "border text-sm font-medium px-3 py-2",
    selected ? "ring-2 ring-brand" : "",
  ];

  const shapeClasses: Record<string, string> = {
    rectangle: "rounded-lg border-border-default",
    pill: "rounded-full border-border-default",
    circle: "rounded-full border-border-default",
  };

  const style: React.CSSProperties = {
    width,
    height,
    minWidth: width,
    minHeight: height,
    backgroundColor: backgroundColor || "#1F1F1F",
    color: textColor || "#EDEDED",
  };

  return (
    <div 
      className={[...baseClasses, shapeClasses[shape || "rectangle"]].join(" ")} 
      style={style}
      onDoubleClick={onStartEdit}
    >
      <span 
        className="truncate max-w-full" 
        style={{ visibility: isEditing ? "hidden" : "visible" }}
      >
        {label || "Label"}
      </span>
    </div>
  );
}

function SVGShape({ shape, width = 100, height = 100, selected, label, isEditing, backgroundColor, textColor, onStartEdit }: ShapeProps) {
  const strokeColor = selected ? "var(--color-brand)" : "var(--color-border-default)";
  const strokeWidth = selected ? 2 : 1;

  const bgColor = backgroundColor || "#1F1F1F";
  const txtColor = textColor || "#EDEDED";

  const shapes: Record<string, { path: string; viewBox: string }> = {
    diamond: {
      viewBox: "0 0 100 100",
      // vertices at exact handle positions: top(50,0), right(100,50), bottom(50,100), left(0,50)
      path: "M50 0 L100 50 L50 100 L0 50 Z",
    },
    hexagon: {
      viewBox: "0 0 100 100",
      // fills viewBox so handles align with shape edges
      path: "M25 2 L75 2 L98 50 L75 98 L25 98 L2 50 Z",
    },
    cylinder: {
      viewBox: "0 0 100 100",
      // top cap touches y≈2, bottom touches y≈98 so top/bottom handles land on the shape
      path: "M6,18 L6,82 Q50,98 94,82 L94,18 Q50,34 6,18 Z M6,18 Q50,2 94,18 Q50,34 6,18",
    },
  };

  const svgProps = shapes[shape || "diamond"];

  return (
    <svg
      width={width}
      height={height}
      viewBox={svgProps.viewBox}
      style={{ overflow: "visible" }}
      onDoubleClick={onStartEdit}
    >
      <path
        d={svgProps.path}
        fill={bgColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
      <foreignObject x="0" y="0" width="100" height="100">
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px",
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <span 
            className="text-sm font-medium truncate"
            style={{ 
              color: txtColor,
              visibility: isEditing ? "hidden" : "visible" 
            }}
          >
            {label || "Label"}
          </span>
        </div>
      </foreignObject>
    </svg>
  );
}

export function CanvasFlowNode({ 
  data, 
  selected, 
  width, 
  height, 
  id,
  editingNodeId,
  onStartEdit,
  onEndEdit,
  onCancelEdit,
  onColorChange,
}: CanvasFlowNodeProps) {
  const isEditing = editingNodeId === id;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    if (selected && onStartEdit) {
      onStartEdit(id, data.label || "");
    }
  };

  const handleTextareaBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (onEndEdit) {
      onEndEdit(e.currentTarget.value);
    }
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape" && onCancelEdit) {
      onCancelEdit();
    }
  };

  const handleColorSelect = (color: NodeColor) => {
    if (onColorChange) {
      onColorChange(id, color);
    }
  };

  const shape = data.shape || "rectangle";
  const isCSSShape = shape === "rectangle" || shape === "pill" || shape === "circle";
  const isSVGShape = shape === "diamond" || shape === "hexagon" || shape === "cylinder";

  return (
    <>
      <Handle type="source" id="top"    position={Position.Top}    style={handleStyle} className="opacity-0! hover:opacity-100! transition-opacity" />
      <Handle type="source" id="right"  position={Position.Right}  style={handleStyle} className="opacity-0! hover:opacity-100! transition-opacity" />
      <Handle type="source" id="bottom" position={Position.Bottom} style={handleStyle} className="opacity-0! hover:opacity-100! transition-opacity" />
      <Handle type="source" id="left"   position={Position.Left}   style={handleStyle} className="opacity-0! hover:opacity-100! transition-opacity" />
      <ColorToolbar 
        nodeId={id}
        selected={selected}
        backgroundColor={data.backgroundColor}
        onSelect={handleColorSelect}
      />
      {isCSSShape && (
        <CSSShape 
          shape={shape} 
          width={width} 
          height={height} 
          selected={selected} 
          label={data.label} 
          isEditing={isEditing}
          backgroundColor={data.backgroundColor}
          textColor={data.textColor}
          onStartEdit={handleStartEdit}
        />
      )}
      {isSVGShape && (
        <SVGShape 
          shape={shape} 
          width={width} 
          height={height} 
          selected={selected} 
          label={data.label}
          isEditing={isEditing}
          backgroundColor={data.backgroundColor}
          textColor={data.textColor}
          onStartEdit={handleStartEdit}
        />
      )}
      {isEditing && (
        <textarea
          ref={textareaRef}
          defaultValue={data.label || ""}
          className="absolute inset-0 w-full h-full resize-none border-none outline-none text-center text-xs font-medium nodrag nopan"
          style={{ 
            backgroundColor: "transparent", 
            color: data.textColor || "#EDEDED",
            textAlign: "center",
            textAlignLast: "center",
            padding: "8px",
            pointerEvents: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: "normal",
          }}
          onBlur={handleTextareaBlur}
          onKeyDown={handleTextareaKeyDown}
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        />
      )}
      {selected && !isEditing && (
        <>
          <NodeResizeControl 
            position="top-left" 
            minWidth={60} 
            minHeight={40}
            className="!w-1.5 !h-1.5 !bg-white/55 !border-0"
            style={{ opacity: 0.55 }}
          />
          <NodeResizeControl 
            position="top-right" 
            minWidth={60} 
            minHeight={40}
            className="!w-1.5 !h-1.5 !bg-white/55 !border-0"
            style={{ opacity: 0.55 }}
          />
          <NodeResizeControl 
            position="bottom-left" 
            minWidth={60} 
            minHeight={40}
            className="!w-1.5 !h-1.5 !bg-white/55 !border-0"
            style={{ opacity: 0.55 }}
          />
          <NodeResizeControl 
            position="bottom-right" 
            minWidth={60} 
            minHeight={40}
            className="!w-1.5 !h-1.5 !bg-white/55 !border-0"
            style={{ opacity: 0.55 }}
          />
        </>
      )}
    </>
  );
}