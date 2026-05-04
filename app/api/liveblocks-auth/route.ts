import { currentUser } from "@clerk/nextjs/server";
import { getLiveblocksClient, getCursorColor } from "@/lib/liveblocks";
import { getProjectWithAccess } from "@/lib/project-access";

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { room } = await request.json();

  const { hasAccess } = await getProjectWithAccess(room);
  if (!hasAccess) return new Response("Forbidden", { status: 403 });

  const liveblocks = getLiveblocksClient();

  await liveblocks.getOrCreateRoom(room, { defaultAccesses: [] });

  const name =
    user.fullName ??
    user.firstName ??
    user.primaryEmailAddress?.emailAddress ??
    "Anonymous";
  const avatar = user.imageUrl ?? "";
  const color = getCursorColor(user.id);

  const session = liveblocks.prepareSession(user.id, {
    userInfo: { name, avatar, color },
  });
  session.allow(room, session.FULL_ACCESS);

  const { status, body } = await session.authorize();
  return new Response(body, { status });
}
