import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { ButtonLink, ExternalButtonLink } from '@/components/ui/button';
import { MapEmbed } from '@/components/site/map-embed';
import { getSite } from '@/lib/site';

/**
 * Where the restaurant is.
 *
 * The map is one half of a designed two-column block, framed and toned to the
 * page, rather than a widget dropped into a white box. Everything a visitor
 * needs to actually arrive — address, phone, directions — sits beside it and
 * works whether or not the map itself is loaded. The opening hours are not
 * repeated here; they are in the footer of every page.
 */
export async function LocationBlock() {
  const site = await getSite();
  const { contact } = site.content;

  return (
    <Section
      aria-labelledby="location-title"
      className="atmos atmos--brass border-t border-border/60"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col">
            <h2 id="location-title" className="font-display text-4xl text-foreground">
              {contact.street}
              <br />
              <span className="text-primary">
                {contact.postalCode} {contact.city}
              </span>
            </h2>

            <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
              A pizzéria Hatvan belvárosában, a Kossuth téren található, saját utcafronti terasszal.
            </p>

            {/*
             * Address and phone only. The opening hours are in the footer of
             * every page — printing the week twice on one screen is two places
             * to forget when they change, and it was the block squeezing the map.
             */}
            <dl className="mt-10 grid gap-8 sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-[0.16em] text-muted">Cím</dt>
                <dd>
                  <address className="mt-3 not-italic leading-relaxed text-foreground">
                    {site.fullAddress}
                  </address>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.16em] text-muted">Telefon</dt>
                <dd>
                  <a
                    href={site.phone.href}
                    className="font-display mt-3 block text-2xl text-foreground transition-colors hover:text-primary"
                  >
                    {site.phone.display}
                  </a>
                </dd>
              </div>
            </dl>

            <div className="mt-10 flex flex-wrap gap-3">
              <ExternalButtonLink
                href={site.maps.directions}
                label="Útvonaltervezés a Google Térképen — új lapon nyílik meg"
              >
                Útvonaltervezés
              </ExternalButtonLink>
              <ButtonLink href="/megkozelites" variant="outline">
                Részletek
              </ButtonLink>
            </div>
          </div>

          <div className="lg:pt-14">
            <MapEmbed
              className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/5]"
              title={`${site.name} a térképen — ${site.fullAddress}`}
              fullAddress={site.fullAddress}
              latitude={contact.latitude}
              longitude={contact.longitude}
              embedUrl={site.maps.embed}
              directionsUrl={site.maps.directions}
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
