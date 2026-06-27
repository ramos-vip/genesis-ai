/**
 * Clerk Appearance Configuration
 *
 * Customises Clerk's embedded components to match the Genesis design system.
 * Applied via the `appearance` prop on ClerkProvider, SignIn, and SignUp.
 *
 * Typed via ComponentProps inference — validated at each call-site.
 */

// Only valid Clerk Variables keys are used here.
// Invalid keys would cause TypeScript errors when passed to ClerkProvider.
export const clerkAppearance = {
  variables: {
    colorPrimary:          "#7c3aed",
    colorBackground:       "#0d0d12",
    colorDanger:           "#f87171",
    colorSuccess:          "#4ade80",
    colorWarning:          "#fbbf24",
    colorNeutral:          "#71717a",
    colorInputText:        "#f0f0f2",
    colorBorder:           "rgba(255, 255, 255, 0.08)",
    borderRadius:          "8px",
    fontFamily:            "inherit",
    fontSize:              "14px",
    fontWeight:            { normal: 400, medium: 500, bold: 600 } as const,
    spacingUnit:           "16px",
  },

  elements: {
    // Container resets
    rootBox:               "w-full",
    card:                  "bg-transparent shadow-none border-none p-0 w-full",
    cardBox:               "w-full",

    // Header
    headerTitle:           "text-[22px] font-bold text-[#f0f0f2] tracking-tight",
    headerSubtitle:        "text-sm text-[#71717a]",

    // Social buttons
    socialButtonsBlockButton:
      "bg-[#14141a] border border-[rgba(255,255,255,0.08)] text-[#f0f0f2] text-sm font-medium hover:bg-[rgba(255,255,255,0.06)] transition-colors rounded-lg",
    socialButtonsBlockButtonText: "font-medium",

    // Divider
    dividerRow:            "my-5",
    dividerLine:           "bg-[rgba(255,255,255,0.06)]",
    dividerText:           "text-xs text-[#52525b] px-3",

    // Form fields
    formFieldLabel:        "text-sm font-medium text-[#f0f0f2] mb-1.5",
    formFieldInput:
      "bg-[#14141a] border border-[rgba(255,255,255,0.08)] text-[#f0f0f2] text-sm rounded-lg h-10 px-3 focus:ring-2 focus:ring-[rgba(124,58,237,0.3)] focus:border-[rgba(124,58,237,0.6)] transition-all placeholder:text-[#52525b] outline-none",
    formFieldErrorText:    "text-xs text-[#f87171] mt-1",
    formFieldHintText:     "text-xs text-[#71717a] mt-1",
    formFieldInputShowPasswordButton: "text-[#71717a] hover:text-[#f0f0f2]",

    // Primary CTA
    formButtonPrimary:
      "bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm font-medium h-10 rounded-lg transition-all shadow-[0_0_20px_rgba(124,58,237,0.2)] hover:shadow-[0_0_28px_rgba(124,58,237,0.35)]",

    // Secondary
    formButtonReset:
      "text-[#71717a] hover:text-[#f0f0f2] text-sm font-medium transition-colors",

    // Footer
    footerActionText:      "text-sm text-[#71717a]",
    footerActionLink:
      "text-sm font-medium text-[#7c3aed] hover:text-[#a78bfa] transition-colors",

    // Alerts
    alert:                 "bg-[rgba(248,113,113,0.08)] border border-[rgba(248,113,113,0.2)] rounded-lg",
    alertText:             "text-sm text-[#f87171]",

    // Identity preview
    identityPreviewText:   "text-sm text-[#71717a]",
    identityPreviewEditButton: "text-[#7c3aed] hover:text-[#a78bfa] text-sm",

    // OTP
    otpCodeFieldInput:
      "bg-[#14141a] border border-[rgba(255,255,255,0.08)] text-[#f0f0f2] rounded-lg focus:ring-2 focus:ring-[rgba(124,58,237,0.3)]",
  },
} as const;

export type ClerkAppearance = typeof clerkAppearance;
