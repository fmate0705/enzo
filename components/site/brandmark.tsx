import Image from 'next/image';
import Link from 'next/link';
import { Wordmark } from './wordmark';

/**
 * The crest plus the wordmark, as used in the header.
 *
 * The restaurant's logo is a full lockup — a gold ring around the flame, with
 * "ENZO DI NAPOLI · PIZZA TRADIZIONALE" set inside it. At header size that inner
 * lettering is far too small to read, so the crest is used as a *badge* and the
 * readable name is set in type beside it. The wordmark's own descriptor line is
 * suppressed here: the crest already says "Pizza Tradizionale", and printing it
 * twice at 10px reads as a mistake.
 *
 * INTERIM CROP — remove once the transparent logo lands.
 * The supplied file is a JPEG with a near-black ground baked in, which would
 * show as a dark square against the page. Until the transparent version
 * arrives it is clipped to its own ring: `rounded-full` on the frame plus a
 * scale that pushes the ring out to the crop edge, so what remains reads as a
 * struck coin rather than as a photograph of a logo.
 *
 * To swap in the transparent asset: drop it at the path below, change `LOGO_SRC`,
 * and delete `LOGO_INTERIM_CROP` from the frame's className. Nothing else moves.
 */
const LOGO_SRC = '/images/brand/logo.jpg';
const LOGO_INTERIM_CROP = 'overflow-hidden rounded-full';

export function Brandmark({ href = '/' }: { href?: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-sm"
      aria-label="Enzo di Napoli — vissza a főoldalra"
    >
      <span className={`relative block size-11 shrink-0 md:size-12 ${LOGO_INTERIM_CROP}`}>
        <Image
          src={LOGO_SRC}
          alt=""
          fill
          sizes="48px"
          priority
          // The ring sits well inside the source frame; the scale brings it out
          // to the crop edge. Harmless on a transparent asset, but unnecessary —
          // remove it together with the crop.
          className="scale-[1.34] object-cover"
        />
      </span>
      <Wordmark href={null} descriptor={false} />
    </Link>
  );
}
