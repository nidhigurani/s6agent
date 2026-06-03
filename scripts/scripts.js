import {
  buildBlock,
  loadHeader,
  loadFooter,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
} from './aem.js';

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    if (h1.closest('.hero') || picture.closest('.hero')) {
      return;
    }
    const img = picture.querySelector('img');
    if (img && (!img.src || img.src === 'about:error' || img.src.includes('about:error'))) {
      img.src = 'https://www.goindigo.in/content/dam/s6web/in/en/assets/static-pages/6e-sme/sme-banner-new.png';
      picture.querySelectorAll('source').forEach((source) => {
        source.srcset = img.src;
      });
    }
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

const STATS_LABELS = [
  'Daily Flights', 'Domestic Destinations',
  'International Destinations', 'Happy Customers', 'Fleet Strong',
];

function buildStatsBlock(main) {
  const paragraphs = [...main.querySelectorAll('p')];
  const startIdx = paragraphs.findIndex(
    (p) => STATS_LABELS.some((l) => p.textContent.trim() === l),
  );
  if (startIdx < 1) return;

  const numberIdx = startIdx - 1;
  const statParagraphs = [];
  let i = numberIdx;
  while (i < paragraphs.length) {
    const text = paragraphs[i].textContent.trim();
    if (text === 'style' || text === 'light') break;
    statParagraphs.push(paragraphs[i]);
    i += 1;
  }

  if (statParagraphs.length < 4) return;

  const rows = [];
  for (let j = 0; j < statParagraphs.length; j += 2) {
    const number = statParagraphs[j]?.textContent.trim() || '';
    const label = statParagraphs[j + 1]?.textContent.trim() || '';
    if (number && label) rows.push([number, label]);
  }

  if (rows.length < 2) return;

  const block = buildBlock('stats', rows.map((row) => row.map((cell) => {
    const div = document.createElement('div');
    div.textContent = cell;
    return div;
  })));

  const section = statParagraphs[0].closest('div');
  statParagraphs.forEach((p) => p.remove());
  section.append(block);
}

function buildSectionMetadataFromParagraphs(main) {
  const paragraphs = [...main.querySelectorAll('p')];
  const styleIdx = paragraphs.findIndex((p) => p.textContent.trim() === 'style');
  if (styleIdx < 0 || styleIdx >= paragraphs.length - 1) return;

  const valueP = paragraphs[styleIdx + 1];
  if (!valueP) return;

  const value = valueP.textContent.trim();
  if (!value) return;

  const section = paragraphs[styleIdx].closest('div');
  const metadata = document.createElement('div');
  metadata.className = 'section-metadata';
  const row = document.createElement('div');
  const keyCell = document.createElement('div');
  keyCell.textContent = 'style';
  const valueCell = document.createElement('div');
  valueCell.textContent = value;
  row.append(keyCell, valueCell);
  metadata.append(row);

  paragraphs[styleIdx].remove();
  valueP.remove();
  section.append(metadata);
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    // auto load `*/fragments/*` references
    const fragments = [...main.querySelectorAll('a[href*="/fragments/"]')].filter((f) => !f.closest('.fragment'));
    if (fragments.length > 0) {
      // eslint-disable-next-line import/no-cycle
      import('../blocks/fragment/fragment.js').then(({ loadFragment }) => {
        fragments.forEach(async (fragment) => {
          try {
            const { pathname } = new URL(fragment.href);
            const frag = await loadFragment(pathname);
            fragment.parentElement.replaceWith(...frag.children);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Fragment loading failed', error);
          }
        });
      });
    }

    buildSectionMetadataFromParagraphs(main);
    buildStatsBlock(main);
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates formatted links to style them as buttons.
 * @param {HTMLElement} main The main container element
 */
function decorateButtons(main) {
  main.querySelectorAll('p a[href]').forEach((a) => {
    a.title = a.title || a.textContent;
    const p = a.closest('p');
    const text = a.textContent.trim();

    // quick structural checks
    if (a.querySelector('img') || p.textContent.trim() !== text) return;

    // skip URL display links
    try {
      if (new URL(a.href).href === new URL(text, window.location).href) return;
    } catch { /* continue */ }

    // require authored formatting for buttonization
    const strong = a.closest('strong');
    const em = a.closest('em');
    if (!strong && !em) return;

    p.className = 'button-wrapper';
    a.className = 'button';
    if (strong && em) { // high-impact call-to-action
      a.classList.add('accent');
      const outer = strong.contains(em) ? strong : em;
      outer.replaceWith(a);
    } else if (strong) {
      a.classList.add('primary');
      strong.replaceWith(a);
    } else {
      a.classList.add('secondary');
      em.replaceWith(a);
    }
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
function decorateSectionMetadata(main) {
  main.querySelectorAll('.section-metadata').forEach((metadata) => {
    const section = metadata.closest('.section');
    if (section) {
      [...metadata.children].forEach((row) => {
        const key = row.children[0]?.textContent.trim().toLowerCase();
        const value = row.children[1]?.textContent.trim();
        if (key === 'style') {
          value.split(',').forEach((style) => {
            section.classList.add(style.trim());
          });
        }
      });
    }
    metadata.remove();
  });
}

// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  decorateButtons(main);
  decorateSectionMetadata(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  loadHeader(doc.querySelector('header'));

  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
