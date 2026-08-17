import React from 'react';
import Link from 'next/link';
import { PendingData } from '@/components/site/legal-layout';

/**
 * A deliberately small Markdown subset, parsed to React elements.
 *
 * The admin can edit the body of every legal page, and that text renders on
 * public pages. That makes it stored input, so it is treated as hostile:
 *
 * - **No raw HTML is ever parsed or emitted.** There is no `dangerouslySetInnerHTML`
 *   anywhere in this file. Anything that is not one of the constructs below
 *   arrives as a text node, which React escapes. Pasting `<script>` into the
 *   editor puts the literal characters on the page and nothing else.
 * - **Link hrefs are scheme-checked.** Only http, https, mailto and site-relative
 *   paths survive; `javascript:` and `data:` links render as plain text.
 * - The grammar is line-based and total: every input produces output, so a
 *   malformed document degrades to paragraphs rather than throwing on a page a
 *   visitor is reading.
 *
 * Supported: `##`/`###` headings, paragraphs, `-` and `1.` lists, `**bold**`,
 * `` `code` ``, `[text](href)`, and `{{token}}` substitution.
 */

/** Tokens an admin can drop into prose; resolved from the company record. */
export type TokenMap = Readonly<Record<string, { value: string; label: string }>>;

const SAFE_SCHEME = /^(https?:|mailto:)/i;

function isSafeHref(href: string): boolean {
  const trimmed = href.trim();
  if (trimmed.startsWith('/')) return true; // site-relative
  if (trimmed.startsWith('#')) return true; // in-page anchor
  return SAFE_SCHEME.test(trimmed);
}

type Inline =
  | { kind: 'text' | 'bold' | 'code'; text: string }
  | { kind: 'link'; text: string; href: string }
  | { kind: 'token'; name: string };

/** Splits one line into inline runs. Order matters: tokens, links, bold, code. */
function parseInline(line: string): Inline[] {
  const out: Inline[] = [];
  // A single pass over the alternatives keeps precedence unambiguous and avoids
  // the nested-replacement bugs that come from running several regexes in turn.
  const pattern = /\{\{([a-zA-Z0-9_.]+)\}\}|\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|`([^`]+)`/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(line)) !== null) {
    if (match.index > last) out.push({ kind: 'text', text: line.slice(last, match.index) });

    if (match[1] !== undefined) {
      out.push({ kind: 'token', name: match[1] });
    } else if (match[2] !== undefined && match[3] !== undefined) {
      const href = match[3];
      // An unsafe scheme loses its link and keeps its text — the reader still
      // sees what the author wrote, but it is inert.
      if (isSafeHref(href)) out.push({ kind: 'link', text: match[2], href: href.trim() });
      else out.push({ kind: 'text', text: match[2] });
    } else if (match[4] !== undefined) {
      out.push({ kind: 'bold', text: match[4] });
    } else if (match[5] !== undefined) {
      out.push({ kind: 'code', text: match[5] });
    }

    last = pattern.lastIndex;
  }

  if (last < line.length) out.push({ kind: 'text', text: line.slice(last) });
  return out;
}

function renderInline(line: string, tokens: TokenMap, keyPrefix: string): React.ReactNode[] {
  return parseInline(line).map((run, index) => {
    const key = `${keyPrefix}-${index}`;
    switch (run.kind) {
      case 'bold':
        return <strong key={key}>{run.text}</strong>;
      case 'code':
        return <code key={key}>{run.text}</code>;
      case 'link':
        // Internal links go through next/link for client navigation; external
        // links always carry noopener and say where they lead.
        return run.href.startsWith('/') ? (
          <Link key={key} href={run.href}>
            {run.text}
          </Link>
        ) : (
          <a key={key} href={run.href} target="_blank" rel="noopener noreferrer">
            {run.text}
          </a>
        );
      case 'token': {
        const token = tokens[run.name];
        if (!token) {
          // An unknown token is an authoring mistake, not content. Show it as
          // written so the admin can see and fix it.
          return <span key={key}>{`{{${run.name}}}`}</span>;
        }
        if (token.value.trim() === '') {
          return <PendingData key={key}>{token.label}</PendingData>;
        }
        return <span key={key}>{token.value}</span>;
      }
      default:
        return <span key={key}>{run.text}</span>;
    }
  });
}

type Block = { type: 'h2' | 'h3' | 'p'; lines: string[] } | { type: 'ul' | 'ol'; items: string[] };

function toBlocks(source: string): Block[] {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  let paragraph: string[] = [];

  const flush = () => {
    if (paragraph.length > 0) {
      blocks.push({ type: 'p', lines: paragraph });
      paragraph = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (line.trim() === '') {
      flush();
      continue;
    }
    if (line.startsWith('### ')) {
      flush();
      blocks.push({ type: 'h3', lines: [line.slice(4)] });
      continue;
    }
    if (line.startsWith('## ')) {
      flush();
      blocks.push({ type: 'h2', lines: [line.slice(3)] });
      continue;
    }

    const bullet = /^[-*]\s+(.*)$/.exec(line);
    if (bullet) {
      flush();
      const previous = blocks[blocks.length - 1];
      if (previous && previous.type === 'ul') previous.items.push(bullet[1] ?? '');
      else blocks.push({ type: 'ul', items: [bullet[1] ?? ''] });
      continue;
    }

    const numbered = /^\d+[.)]\s+(.*)$/.exec(line);
    if (numbered) {
      flush();
      const previous = blocks[blocks.length - 1];
      if (previous && previous.type === 'ol') previous.items.push(numbered[1] ?? '');
      else blocks.push({ type: 'ol', items: [numbered[1] ?? ''] });
      continue;
    }

    paragraph.push(line);
  }

  flush();
  return blocks;
}

/** Renders the constrained Markdown subset. Safe for admin-authored text. */
export function Markdown({ source, tokens = {} }: { source: string; tokens?: TokenMap }) {
  const blocks = toBlocks(source);

  return (
    <>
      {blocks.map((block, index) => {
        const key = `b${index}`;
        switch (block.type) {
          case 'h2':
            return <h2 key={key}>{renderInline(block.lines[0] ?? '', tokens, key)}</h2>;
          case 'h3':
            return <h3 key={key}>{renderInline(block.lines[0] ?? '', tokens, key)}</h3>;
          case 'ul':
            return (
              <ul key={key}>
                {block.items.map((item, i) => (
                  <li key={`${key}-${i}`}>{renderInline(item, tokens, `${key}-${i}`)}</li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={key}>
                {block.items.map((item, i) => (
                  <li key={`${key}-${i}`}>{renderInline(item, tokens, `${key}-${i}`)}</li>
                ))}
              </ol>
            );
          default:
            return (
              <p key={key}>
                {block.lines.map((line, i) => (
                  <React.Fragment key={`${key}-${i}`}>
                    {i > 0 ? ' ' : null}
                    {renderInline(line, tokens, `${key}-${i}`)}
                  </React.Fragment>
                ))}
              </p>
            );
        }
      })}
    </>
  );
}

/** Counts unresolved `{{token}}` references, for the pending-data report. */
export function countPendingTokens(source: string, tokens: TokenMap): string[] {
  const found: string[] = [];
  for (const match of source.matchAll(/\{\{([a-zA-Z0-9_.]+)\}\}/g)) {
    const name = match[1] ?? '';
    const token = tokens[name];
    if (token && token.value.trim() === '') found.push(token.label);
  }
  return found;
}
