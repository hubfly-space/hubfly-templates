import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HubFly Next.js Template",
  description: "Template with API routes, server actions, tests, and image optimization"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
