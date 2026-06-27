import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import { clerkAppearance } from "@/shared/lib";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-8">
      <SignIn
        appearance={clerkAppearance}
        routing="hash"
      />
    </div>
  );
}
