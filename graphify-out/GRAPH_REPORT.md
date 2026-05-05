# Graph Report - .  (2026-05-04)

## Corpus Check
- 86 files · ~66,719 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 173 nodes · 167 edges · 44 communities (39 shown, 5 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.78)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_AI Workflow Architecture|AI Workflow Architecture]]
- [[_COMMUNITY_Project Dialog Components|Project Dialog Components]]
- [[_COMMUNITY_UI Shell & Navigation|UI Shell & Navigation]]
- [[_COMMUNITY_Editor Workspace Shell|Editor Workspace Shell]]
- [[_COMMUNITY_Liveblocks & Canvas|Liveblocks & Canvas]]
- [[_COMMUNITY_Editor Pages & Access|Editor Pages & Access]]
- [[_COMMUNITY_Liveblocks Auth|Liveblocks Auth]]
- [[_COMMUNITY_Shape & Label Editing|Shape & Label Editing]]
- [[_COMMUNITY_Project Management|Project Management]]
- [[_COMMUNITY_Collaborators API|Collaborators API]]
- [[_COMMUNITY_React Flow Canvas|React Flow Canvas]]
- [[_COMMUNITY_Database Config|Database Config]]
- [[_COMMUNITY_Sidebar Tabs|Sidebar Tabs]]
- [[_COMMUNITY_Prisma Setup|Prisma Setup]]

## God Nodes (most connected - your core abstractions)
1. `Ghost AI` - 14 edges
2. `cn()` - 9 edges
3. `Node` - 8 edges
4. `getProjectWithAccess()` - 6 edges
5. `Dialog()` - 5 edges
6. `useProjectActions()` - 5 edges
7. `getOwnedProjects()` - 5 edges
8. `getSharedProjects()` - 5 edges
9. `Liveblocks + React Flow` - 5 edges
10. `GET()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `WorkspacePage()` --calls--> `getProjectWithAccess()`  [INFERRED]
  app/editor/[roomId]/page.tsx → lib/project-access.ts
- `GET()` --calls--> `enrichEmails()`  [INFERRED]
  app/api/projects/[projectId]/collaborators/route.ts → lib/clerk-users.ts
- `POST()` --calls--> `enrichEmails()`  [INFERRED]
  app/api/projects/[projectId]/collaborators/route.ts → lib/clerk-users.ts
- `POST()` --calls--> `getProjectWithAccess()`  [INFERRED]
  app/api/liveblocks-auth/route.ts → lib/project-access.ts
- `POST()` --calls--> `getLiveblocksClient()`  [INFERRED]
  app/api/liveblocks-auth/route.ts → lib/liveblocks.ts

## Hyperedges (group relationships)
- **Tech Stack Layers** — nextjs_16_typescript, tailwind_shadcn_ui, clerk, prisma_postgresql, liveblocks_react_flow, trigger_dev, vercel_blob [EXTRACTED 1.00]
- **Auth and Infrastructure** — auth_wiring, prisma_setup, project_apis, liveblocks_setup [EXTRACTED 1.00]
- **Canvas Components** — base_canvas, shape_panel, ui_context [EXTRACTED 1.00]
- **Project API CRUD Operations** — ProjectAPI, Project [EXTRACTED 0.75]
- **Shape Types** — Shape, Rectangle, Pill, Circle, Diamond, Hexagon, Cylinder [EXTRACTED 0.75]
- **User Metadata Fields** — UserMeta, cursor, isThinking [EXTRACTED 0.75]
- **Project Sidebar Tabs** — ProjectSidebar, ProjectDialogs, CreateProjectDialog [EXTRACTED 0.75]

## Communities (44 total, 5 thin omitted)

### Community 0 - "AI Workflow Architecture"
Cohesion: 0.09
Nodes (25): AI Generation Model, AI Workflow Rules, Architecture Context, Auth and Collaboration Model, Auth Wiring, Base Canvas, Clerk, Code Standards (+17 more)

### Community 1 - "Project Dialog Components"
Cohesion: 0.17
Nodes (4): toSlug(), Dialog(), DialogClose(), Input()

### Community 3 - "Editor Workspace Shell"
Cohesion: 0.22
Nodes (4): CanvasWrapper(), EditorHome(), WorkspaceShell(), useProjectActions()

### Community 4 - "Liveblocks & Canvas"
Cohesion: 0.18
Nodes (11): Canvas, Clerk, Edge, Liveblocks, Liveblocks Auth API, Presence, Project API, React Flow (+3 more)

### Community 5 - "Editor Pages & Access"
Cohesion: 0.39
Nodes (5): AccessDenied(), EditorPage(), getOwnedProjects(), getSharedProjects(), WorkspacePage()

### Community 6 - "Liveblocks Auth"
Cohesion: 0.39
Nodes (6): getCursorColor(), getLiveblocksClient(), hashCode(), getCurrentIdentity(), getProjectWithAccess(), POST()

### Community 7 - "Shape & Label Editing"
Cohesion: 0.22
Nodes (9): Color, Drag Preview, Ghost Preview, Inline Label Editing, Label, Node, Resize Handles, Shape (+1 more)

### Community 8 - "Project Management"
Cohesion: 0.29
Nodes (7): Create Project Dialog, Delete Project Dialog, Editor Navbar, Project, Project Collaborator, Rename Project Dialog, Share Dialog

### Community 9 - "Collaborators API"
Cohesion: 0.67
Nodes (4): GET(), POST(), resolveAccess(), enrichEmails()

## Knowledge Gaps
- **31 isolated node(s):** `Tailwind + shadcn/ui`, `Design System`, `Editor Workspace Shell`, `Project Overview`, `Architecture Context` (+26 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getProjectWithAccess()` connect `Liveblocks Auth` to `Editor Pages & Access`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **Why does `toSlug()` connect `Project Dialog Components` to `Editor Workspace Shell`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `getProjectWithAccess()` (e.g. with `POST()` and `WorkspacePage()`) actually correct?**
  _`getProjectWithAccess()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Tailwind + shadcn/ui`, `Design System`, `Editor Workspace Shell` to the rest of the system?**
  _31 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AI Workflow Architecture` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._
- **Should `UI Shell & Navigation` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._