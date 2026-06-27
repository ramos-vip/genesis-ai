import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import { clerkAppearance } from "@/shared/lib";
import { ROUTES } from "@/shared/constants";
import AuthSplitLayout from "../_components/AuthSplitLayout";

export const metadata: Metadata = { title: "Log in — Project Genesis" };

const features = [
  { text: "Deploy your first AI employee in under 5 minutes" },
  { text: "6 specialized roles: Sales, Support, Content, SEO, Email & Ops" },
  { text: "Powered by Gemini 2.5 Flash — real-time streaming responses" },
  { text: "RAG-powered knowledge base with semantic retrieval" },
  { text: "Full conversation history and persistent memory" },
];

const quote = {
  text:   "We tripled our content output in the first week. The AI writes in our exact brand voice.",
  author: "Marcus R.",
  role:   "Head of Marketing, GrowthCo",
};

export default function LoginPage() {
  return (
    <AuthSplitLayout
      title="Log in"
      heading="Welcome back"
      subheading="Sign in to your Genesis AI account to continue."
      headline={
        <>
          Your AI workforce{" "}
          <span className="bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent">
            is waiting.
          </span>
        </>
      }
      description="Thousands of teams use Project Genesis to automate their sales, support, content, and operations with AI employees that never sleep."
      features={features}
      quote={quote}
      switchHref={ROUTES.AUTH.SIGNUP}
      switchPrompt="Don't have an account?"
      switchLabel="Start for free →"
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
