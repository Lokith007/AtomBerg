import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "PerformIQ — Enterprise Performance Management Platform",
  description:
    "Executive-grade Goal Alignment, OKR Management, and Performance Intelligence for the modern enterprise.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-navy-950 text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
