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
