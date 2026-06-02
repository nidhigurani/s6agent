/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-banner variant.
 * Base block: hero
 * Source: https://www.goindigo.in/information/6e-sme.html
 * Selector: section.hero-banner
 * Generated: 2026-06-02
 *
 * Source structure:
 *   <section class="hero-banner">
 *     <img src="./images/sme-banner.jpg" alt="SME" title="SME">
 *     <h1>6E SME Program</h1>
 *   </section>
 *
 * Target table (from library example):
 *   Row 1: Banner image
 *   Row 2: Heading (h1)
 */
export default function parse(element, { document }) {
  // Extract banner image - direct child img of the hero section
  const image = element.querySelector('img');

  // Extract heading - h1 preferred, fallback to h2/h3
  const heading = element.querySelector('h1, h2, h3');

  // Build cells array matching library example structure:
  // Row 1: image
  // Row 2: heading
  const cells = [];

  if (image) {
    cells.push([image]);
  }

  if (heading) {
    cells.push([heading]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
