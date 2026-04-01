import { ReactNode } from "react";
import { cn } from "@/src/utils/cn";

type FullWidthSectionProps = {
  children: ReactNode;
  className?: string;
};

export function FullWidthSection({
  children,
  className,
}: FullWidthSectionProps) {
  return (
    <section className={cn("relative w-full", className)}>
      {children}
    </section>
  );
}