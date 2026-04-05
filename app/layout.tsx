import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeFlatter — See what your AI isn't telling you",
  description:
    "Same question. Two answers. DeFlatter shows you the gap between what AI says and what you need to hear.",
  openGraph: {
    title: "DeFlatter — See what your AI isn't telling you",
    description: "Same question. Two answers. See the sycophancy gap.",
    url: "https://deflatter.vercel.app",
    siteName: "DeFlatter",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'IBM Plex Mono', monospace", overflow: "hidden", overflowY: "auto" }}>
        {children}
      </body>
    </html>
  );
}
