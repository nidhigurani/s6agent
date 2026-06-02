/* eslint-disable */
/* global WebImporter */

import heroBannerParser from './parsers/hero-banner.js';
import goIndigoCleanupTransformer from './transformers/goindigo-cleanup.js';
import goIndigoSectionsTransformer from './transformers/goindigo-sections.js';

const parsers = {
  'hero-banner': heroBannerParser,
};

const PAGE_TEMPLATE = {
  name: 'information-page',
  description: 'IndiGo informational page with hero banner and text content (program details, terms and conditions)',
  urls: [
    'https://www.goindigo.in/information/6e-sme.html'
  ],
  blocks: [
    {
      name: 'hero-banner',
      instances: ['section.hero-banner']
    }
  ],
  sections: [
    {
      id: 'hero-banner',
      name: 'Hero Banner',
      selector: 'section.hero-banner',
      style: null,
      blocks: ['hero-banner'],
      defaultContent: []
    },
    {
      id: 'program-introduction',
      name: 'Program Introduction',
      selector: 'section.content',
      style: null,
      blocks: [],
      defaultContent: ['section.content > p', 'section.content > ul']
    },
    {
      id: 'terms-and-conditions',
      name: 'Terms and Conditions',
      selector: 'section.terms-conditions',
      style: null,
      blocks: [],
      defaultContent: ['section.terms-conditions > p']
    }
  ]
};

const transformers = [
  goIndigoCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [goIndigoSectionsTransformer] : []),
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach(blockDef => {
    blockDef.instances.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null
        });
      });
    });
  });

  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    pageBlocks.forEach(block => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map(b => b.name),
      }
    }];
  }
};
