import { clerkClient } from "@clerk/nextjs/server";

export interface ClerkUserInfo {
  name: string | null;
  avatar: string | null;
}

export async function enrichEmails(
  emails: string[]
): Promise<Map<string, ClerkUserInfo>> {
  if (emails.length === 0) return new Map();

  const client = await clerkClient();
  const { data } = await client.users.getUserList({
    emailAddress: emails,
    limit: 100,
  });

  const map = new Map<string, ClerkUserInfo>();
  for (const user of data) {
    const email =
      user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
        ?.emailAddress ?? user.emailAddresses[0]?.emailAddress;
    if (email) {
      map.set(email, {
        name:
          [user.firstName, user.lastName].filter(Boolean).join(" ") || null,
        avatar: user.imageUrl || null,
      });
    }
  }
  return map;
}
