import type { CanvasNode, CanvasEdge, CanvasShape } from "@/types/canvas";

export interface CanvasTemplate {
  id: string;
  name: string;
  description: string;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}

function n(
  id: string,
  label: string,
  x: number,
  y: number,
  shape: CanvasShape = "rectangle",
  bg = "#1F1F1F",
  text = "#EDEDED",
  w = 140,
  h = 60,
): CanvasNode {
  return {
    id,
    type: "canvasNode",
    position: { x, y },
    data: { label, shape, backgroundColor: bg, textColor: text },
    width: w,
    height: h,
  };
}

function e(id: string, source: string, target: string, label?: string): CanvasEdge {
  return {
    id,
    type: "canvasEdge",
    source,
    target,
    data: label ? { label } : {},
  };
}

export const CANVAS_TEMPLATES: CanvasTemplate[] = [
  {
    id: "microservices",
    name: "Microservices",
    description:
      "API gateway routing traffic to isolated backend services with separate data stores.",
    nodes: [
      n("client",    "Client",          160,   0, "pill",      "#10233D", "#52A8FF", 120, 50),
      n("gateway",   "API Gateway",     160, 120, "rectangle", "#2E1938", "#BF7AF0"),
      n("auth",      "Auth Service",      0, 260, "rectangle"),
      n("users",     "User Service",    160, 260, "rectangle", "#0F2E18", "#62C073"),
      n("products",  "Product Service", 340, 260, "rectangle", "#062822", "#0AC7B4"),
      n("db-users",  "Users DB",         60, 390, "cylinder",  "#331B00", "#FF990A", 120, 70),
      n("db-prod",   "Products DB",     320, 390, "cylinder",  "#331B00", "#FF990A", 120, 70),
    ],
    edges: [
      e("e1", "client",   "gateway"),
      e("e2", "gateway",  "auth"),
      e("e3", "gateway",  "users"),
      e("e4", "gateway",  "products"),
      e("e5", "users",    "db-users"),
      e("e6", "products", "db-prod"),
      e("e7", "auth",     "db-users"),
    ],
  },
  {
    id: "ci-cd",
    name: "CI/CD Pipeline",
    description:
      "Source to production deployment pipeline with build, test, staging, and approval gates.",
    nodes: [
      n("source",  "Source",     0,   0, "pill",      "#10233D", "#52A8FF", 100, 50),
      n("build",   "Build",    160,   0, "rectangle"),
      n("test",    "Test",     320,   0, "rectangle", "#0F2E18", "#62C073"),
      n("stage",   "Staging",  480,   0, "rectangle", "#331B00", "#FF990A"),
      n("approve", "Approval", 640,   0, "diamond",   "#2E1938", "#BF7AF0", 110, 90),
      n("deploy",  "Production",800,  0, "pill",      "#062822", "#0AC7B4", 130, 50),
    ],
    edges: [
      e("e1", "source",  "build",   "push"),
      e("e2", "build",   "test"),
      e("e3", "test",    "stage",   "pass"),
      e("e4", "stage",   "approve"),
      e("e5", "approve", "deploy",  "approved"),
    ],
  },
  {
    id: "event-driven",
    name: "Event-Driven System",
    description:
      "Producers emit events to a central bus; consumers subscribe and process asynchronously.",
    nodes: [
      n("prod-a",  "Producer A",    0,  10, "rectangle", "#10233D", "#52A8FF"),
      n("prod-b",  "Producer B",    0, 130, "rectangle", "#10233D", "#52A8FF"),
      n("bus",     "Event Bus",   200,  70, "hexagon",   "#2E1938", "#BF7AF0", 120, 100),
      n("cons-a",  "Consumer A",  400,   0, "rectangle", "#0F2E18", "#62C073"),
      n("cons-b",  "Consumer B",  400, 100, "rectangle", "#0F2E18", "#62C073"),
      n("cons-c",  "Consumer C",  400, 200, "rectangle", "#0F2E18", "#62C073"),
      n("dlq",     "Dead Letter", 610, 100, "cylinder",  "#3C1618", "#FF6166", 150, 65),
    ],
    edges: [
      e("e1", "prod-a", "bus"),
      e("e2", "prod-b", "bus"),
      e("e3", "bus",    "cons-a"),
      e("e4", "bus",    "cons-b"),
      e("e5", "bus",    "cons-c"),
      e("e6", "cons-a", "dlq", "failed"),
      e("e7", "cons-b", "dlq", "failed"),
    ],
  },
];
