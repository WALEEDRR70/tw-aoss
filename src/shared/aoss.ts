import { css, html, svg } from 'lit';

/** Salla SDK on the storefront. */
export const salla = (): any => (window as any).Salla;

/** Multi-language fields may arrive as a plain string or as {ar, en}. */
export function t(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (typeof value === 'object') {
    const v = value as Record<string, string>;
    const lang = document.documentElement.lang?.slice(0, 2) || 'ar';
    return v[lang] ?? v.ar ?? v.en ?? Object.values(v)[0] ?? '';
  }
  return '';
}

/** A collection field arrives as an array (or occasionally a JSON string). */
export function list<T = Record<string, unknown>>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

/** Items fields (dropdown-list) arrive as [{value,label}] or plain ids. */
export function ids(value: unknown): Array<string | number> {
  return list<any>(value)
    .map((item) => (typeof item === 'object' && item ? item.value ?? item.id : item))
    .filter((v) => v !== undefined && v !== null && v !== '');
}

export function whatsappLink(number: unknown, message: string): string {
  const n = String(t(number) || '').replace(/\D/g, '');
  if (!n) return '';
  return `https://wa.me/${n}?text=${encodeURIComponent(message)}`;
}

/** Fonts must live on the document: @font-face inside shadow roots is ignored. */
export function ensureFonts(): void {
  const id = 'aoss-bundle-fonts';
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href =
    'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap';
  document.head.appendChild(link);
}

export const head = (title: string, kicker: string) =>
  title || kicker
    ? html`<div class="head">
        ${title ? html`<h2>${title}</h2>` : ''} ${kicker ? html`<span class="kicker">${kicker}</span>` : ''}
      </div>`
    : '';

export const orbits = (withCore = false) => html`
  <span class="orbit o3" aria-hidden="true"></span>
  <span class="orbit o2" aria-hidden="true"></span>
  <span class="orbit o1" aria-hidden="true"></span>
  ${withCore ? html`<span class="core" aria-hidden="true"></span>` : ''}
`;

export const waIcon = svg`<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.4-3c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.1 5.1 0 0 0 1.1 2.7 11.7 11.7 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3Z"/></svg>`;

/** Brand tokens and building blocks shared by every AOSS component. */
export const base = css`
  :host {
    --ink: #0a0a0a;
    --paper: #ffffff;
    --mist: #f4f4f2;
    --line: #e6e6e3;
    --grey: #6b6b6b;
    --en: 'Space Grotesk', 'IBM Plex Sans Arabic', sans-serif;
    --ar: 'IBM Plex Sans Arabic', 'Space Grotesk', sans-serif;
    display: block;
    margin-block: 2.5rem;
    font-family: var(--ar);
    color: var(--ink);
  }
  *, *::before, *::after { box-sizing: border-box; }
  a { color: inherit; text-decoration: none; }
  .wrap { width: 100%; max-width: 1280px; margin-inline: auto; padding-inline: 16px; }
  .head {
    display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 18px;
  }
  .head h2 { font-size: 24px; font-weight: 700; margin: 0; color: var(--ink); }
  .kicker {
    font-family: var(--en); font-size: 12px; letter-spacing: .25em; text-transform: uppercase; color: var(--grey);
  }
  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer;
    padding: 13px 26px; border-radius: 999px; font-weight: 600; font-size: 15px; font-family: var(--ar);
    border: 0; transition: all .25s ease;
  }
  .btn--light { background: #fff; color: #000; }
  .btn--light:hover { background: transparent; color: #fff; box-shadow: inset 0 0 0 1px #fff; }
  .btn--ghost { background: transparent; color: #fff; box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .35); }
  .btn--ghost:hover { box-shadow: inset 0 0 0 1px #fff; }
  .btn--dark { background: var(--ink); color: #fff; }
  .btn--dark:hover { background: #25d366; }
  .actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; position: relative; }

  .stage {
    position: relative; overflow: hidden; isolation: isolate; text-align: center;
    background: #050505; color: #fff; border-radius: 28px; padding: 76px 28px 68px;
  }
  .stage::before {
    content: ''; position: absolute; inset: -40%; z-index: -2;
    background: radial-gradient(closest-side, rgba(255, 255, 255, .16), rgba(255, 255, 255, 0) 70%) 50% 60% / 60% 60% no-repeat;
  }
  .stage .eyebrow {
    font-family: var(--en); font-size: 12px; letter-spacing: .35em; text-transform: uppercase;
    color: rgba(255, 255, 255, .6); margin-bottom: 18px; position: relative;
  }
  .stage h1, .stage h2.big {
    font-family: var(--en); font-size: clamp(30px, 5.4vw, 64px); line-height: 1.04; font-weight: 700;
    letter-spacing: -.03em; text-transform: uppercase; color: #fff; margin: 0 0 14px; position: relative;
    text-shadow: 0 2px 24px rgba(0, 0, 0, .6);
  }
  .stage p.sub {
    font-size: clamp(15px, 1.8vw, 19px); line-height: 1.8; color: rgba(255, 255, 255, .8);
    max-width: 640px; margin: 0 auto 30px; position: relative; text-shadow: 0 2px 24px rgba(0, 0, 0, .6);
  }
  .orbit {
    position: absolute; left: 50%; top: 78%; z-index: -1; border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, .14); transform: translate(-50%, -50%) rotateX(68deg);
    animation: spin 40s linear infinite;
  }
  .orbit.o1 { width: 520px; height: 520px; }
  .orbit.o2 { width: 780px; height: 780px; border-color: rgba(255, 255, 255, .08); animation-duration: 70s; animation-direction: reverse; }
  .orbit.o3 { width: 1040px; height: 1040px; border-color: rgba(255, 255, 255, .05); animation-duration: 110s; }
  .orbit::after {
    content: ''; position: absolute; top: -3px; left: 50%; width: 6px; height: 6px; border-radius: 50%;
    background: #fff; box-shadow: 0 0 14px 4px rgba(255, 255, 255, .6);
  }
  .core {
    position: absolute; left: 50%; top: 78%; z-index: -1; width: 120px; height: 120px; border-radius: 50%;
    transform: translate(-50%, -50%); background: #000;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, .25), 0 0 60px 18px rgba(255, 255, 255, .12), inset 0 0 30px rgba(255, 255, 255, .08);
  }
  @keyframes spin { to { transform: translate(-50%, -50%) rotateX(68deg) rotate(360deg); } }
  @media (max-width: 768px) {
    .stage { padding: 56px 18px 48px; border-radius: 22px; }
    .orbit.o1 { width: 340px; height: 340px; }
    .orbit.o2 { width: 520px; height: 520px; }
    .core { width: 90px; height: 90px; top: 82%; }
  }
  @media (prefers-reduced-motion: reduce) { .orbit { animation: none; } }
`;
