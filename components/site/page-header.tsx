import { Container } from '@/components/ui/container';

/**
 * The opening band of every page except the home page.
 *
 * Clears the fixed header, states where the visitor is, and gives each page one
 * consistent entrance. The brass rule beneath ties it to the section dividers
 * used throughout the site.
 *
 * SPACING CONTRACT — this band's `pb` is the space belonging to the RULE, not
 * the gap before the next block. Whatever follows must bring its own top
 * padding, exactly as it would anywhere else on the page:
 *
 *   <PageHeader />
 *   <Section>…</Section>                     ← fine, Section pads its own top
 *   <Container className="pt-20 md:pt-28">…  ← a bare Container must say so
 *
 * Following it with an unpadded `Container` leaves only this `pb` between the
 * rule and the content, which is roughly half the gap the pages that use a
 * Section get — the reason /galeria, /megkozelites and the legal pages once
 * looked cramped while /tortenet did not.
 */
export function PageHeader({
  title,
  lede,
  children,
}: {
  title: React.ReactNode;
  lede?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header className="relative overflow-hidden pb-14 pt-36 md:pb-20 md:pt-44">
      <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />
      {/* A low ember wash so the top of every page carries a trace of the oven. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[28rem]"
        style={{
          background:
            'radial-gradient(60vw 24rem at 22% 0%, rgb(var(--enzo-ember-rgb) / 0.10), transparent 70%)',
        }}
      />

      <Container className="relative">
        <h1 className="font-display max-w-3xl text-4xl text-foreground md:text-5xl">{title}</h1>
        {lede ? <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted">{lede}</p> : null}
        {children}
        <hr className="rule-brass mt-12" />
      </Container>
    </header>
  );
}
