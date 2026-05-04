# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Complete

## Current Goal

- Auth wiring implemented successfully

## Completed

- Design system setup (feature-specs/01-design-system.md)
  - Installed and configured shadcn/ui
  - Added all required components: Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea
  - Installed lucide-react icon library
  - Created lib/utils.ts with cn() helper function
  - Configured dark theme by default in app/layout.tsx
  - Created components/ui/index.ts for convenient component imports
  - Verified build succeeds without errors

- Editor chrome components (feature-specs/02-editor.md)
  - Added custom CSS color tokens to globals.css for app-specific theming
  - Created components/editor/editor-navbar.tsx with sidebar toggle
  - Created components/editor/project-sidebar.tsx with tabs and empty states
  - Dialog pattern ready for future use (from previous feature)
  - Verified TypeScript build succeeds without errors

- Project dialogs and editor home (feature-specs/04-project-dialogs.md)
  - Editor home: centered heading, description, and New Project button
  - Created lib/mock-projects.ts with owned and shared mock data
  - Created hooks/use-project-dialogs.ts managing dialog, form, and loading state
  - Create Project dialog: name input, live slug preview, Enter submits
  - Rename Project dialog: prefilled input, current name in description, auto-focus, Enter submits
  - Delete Project dialog: destructive confirm only, no input
  - Sidebar project items with hover-revealed rename/delete actions (owned only)
  - Shared projects show no actions
  - Mobile backdrop scrim on sidebar
  - All wiring: editor home → Create, sidebar footer → Create, sidebar item → Rename/Delete
  - npm run build and lint pass with no errors

- Auth wiring (feature-specs/03-auth.md)
  - Installed @clerk/ui for dark theme support
  - Wrapped root layout with ClerkProvider using dark theme from @clerk/ui/themes
  - Overrode Clerk appearance variables with app CSS custom properties (no hardcoded colors)
  - Created proxy.ts at project root (Next.js 16 middleware replacement)
  - All routes protected by default via clerkMiddleware; sign-in and sign-up are public
  - Public routes derived from NEXT_PUBLIC_CLERK_SIGN_IN_URL and NEXT_PUBLIC_CLERK_SIGN_UP_URL env vars
  - Created app/(auth)/sign-in/[[...sign-in]]/page.tsx with two-panel layout
  - Created app/(auth)/sign-up/[[...sign-up]]/page.tsx with two-panel layout
  - Auth pages: left panel (logo, tagline, feature list) hidden on mobile; right panel: Clerk form
  - Updated app/page.tsx: authenticated users redirect to /editor, unauthenticated to /sign-in
  - Added UserButton to editor navbar right section
  - Added NEXT_PUBLIC_CLERK_SIGN_IN_URL and NEXT_PUBLIC_CLERK_SIGN_UP_URL to .env.local
  - npm run build passes

- Prisma schema and client (feature-specs/05-prisma.md)
  - Created prisma/models/project.prisma with Project and ProjectCollaborator models
  - Project: ownerId (Clerk), name, optional description, DRAFT/ARCHIVED status enum, canvasJsonPath, timestamps, indexes on ownerId and createdAt
  - ProjectCollaborator: composite PK on (projectId, email), cascade-delete relation to Project, createdAt, indexes on email and (projectId, createdAt)
  - Created lib/prisma.ts as a dev-cached singleton; branches on prisma+postgres:// (Accelerate via accelerateUrl) vs direct @prisma/adapter-pg
  - Ran first migration (20260503044120_init) successfully against Prisma Postgres database
  - Generated Prisma client to app/generated/prisma/
  - Fixed pre-existing npm run build failure caused by __NEXT_PRIVATE_STANDALONE_CONFIG being set in the host environment; build script now unsets it before invoking next build

- Project APIs (feature-specs/06-project-apis.md)
  - Created app/api/projects/route.ts: GET lists current user's projects ordered by createdAt desc; POST creates a project (defaults name to "Untitled Project")
  - Created app/api/projects/[projectId]/route.ts: PATCH renames a project (owner-only); DELETE removes a project (owner-only)
  - 401 returned when no authenticated userId; 403 returned when userId !== project.ownerId
  - params awaited as Promise per Next.js 16 route handler convention
  - npm run build passes

