import { css, html, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import { base, ensureFonts, head, ids, salla, t, waIcon, whatsappLink } from '../../shared/aoss';

interface Talent { id: number; name: string; url: string; price?: number; image?: { url?: string; alt?: string }; subtitle?: string }

/**
 * Talent profiles (makeup artist, model, قهوجي, hostess…). Each talent is a store product;
 * the merchant picks them here. Card shows photo, name, hourly price and a WhatsApp booking button.
 */
export default class AossTalent extends LitElement {
  @property({ type: Object }) config?: {
    title?: unknown;
    kicker?: string;
    description?: unknown;
    products?: unknown;
    rate_suffix?: unknown;
    book_text?: unknown;
    whatsapp?: string;
  };

  @state() private talents: Talent[] = [];
  @state() private loading = true;

  static styles = [
    base,
    css`
      .intro { color: var(--grey); line-height: 1.8; max-width: 720px; margin: -6px 0 18px; }
      .grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
      .card { border: 1px solid var(--line); border-radius: 20px; overflow: hidden; background: #fff; transition: all .35s; display: flex; flex-direction: column; }
      .card:hover { transform: translateY(-6px); border-color: var(--ink); box-shadow: 0 24px 48px -24px rgba(0, 0, 0, .35); }
      .ph { display: block; aspect-ratio: 4 / 5; background: var(--mist); }
      .ph img { width: 100%; height: 100%; object-fit: cover; display: block; filter: grayscale(.15); }
      .body { padding: 14px; display: flex; flex-direction: column; gap: 6px; flex: 1; }
      .badge { align-self: flex-start; font-family: var(--en); font-size: 10px; letter-spacing: .25em; background: var(--ink); color: #fff; border-radius: 999px; padding: 4px 10px; }
      .name { font-weight: 700; font-size: 16px; margin: 0; }
      .sub { color: var(--grey); font-size: 13px; margin: 0; }
      .rate { font-weight: 600; font-size: 15px; margin-top: auto; }
      .rate small { color: var(--grey); font-weight: 400; }
      .book { margin-top: 8px; width: 100%; padding: 11px 16px; font-size: 14px; }
      .sk { border-radius: 20px; background: var(--mist); aspect-ratio: 4 / 6; animation: pulse 1.5s infinite ease-in-out; }
      @keyframes pulse { 50% { opacity: .55; } }
      @media (max-width: 1024px) { .grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
      @media (max-width: 768px) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    `,
  ];

  async connectedCallback() {
    super.connectedCallback();
    ensureFonts();
    const list = ids(this.config?.products);
    if (!list.length) {
      this.loading = false;
      return;
    }
    try {
      await salla().onReady();
      const results = await Promise.all(
        list.map((id) =>
          salla()
            .product.api.getDetails(id)
            .then((res: { data: Talent }) => res.data)
            .catch(() => null),
        ),
      );
      this.talents = results.filter(Boolean) as Talent[];
    } finally {
      this.loading = false;
    }
  }

  private money(value?: number) {
    if (value == null) return '';
    try {
      return salla().money(value);
    } catch {
      return String(value);
    }
  }

  render() {
    const c = this.config ?? {};
    const count = ids(c.products).length;
    if (!count) return html``;
    const suffix = t(c.rate_suffix) || '/ ساعة';
    const book = t(c.book_text) || 'احجز عبر واتساب';
    return html`
      <div class="wrap">
        ${head(t(c.title), t(c.kicker))}
        ${t(c.description) ? html`<p class="intro">${t(c.description)}</p>` : ''}
        <div class="grid">
          ${this.loading
            ? Array.from({ length: Math.min(count, 4) }, () => html`<div class="sk"></div>`)
            : this.talents.map((p) => {
                const wa = whatsappLink(c.whatsapp, `${book}: ${p.name}`);
                return html`<div class="card">
                  <a class="ph" href=${p.url}>
                    ${p.image?.url ? html`<img src=${p.image.url} alt=${p.image.alt || p.name} loading="lazy" />` : ''}
                  </a>
                  <div class="body">
                    <span class="badge">TALENT</span>
                    <a href=${p.url}><h3 class="name">${p.name}</h3></a>
                    ${p.subtitle ? html`<p class="sub">${p.subtitle}</p>` : ''}
                    ${p.price ? html`<div class="rate">${this.money(p.price)} <small>${suffix}</small></div>` : ''}
                    ${wa
                      ? html`<a class="btn btn--dark book" href=${wa} target="_blank" rel="noopener">${waIcon} ${book}</a>`
                      : html`<a class="btn btn--dark book" href=${p.url}>${book}</a>`}
                  </div>
                </div>`;
              })}
        </div>
      </div>
    `;
  }
}
