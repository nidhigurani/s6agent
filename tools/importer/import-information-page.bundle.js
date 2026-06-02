/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-information-page.js
  var import_information_page_exports = {};
  __export(import_information_page_exports, {
    default: () => import_information_page_default
  });

  // tools/importer/parsers/hero-banner.js
  function parse(element, { document }) {
    const image = element.querySelector("img");
    const heading = element.querySelector("h1, h2, h3");
    const cells = [];
    if (image) {
      cells.push([image]);
    }
    if (heading) {
      cells.push([heading]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/goindigo-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        '[class*="cookie"]',
        ".chat-widget",
        ".modal-overlay"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        "nav",
        "script",
        "noscript",
        "link",
        "style",
        "iframe",
        '[class*="breadcrumb"]'
      ]);
    }
  }

  // tools/importer/transformers/goindigo-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const doc = element.ownerDocument;
      const sections = template.sections;
      const sectionElements = sections.map((section) => {
        return element.querySelector(section.selector) || doc.querySelector(section.selector);
      });
      const matched = sectionElements.filter(Boolean);
      if (matched.length >= 2) {
        for (let i = sections.length - 1; i >= 0; i--) {
          const sectionEl = sectionElements[i];
          if (!sectionEl) continue;
          if (sections[i].style) {
            const metaBlock = WebImporter.Blocks.createBlock(doc, {
              name: "Section Metadata",
              cells: { style: sections[i].style }
            });
            sectionEl.append(metaBlock);
          }
          if (i > 0) {
            const hr = doc.createElement("hr");
            sectionEl.before(hr);
          }
        }
      } else {
        const children = [...element.children].filter(
          (child) => child.tagName !== "HR" && child.tagName !== "TABLE"
        );
        const breaksNeeded = Math.min(sections.length - 1, children.length - 1);
        for (let i = breaksNeeded; i >= 1; i--) {
          const child = children[i];
          if (!child) continue;
          if (sections[i] && sections[i].style) {
            const metaBlock = WebImporter.Blocks.createBlock(doc, {
              name: "Section Metadata",
              cells: { style: sections[i].style }
            });
            child.after(metaBlock);
          }
          const hr = doc.createElement("hr");
          child.before(hr);
        }
      }
    }
  }

  // tools/importer/import-information-page.js
  var parsers = {
    "hero-banner": parse
  };
  var PAGE_TEMPLATE = {
    name: "information-page",
    description: "IndiGo informational page with hero banner and text content (program details, terms and conditions)",
    urls: [
      "https://www.goindigo.in/information/6e-sme.html"
    ],
    blocks: [
      {
        name: "hero-banner",
        instances: ["section.hero-banner"]
      }
    ],
    sections: [
      {
        id: "hero-banner",
        name: "Hero Banner",
        selector: "section.hero-banner",
        style: null,
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "program-introduction",
        name: "Program Introduction",
        selector: "section.content",
        style: null,
        blocks: [],
        defaultContent: ["section.content > p", "section.content > ul"]
      },
      {
        id: "terms-and-conditions",
        name: "Terms and Conditions",
        selector: "section.terms-conditions",
        style: null,
        blocks: [],
        defaultContent: ["section.terms-conditions > p"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
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
  var import_information_page_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_information_page_exports);
})();
