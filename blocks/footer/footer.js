import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // restructure flat content into columns based on h2 headings
  const wrapper = footer.querySelector('.default-content-wrapper');
  if (wrapper) {
    const columns = [];
    let current = null;

    [...wrapper.children].forEach((el) => {
      if (el.tagName === 'H2') {
        current = document.createElement('div');
        current.classList.add('footer-column');
        current.append(el);
        columns.push(current);
      } else if (current) {
        current.append(el);
      }
    });

    if (columns.length > 0) {
      const grid = document.createElement('div');
      grid.classList.add('footer-grid');
      columns.forEach((col) => grid.append(col));
      wrapper.textContent = '';
      wrapper.append(grid);
    }
  }

  // restructure second section (awards/social)
  const sections = footer.querySelectorAll('.section');
  if (sections.length > 1) {
    const bottomSection = sections[sections.length - 1];
    const bottomWrapper = bottomSection.querySelector('.default-content-wrapper');
    if (bottomWrapper) {
      bottomWrapper.classList.add('footer-bottom');
    }
  }

  block.append(footer);
}
