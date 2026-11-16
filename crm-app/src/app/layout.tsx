import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider} from '@clerk/nextjs'
import { Toaster } from "@/components/ui/toast";
import { clerkAppearance } from "@/lib/clerk-appearance";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Streaming CRM",
  description:
    "The CRM for streaming teams: subscribers, plans, billing, campaigns and viewing in one workspace.",
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
          <ClerkProvider signInUrl="/sign-in" signInFallbackRedirectUrl="/" appearance={clerkAppearance}>
                  {children}
          </ClerkProvider>
          <Toaster />
      </body>
    </html>
  );
}
