import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { base, ensureFonts, head, list, t, whatsappLink } from '../../shared/aoss';

interface Service { en?: unknown; ar?: unknown; url?: string; label?: unknown }

/** Numbered services grid. Cards without a link open a WhatsApp quote request. */
export default class AossServices extends LitElement {
  @property({ type: Object }) config?: { title?: unknown; kicker?: string; whatsapp?: string; items?: unknown };

  static styles = [
    base,
    css`
      .grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px; }
      .card {
        display: flex; flex-direction: column; justify-content: space-between; gap: 14px; min-height: 150px;
        border: 1px solid var(--line); border-radius: 18px; padding: 18px 16px 16px; background: #fff; transition: all .3s ease;
      }
      .card:hover { background: var(--ink); border-color: var(--ink); transform: translateY(-4px); }
      .card:hover * { color: #fff !important; }
      .n { font-family: var(--en); font-size: 12px; letter-spacing: .1em; color: var(--grey); }
      .en { display: block; font-family: var(--en); font-size: 13px; font-weight: 600; text-transform: uppercase; color: var(--ink); margin-bottom: 4px; }
      .ar { display: block; font-size: 13px; line-height: 1.6; color: var(--grey); }
      .go { font-style: normal; font-size: 12px; color: var(--ink); opacity: .55; }
      .card:hover .go { opacity: 1; }
      @media (max-width: 1024px) { .grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
      @media (max-width: 768px) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    `,
  ];

  connectedCallback() {
    super.connectedCallback();
    ensureFonts();
  }

  render() {
    const c = this.config ?? {};
    const items = list<Service>(c.items);
    if (!items.length) return html``;
    return html`
      <div class="wrap">
        ${head(t(c.title), t(c.kicker))}
        <div class="grid">
          ${items.map((item, i) => {
            const en = t(item.en);
            const ar = t(item.ar);
            const href = t(item.url) || whatsappLink(c.whatsapp, `${ar || en}`);
            const external = href.startsWith('https://wa.me');
            return html`<a class="card" href=${href || '#'} target=${external ? '_blank' : '_self'} rel="noopener">
              <span class="n">${String(i + 1).padStart(2, '0')}</span>
              <span>${en ? html`<span class="en">${en}</span>` : ''}${ar ? html`<span class="ar">${ar}</span>` : ''}</span>
              ${t(item.label) ? html`<i class="go">${t(item.label)}</i>` : ''}
            </a>`;
          })}
        </div>
      </div>
    `;
  }
}
