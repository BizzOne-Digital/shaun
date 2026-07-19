"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { Mascot } from "@/components/ui/Mascot";

const SESSION_KEY = "mr-intro-seen";

/**
 * Cinematic first-visit intro: waveform draw → mascot eyes reveal →
 * logo RF-glitch → tagline → pulsing enter button. Plays once per
 * browser session (sessionStorage) and respects reduced motion.
 */
export function IntroOverlay() {
  // Rendered on the server so the intro is visible from the very first paint.
  // A tiny inline script (below) hides it pre-paint for returning visitors.
  const [show, setShow] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    const check = () => {
      try {
        if (sessionStorage.getItem(SESSION_KEY)) setShow(false);
      } catch {
        // sessionStorage unavailable — skip the intro entirely
        setShow(false);
      }
    };
    check();
  }, []);

  const dismiss = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {}
    setLeaving(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !rootRef.current) {
      setShow(false);
      return;
    }
    gsap.to(rootRef.current, {
      opacity: 0,
      scale: 1.06,
      duration: 0.7,
      ease: "power2.inOut",
      onComplete: () => setShow(false),
    });
  };

  useEffect(() => {
    if (!show || !rootRef.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = rootRef.current;

    if (reduced) {
      // Static, quick intro for reduced-motion users
      gsap.set(root.querySelectorAll("[data-intro]"), { opacity: 1 });
      const t = setTimeout(dismiss, 1600);
      return () => clearTimeout(t);
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. waveform draws across the screen
      tl.fromTo(
        "[data-intro='wave']",
        { strokeDashoffset: 1200 },
        { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" }
      )
        // 2. purple light reveals the mascot's eyes
        .to("[data-intro='glowlight']", { opacity: 0.55, duration: 0.6 }, "-=0.4")
        .to("[data-intro='mascot']", { opacity: 1, scale: 1, duration: 0.6 }, "<")
        // 3. logo appears through an RF glitch
        .to("[data-intro='logo']", {
          opacity: 1,
          duration: 0.08,
          repeat: 5,
          yoyo: true,
          onUpdate: function () {
            const el = root.querySelector<HTMLElement>("[data-intro='logo']");
            if (el) el.style.transform = `translateX(${(Math.random() - 0.5) * 10}px)`;
          },
        })
        .to("[data-intro='logo']", {
          opacity: 1,
          x: 0,
          duration: 0.3,
          onComplete: () => {
            const el = root.querySelector<HTMLElement>("[data-intro='logo']");
            if (el) el.style.transform = "";
          },
        })
        // 4. tagline + enter button
        .to("[data-intro='tagline']", { opacity: 1, y: 0, duration: 0.5 }, "-=0.1")
        .to("[data-intro='enter']", { opacity: 1, y: 0, duration: 0.4 }, "-=0.2");
    }, root);

    // auto-reveal the homepage after ~3s
    const timer = setTimeout(dismiss, 3400);
    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, [show]);

  if (!show) return null;

  return (
    <>
      {/* Hide the overlay before first paint when the intro was already seen
          this session — prevents both the "site first, then intro" flash for
          new visitors and an intro flash for returning ones. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(sessionStorage.getItem("${SESSION_KEY}")){var e=document.getElementById("mr-intro");if(e)e.style.display="none"}}catch(t){}`,
        }}
      />
    <div
      id="mr-intro"
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-black"
      role="dialog"
      aria-label="Monsterous Radio intro"
    >
      {/* purple studio light */}
      <div
        data-intro="glowlight"
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-[100px]"
        style={{ background: "radial-gradient(circle, #6f1599 0%, transparent 70%)" }}
      />

      {/* waveform line */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1200 120"
        className="absolute top-[22%] w-[140%] max-w-none"
        fill="none"
      >
        <path
          data-intro="wave"
          d="M0 60 L80 60 L100 30 L120 90 L140 45 L160 75 L180 60 L300 60 L320 20 L340 100 L360 40 L380 80 L400 60 L520 60 L540 35 L560 85 L580 50 L600 70 L620 60 L740 60 L760 25 L780 95 L800 42 L820 78 L840 60 L960 60 L980 32 L1000 88 L1020 48 L1040 72 L1060 60 L1200 60"
          stroke="var(--lime)"
          strokeWidth="2"
          strokeDasharray="1200"
          strokeDashoffset="1200"
          style={{ filter: "drop-shadow(0 0 6px rgba(182,229,29,0.8))" }}
        />
      </svg>

      <div data-intro="mascot" className="scale-75 opacity-0" style={{ opacity: 0 }}>
        <Mascot className="h-28 w-28 sm:h-36 sm:w-36" />
      </div>

      <div data-intro="logo" className="mt-6 opacity-0">
        <Image
          src="/brand/logo.png"
          alt="Monsterous Radio"
          width={340}
          height={128}
          priority
          className="h-auto w-[240px] sm:w-[320px]"
        />
      </div>

      <p
        data-intro="tagline"
        className="display mt-6 max-w-full translate-y-4 px-6 text-center text-base tracking-[0.2em] text-white/85 opacity-0 sm:text-2xl"
      >
        PLAYIN&apos; YOUR FAVORITE MONSTER HITS!
      </p>

      <button
        data-intro="enter"
        type="button"
        onClick={dismiss}
        disabled={leaving}
        className="btn btn-lime mt-8 translate-y-4 animate-pulse opacity-0"
      >
        Enter The Station
      </button>

      <button
        type="button"
        onClick={dismiss}
        disabled={leaving}
        className="absolute right-5 top-5 rounded-full border border-white/20 px-4 py-2 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-white/60 transition-colors hover:border-lime hover:text-lime"
      >
        Skip Intro
      </button>
    </div>
    </>
  );
}
