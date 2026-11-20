import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { base, ensureFonts, head, list, t } from '../../shared/aoss';

/** Numbered work steps: English step name, Arabic description. */
export default class AossProcess extends LitElement {
  @property({ type: Object }) config?: { title?: unknown; kicker?: string; steps?: unknown };

  static styles = [
    base,
    css`
      .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; }
      .s { border-top: 2px solid var(--ink); padding: 18px 4px 6px; }
      .s i { font-style: normal; font-family: var(--en); font-size: 12px; letter-spacing: .1em; color: var(--grey); }
      .s b { display: block; font-family: var(--en); font-size: 18px; font-weight: 700; text-transform: uppercase; margin: 10px 0 6px; }
      .s p { margin: 0; font-size: 14px; line-height: 1.7; color: var(--grey); }
    `,
  ];

  connectedCallback() {
    super.connectedCallback();
    ensureFonts();
  }

  render() {
    const c = this.config ?? {};
    const steps = list<{ en?: unknown; ar?: unknown }>(c.steps);
    if (!steps.length) return html``;
    return html`
      <div class="wrap">
        ${head(t(c.title), t(c.kicker))}
        <div class="grid">
          ${steps.map(
            (s, i) => html`<div class="s"><i>${String(i + 1).padStart(2, '0')}</i><b>${t(s.en)}</b><p>${t(s.ar)}</p></div>`,
          )}
        </div>
      </div>
    `;
  }
}
