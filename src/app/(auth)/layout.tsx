import Link from "next/link";
import { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ROUTES } from "@/shared/constants";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  // Authenticated users have no business being on login/signup pages
  const { userId } = await auth();
  if (userId) redirect(ROUTES.APP.DASHBOARD);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal auth header */}
      <header className="flex items-center justify-between h-16 px-6 border-b border-border">
        <Link
          href={ROUTES.HOME}
          className="flex items-center gap-2 focus-ring rounded-lg"
        >
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-white" aria-hidden>
              <path d="M8 1L10.5 6H15L11 9.5L12.5 15L8 12L3.5 15L5 9.5L1 6H5.5L8 1Z" fill="currentColor" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-white">Project Genesis</span>
        </Link>
      </header>

      {/* Centered form card */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-text-muted">
        © {new Date().getFullYear()} Project Genesis.{" "}
        <Link href="#" className="hover:text-text-secondary transition-colors">Privacy</Link>
        {" · "}
        <Link href="#" className="hover:text-text-secondary transition-colors">Terms</Link>
      </footer>
    </div>
  );
}
