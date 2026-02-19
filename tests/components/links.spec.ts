import { describe, it, expect, beforeEach, vi } from 'vitest';
import linkRegistry from '@config/links.json';

describe('portal hydration', () => {
  beforeEach(() => {
    vi.resetModules();
    document.body.innerHTML = `
      <header class="hero">
        <div class="hero__crest"><span id="hero-crest-text"></span></div>
        <div>
          <p class="eyebrow" id="hero-eyebrow"></p>
          <h1 id="hero-title"></h1>
          <p class="lede" id="hero-lede"></p>
        </div>
      </header>
      <main id="portal-sections"></main>
      <footer>
        <p id="footer-text"></p>
      </footer>
    `;
  });

  it('renders hero, sections and footer from localized content', async () => {
    const module = await import('../../src/scripts/main');

    expect(document.getElementById('hero-title')?.textContent).toContain('Ratssaal');

    const cards = document.querySelectorAll('#portal-sections .card');
    expect(cards.length).toBeGreaterThanOrEqual(3);

    const footerText = document.getElementById('footer-text')?.textContent;
    expect(footerText).toContain(new Date().getFullYear().toString());
    expect(module.configPlaceholder.links).toBe('config/links.json');

    const firstLink = document.querySelector('.link-list a') as HTMLAnchorElement | null;
    const cta = document.querySelector('.cta') as HTMLAnchorElement | null;
    expect(firstLink?.href).toBe(linkRegistry.roe);
    expect(cta?.href).toBe(linkRegistry.loss_calculator);
  });
});
