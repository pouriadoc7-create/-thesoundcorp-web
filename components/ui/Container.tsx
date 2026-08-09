import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

export function Container({ children, className, as: Tag = "div" }: ContainerProps) {
  return (
    // Widens gently on ultrawide (≥1920px, the --breakpoint-3xl token) so large
    // desktops aren't left with vast empty gutters, without letting text lines
    // run too long on normal screens.
    <Tag className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 3xl:max-w-[88rem]", className)}>
      {children}
    </Tag>
  );
}
