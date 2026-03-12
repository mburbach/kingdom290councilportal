import enContentRaw from '../content/en.json';
import deContentRaw from '../content/de.json';

type WikiEntry = {
  category: string;
  title: string;
  slug: string;
  content: string;
};

type WikiModuleMap = Record<string, string>;

type WikiCopy = {
  pageTitle: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  backLinkLabel: string;
  navToggleLabel: string;
  copyButton: string;
  copySuccess: string;
};

type LocaleContent = {
  locale: string;
  wiki: WikiCopy;
};

const modules = import.meta.glob('../../wikitext/**/*.md', { eager: true, as: 'raw' }) as WikiModuleMap;
const entries = buildEntries(modules);
const grouped = groupByCategory(entries);

const locales: Record<string, LocaleContent> = {
  en: enContentRaw as LocaleContent,
  de: deContentRaw as LocaleContent
};

const activeLocale = locales.en;
const wikiCopy = activeLocale.wiki;

const menuRoot = document.getElementById('wiki-menu');
const breadcrumb = document.getElementById('wiki-breadcrumb');
const articleTitle = document.getElementById('wiki-article-title');
const articleContent = document.getElementById('wiki-article-content');
const nav = document.getElementById('wiki-nav');
const navToggle = document.getElementById('wiki-nav-toggle');
const navToggleText = document.getElementById('wiki-nav-toggle-text');
const backLink = document.getElementById('wiki-back-link') as HTMLAnchorElement | null;
const copyButton = document.getElementById('wiki-copy') as HTMLButtonElement | null;

document.documentElement.lang = activeLocale.locale;
document.title = wikiCopy.pageTitle;
setText('wiki-eyebrow', wikiCopy.eyebrow);
setText('wiki-title', wikiCopy.title);
setText('wiki-subtitle', wikiCopy.subtitle);
setTextElement(navToggleText, wikiCopy.navToggleLabel);
if (backLink) {
  backLink.textContent = wikiCopy.backLinkLabel;
}
if (copyButton) {
  copyButton.textContent = wikiCopy.copyButton;
}

renderMenu();
if (entries[0]) {
  loadEntry(entries[0]);
}

navToggle?.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  nav?.classList.toggle('open');
});

function renderMenu(): void {
  if (!menuRoot) return;
  Object.entries(grouped).forEach(([category, items], index) => {
    const wrapper = document.createElement('div');
    const heading = document.createElement('h3');
    heading.textContent = formatTitle(category);
    wrapper.appendChild(heading);

    const list = document.createElement('ul');
    list.className = 'wiki-menu__list';

    items.forEach((entry) => {
      const button = document.createElement('button');
      button.textContent = entry.title;
      button.dataset.slug = entry.slug;
      if (index === 0 && entry === items[0]) {
        button.classList.add('active');
      }
      button.addEventListener('click', () => {
        loadEntry(entry);
        updateActive(button);
        if (nav?.classList.contains('open')) {
          nav.classList.remove('open');
          navToggle?.setAttribute('aria-expanded', 'false');
        }
      });
      const li = document.createElement('li');
      li.appendChild(button);
      list.appendChild(li);
    });

    wrapper.appendChild(list);
    menuRoot.appendChild(wrapper);
  });
}

function loadEntry(entry: WikiEntry): void {
  if (breadcrumb) {
    breadcrumb.textContent = `${formatTitle(entry.category)} › ${entry.title}`;
  }
  if (articleTitle) {
    articleTitle.textContent = entry.title;
  }
  if (articleContent) {
    articleContent.innerHTML = markdownToHtml(entry.content);
  }
  copyButton?.classList.remove('success');
}

function updateActive(button: HTMLButtonElement): void {
  menuRoot?.querySelectorAll('button').forEach((btn) => btn.classList.remove('active'));
  button.classList.add('active');
}

function buildEntries(map: WikiModuleMap): WikiEntry[] {
  return Object.entries(map)
    .map(([path, content]) => {
      const segments = path.split('/');
      const fileName = segments.pop() ?? 'entry';
      const category = segments.pop() ?? 'general';
      return {
        category,
        slug: `${category}-${fileName.replace(/\.md$/, '')}`,
        title: formatTitle(fileName.replace(/\.md$/, '')),
        content
      } satisfies WikiEntry;
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

function groupByCategory(items: WikiEntry[]): Record<string, WikiEntry[]> {
  return items.reduce<Record<string, WikiEntry[]>>((acc, entry) => {
    acc[entry.category] ??= [];
    acc[entry.category].push(entry);
    return acc;
  }, {});
}

function formatTitle(value: string): string {
  return value
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase())
    .trim();
}

function markdownToHtml(text: string): string {
  const lines = text.split('\n');
  const html: string[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length) {
      html.push(`<ul>${listItems.map((item) => `<li>${item}</li>`).join('')}</ul>`);
      listItems = [];
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      html.push('');
      return;
    }

    if (/^[\-\*∙•]/.test(trimmed)) {
      listItems.push(trimmed.replace(/^[\-\*∙•\s]+/, ''));
      return;
    }

    flushList();

    if (/^[A-Z0-9\s]+:$/u.test(trimmed)) {
      html.push(`<h3>${trimmed.slice(0, -1)}</h3>`);
      return;
    }

    html.push(`<p>${trimmed}</p>`);
  });

  flushList();

  return html.filter(Boolean).join('');
}

copyButton?.addEventListener('click', async () => {
  if (!articleContent) return;
  await navigator.clipboard.writeText(articleContent.innerText);
  if (copyButton) {
    copyButton.textContent = wikiCopy.copySuccess;
    copyButton.classList.add('success');
    setTimeout(() => {
      copyButton.textContent = wikiCopy.copyButton;
      copyButton.classList.remove('success');
    }, 2000);
  }
});

function setText(id: string, value: string): void {
  const node = document.getElementById(id);
  setTextElement(node, value);
}

function setTextElement(node: HTMLElement | null | undefined, value: string): void {
  if (node) {
    node.textContent = value;
  }
}
