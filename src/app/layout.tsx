import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "P.G. Brothers | Supporting Players & Growing Kabaddi",
  description: "P.G. Brothers supports Kabaddi players, teams and grassroots sporting communities by encouraging participation, talent development and opportunities to grow in the game.",
  keywords: [
    "Kabaddi support organization",
    "Kabaddi players support",
    "Kabaddi development",
    "Kabaddi grassroots development",
    "Kabaddi team support",
    "Kabaddi talent development",
    "Kabaddi sports community",
    "Kabaddi players",
    "Kabaddi tournaments",
    "Kabaddi in India"
  ],
  openGraph: {
    title: "P.G. Brothers | Supporting Players & Growing Kabaddi",
    description: "Supporting Kabaddi players, teams and grassroots sporting communities by creating encouragement, opportunities and a stronger platform for the game.",
    type: "website",
    url: "https://pgbrothers.org",
    siteName: "P.G. Brothers",
  },
  twitter: {
    card: "summary_large_image",
    title: "P.G. Brothers | Supporting Players & Growing Kabaddi",
    description: "Supporting Kabaddi players, teams and grassroots sporting communities by creating encouragement, opportunities and a stronger platform.",
  },
  alternates: {
    canonical: "https://pgbrothers.org",
  }
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${oswald.variable} ${inter.variable} h-full antialiased dark`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-[#fafaf9] font-sans selection:bg-[#d4af37] selection:text-[#0a0a0a]">
        {children}
      </body>
    </html>
  );
}
