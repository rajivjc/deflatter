import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeFlatter — See What AI Won't Tell You Straight",
  description:
    "Paste a question. Two AI personas answer — one flatters, one doesn't. DeFlatter scores the sycophancy gap and shows you what was hidden.",
  openGraph: {
    title: "DeFlatter — See What AI Won't Tell You Straight",
    description:
      "Paste a question. Two AI personas answer — one flatters, one doesn't. DeFlatter scores the sycophancy gap and shows you what was hidden.",
    url: "https://deflatter.vercel.app",
    siteName: "DeFlatter",
    type: "website",
    images: [
      {
        url: "https://deflatter.vercel.app/opengraph-image",
        width: 1200,
        height: 630,
        alt: "DeFlatter — See What AI Won't Tell You Straight",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DeFlatter — See What AI Won't Tell You Straight",
    description:
      "Paste a question. Two AI personas answer — one flatters, one doesn't. DeFlatter scores the sycophancy gap and shows you what was hidden.",
    images: ["https://deflatter.vercel.app/opengraph-image"],
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
