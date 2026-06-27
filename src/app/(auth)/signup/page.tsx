import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import { clerkAppearance } from "@/shared/lib";
import { ROUTES } from "@/shared/constants";
import AuthSplitLayout from "../_components/AuthSplitLayout";

export const metadata: Metadata = { title: "Create account — Project Genesis" };

const features = [
  { text: "Free to start — no credit card required" },
  { text: "Create your first AI employee in minutes, not months" },
  { text: "Train on your own documents, URLs, and content" },
  { text: "Semantic retrieval puts the right context in every response" },
  { text: "Chat persists — your AI remembers every conversation" },
];

const quote = {
  text:   "Our Sales AI books demos while we sleep. We went from 12 demos a week to 47 in the first month.",
  author: "Elena V.",
  role:   "CEO, SaasCo",
};

export default function SignupPage() {
  return (
    <AuthSplitLayout
      title="Create account"
      heading="Create your AI Workforce"
      subheading="Build AI employees in minutes. No engineers needed."
      headline={
        <>
          Build your AI{" "}
          <span className="bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent">
            Workforce
          </span>{" "}
          today.
        </>
      }
      description="Join thousands of businesses that use Project Genesis to run sales, support, content, SEO, email, and operations on autopilot."
      features={features}
      quote={quote}
      switchHref={ROUTES.AUTH.LOGIN}
      switchPrompt="Already have an account?"
      switchLabel="Sign in →"
    >
      <SignUp
        appearance={clerkAppearance}
        routing="hash"
        signInUrl={ROUTES.AUTH.LOGIN}
        fallbackRedirectUrl={ROUTES.APP.DASHBOARD}
      />
    </AuthSplitLayout>
  );
}
