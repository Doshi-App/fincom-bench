import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer, Header, NoLeaderboardBanner } from "@/lib/site";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  // TODO: set the real hostname once the Vercel project is repointed at this
  // repo and the domain is decided (see the website plan for the manual
  // Vercel steps). A wrong value here silently breaks canonical/OG URLs, so
  // this is left unset rather than guessed.
  // metadataBase: new URL("https://REPLACE-ME"),
  alternates: { canonical: "/" },
  title: {
    default: "FinCom Bench",
    template: "%s — FinCom Bench",
  },
  description:
    "A public benchmark for financial compliance and behaviour in AI chat replies, graded against real conduct rules from the UK, the EU, the US and Australia.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <NoLeaderboardBanner />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
