import { Reveal } from "@/components/animations/Reveal";

interface SectionHeadingProps {
  kicker: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  kicker,
  title,
  description,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  return (
    <Reveal className={`${align === "center" ? "text-center" : ""} ${className}`}>
      <p className="kicker">{kicker}</p>
      <h2 className="display mt-3 text-4xl text-white sm:text-5xl lg:text-6xl">{title}</h2>
      {description && (
        <p
          className={`mt-4 max-w-2xl text-base leading-relaxed text-muted ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
