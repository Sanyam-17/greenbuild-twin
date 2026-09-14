import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GreenBuild Twin — Architectural Digital Twin",
  description:
    "Explore a glassmorphism architectural floor plan with live building telemetry, furniture volumes, and spatial dimensions.",
  keywords: ["IoT", "digital twin", "smart building", "BMS", "3D dashboard", "GreenBuild"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-navy-900 text-slate-200 antialiased">
        {children}
      </body>
    </html>
  );
}
