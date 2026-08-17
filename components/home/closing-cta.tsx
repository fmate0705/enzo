import Image from 'next/image';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { ButtonLink, ExternalButtonLink } from '@/components/ui/button';
import { getSite } from '@/lib/site';

/**
 * The closing act.
 *
 * The restaurant's own spread of dishes, shot on a near-black ground that is
 * within a few percent of the page's own background — so the photograph does not
 * sit in a box, it becomes the page. The type sits in the dark half of the frame
 * where the image has nothing to say.
 */
export async function ClosingCta() {
  const site = await getSite();
  return (
    <Section aria-labelledby="closing-title" size="lg" className="relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0">
        <Image
          src="/images/etterem/foodora-listing.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-right"
        />
        {/* Reads the type against the image from any viewport width. */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/92 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
      </div>

      <Container className="relative">
        <div className="max-w-xl">
          <h2 id="closing-title" className="font-display text-4xl text-foreground md:text-5xl">
            Kedd és vasárnap között
            <br />
            <span className="text-primary">be van gyújtva.</span>
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-muted">
            Nézze meg az étlapot, vagy rendeljen haza a Foodorán. {site.hoursSummary}.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href="/etlap" size="lg">
              Étlap
            </ButtonLink>
            <ExternalButtonLink
              href={site.links.foodora}
              size="lg"
              variant="onImage"
              label="Rendelés a Foodorán — új lapon nyílik meg"
            >
              Rendelés Foodorán
            </ExternalButtonLink>
          </div>
        </div>
      </Container>
    </Section>
  );
}
