import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GreenBuild Twin — 3D Building Digital Twin Dashboard",
  description:
    "Real-time IoT digital twin dashboard for smart building monitoring. Visualize CO₂, temperature, humidity, and power consumption in an interactive 3D room view.",
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
