import Link from "next/link";
import { Lock } from "lucide-react";

export function AccessDenied() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-base text-center px-4">
      <Lock className="h-10 w-10 text-copy-faint" />
      <h1 className="text-xl font-semibold text-copy-primary">Access Denied</h1>
      <p className="text-copy-muted text-sm max-w-sm">
        This project doesn&apos;t exist or you don&apos;t have permission to view it.
      </p>
      <Link href="/editor" className="text-brand text-sm hover:underline">
        Back to editor
      </Link>
    </div>
  );
}
