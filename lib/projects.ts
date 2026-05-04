import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export interface Project {
  id: string;
  name: string;
  isOwned: boolean;
}

export async function getOwnedProjects(): Promise<Project[]> {
  const { userId } = await auth();
  if (!userId) return [];

  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true },
  });

  return projects.map((p) => ({ ...p, isOwned: true }));
}

export async function getSharedProjects(): Promise<Project[]> {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  if (!email) return [];

  const collaborations = await prisma.projectCollaborator.findMany({
    where: { email },
    include: { project: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return collaborations.map((c) => ({ ...c.project, isOwned: false }));
}
