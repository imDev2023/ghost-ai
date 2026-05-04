import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { enrichEmails } from "@/lib/clerk-users";

async function resolveAccess(projectId: string) {
  const { userId } = await auth();
  if (!userId) return { userId: null, project: null };

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return { userId, project: null };

  return { userId, project };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const { userId, project } = await resolveAccess(projectId);

  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!project) return Response.json({ error: "Not found" }, { status: 404 });

  // Check access: owner or collaborator
  const isOwner = project.ownerId === userId;
  if (!isOwner) {
    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;
    const collab = email
      ? await prisma.projectCollaborator.findUnique({
          where: { projectId_email: { projectId, email } },
        })
      : null;
    if (!collab) return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const collaborators = await prisma.projectCollaborator.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
  });

  const emails = collaborators.map((c) => c.email);
  const clerkMap = await enrichEmails(emails).catch(() => new Map());

  const client = await clerkClient();
  let ownerEntry: { email: string; name: string | null; avatar: string | null; role: "owner" } | null = null;
  try {
    const ownerUser = await client.users.getUser(project.ownerId);
    const email =
      ownerUser.primaryEmailAddress?.emailAddress ??
      ownerUser.emailAddresses[0]?.emailAddress ??
      "";
    ownerEntry = {
      email,
      name: [ownerUser.firstName, ownerUser.lastName].filter(Boolean).join(" ") || null,
      avatar: ownerUser.imageUrl || null,
      role: "owner",
    };
  } catch {
    // owner lookup failed — omit from list
  }

  const result = [
    ...(ownerEntry ? [ownerEntry] : []),
    ...collaborators.map((c) => ({
      email: c.email,
      name: clerkMap.get(c.email)?.name ?? null,
      avatar: clerkMap.get(c.email)?.avatar ?? null,
      role: "collaborator" as const,
    })),
  ];

  return Response.json(result);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const { userId, project } = await resolveAccess(projectId);

  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!project) return Response.json({ error: "Not found" }, { status: 404 });
  if (project.ownerId !== userId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const email =
    typeof body?.email === "string" && body.email.trim()
      ? body.email.trim().toLowerCase()
      : null;

  if (!email) return Response.json({ error: "email is required" }, { status: 400 });

  const existing = await prisma.projectCollaborator.findUnique({
    where: { projectId_email: { projectId, email } },
  });
  if (existing) return Response.json({ error: "Already a collaborator" }, { status: 409 });

  try {
    await prisma.projectCollaborator.create({ data: { projectId, email } });
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("Unique constraint")) {
      return Response.json({ error: "Already a collaborator" }, { status: 409 });
    }
    throw err;
  }

  const clerkMap = await enrichEmails([email]).catch(() => new Map());

  return Response.json(
    {
      email,
      name: clerkMap.get(email)?.name ?? null,
      avatar: clerkMap.get(email)?.avatar ?? null,
    },
    { status: 201 }
  );
}
