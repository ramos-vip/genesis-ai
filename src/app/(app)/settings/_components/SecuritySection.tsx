"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter }         from "next/navigation";
import { useState }          from "react";
import Button  from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { useToast } from "@/shared/providers";
import { ROUTES }   from "@/shared/constants";
import { formatDate } from "@/shared/utils";

export default function SecuritySection() {
  const { user }        = useUser();
  const { signOut }     = useClerk();
  const router          = useRouter();
  const { toast }       = useToast();
  const [signing, setSigning] = useState(false);

  const emailVerified = user?.primaryEmailAddress?.verification?.status === "verified";
  const createdAt     = user?.createdAt ? formatDate(new Date(user.createdAt).toISOString(), "medium") : "—";

  async function handleSignOutAll() {
    setSigning(true);
    try {
      await signOut({ redirectUrl: ROUTES.AUTH.LOGIN });
      router.push(ROUTES.AUTH.LOGIN);
    } catch {
      toast.error("Failed to sign out.");
      setSigning(false);
    }
  }

  return (
    <div className="space-y-4" id="security">
      {/* Account security */}
      <div className="rounded-2xl border border-border bg-surface overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-white">Security</h3>
          <p className="text-xs text-text-muted mt-0.5">Account security and active sessions.</p>
        </div>

        <div className="px-6 divide-y divide-border">
          {/* Email verification */}
          <div className="flex items-center justify-between gap-6 py-4">
            <div>
              <p className="text-sm font-medium text-text-primary">Email verification</p>
              <p className="text-xs text-text-muted mt-0.5">
                {user?.primaryEmailAddress?.emailAddress ?? "No email set"}
              </p>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
              emailVerified
                ? "text-success bg-success/10 border-success/20"
                : "text-warning bg-warning/10 border-warning/20"
            }`}>
              {emailVerified ? "Verified" : "Unverified"}
            </span>
          </div>

          {/* Account created */}
          <div className="flex items-center justify-between gap-6 py-4">
            <div>
              <p className="text-sm font-medium text-text-primary">Account created</p>
              <p className="text-xs text-text-muted mt-0.5">Date your account was registered</p>
            </div>
            <span className="text-sm text-text-secondary">{createdAt}</span>
          </div>

          {/* 2FA */}
          <div className="flex items-center justify-between gap-6 py-4">
            <div>
              <p className="text-sm font-medium text-text-primary">Two-factor authentication</p>
              <p className="text-xs text-text-muted mt-0.5">Add an extra layer of security to your account</p>
            </div>
            <span className="text-xs font-semibold text-text-muted border border-border rounded-full px-2.5 py-1">
              Manage in Clerk
            </span>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border border-danger-border bg-danger-bg p-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-semibold text-danger mb-1">Sign out everywhere</p>
            <p className="text-xs text-text-secondary leading-relaxed">
              Immediately sign out of all active sessions across all devices.
            </p>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={handleSignOutAll}
            disabled={signing}
            className="shrink-0"
          >
            {signing ? <Spinner size="xs" color="danger" /> : null}
            {signing ? "Signing out…" : "Sign out all"}
          </Button>
        </div>
      </div>
    </div>
  );
}
