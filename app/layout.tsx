// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import Header from "@/components/Header";
import Footer4Col from "@/components/ui/Footers";
import Providers from "./providers";
import ChatPanel from "@/components/ChatPanel";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brihaspathi Technologies Limited",
  description: "Ai Survilence",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col bg-white text-slate-900`}
      >
        <Providers>
          <Header />
          <main id="content" className="flex-1">
            {children}
          </main>
          <Footer4Col />
          <ChatPanel />
        </Providers>

        {/* Kill any Next.js dev/build/ISR indicator in production just in case */}
        {process.env.NODE_ENV === "production" && (
          <Script id="remove-next-build-indicator" strategy="afterInteractive">
            {`
              const kill = () => {
                document.querySelectorAll(
                  '#nextjs__container_build_indicator,' +
                  '[id^="__next-build-watcher"],' +
                  '[id^="__next-build-indicator"],' +
                  '[id^="__next-build"],' +
                  'div[id*="__next-build"]'
                ).forEach(el => el.remove());
              };
              // Run now and observe for any late inserts
              kill();
              const obs = new MutationObserver(kill);
              obs.observe(document.documentElement, { childList: true, subtree: true });
            `}
          </Script>
        )}
      </body>
    </html>
  );
}