- Editor home wiring (feature-specs/07-wire-editor-home.md)
  - Created lib/projects.ts: getOwnedProjects() and getSharedProjects() server helpers; shared Project interface with isOwned field
  - Created hooks/use-project-actions.ts: manages dialog state + real API mutations; replaces mock use-project-dialogs.ts
  - Create: generates roomId as `${toSlug(name)}-${shortSuffix()}`, POSTs to /api/projects with id, navigates to /editor/[roomId]
  - Rename: PATCHes /api/projects/[id], calls router.refresh() on success
  - Delete: DELETEs /api/projects/[id]; redirects to /editor if active workspace, otherwise router.refresh()
  - Updated POST /api/projects to accept an optional client-provided id (keeps project ID and Liveblocks room ID aligned)
  - Created components/editor/editor-home.tsx: client shell that receives ownedProjects + sharedProjects as props
  - Converted app/editor/page.tsx to a server component; fetches both project lists server-side, no client-side fetch on initial load
  - Updated project-sidebar.tsx: accepts ownedProjects/sharedProjects as props; shows project.id as room ID in mono; removed mock imports
  - Updated all three dialogs: swapped MockProject → Project from lib/projects; create dialog shows "Room ID:" preview
  - npm run build passes

- Editor workspace shell (feature-specs/08-editor-workspace-shell.md)
  - Created lib/project-access.ts: getCurrentIdentity() returns userId + primary email; getProjectWithAccess(roomId) checks owner or collaborator access
  - Created components/editor/access-denied.tsx: centered layout with lock icon, message, and link back to /editor
  - Updated components/editor/editor-navbar.tsx: added optional projectName (center), Share button placeholder, and AI sidebar toggle button
  - Updated components/editor/project-sidebar.tsx: added optional activeRoomId prop; active item rendered with subtle ring highlight
  - Created components/editor/workspace-shell.tsx: client shell managing sidebar + AI sidebar state, reuses ProjectSidebar and EditorNavbar with workspace props, canvas and AI sidebar placeholders
  - Created app/editor/[roomId]/page.tsx: server component; redirects unauthenticated users to /sign-in; shows AccessDenied for missing or unauthorized projects; passes project name and room data to WorkspaceShell
  - npm run build passes

- Share dialog (feature-specs/09-share-dialog.md)
  - Created lib/clerk-users.ts: enrichEmails() batches email → Clerk user lookup, returns Map<email, {name, avatar}>; falls back gracefully on Clerk errors
  - Created GET /api/projects/[projectId]/collaborators: checks owner-or-collaborator access, returns enriched collaborator list
  - Created POST /api/projects/[projectId]/collaborators: owner-only; validates email, returns 409 on duplicate, returns enriched collaborator on 201
  - Created DELETE /api/projects/[projectId]/collaborators/[email]: owner-only; URL-decodes email param, silently no-ops on missing record, returns 204
  - Created components/editor/dialogs/share-dialog.tsx: fetches collaborators on open; owners see invite input + remove buttons; collaborators see read-only list; Clerk avatars rendered with a plain img tag; Copy link button with 2s "Copied!" feedback
  - Updated EditorNavbar: added onShare prop; Share button now calls onShare instead of being disabled
  - Updated WorkspaceShell: added isOwner prop; added isShareOpen state; passes onShare to navbar; renders ShareDialog
  - Updated app/editor/[roomId]/page.tsx: computes isOwner = project.ownerId === userId; passes isOwner to WorkspaceShell
  - npm run build passes

