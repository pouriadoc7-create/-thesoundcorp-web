import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "../globals.css";
import "./lab.css";

export const metadata: Metadata = {
  title: "Menu Lab — TheSoundCorp",
  description: "Temporary mobile-navigation concept lab.",
  robots: { index: false, follow: false },
};

/**
 * viewportFit: "cover" lets the concepts paint edge-to-edge behind the Dynamic
 * Island / Android punch-hole and the bottom browser bar, with every concept
 * honouring env(safe-area-inset-*) for its interactive chrome.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function MenuLabLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className="mlab-body">{children}</body>
    </html>
  );
}
