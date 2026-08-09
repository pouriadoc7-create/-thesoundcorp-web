import type { ReactNode } from "react";

import { Reveal } from "@/components/motion/Reveal";

import { Container } from "./Container";
import { Section } from "./Section";
import { SectionHeader } from "./SectionHeader";

interface PlaceholderSectionProps {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}

/**
 * Shared shell for routes that don't have real content yet. Keeps the
 * "coming soon" state honest and on-brand instead of a broken/blank page,
 * without fabricating business details the placeholder can't back up.
 */
export function PlaceholderSection({ eyebrow, title, description, children }: PlaceholderSectionProps) {
  return (
    <Section className="flex min-h-[60vh] items-center">
      <Container className="flex flex-col items-center text-center">
        <SectionHeader eyebrow={eyebrow} title={title} description={description} />
        {children ? (
          <Reveal delayMs={240} className="mt-10">
            {children}
          </Reveal>
        ) : null}
      </Container>
    </Section>
  );
}