- Liveblocks setup (feature-specs/10-liveblocks-setup.md)
  - Installed @liveblocks/node (was missing; all other Liveblocks packages were pre-installed)
  - Updated liveblocks.config.ts: Presence (cursor x/y + isThinking), UserMeta (id, info: name/avatar/color)
  - Created lib/liveblocks.ts: lazy cached Liveblocks node client via getLiveblocksClient(); getCursorColor() deterministically maps userId to a fixed 10-color palette using djb2 hash
  - Created POST /api/liveblocks-auth: requires Clerk auth, verifies project access via getProjectWithAccess(), calls getOrCreateRoom() to ensure room exists, issues access token scoped to that room with name/avatar/color in userInfo
  - Added LIVEBLOCKS_SECRET_KEY placeholder to .env.local (must be filled with real key from Liveblocks dashboard)
  - npm run build passes

- Base canvas (feature-specs/11-base-canvas.md)
  - Created types/canvas.ts: CanvasNodeData (label, color?, shape?), CanvasNode (Node<CanvasNodeData, "canvasNode">), CanvasEdge (Edge<Record<string,unknown>, "canvasEdge">)
  - Created components/editor/canvas.tsx: useLiveblocksFlow<CanvasNode, CanvasEdge> with suspense:true, empty initial nodes/edges; ReactFlow with ConnectionMode.Loose, fitView, MiniMap, Background (dots)
  - Created components/editor/canvas-wrapper.tsx: LiveblocksProvider (/api/liveblocks-auth) → RoomProvider (initialPresence cursor:null, isThinking:false) → ErrorBoundary → ClientSideSuspense → Canvas; CSS imports for xyflow, liveblocks-react-ui, liveblocks-react-flow
  - Updated workspace-shell.tsx: replaced canvas placeholder with CanvasWrapper, passing roomId
  - Installed react-error-boundary
  - npm run build passes

- Shape panel (feature-specs/12-shape-panel.md)
  - Updated types/canvas.ts: added CanvasShape union (rectangle|diamond|circle|pill|cylinder|hexagon), ShapeDragPayload interface, tightened shape field from string to CanvasShape
  - Created components/editor/nodes/canvas-node.tsx: custom node renderer (CanvasFlowNode) — bordered rectangle with centered label, top/bottom Handles, ring highlight when selected; uses width/height from NodeProps for sizing
  - Created components/editor/shape-panel.tsx: floating pill toolbar with 6 draggable icon buttons (RectangleHorizontal/Diamond/Circle/Pill/Cylinder/Hexagon from lucide-react); drag start sets application/json payload with shape name and default dimensions (rectangle 160x80, diamond 120x120, circle 80x80, pill 160x60, cylinder 100x100, hexagon 100x100)
  - Updated components/editor/canvas.tsx: split into Canvas (ReactFlowProvider wrapper) and CanvasInner (useLiveblocksFlow + useReactFlow); added onDragOver (preventDefault, dropEffect=copy) and onDrop (parse payload, screenToFlowPosition centered at cursor, onNodesChange add with type canvasNode); nodeTypes registered; ShapePanel in Panel position=bottom-center
  - Node IDs generated as shape-timestamp-counter
  - npm run build passes

## In Progress

- None

## Next Up

- Awaiting next feature specification

## Open Questions

- [Any unresolved product or technical decisions]

## Architecture Decisions

- proxy.ts uses the Next.js 16 file convention (renamed from middleware.ts); exports `proxy` as the named function — Clerk's clerkMiddleware() return value is assigned to `proxy`
- Auth pages use a route group (auth) so the URL paths remain /sign-in and /sign-up without a segment prefix
- Appearance variables reference CSS custom properties defined in globals.css; Clerk injects them as CSS vars on its container element
- ProjectCollaborator uses a composite @@id([projectId, email]) instead of a surrogate key; satisfies the unique constraint requirement without an extra field
- lib/prisma.ts branches on prisma+postgres:// for Accelerate vs @prisma/adapter-pg for direct TCP; global cache prevents multiple client instances during hot reloads
- __NEXT_PRIVATE_STANDALONE_CONFIG set in the host shell (from another project's standalone deployment) caused Next.js to skip config loading and use stale JSON — fixed by unsetting it in the build script

## Session Notes

- [Context needed to resume work in the next session]
