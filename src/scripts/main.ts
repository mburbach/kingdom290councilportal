import enContentRaw from '../content/en.json';
import deContentRaw from '../content/de.json';
import linkRegistry from '@config/links.json';
import { dailyRewards } from '../data/dailyRewards';

type LinkReference = {
  label: string;
  linkKey: string;
};

type ResourceItem = LinkReference & {
  title: string;
  description: string;
};

type Section = {
  id: string;
  layout: 'links' | 'cta' | 'resources' | 'daily';
  title: string;
  description: string;
  links?: LinkReference[];
  cta?: LinkReference;
  resources?: ResourceItem[];
};

type PortalContent = {
  locale: string;
  meta: {
    pageTitle: string;
    heroEyebrow: string;
    heroTitle: string;
    heroLead: string;
    footer: string;
  };
  hero: {
    crest: string;
  };
  daily?: {
    otherLabel: string;
  };
  sections: Section[];
};

type LinkRegistry = Record<string, string>;

const links = linkRegistry as LinkRegistry;

const configPlaceholder = {
  links: 'config/links.json'
};

const contentMap = {
  en: enContentRaw as PortalContent,
  de: deContentRaw as PortalContent
};
const activeContent: PortalContent = contentMap.en;
let dailyOtherLabel = 'More days';

export function initPortal(content: PortalContent = activeContent): void {
  document.documentElement.lang = content.locale;
  document.title = content.meta.pageTitle;
  dailyOtherLabel = content.daily?.otherLabel ?? 'More days';

  setText('hero-eyebrow', content.meta.heroEyebrow);
  setText('hero-title', content.meta.heroTitle);
  setText('hero-lede', content.meta.heroLead);
  setText('hero-crest-text', content.hero.crest);

  hydrateFooter(content.meta.footer);
  buildSections(content.sections);
}

function setText(id: string, value: string): void {
  const node = document.getElementById(id);
  if (node) {
    node.textContent = value;
  }
}

function hydrateFooter(template: string): void {
  const footerNode = document.getElementById('footer-text');
  if (!footerNode) return;
  const year = new Date().getFullYear().toString();
  footerNode.textContent = template.replace('{{year}}', year);
}

function buildSections(sections: Section[]): void {
  const container = document.getElementById('portal-sections');
  if (!container) return;
  container.innerHTML = '';

  sections.forEach((section) => {
    const card = document.createElement('section');
    card.className = 'card';

    const heading = document.createElement('h2');
    heading.textContent = section.title;

    const description = document.createElement('p');
    description.textContent = section.description;

    card.append(heading, description);

    if (section.layout === 'links' && section.links) {
      card.appendChild(renderLinks(section.links));
    }

    if (section.layout === 'cta' && section.cta) {
      card.appendChild(renderCta(section.cta));
    }

    if (section.layout === 'resources' && section.resources) {
      card.appendChild(renderResources(section.resources));
    }

    if (section.layout === 'daily') {
      card.appendChild(renderDailyRewards());
    }

    container.appendChild(card);
  });
}

function renderLinks(items: LinkReference[]): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'link-list';
  items.forEach((link) => {
    const anchor = document.createElement('a');
    anchor.className = 'link-pill';
    anchor.href = resolveLink(link.linkKey);
    anchor.target = '_blank';
    anchor.rel = 'noreferrer';
    anchor.textContent = link.label;
    wrapper.appendChild(anchor);
  });
  return wrapper;
}

function renderCta(cta: LinkReference): HTMLElement {
  const anchor = document.createElement('a');
  anchor.className = 'cta';
  anchor.href = resolveLink(cta.linkKey);
  anchor.target = '_blank';
  anchor.rel = 'noreferrer';
  anchor.textContent = cta.label;
  return anchor;
}

function renderResources(items: ResourceItem[]): HTMLElement {
  const list = document.createElement('ul');
  list.className = 'resource-grid';
  items.forEach((item) => {
    const li = document.createElement('li');

    const title = document.createElement('h3');
    title.textContent = item.title;

    const description = document.createElement('p');
    description.textContent = item.description;

    const anchor = document.createElement('a');
    anchor.href = resolveLink(item.linkKey);
    anchor.target = '_blank';
    anchor.rel = 'noreferrer';
    anchor.textContent = item.label;

    li.append(title, description, anchor);
    list.appendChild(li);
  });
  return list;
}

function renderDailyRewards(): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'daily-grid';
  const todayLabel = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date()).toLowerCase();

  const todayEntry = dailyRewards.find((reward) => reward.day.toLowerCase() === todayLabel);
  const remaining = dailyRewards.filter((reward) => reward !== todayEntry);

  if (todayEntry) {
    wrapper.appendChild(buildDailyItem(todayEntry, true));
  }

  if (remaining.length) {
    const details = document.createElement('details');
    details.className = 'daily-collapse';
    const summary = document.createElement('summary');
    summary.textContent = dailyOtherLabel;
    details.appendChild(summary);

    const restList = document.createElement('div');
    restList.className = 'daily-collapse__list';

    remaining.forEach((reward) => {
      restList.appendChild(buildDailyItem(reward));
    });

    details.appendChild(restList);
    wrapper.appendChild(details);
  }

  return wrapper;
}

function buildDailyItem(reward: (typeof dailyRewards)[number], isToday = false): HTMLElement {
  const item = document.createElement('article');
  item.className = 'daily-item';
  if (isToday) {
    item.classList.add('is-today');
  }

  const heading = document.createElement('h3');
  heading.textContent = `${reward.day} – ${reward.title}`;

  const linkGroup = document.createElement('div');
  linkGroup.className = 'daily-links';

  linkGroup.appendChild(buildRewardLink('Total Battle', reward.links.totalBattle));
  linkGroup.appendChild(buildRewardLink('Triumph', reward.links.triumph));
  linkGroup.appendChild(buildRewardLink('Mobile', reward.links.mobile));

  item.append(heading, linkGroup);
  return item;
}

function buildRewardLink(label: string, url: string): HTMLAnchorElement {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.target = '_blank';
  anchor.rel = 'noreferrer';
  anchor.className = 'daily-link';
  anchor.textContent = label;
  return anchor;
}

initPortal();

function resolveLink(key: string): string {
  const url = links[key];
  if (!url) {
    console.warn(`Missing link for key ${key}`);
    return '#';
  }
  return url;
}

export { configPlaceholder };
