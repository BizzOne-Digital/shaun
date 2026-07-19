import Link from "next/link";
import { Radio, Home } from "lucide-react";
import { Mascot } from "@/components/ui/Mascot";

export default function NotFound() {
  return (
    <section className="noir-gradient grain flex min-h-[80vh] flex-col items-center justify-center px-4 pt-[120px] text-center">
      <Mascot className="h-36 w-36 sm:h-44 sm:w-44" />
      <p className="kicker mt-8">Signal Lost — 404</p>
      <h1 className="display mt-4 text-5xl text-white sm:text-6xl">
        This Frequency <span className="text-gradient-lime">Doesn&apos;t Exist</span>
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
        The page you&apos;re tuning to has drifted off the dial. Head back to the station — the
        music never stopped.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href="/" className="btn btn-lime">
          <Home className="h-4 w-4" aria-hidden="true" /> Back Home
        </Link>
        <Link href="/listen" className="btn btn-outline">
          <Radio className="h-4 w-4" aria-hidden="true" /> Listen Live
        </Link>
      </div>
    </section>
  );
}
