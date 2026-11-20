import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { base, ensureFonts, head, list, t } from '../../shared/aoss';

/** "Why AOSS" feature cards. */
export default class AossFeatures extends LitElement {
  @property({ type: Object }) config?: { title?: unknown; kicker?: string; items?: unknown };

  static styles = [
    base,
    css`
      .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
      .f { background: var(--mist); border-radius: 18px; padding: 22px; }
      .f b { display: block; font-size: 16px; margin-bottom: 6px; color: var(--ink); }
      .f p { margin: 0; font-size: 14px; line-height: 1.7; color: var(--grey); }
      @media (max-width: 768px) { .grid { grid-template-columns: 1fr; } }
    `,
  ];

  connectedCallback() {
    super.connectedCallback();
    ensureFonts();
  }

  render() {
    const c = this.config ?? {};
    const items = list<{ title?: unknown; text?: unknown }>(c.items);
    if (!items.length) return html``;
    return html`
      <div class="wrap">
        ${head(t(c.title), t(c.kicker))}
        <div class="grid">
          ${items.map((i) => html`<div class="f"><b>${t(i.title)}</b><p>${t(i.text)}</p></div>`)}
        </div>
      </div>
    `;
  }
}
