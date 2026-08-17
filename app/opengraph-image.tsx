import { ImageResponse } from 'next/og';
import { fullAddress, restaurant } from '@/content/restaurant';

export const alt = 'Enzo di Napoli — nápolyi pizzéria Hatvanban';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * The social card.
 *
 * Drawn rather than photographed: a share preview is rendered at thumbnail size
 * in a feed, where a photograph of a pizza becomes an unreadable smudge but the
 * wordmark and the town name stay legible. Uses the brand ground and accent
 * directly — no font is fetched, so the card renders even if a font CDN is
 * unreachable at build time.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#1B191A',
        padding: '72px 80px',
        fontFamily: 'serif',
        position: 'relative',
      }}
    >
      {/* The ember, as a soft radial in the corner where the oven would be. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(600px 420px at 82% 78%, rgba(168,96,38,0.34), rgba(27,25,26,0) 70%)',
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {/* Satori requires an explicit display on any node with more than one
              child, so every wrapper here declares it. */}
        <div
          style={{
            display: 'flex',
            fontSize: 22,
            letterSpacing: 10,
            color: '#CCBE86',
            textTransform: 'uppercase',
            fontFamily: 'sans-serif',
          }}
        >
          {`${restaurant.city} · ${restaurant.address.street}`}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div style={{ fontSize: 92, color: '#F2EDE4', lineHeight: 1.02, letterSpacing: -1 }}>
          ENZO DI NAPOLI
        </div>
        <div
          style={{
            fontSize: 24,
            letterSpacing: 14,
            color: '#CCBE86',
            marginTop: 18,
            textTransform: 'uppercase',
            fontFamily: 'sans-serif',
          }}
        >
          Pizza Tradizionale
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          position: 'relative',
          borderTop: '1px solid rgba(204,190,134,0.35)',
          paddingTop: 28,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 26, color: '#A69C90', display: 'flex' }}>
          {`Nápolyi pizza AVPN minősítésű ${restaurant.oven} kemencéből`}
        </div>
        <div style={{ fontSize: 22, color: '#A69C90', display: 'flex' }}>{fullAddress}</div>
      </div>
    </div>,
    size,
  );
}
