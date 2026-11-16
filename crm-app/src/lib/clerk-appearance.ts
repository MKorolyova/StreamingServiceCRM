import type { ComponentProps } from "react";
import type { SignIn } from "@clerk/nextjs";

type ClerkAppearance = NonNullable<ComponentProps<typeof SignIn>["appearance"]>;

const MONO_LABEL = {
  fontFamily: "var(--font-geist-mono)",
  fontSize: "0.75rem",
  fontWeight: 400,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--muted-foreground)",
} as const;

const FOCUS_RING_IMPORTANT = {
  borderColor: "var(--ring) !important",
  boxShadow: "0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent) !important",
} as const;

const CUT_CORNERS =
  "polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)";

const OUTLINE_BUTTON = {
  height: "2.5rem",
  border: "1px solid var(--border) !important",
  borderRadius: "0",
  boxShadow: "none !important",
  backgroundColor: "var(--background)",
  color: "var(--foreground)",
  "&:hover": { backgroundColor: "var(--muted)" },
  "&:focus-visible": FOCUS_RING_IMPORTANT,
} as const;

export const clerkAppearance = {
  variables: {
    colorPrimary: "var(--primary)",
    colorPrimaryForeground: "var(--primary-foreground)",
    colorBackground: "var(--background)",
    colorForeground: "var(--foreground)",
    colorMuted: "var(--muted)",
    colorMutedForeground: "var(--muted-foreground)",
    colorNeutral: "var(--foreground)",
    colorInput: "var(--background)",
    colorInputForeground: "var(--foreground)",
    colorBorder: "var(--border)",
    colorRing: "var(--ring)",
    colorDanger: "var(--destructive)",
    colorShadow: "transparent",
    fontFamily: "var(--font-geist-sans)",
    fontFamilyButtons: "var(--font-geist-sans)",
    fontFamilyMono: "var(--font-geist-mono)",
    borderRadius: "0",
  },
  elements: {
    rootBox: { width: "100%" },
    cardBox: {
      width: "100%",
      maxWidth: "100%",
      border: "1px solid var(--border)",
      borderRadius: "0",
      boxShadow: "none",
    },
    card: {
      backgroundColor: "var(--background)",
      borderRadius: "0",
      boxShadow: "none",
      padding: "2.25rem",
      gap: "1.75rem",
    },
    headerTitle: {
      fontSize: "1.75rem",
      lineHeight: 1.1,
      fontWeight: 500,
      letterSpacing: "-0.04em",
      color: "var(--foreground)",
    },
    headerSubtitle: { fontSize: "0.95rem", color: "var(--muted-foreground)" },

    socialButtonsBlockButton: OUTLINE_BUTTON,
    socialButtonsBlockButtonText: { fontSize: "0.875rem", fontWeight: 500 },
    alternativeMethodsBlockButton: OUTLINE_BUTTON,
    lastAuthenticationStrategyBadge: {
      border: "1px solid var(--foreground) !important",
      borderRadius: "0",
      boxShadow: "none !important",
      backgroundColor: "var(--background)",
      color: "var(--foreground)",
    },

    dividerLine: {
      height: "0",
      backgroundColor: "transparent",
      borderTop: "1px dashed var(--border)",
    },
    dividerText: MONO_LABEL,

    formFieldLabel: MONO_LABEL,
    formFieldInput: {
      height: "2.5rem",
      border: "1px solid var(--input) !important",
      borderRadius: "0",
      boxShadow: "none !important",
      backgroundColor: "transparent",
      fontSize: "0.875rem",
      "&:hover": { borderColor: "var(--ring) !important" },
      "&:focus": FOCUS_RING_IMPORTANT,
    },
    otpCodeFieldInput: {
      border: "1px solid var(--input) !important",
      borderRadius: "0",
      boxShadow: "none !important",
      "&:focus": FOCUS_RING_IMPORTANT,
    },
    formFieldErrorText: { fontSize: "0.8rem", color: "var(--destructive)" },

    formButtonPrimary: {
      height: "2.75rem",
      borderRadius: "0",
      border: "none",
      boxShadow: "none",
      clipPath: CUT_CORNERS,
      backgroundColor: "var(--primary)",
      color: "var(--primary-foreground)",
      fontSize: "0.95rem",
      fontWeight: 500,
      textTransform: "none",
      "&:hover": { backgroundColor: "color-mix(in oklab, var(--primary) 80%, transparent)" },
      "&:focus-visible": { boxShadow: "none", outline: "2px solid var(--ring)", outlineOffset: "2px" },
      "&::after": { display: "none" },
    },

    footer: {
      background: "var(--background)",
      borderTop: "1px dashed var(--border) !important",
    },
    footerActionText: { color: "var(--muted-foreground)" },
    footerActionLink: {
      color: "var(--foreground)",
      fontWeight: 500,
      textUnderlineOffset: "4px",
      "&:hover": { color: "var(--foreground)", textDecoration: "underline" },
    },
    formResendCodeLink: { color: "var(--foreground)" },
    identityPreviewEditButton: { color: "var(--foreground)" },
  },
} satisfies ClerkAppearance;
