import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeFlatter — See What Your AI Won't Tell You Straight",
  description:
    "Paste a question. Two AI personas answer — one flatters, one doesn't. DeFlatter scores the sycophancy gap and shows you what was hidden.",
  metadataBase: new URL("https://deflatter.vercel.app"),
  openGraph: {
    title: "DeFlatter — See What Your AI Won't Tell You Straight",
    description:
      "Paste a question. Two AI personas answer — one flatters, one doesn't. DeFlatter scores the sycophancy gap and shows you what was hidden.",
    url: "https://deflatter.vercel.app",
    siteName: "DeFlatter",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DeFlatter — See What Your AI Won't Tell You Straight",
    description:
      "Paste a question. Two AI personas answer — one flatters, one doesn't. DeFlatter scores the sycophancy gap and shows you what was hidden.",
  },
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
