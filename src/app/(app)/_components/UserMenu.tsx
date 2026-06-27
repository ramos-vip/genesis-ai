"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useClickOutside } from "@/shared/hooks";
import { ROUTES } from "@/shared/constants";
import Spinner from "@/components/ui/Spinner";

export default function UserMenu() {
  const { user, isLoaded } = useUser();
  const { signOut }        = useClerk();
  const router             = useRouter();
  const [open, setOpen]    = useState(false);
  const [signing, setSigning] = useState(false);
  const containerRef       = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setOpen(false));

  async function handleSignOut() {
    setSigning(true);
    await signOut();
    router.push(ROUTES.AUTH.LOGIN);
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center gap-2 px-2 py-1.5">
        <div className="w-7 h-7 rounded-full bg-surface-elevated animate-pulse" />
      </div>
    );
  }

  const displayName  = user?.fullName ?? user?.username ?? "User";
  const email        = user?.primaryEmailAddress?.emailAddress ?? "";
  const avatarUrl    = user?.imageUrl;
  const initials     = displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/[0.05] transition-all focus-ring"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="User menu"
      >
        {/* Avatar */}
        <div className="w-7 h-7 rounded-full overflow-hidden bg-violet-700 flex items-center justify-center shrink-0 border border-border">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <span className="text-xs font-semibold text-white">{initials}</span>
          )}
        </div>

        {/* Name (hidden on mobile) */}
        <span className="hidden sm:block text-sm font-medium text-text-primary max-w-[120px] truncate">
          {displayName}
        </span>

        <svg
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={`hidden sm:block w-3 h-3 text-text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-surface-elevated shadow-[0_10px_15px_rgba(0,0,0,0.4)] animate-scale-in z-dropdown"
        >
          {/* User identity header */}
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-medium text-text-primary truncate">{displayName}</p>
            <p className="text-xs text-text-muted truncate mt-0.5">{email}</p>
          </div>

          {/* Navigation items */}
          <div className="p-1">
            <button
              role="menuitem"
              onClick={() => { setOpen(false); router.push(ROUTES.APP.SETTINGS.PROFILE); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-white/[0.05] rounded-lg transition-colors text-left"
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 shrink-0" aria-hidden>
                <circle cx="8" cy="5.5" r="2.5" />
                <path d="M2 13.5a6 6 0 0112 0" strokeLinecap="round" />
              </svg>
              Profile
            </button>

            <button
              role="menuitem"
              onClick={() => { setOpen(false); router.push(ROUTES.APP.SETTINGS.ROOT); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-white/[0.05] rounded-lg transition-colors text-left"
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 shrink-0" aria-hidden>
                <circle cx="8" cy="8" r="2" />
                <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06" strokeLinecap="round" />
              </svg>
              Settings
            </button>

            <button
              role="menuitem"
              onClick={() => { setOpen(false); router.push(ROUTES.APP.BILLING.ROOT); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-white/[0.05] rounded-lg transition-colors text-left"
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 shrink-0" aria-hidden>
                <rect x="1" y="4" width="14" height="9" rx="1.5" />
                <path d="M1 7.5h14" strokeLinecap="round" />
              </svg>
              Billing
            </button>
          </div>

          {/* Sign out */}
          <div className="p-1 border-t border-border">
            <button
              role="menuitem"
              onClick={handleSignOut}
              disabled={signing}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-danger hover:bg-danger-bg rounded-lg transition-colors text-left disabled:opacity-50"
            >
              {signing ? (
                <Spinner size="xs" color="danger" />
              ) : (
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 shrink-0" aria-hidden>
                  <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {signing ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
