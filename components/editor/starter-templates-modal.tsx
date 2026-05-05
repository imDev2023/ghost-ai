"use client";

import { LayoutTemplate } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type CanvasTemplate, CANVAS_TEMPLATES } from "./starter-templates";
import type { CanvasNode, CanvasEdge } from "@/types/canvas";

const PREVIEW_W = 220;
const PREVIEW_H = 130;
const PREVIEW_PAD = 12;

function DiagramPreview({ nodes, edges }: { nodes: CanvasNode[]; edges: CanvasEdge[] }) {
  if (nodes.length === 0) return null;

  const minX = Math.min(...nodes.map((nd) => nd.position.x));
  const minY = Math.min(...nodes.map((nd) => nd.position.y));
  const maxX = Math.max(...nodes.map((nd) => nd.position.x + (nd.width ?? 140)));
  const maxY = Math.max(...nodes.map((nd) => nd.position.y + (nd.height ?? 60)));

  const contentW = maxX - minX || 1;
  const contentH = maxY - minY || 1;
  const scale = Math.min(
    (PREVIEW_W - PREVIEW_PAD * 2) / contentW,
    (PREVIEW_H - PREVIEW_PAD * 2) / contentH,
  );

  const offsetX = PREVIEW_PAD + (PREVIEW_W - PREVIEW_PAD * 2 - contentW * scale) / 2;
  const offsetY = PREVIEW_H / 2 - (contentH * scale) / 2;

  const tx = (x: number) => offsetX + (x - minX) * scale;
  const ty = (y: number) => offsetY + (y - minY) * scale;

  const centers: Record<string, { cx: number; cy: number }> = {};
  for (const nd of nodes) {
    const w = nd.width ?? 140;
    const h = nd.height ?? 60;
    centers[nd.id] = { cx: tx(nd.position.x + w / 2), cy: ty(nd.position.y + h / 2) };
  }

  return (
    <svg
      width={PREVIEW_W}
      height={PREVIEW_H}
      viewBox={`0 0 ${PREVIEW_W} ${PREVIEW_H}`}
      className="w-full rounded-lg"
      style={{ background: "#080809" }}
    >
      {edges.map((ed) => {
        const s = centers[ed.source];
        const t = centers[ed.target];
        if (!s || !t) return null;
        return (
          <line
            key={ed.id}
            x1={s.cx}
            y1={s.cy}
            x2={t.cx}
            y2={t.cy}
            stroke="rgba(255,255,255,0.22)"
            strokeWidth={0.8}
          />
        );
      })}
      {nodes.map((nd) => {
        const w = (nd.width ?? 140) * scale;
        const h = (nd.height ?? 60) * scale;
        const x = tx(nd.position.x);
        const y = ty(nd.position.y);
        const bg = nd.data.backgroundColor || "#1F1F1F";
        const shape = nd.data.shape || "rectangle";
        let rx = 3;
        if (shape === "pill" || shape === "circle") rx = h / 2;
        return (
          <rect
            key={nd.id}
            x={x}
            y={y}
            width={w}
            height={h}
            rx={rx}
            fill={bg}
            stroke="rgba(255,255,255,0.14)"
            strokeWidth={0.5}
          />
        );
      })}
    </svg>
  );
}

interface StarterTemplatesModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (template: CanvasTemplate) => void;
}

export function StarterTemplatesModal({ open, onClose, onImport }: StarterTemplatesModalProps) {
  function handleImport(template: CanvasTemplate) {
    onImport(template);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl bg-elevated border-border-default">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-copy-primary">
            <LayoutTemplate className="h-4 w-4 text-brand" />
            Starter Templates
          </DialogTitle>
          <DialogDescription className="text-copy-muted">
            Choose a template to start from. This will replace your current canvas.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[420px] pr-2">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 pb-1">
            {CANVAS_TEMPLATES.map((template) => (
              <div
                key={template.id}
                className="flex flex-col gap-3 rounded-2xl border border-border-default bg-subtle p-3 hover:border-border-subtle transition-colors"
              >
                <DiagramPreview nodes={template.nodes} edges={template.edges} />
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold text-copy-primary">{template.name}</p>
                  <p className="text-xs text-copy-muted leading-relaxed line-clamp-2">
                    {template.description}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-border-default text-copy-secondary hover:text-copy-primary hover:bg-elevated"
                  onClick={() => handleImport(template)}
                >
                  Import
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
