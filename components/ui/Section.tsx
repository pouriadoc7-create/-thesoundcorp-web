import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

interface SectionProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

export function Section({ children, className, as: Tag = "section" }: SectionProps) {
  return <Tag className={cn("py-16 sm:py-24 lg:py-28", className)}>{children}</Tag>;
}
