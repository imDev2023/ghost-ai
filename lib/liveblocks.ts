import { Liveblocks } from "@liveblocks/node";

const CURSOR_COLORS = [
  "#FF4D4D",
  "#FF7A00",
  "#FFD600",
  "#00CC88",
  "#00AAFF",
  "#7B61FF",
  "#FF6B9D",
  "#00D2D2",
  "#FF8C42",
  "#B026FF",
];

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function getCursorColor(userId: string): string {
  return CURSOR_COLORS[hashCode(userId) % CURSOR_COLORS.length];
}

const globalForLiveblocks = global as typeof global & {
  liveblocks?: Liveblocks;
};

export function getLiveblocksClient(): Liveblocks {
  if (!globalForLiveblocks.liveblocks) {
    globalForLiveblocks.liveblocks = new Liveblocks({
      secret: process.env.LIVEBLOCKS_SECRET_KEY!,
    });
  }
  return globalForLiveblocks.liveblocks;
}
