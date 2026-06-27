import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import { clerkAppearance } from "@/shared/lib";
import { ROUTES } from "@/shared/constants";
import AuthSplitLayout from "../_components/AuthSplitLayout";

export const metadata: Metadata = { title: "Reset password — Project Genesis" };

const features = [
  { text: "Secure password reset via verified email" },
  { text: "Your AI employees keep running while you reset" },
  { text: "Enterprise-grade account security" },
];

export default function ResetPasswordPage() {
  return (
    <AuthSplitLayout
      title="Reset password"
      heading="Reset your password"
      subheading="Enter your email and we'll send you a secure reset link."
      headline={
        <>
          Back in a{" "}
          <span className="bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent">
            moment.
          </span>
        </>
      }
      description="Forgot your password? No worries. Your AI workforce stays active while you get back in."
      features={features}
      switchHref={ROUTES.AUTH.LOGIN}
      switchPrompt="Remember your password?"
      switchLabel="Back to sign in →"
    >
      <SignIn
        appearance={clerkAppearance}
        routing="hash"
        signUpUrl={ROUTES.AUTH.SIGNUP}
        fallbackRedirectUrl={ROUTES.APP.DASHBOARD}
      />
    </AuthSplitLayout>
  );
}
