import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Reveal } from '@/components/motion/reveal';
import { awards } from '@/content/restaurant';
import { getSite } from '@/lib/site';

/**
 * Recognition.
 *
 * The awards the restaurant was actually given, each attributed to the body that
 * gave it and linked to the profile it can be checked against.
 *
 * There are no invented guest quotes here, and no aggregate scores either. The
 * scores were real and attributed, but three platform logos under a headline
 * about craft read as a badge wall — the awards say the same thing with less
 * noise. The figures still live in content/restaurant.ts if they are ever
 * wanted back.
 */
export async function Recognition() {
  const site = await getSite();
  // Grouped by year so the seal reads as a run of form, not a list of four badges.
  const years = [...new Set(awards.map((award) => award.year))].sort((a, b) => b - a);

  return (
    <Section
      aria-labelledby="recognition-title"
      className="atmos atmos--pool atmos--mesh border-y border-border/60 bg-surface/40"
    >
      <Container>
        <div className="grid gap-16 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-24">
          <div>
            <h2 id="recognition-title" className="font-display text-4xl text-foreground">
              Elismerés, ami mögött
              <br />
              <span className="text-primary">munka van.</span>
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
              A Turul Gasztronómia két egymást követő évben minősítette a pizzériát — a szakmai
              értékelés és a vendégek visszajelzései alapján.
            </p>
            <a
              href={site.links.turul}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-primary transition-opacity hover:opacity-75"
            >
              Turul Gasztronómia profil
              <span aria-hidden="true">↗</span>
              <span className="sr-only">(új lapon nyílik meg)</span>
            </a>
          </div>

          <div>
            {/* ---- Awards, as seals ------------------------------------- */}
            <ul className="grid gap-6 sm:grid-cols-2">
              {years.map((year, index) => (
                <Reveal as="li" key={year} delay={index * 90}>
                  <div className="relative flex h-full flex-col items-center border border-primary/25 px-6 py-8 text-center">
                    {/* Corner ticks — a struck seal rather than a rounded card. */}
                    <span
                      aria-hidden="true"
                      className="absolute left-2 top-2 h-3 w-3 border-l border-t border-primary/50"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute bottom-2 right-2 h-3 w-3 border-b border-r border-primary/50"
                    />

                    <p className="font-display text-4xl leading-none text-primary">{year}</p>
                    <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted">
                      Turul Gasztronómia
                    </p>
                    <ul className="mt-4 space-y-1 text-sm text-foreground">
                      {awards
                        .filter((award) => award.year === year)
                        .map((award) => (
                          <li key={award.title}>{award.title}</li>
                        ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
