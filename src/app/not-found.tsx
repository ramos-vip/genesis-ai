import Link from "next/link";
import { ROUTES } from "@/shared/constants";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      {/* Glowing 404 */}
      <div className="relative mb-8">
        <p className="text-[120px] sm:text-[160px] font-bold leading-none text-surface-elevated select-none">
          404
        </p>
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-center text-[120px] sm:text-[160px] font-bold leading-none text-transparent bg-gradient-to-b from-text-muted to-transparent bg-clip-text select-none"
        >
          404
        </div>
      </div>

      <h1 className="text-2xl font-bold text-white mb-3">Page not found</h1>
      <p className="text-sm text-text-secondary max-w-sm leading-relaxed mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <div className="flex items-center gap-3">
        <Link
          href={ROUTES.HOME}
          className="inline-flex items-center justify-center h-10 px-5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
        >
          Go home
        </Link>
        <Link
          href={ROUTES.APP.DASHBOARD}
          className="inline-flex items-center justify-center h-10 px-5 rounded-lg border border-border bg-surface text-text-secondary text-sm font-medium hover:text-text-primary hover:border-border-hover transition-all"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
