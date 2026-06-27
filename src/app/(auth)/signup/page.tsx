import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import { clerkAppearance } from "@/shared/lib";

export const metadata: Metadata = { title: "Create account" };

export default function SignupPage() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-8">
      <SignUp
        appearance={clerkAppearance}
        routing="hash"
      />
    </div>
  );
}
