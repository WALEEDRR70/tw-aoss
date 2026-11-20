import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { base, ensureFonts, head, list, t } from '../../shared/aoss';

/** FAQ accordion built on native <details>. */
export default class AossFaq extends LitElement {
  @property({ type: Object }) config?: { title?: unknown; kicker?: string; items?: unknown };

  static styles = [
    base,
    css`
      details { border-bottom: 1px solid var(--line); }
      summary {
        list-style: none; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 12px;
        padding: 18px 2px; font-weight: 600; font-size: 16px;
      }
      summary::-webkit-details-marker { display: none; }
      summary::after { content: '+'; font-family: var(--en); font-size: 22px; font-weight: 400; transition: transform .25s; }
      details[open] summary::after { transform: rotate(45deg); }
      p { margin: 0 0 18px; color: var(--grey); line-height: 1.8; font-size: 14px; white-space: pre-line; }
    `,
  ];

  connectedCallback() {
    super.connectedCallback();
    ensureFonts();
  }

  render() {
    const c = this.config ?? {};
    const items = list<{ q?: unknown; a?: unknown }>(c.items).filter((i) => t(i.q));
    if (!items.length) return html``;
    return html`
      <div class="wrap">
        ${head(t(c.title), t(c.kicker))}
        ${items.map((i) => html`<details><summary>${t(i.q)}</summary><p>${t(i.a)}</p></details>`)}
      </div>
    `;
  }
}
