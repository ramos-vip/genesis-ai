/**
 * Password reset is handled by Clerk's SignIn component.
 * The "Forgot password?" link inside SignIn navigates to the reset flow.
 * This page serves as a direct entry point for reset-password deep links
 * from Clerk emails (Clerk appends its own token parameters).
 */
import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import { clerkAppearance } from "@/shared/lib";

export const metadata: Metadata = { title: "Reset password" };

export default function ResetPasswordPage() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-8">
      <SignIn
        appearance={clerkAppearance}
        routing="hash"
      />
    </div>
  );
}
