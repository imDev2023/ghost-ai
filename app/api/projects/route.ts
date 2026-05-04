import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(projects);
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const name =
    typeof b?.name === "string" && b.name.trim() ? b.name.trim() : undefined;
  if (!name) {
    return Response.json({ error: "name is required" }, { status: 400 });
  }
  const id =
    typeof b?.id === "string" && b.id.trim() ? b.id.trim() : undefined;

  try {
    const project = await prisma.project.create({
      data: { ...(id ? { id } : {}), ownerId: userId, name },
    });
    return Response.json(project, { status: 201 });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "P2002") {
      return Response.json({ error: "Project ID already exists" }, { status: 409 });
    }
    throw err;
  }
}
