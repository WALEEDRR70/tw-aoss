import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { base, ensureFonts, orbits, t, waIcon, whatsappLink } from '../../shared/aoss';

/** Closing call to action: black stage with orbits and one button (link or WhatsApp). */
export default class AossCta extends LitElement {
  @property({ type: Object }) config?: {
    title?: unknown;
    text?: unknown;
    button_text?: unknown;
    button_url?: string;
    whatsapp?: string;
  };

  static styles = [base];

  connectedCallback() {
    super.connectedCallback();
    ensureFonts();
  }

  render() {
    const c = this.config ?? {};
    const title = t(c.title);
    if (!title) return html``;
    const label = t(c.button_text);
    const href = t(c.button_url) || whatsappLink(c.whatsapp, label || title);
    return html`
      <div class="wrap">
        <div class="stage" style="padding:64px 24px">
          ${orbits()}
          <h2 class="big" style="font-size:clamp(24px,4vw,44px)">${title}</h2>
          ${t(c.text) ? html`<p class="sub">${t(c.text)}</p>` : ''}
          ${label && href
            ? html`<div class="actions">
                <a class="btn btn--light" href=${href} target=${href.startsWith('https://wa.me') ? '_blank' : '_self'} rel="noopener">
                  ${href.startsWith('https://wa.me') ? waIcon : ''} ${label}
                </a>
              </div>`
            : ''}
        </div>
      </div>
    `;
  }
}
