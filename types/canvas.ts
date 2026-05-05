import type { Node, Edge } from "@xyflow/react";

export type CanvasShape =
  | "rectangle"
  | "diamond"
  | "circle"
  | "pill"
  | "cylinder"
  | "hexagon";

export interface NodeColor {
  name: string;
  background: string;
  text: string;
}

export const NODE_COLORS: NodeColor[] = [
  { name: "default", background: "#1F1F1F", text: "#EDEDED" },
  { name: "blue", background: "#10233D", text: "#52A8FF" },
  { name: "purple", background: "#2E1938", text: "#BF7AF0" },
  { name: "orange", background: "#331B00", text: "#FF990A" },
  { name: "red", background: "#3C1618", text: "#FF6166" },
  { name: "pink", background: "#3A1726", text: "#F75F8F" },
  { name: "green", background: "#0F2E18", text: "#62C073" },
  { name: "teal", background: "#062822", text: "#0AC7B4" },
];

export interface CanvasNodeData extends Record<string, unknown> {
  label: string;
  backgroundColor?: string;
  textColor?: string;
  shape?: CanvasShape;
}

export type CanvasNode = Node<CanvasNodeData, "canvasNode">;

export interface CanvasEdgeData extends Record<string, unknown> {
  label?: string;
}

export type CanvasEdge = Edge<CanvasEdgeData, "canvasEdge">;

export interface ShapeDragPayload {
  shape: CanvasShape;
  width: number;
  height: number;
}
