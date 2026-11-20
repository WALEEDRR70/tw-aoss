import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { base, ensureFonts, head, list, t } from '../../shared/aoss';

/** "Who we serve" pill tags. */
export default class AossAudiences extends LitElement {
  @property({ type: Object }) config?: { title?: unknown; kicker?: string; tags?: unknown };

  static styles = [
    base,
    css`
      .tags { display: flex; flex-wrap: wrap; gap: 10px; }
      .tags span {
        border: 1px solid var(--line); border-radius: 999px; padding: 10px 18px; font-size: 14px; transition: all .25s;
      }
      .tags span:hover { background: var(--ink); border-color: var(--ink); color: #fff; }
    `,
  ];

  connectedCallback() {
    super.connectedCallback();
    ensureFonts();
  }

  render() {
    const c = this.config ?? {};
    const tags = list<{ name?: unknown }>(c.tags).map((x) => t(x.name)).filter(Boolean);
    if (!tags.length) return html``;
    return html`
      <div class="wrap">
        ${head(t(c.title), t(c.kicker))}
        <div class="tags">${tags.map((name) => html`<span>${name}</span>`)}</div>
      </div>
    `;
  }
}
