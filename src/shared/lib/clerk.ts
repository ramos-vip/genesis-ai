/**
 * Clerk Appearance Configuration
 *
 * - header is hidden: each page provides its own custom heading above <SignIn>/<SignUp>
 *   This eliminates the generic "Sign in to My Application" text.
 * - All elements styled with Genesis design tokens (violet accent, dark surfaces).
 */

export const clerkAppearance = {
  variables: {
    colorPrimary:          "#7c3aed",
    colorBackground:       "#07070a",
    colorDanger:           "#f87171",
    colorSuccess:          "#4ade80",
    colorWarning:          "#fbbf24",
    colorNeutral:          "#71717a",
    colorInputText:        "#f0f0f2",
    colorBorder:           "rgba(255, 255, 255, 0.08)",
    borderRadius:          "10px",
    fontFamily:            "inherit",
    fontSize:              "14px",
    fontWeight:            { normal: 400, medium: 500, bold: 600 } as const,
    spacingUnit:           "16px",
  },

  elements: {
    // ── Container resets ──────────────────────────────────────────────────
    rootBox:    "w-full",
    card:       "bg-transparent shadow-none border-none p-0 w-full",
    cardBox:    "w-full",

    // ── Hide Clerk's generic "Sign in to My Application" header ───────────
    // Each page renders its own branded heading above the component.
    header:         "hidden",
    headerTitle:    "hidden",
    headerSubtitle: "hidden",

    // ── Social buttons (Google, GitHub, etc.) ────────────────────────────
    socialButtonsBlockButton: [
      "bg-[#0d0d12] border border-[rgba(255,255,255,0.1)] text-[#f0f0f2]",
      "text-sm font-medium h-11 rounded-xl",
      "hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.16)]",
      "transition-all duration-150 gap-3",
    ].join(" "),
    socialButtonsBlockButtonText:  "font-medium",
    socialButtonsBlockButtonArrow: "hidden",

    // ── Divider ───────────────────────────────────────────────────────────
    dividerRow:  "my-6",
    dividerLine: "bg-[rgba(255,255,255,0.06)]",
    dividerText: "text-xs text-[#52525b] px-3 font-medium tracking-wider uppercase",

    // ── Form fields ───────────────────────────────────────────────────────
    formFieldRow:   "mb-4",
    formFieldLabel: "text-sm font-medium text-[#d4d4d8] mb-2 block",
    formFieldInput: [
      "bg-[#0d0d12] border border-[rgba(255,255,255,0.09)] text-[#f0f0f2]",
      "text-sm rounded-xl h-11 px-4 w-full",
      "placeholder:text-[#52525b] outline-none",
      "focus:border-[rgba(124,58,237,0.7)] focus:ring-2 focus:ring-[rgba(124,58,237,0.2)]",
      "hover:border-[rgba(255,255,255,0.15)]",
      "transition-all duration-150",
    ].join(" "),
    formFieldErrorText:               "text-xs text-[#f87171] mt-1.5 flex items-center gap-1",
    formFieldHintText:                "text-xs text-[#71717a] mt-1",
    formFieldInputShowPasswordButton: "text-[#71717a] hover:text-[#f0f0f2] transition-colors p-2",

    // ── Primary CTA button ────────────────────────────────────────────────
    formButtonPrimary: [
      "bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm font-semibold",
      "h-11 rounded-xl w-full transition-all duration-150",
      "shadow-[0_0_24px_rgba(124,58,237,0.25)] hover:shadow-[0_0_32px_rgba(124,58,237,0.4)]",
      "focus:outline-none focus:ring-2 focus:ring-[rgba(124,58,237,0.4)] focus:ring-offset-2 focus:ring-offset-[#07070a]",
    ].join(" "),

    // ── Secondary / reset buttons ─────────────────────────────────────────
    formButtonReset: "text-[#71717a] hover:text-[#f0f0f2] text-sm font-medium transition-colors",

    // ── Footer links ──────────────────────────────────────────────────────
    footerActionText: "text-sm text-[#71717a]",
    footerActionLink: "text-sm font-semibold text-[#7c3aed] hover:text-[#a78bfa] transition-colors",

    // ── Alert / error states ──────────────────────────────────────────────
    alert:     "bg-[rgba(248,113,113,0.08)] border border-[rgba(248,113,113,0.2)] rounded-xl p-4",
    alertText: "text-sm text-[#f87171]",

    // ── Identity preview (step 2+) ────────────────────────────────────────
    identityPreviewText:       "text-sm text-[#71717a]",
    identityPreviewEditButton: "text-[#7c3aed] hover:text-[#a78bfa] text-sm font-medium transition-colors",

    // ── OTP / verification code inputs ────────────────────────────────────
    otpCodeFieldInput: [
      "bg-[#0d0d12] border border-[rgba(255,255,255,0.09)] text-[#f0f0f2]",
      "rounded-xl text-lg font-semibold text-center",
      "focus:border-[rgba(124,58,237,0.7)] focus:ring-2 focus:ring-[rgba(124,58,237,0.2)]",
      "transition-all duration-150",
    ].join(" "),

    // ── Navbar (for multi-step flows) ─────────────────────────────────────
    navbarButton:     "text-sm text-[#71717a] hover:text-[#f0f0f2] transition-colors rounded-lg px-3 py-2 hover:bg-[rgba(255,255,255,0.05)]",
    navbarButtonIcon: "text-[#71717a]",

    // ── Back button in multi-step ─────────────────────────────────────────
    backLink: "text-sm text-[#71717a] hover:text-[#f0f0f2] flex items-center gap-1.5 transition-colors",
  },
} as const;

export type ClerkAppearance = typeof clerkAppearance;
