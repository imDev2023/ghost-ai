import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// pg v9 will change semantics of 'prefer'/'require'/'verify-ca' — lock in current behavior now.
function toVerifyFull(url: string): string {
  return url.replace(/([?&]sslmode=)(prefer|require|verify-ca)(?=&|$)/, "$1verify-full");
}

// Set PG_FORCE_VERIFY_FULL=true to opt in to rewriting sslmode → verify-full.
function createClient(): PrismaClient {
  const url = process.env.DATABASE_URL ?? "";
  if (url.startsWith("prisma+postgres://")) {
    return new PrismaClient({ accelerateUrl: url });
  }
  const connectionString = process.env.PG_FORCE_VERIFY_FULL ? toVerifyFull(url) : url;
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
