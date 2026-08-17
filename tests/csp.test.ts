import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * The admin CSP allows exactly one inline script, by hash.
 *
 * If someone edits that script in app/layout.tsx and forgets the hash in
 * middleware.ts, the admin silently loses it — and because CSP failures only
 * appear in the browser console, nobody would notice until something depending
 * on it broke. This test ties the two together.
 */

const ROOT = process.cwd();
const layout = readFileSync(join(ROOT, 'app/layout.tsx'), 'utf8');
const middleware = readFileSync(join(ROOT, 'middleware.ts'), 'utf8');

describe('admin content security policy', () => {
  it('allows the layout inline script by its actual hash', () => {
    const match = /__html:\s*"([^"]+)"/.exec(layout);
    expect(match, 'inline script not found in app/layout.tsx').toBeTruthy();

    const script = match![1]!;
    const hash = `sha256-${createHash('sha256').update(script, 'utf8').digest('base64')}`;

    expect(middleware.includes(hash), `middleware.ts must allow '${hash}' in script-src`).toBe(
      true,
    );
  });

  it('keeps the directives that actually stop the attacks', () => {
    for (const directive of [
      "object-src 'none'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-src 'none'",
    ]) {
      expect(middleware).toContain(directive);
    }
  });

  it('never allows unsafe-inline for scripts on the admin', () => {
    // The directive as it is actually built, not any prose about it elsewhere
    // in the file — matching loosely here would pass on a comment.
    const line = middleware.split('\n').find((l) => l.trimStart().startsWith('`script-src'));
    expect(line, 'script-src directive not found in middleware.ts').toBeTruthy();
    expect(line).not.toContain('unsafe-inline');
    expect(line).toContain('nonce-');
  });

  it('marks admin responses no-store and noindex', () => {
    expect(middleware).toContain('no-store');
    expect(middleware).toContain('noindex');
  });
});
