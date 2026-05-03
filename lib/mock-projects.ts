export interface MockProject {
  id: string;
  name: string;
  slug: string;
  isOwned: boolean;
  updatedAt: string;
}

export const MOCK_OWNED_PROJECTS: MockProject[] = [
  {
    id: "proj_1",
    name: "E-commerce Platform",
    slug: "e-commerce-platform",
    isOwned: true,
    updatedAt: "2026-04-28",
  },
  {
    id: "proj_2",
    name: "Social Media App",
    slug: "social-media-app",
    isOwned: true,
    updatedAt: "2026-04-20",
  },
];

export const MOCK_SHARED_PROJECTS: MockProject[] = [
  {
    id: "proj_3",
    name: "Startup Backend",
    slug: "startup-backend",
    isOwned: false,
    updatedAt: "2026-04-25",
  },
];
