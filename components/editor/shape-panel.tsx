"use client";

import {
  RectangleHorizontal,
  Diamond,
  Circle,
  Pill,
  Cylinder,
  Hexagon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CanvasShape, ShapeDragPayload } from "@/types/canvas";
import { setDragPayload } from "@/components/editor/canvas";

interface ShapeConfig {
  shape: CanvasShape;
  icon: LucideIcon;
  width: number;
  height: number;
}

const SHAPES: ShapeConfig[] = [
  { shape: "rectangle", icon: RectangleHorizontal, width: 160, height: 80 },
  { shape: "diamond",   icon: Diamond,             width: 120, height: 120 },
  { shape: "circle",    icon: Circle,              width: 80,  height: 80  },
  { shape: "pill",      icon: Pill,                width: 160, height: 60  },
  { shape: "cylinder",  icon: Cylinder,            width: 100, height: 100 },
  { shape: "hexagon",   icon: Hexagon,             width: 100, height: 100 },
];

export function ShapePanel() {
  function handleDragStart(event: React.DragEvent, config: ShapeConfig) {
    const payload: ShapeDragPayload = {
      shape: config.shape,
      width: config.width,
      height: config.height,
    };
    setDragPayload(payload);
    event.dataTransfer.setData("application/json", JSON.stringify(payload));
    event.dataTransfer.effectAllowed = "copy";
  }

  function handleDragEnd() {
    setDragPayload(null);
  }

  return (
    <div className="flex items-center gap-1 px-3 py-2 bg-elevated border border-border-default rounded-full shadow-lg">
      {SHAPES.map((config) => {
        const Icon = config.icon;
        return (
          <button
            key={config.shape}
            title={config.shape}
            draggable
            onDragStart={(e) => handleDragStart(e, config)}
            onDragEnd={handleDragEnd}
            className="h-8 w-8 flex items-center justify-center rounded-full text-copy-muted hover:text-copy-primary hover:bg-subtle transition-colors cursor-grab active:cursor-grabbing"
          >
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}
