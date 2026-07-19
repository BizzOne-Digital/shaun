"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X, Radio, Phone, Mail } from "lucide-react";
import { FacebookIcon } from "@/components/ui/BrandIcons";
import { siteConfig } from "@/config/siteConfig";
import { usePlayer } from "@/providers/PlayerProvider";
import { Equalizer } from "@/components/animations/Equalizer";
import { StatusStrip } from "./StatusStrip";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/listen", label: "Listen Live" },
  { href: "/shows", label: "Shows & Schedule" },
  { href: "/news", label: "News" },
  { href: "/advertise", label: "Advertise" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { live, isPlaying, toggle, hasStream } = usePlayer();
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu on navigation (state-adjustment-during-render pattern)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
  }

  // Lock body scroll while the menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <StatusStrip />
      <div
        className={`transition-all duration-300 ${
          scrolled || menuOpen ? "glass shadow-[0_8px_40px_-12px_rgba(0,0,0,0.8)]" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Monsterous Radio — home">
            <Image
              src="/brand/logo.png"
              alt="Monsterous Radio logo"
              width={150}
              height={56}
              priority
              className="h-11 w-auto object-contain"
            />
          </Link>

          <nav className="hidden items-center gap-6 xl:flex" aria-label="Main navigation">
            {NAV_LINKS.slice(0, 8).map((link) => {
              const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-[0.72rem] font-bold uppercase tracking-[0.18em] transition-colors ${
                    active ? "text-lime" : "text-white/75 hover:text-white"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span aria-hidden="true" className="absolute -bottom-2 left-0 h-[2px] w-full rounded-full bg-lime" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/listen" className="btn btn-lime hidden !px-5 !py-2.5 text-[0.7rem] md:inline-flex">
              <Radio className="h-4 w-4" aria-hidden="true" />
              Listen Live
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-white transition-colors hover:border-violet xl:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="noir-gradient fixed inset-0 top-[97px] z-40 flex flex-col overflow-y-auto xl:hidden"
          >
            <nav className="flex flex-1 flex-col justify-center gap-1 px-8 py-8" aria-label="Mobile navigation">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, x: -28 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={link.href}
                    className={`display block py-2.5 text-4xl transition-colors sm:text-5xl ${
                      (link.href === "/" ? pathname === "/" : pathname.startsWith(link.href))
                        ? "text-lime"
                        : "text-white hover:text-limesoft"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="border-t border-line px-8 py-6">
              {live?.current && (
                <div className="mb-5 flex items-center gap-3">
                  <Equalizer playing={isPlaying} bars={4} height={14} />
                  <p className="text-sm text-muted">
                    On air now: <span className="font-bold text-white">{live.current.name}</span>
                  </p>
                </div>
              )}
              {hasStream ? (
                <button type="button" onClick={toggle} className="btn btn-lime w-full">
                  <Radio className="h-4 w-4" aria-hidden="true" />
                  {isPlaying ? "Pause Stream" : "Listen Live Now"}
                </button>
              ) : (
                <Link href="/listen" className="btn btn-lime w-full">
                  <Radio className="h-4 w-4" aria-hidden="true" />
                  Listen Live
                </Link>
              )}
              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
                <a href={siteConfig.contact.phoneHref} className="flex items-center gap-2 hover:text-white">
                  <Phone className="h-4 w-4" aria-hidden="true" /> {siteConfig.contact.phone}
                </a>
                <a href={`mailto:${siteConfig.contact.email}`} className="flex items-center gap-2 hover:text-white">
                  <Mail className="h-4 w-4" aria-hidden="true" /> {siteConfig.contact.email}
                </a>
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white"
                  aria-label="Monsterous Radio on Facebook (opens in a new tab)"
                >
                  <FacebookIcon className="h-4 w-4" /> Facebook
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
