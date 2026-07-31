"use client";

import { PlayerProvider } from "@/providers/PlayerProvider";
import { LenisProvider } from "@/providers/LenisProvider";
import {
  SiteConfigProvider,
  type RuntimeSiteConfig,
} from "@/providers/SiteConfigProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { IntroOverlay } from "@/components/animations/IntroOverlay";
import { usePathname } from "next/navigation";

export function SiteShell({
  children,
  config,
}: {
  children: React.ReactNode;
  config: RuntimeSiteConfig;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <SiteConfigProvider value={config}>
      <PlayerProvider>
        <LenisProvider>
          <IntroOverlay />
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </LenisProvider>
      </PlayerProvider>
    </SiteConfigProvider>
  );
}
