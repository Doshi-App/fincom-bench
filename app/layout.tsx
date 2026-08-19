import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer, Header, NoResultsBanner } from "./components/site-chrome";
import { HAS_RESULTS } from "@/lib/results";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  title: {
    default: "Fincon Bench",
    template: "%s — Fincon Bench",
  },
  description:
    "A public benchmark for financial compliance and behaviour in AI chat replies, graded against real conduct rules from the UK, the EU, the US and Australia.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {!HAS_RESULTS && <NoResultsBanner />}
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
