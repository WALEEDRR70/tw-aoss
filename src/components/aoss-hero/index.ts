import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { base, ensureFonts, orbits, t } from '../../shared/aoss';

/** AOSS cinematic hero: big English headline, Arabic line beneath, animated orbits. */
export default class AossHero extends LitElement {
  @property({ type: Object }) config?: {
    kicker?: string;
    title?: unknown;
    subtitle?: unknown;
    background?: string;
    show_orbits?: boolean;
    primary_text?: unknown;
    primary_url?: string;
    secondary_text?: unknown;
    secondary_url?: string;
  };

  static styles = [
    base,
    css`
      .stage.has-bg::after {
        content: ''; position: absolute; inset: 0; z-index: -3;
        background: linear-gradient(180deg, rgba(0, 0, 0, .55), rgba(0, 0, 0, .8)), var(--bg) center / cover no-repeat;
      }
    `,
  ];

  connectedCallback() {
    super.connectedCallback();
    ensureFonts();
  }

  render() {
    const c = this.config ?? {};
    const title = t(c.title);
    if (!title) return html``;
    const bg = t(c.background);
    const primary = t(c.primary_text);
    const secondary = t(c.secondary_text);
    return html`
      <div class="wrap">
        <div class="stage ${bg ? 'has-bg' : ''}" style=${bg ? `--bg:url("${bg}")` : ''}>
          ${c.show_orbits !== false ? orbits(true) : ''}
          ${c.kicker ? html`<div class="eyebrow">${t(c.kicker)}</div>` : ''}
          <h1>${title}</h1>
          ${t(c.subtitle) ? html`<p class="sub">${t(c.subtitle)}</p>` : ''}
          <div class="actions">
            ${primary ? html`<a class="btn btn--light" href=${t(c.primary_url) || '#'}>${primary}</a>` : ''}
            ${secondary ? html`<a class="btn btn--ghost" href=${t(c.secondary_url) || '#'}>${secondary}</a>` : ''}
          </div>
        </div>
      </div>
    `;
  }
}
