import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getCurrentIdentity() {
  const { userId } = await auth();
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? null;
  return { userId, email };
}

export async function getProjectWithAccess(roomId: string) {
  const { userId, email } = await getCurrentIdentity();
  if (!userId) return { project: null, hasAccess: false, userId: null };

  const project = await prisma.project.findUnique({
    where: { id: roomId },
    include: {
      collaborators: email ? { where: { email } } : false,
    },
  });

  if (!project) return { project, hasAccess: false, userId };

  const isOwner = project.ownerId === userId;
  const isCollaborator = email ? (project.collaborators?.length ?? 0) > 0 : false;
  const hasAccess = isOwner || isCollaborator;

  return { project, hasAccess, userId };
}
