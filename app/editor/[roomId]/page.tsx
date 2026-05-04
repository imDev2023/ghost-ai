import { redirect } from "next/navigation";
import { getProjectWithAccess } from "@/lib/project-access";
import { getOwnedProjects, getSharedProjects } from "@/lib/projects";
import { AccessDenied } from "@/components/editor/access-denied";
import { WorkspaceShell } from "@/components/editor/workspace-shell";

interface Props {
  params: Promise<{ roomId: string }>;
}

export default async function WorkspacePage({ params }: Props) {
  const { roomId } = await params;
  const { project, hasAccess, userId } = await getProjectWithAccess(roomId);

  if (!userId) redirect("/sign-in");
  if (!project || !hasAccess) return <AccessDenied />;

  const isOwner = project.ownerId === userId;

  const [ownedProjects, sharedProjects] = await Promise.all([
    getOwnedProjects(),
    getSharedProjects(),
  ]);

  return (
    <WorkspaceShell
      projectName={project.name}
      roomId={roomId}
      isOwner={isOwner}
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
    />
  );
}
