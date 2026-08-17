import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { ButtonLink, ExternalButtonLink } from '@/components/ui/button';
import { MapEmbed } from '@/components/site/map-embed';
import { OpeningHours } from '@/components/site/opening-hours';
import { getSite } from '@/lib/site';

/**
 * Where the restaurant is.
 *
 * The map is one half of a designed two-column block, framed and toned to the
 * page, rather than a widget dropped into a white box. Everything a visitor
 * needs to actually arrive — address, hours, phone, directions — sits beside it
 * and works whether or not the map itself is loaded.
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

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="text-xs uppercase tracking-[0.16em] text-muted">Nyitvatartás</h3>
                <OpeningHours hours={contact.hours} className="mt-4" />
                <p className="mt-3 text-xs leading-relaxed text-muted">
                  {contact.deliveryHoursNote}
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xs uppercase tracking-[0.16em] text-muted">Telefon</h3>
                  <a
                    href={site.phone.href}
                    className="font-display mt-3 block text-2xl text-foreground transition-colors hover:text-primary"
                  >
                    {site.phone.display}
                  </a>
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-[0.16em] text-muted">Cím</h3>
                  <address className="mt-3 not-italic leading-relaxed text-foreground">
                    {site.fullAddress}
                  </address>
                </div>
              </div>
            </div>

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
