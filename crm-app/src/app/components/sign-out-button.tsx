"use client";

import { useState } from "react";
import { useClerk } from "@clerk/nextjs";
import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

type SignOutButtonProps = {
  className?: string;
  variant?: "default" | "ghost";
};

export function SignOutButton({ className, variant = "default" }: SignOutButtonProps) {
  const { signOut } = useClerk();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function signOutUser() {
    setIsSigningOut(true);
    try {
      // On success Clerk navigates to the home page, so the button stays disabled.
      await signOut({ redirectUrl: "/" });
    } catch (error) {
      console.error("Sign out failed", { error });
      toast.add({
        type: "error",
        title: "Couldn't sign you out",
        description: "Check your connection and try again.",
      });
      setIsSigningOut(false);
    }
  }

  return (
    <Button size="lg" variant={variant} className={className} disabled={isSigningOut} onClick={signOutUser}>
      {isSigningOut && <Loader2Icon data-icon="inline-start" className="animate-spin" aria-hidden />}
      {isSigningOut ? "Signing out…" : "Sign out"}
    </Button>
  );
}
