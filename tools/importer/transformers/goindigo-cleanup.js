/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: goindigo cleanup.
 * Removes non-authorable site-shell content from goindigo.in pages.
 * Selectors based on standard site layout elements.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie consent banners, overlays, and widgets that may block parsing
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '[class*="cookie"]',
      '.chat-widget',
      '.modal-overlay'
    ]);
  }
  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable site shell content
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      'nav',
      'script',
      'noscript',
      'link',
      'style',
      'iframe',
      '[class*="breadcrumb"]'
    ]);
  }
}
