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

## Session Notes

- [Context needed to resume work in the next session]
