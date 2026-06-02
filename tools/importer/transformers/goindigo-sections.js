/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: goindigo sections.
 * Inserts section breaks (<hr>) between template sections.
 * Template defines 3 sections:
 *   - Hero Banner (section.hero-banner)
 *   - Program Introduction (section.content)
 *   - Terms and Conditions (section.terms-conditions)
 *
 * Strategy: Uses template section selectors to find section boundaries.
 * Falls back to direct children of main when selectors don't match
 * (live page may have different structure than cleaned HTML).
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { template } = payload;
    if (!template || !template.sections || template.sections.length < 2) return;

    const doc = element.ownerDocument;
    const sections = template.sections;

    // Attempt to find section elements by selector
    const sectionElements = sections.map((section) => {
      return element.querySelector(section.selector) || doc.querySelector(section.selector);
    });

    const matched = sectionElements.filter(Boolean);

    if (matched.length >= 2) {
      // Selectors matched - insert <hr> and Section Metadata in reverse order
      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionEl = sectionElements[i];
        if (!sectionEl) continue;

        if (sections[i].style) {
          const metaBlock = WebImporter.Blocks.createBlock(doc, {
            name: 'Section Metadata',
            cells: { style: sections[i].style },
          });
          sectionEl.append(metaBlock);
        }

        if (i > 0) {
          const hr = doc.createElement('hr');
          sectionEl.before(hr);
        }
      }
    } else {
      // Fallback: use direct children of main as section boundaries
      const children = [...element.children].filter(
        (child) => child.tagName !== 'HR' && child.tagName !== 'TABLE',
      );

      // Insert <hr> between each top-level child (up to section count - 1)
      const breaksNeeded = Math.min(sections.length - 1, children.length - 1);
      for (let i = breaksNeeded; i >= 1; i--) {
        const child = children[i];
        if (!child) continue;

        // Add Section Metadata if the corresponding section has a style
        if (sections[i] && sections[i].style) {
          const metaBlock = WebImporter.Blocks.createBlock(doc, {
            name: 'Section Metadata',
            cells: { style: sections[i].style },
          });
          child.after(metaBlock);
        }

        const hr = doc.createElement('hr');
        child.before(hr);
      }
    }
  }
}
