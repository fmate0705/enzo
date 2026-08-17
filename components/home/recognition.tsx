import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Reveal } from '@/components/motion/reveal';
import { awards, ratings } from '@/content/restaurant';
import { getSite } from '@/lib/site';

/**
 * Recognition.
 *
 * Two kinds of proof, kept visually distinct: awards the restaurant was given,
 * and scores its guests left. Both are real and both are attributed to a named,
 * linked source — a visitor can check every number on this page in one click.
 *
 * There are no invented guest quotes here. No review text was available to
 * attribute, and a plausible-sounding testimonial with a first name under it is
 * exactly the kind of thing this site refuses to print. The scores carry the
 * section on their own; see docs/CONTENT-INVENTORY.md for adding real quotes.
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
              A Turul Gasztronómia két egymást követő évben minősítette a pizzériát. A pontszám a
              vendégek értékeléseiből áll össze.
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

          <div className="space-y-14">
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

            {/* ---- Scores ---------------------------------------------- */}
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-muted">
                Amit a vendégek adtak
              </h3>
              <dl className="mt-6 grid gap-x-8 gap-y-8 sm:grid-cols-3">
                {ratings.map((rating, index) => (
                  <Reveal
                    key={rating.source}
                    delay={index * 80}
                    className="border-t border-border pt-5"
                  >
                    <dt className="text-xs uppercase tracking-[0.16em] text-muted">
                      <a
                        href={rating.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-primary"
                      >
                        {rating.source}
                      </a>
                    </dt>
                    <dd className="mt-3">
                      <span className="font-display text-3xl text-foreground">{rating.value}</span>
                      {rating.scale ? (
                        <span className="text-lg text-muted">/{rating.scale}</span>
                      ) : null}
                      <span className="mt-1 block text-sm text-muted">
                        {rating.count} {rating.countLabel}
                      </span>
                    </dd>
                  </Reveal>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
