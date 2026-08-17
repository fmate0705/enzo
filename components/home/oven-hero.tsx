'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ButtonLink, ExternalButtonLink } from '@/components/ui/button';
import { Container } from '@/components/ui/container';

/**
 * The hero.
 *
 * A full-bleed shot looking into the restaurant's own oven. The fire is not
 * playing on a loop — it is *scrubbed*: the visitor's scroll position drives the
 * video's playhead, so the oven lights as they move down the page and goes back
 * to embers if they scroll up. One custom property, `--p`, carries the progress
 * and everything else on screen reads from it.
 *
 *   0.00  cold chamber, dull embers, the type at full weight
 *   0.50  fire spreading across the log bed, warm light on the brick
 *   1.00  full blaze, the type lifted and faded as the section hands over
 *
 * Why scrubbed video rather than an autoplaying loop: a loop ignores the
 * visitor, and a loop of fire behind text is the single most over-used hero on
 * the internet. Tying the flame to the scroll makes the page feel like it
 * responds to the person reading it, which is the whole brief.
 *
 * Cost and courtesy are handled by not shipping the video where it cannot pay
 * for itself:
 * - Below `md` the <video> is never mounted, so a phone downloads a ~400 KB
 *   still instead of a video it would only see a sliver of.
 * - Under prefers-reduced-motion the same still is used and nothing scrubs.
 * - The still is also the poster, so the first paint is the finished image
 *   rather than a black box waiting on metadata.
 */
export function OvenHero({ foodoraUrl }: { foodoraUrl: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [useVideo, setUseVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  // Decide once, on the client, whether this visitor gets the video at all.
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const wide = window.matchMedia('(min-width: 768px)');
    const decide = () => setUseVideo(wide.matches && !reduced.matches);
    decide();
    reduced.addEventListener('change', decide);
    wide.addEventListener('change', decide);
    return () => {
      reduced.removeEventListener('change', decide);
      wide.removeEventListener('change', decide);
    };
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    if (!useVideo) {
      node.style.setProperty('--p', '1');
      return;
    }

    let frame = 0;
    let target = 0;

    const apply = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const progress = travel <= 0 ? 1 : Math.min(1, Math.max(0, -rect.top / travel));
      node.style.setProperty('--p', String(progress));
      target = progress;

      const video = videoRef.current;
      if (!video || !video.duration || Number.isNaN(video.duration)) return;
      // Leave a hair of headroom: seeking exactly to duration can park some
      // browsers on the "ended" state and stop further seeks landing.
      const time = target * (video.duration - 0.05);
      // Skip sub-frame seeks — at 24fps anything under ~40ms is invisible and
      // only costs a decode.
      if (Math.abs(video.currentTime - time) < 0.04) return;
      // fastSeek lands on the nearest keyframe without a full decode walk.
      if (typeof video.fastSeek === 'function') video.fastSeek(time);
      else video.currentTime = time;
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [useVideo, videoReady]);

  return (
    <div ref={sectionRef} data-oven-hero="" className="relative md:h-[240vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden md:h-screen">
        {/* ---- The oven ------------------------------------------------- */}
        <div className="absolute inset-0" aria-hidden="true">
          {/*
           * The lit still. This is what a phone and a reduced-motion visitor
           * get, and it is the LCP image on those devices — a phone downloads
           * 106 KB here and never touches the 598 KB video.
           *
           * On desktop the <video> mounts on top of it and its poster (the
           * video's own cold first frame) paints immediately, so the still is
           * simply covered. No swap, no fade, nothing to flash.
           */}
          <Image
            src="/images/etterem/kemence-belso.jpg"
            alt=""
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover"
          />

          {useVideo ? (
            <video
              ref={videoRef}
              // Scrubbed, never played: muted + playsInline stop any browser
              // taking it over, and the absence of autoplay means the oven only
              // ever moves because the visitor moved.
              muted
              playsInline
              preload="auto"
              poster="/images/etterem/kemence-belso-hideg.jpg"
              tabIndex={-1}
              aria-hidden="true"
              onLoadedData={() => setVideoReady(true)}
              className="absolute inset-0 h-full w-full object-cover"
              data-oven-video={videoReady ? 'ready' : ''}
            >
              <source src="/video/kemence-belso.mp4" type="video/mp4" />
            </video>
          ) : null}

          {/* Grade: the frame is lifted from behind the type and dropped at the
              edges, so the headline sits on near-black however bright the fire
              gets. */}
          <div data-oven-grade="" className="absolute inset-0" />
          <div className="grain absolute inset-0" />
        </div>

        {/* ---- Type ------------------------------------------------------ */}
        <Container wide className="relative z-10 flex flex-1 flex-col justify-center pb-28 pt-24">
          <div data-hero-copy="" className="w-full">
            {/*
             * Deliberately not a centred stack. The two display lines are set
             * at different indents so the eye travels diagonally, the standfirst
             * hangs off the first line's baseline on the right, and the actions
             * sit under the *second* line rather than under the block. It reads
             * as a composed page rather than a list of centred elements.
             */}
            <h1 className="font-display text-foreground">
              <span data-hero-line="1" className="block">
                Nápolyi pizza
              </span>{' '}
              <span data-hero-line="2" className="block text-primary md:ml-[14%] lg:ml-[18%]">
                hatvani tűzön.
              </span>
            </h1>

            {/* Actions, centred across the frame. */}
            <div
              data-hero-actions=""
              className="mt-10 flex flex-wrap items-center justify-center gap-4 md:mt-12"
            >
              <ButtonLink href="/etlap" size="lg">
                Étlap
              </ButtonLink>
              <ExternalButtonLink
                href={foodoraUrl}
                variant="onImage"
                size="lg"
                label="Rendelés a Foodorán — új lapon nyílik meg"
              >
                Rendelés Foodorán
              </ExternalButtonLink>
            </div>
          </div>
        </Container>

        {/* ---- Scroll cue ------------------------------------------------ */}
        <div
          data-hero-cue=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-7 z-10 flex flex-col items-center gap-3"
        >
          <span className="text-[0.6875rem] uppercase tracking-[0.28em] text-foreground/55">
            Görgessen
          </span>
          {/*
           * A mouse, drawn rather than shipped as an icon font: the body is a
           * stadium outline and the wheel is a brass dot that falls inside it,
           * so the cue reads as "scroll this" at a glance instead of asking the
           * visitor to infer it from a moving line.
           */}
          <svg
            width="26"
            height="40"
            viewBox="0 0 26 40"
            fill="none"
            className="text-foreground/40"
          >
            <rect
              x="0.9"
              y="0.9"
              width="24.2"
              height="38.2"
              rx="12.1"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <circle data-hero-cue-dot="" cx="13" cy="11" r="2.6" className="fill-primary" />
          </svg>
        </div>
      </div>
    </div>
  );
}
