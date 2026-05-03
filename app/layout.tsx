import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/ui/themes";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ghost AI",
  description: "Real-time collaborative system design workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        theme: dark,
        variables: {
          colorBackground: "var(--bg-surface)",
          colorPrimary: "var(--accent-primary)",
          colorForeground: "var(--text-primary)",
          colorMutedForeground: "var(--text-secondary)",
          colorDanger: "var(--state-error)",
          colorSuccess: "var(--state-success)",
          colorWarning: "var(--state-warning)",
          colorInput: "var(--bg-elevated)",
          colorInputForeground: "var(--text-primary)",
          fontFamily: "var(--font-geist-sans)",
        },
      }}
    >
      <html
        lang="en"
        className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
      </html>
    </ClerkProvider>
  );
}
