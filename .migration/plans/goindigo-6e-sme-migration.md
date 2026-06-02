# GoIndigo 6E SME Page Migration Plan

## Overview
Migrate the page at `https://www.goindigo.in/information/6e-sme.html` to AEM Edge Delivery Services with full content import and design styling.

**Source URL:** https://www.goindigo.in/information/6e-sme.html  
**Target Project:** nidhigurani/s6agent  
**Existing Blocks:** hero, columns, cards, fragment, header, footer

---

## Migration Phases

### Phase 1: Page Analysis
Analyze the source page to identify content structure, sections, block variants, and authoring decisions.

- Capture the page DOM, screenshots, and metadata
- Identify sections and content sequences
- Map content to EDS block types (existing or new)
- Produce cleaned HTML and analysis artifacts

### Phase 2: Import Infrastructure
Create the necessary parsers and transformers to convert the source page into EDS-compatible content.

- Generate block parsers for each identified block variant
- Create page transformers (cleanup, sections, metadata)
- Build the import script combining parsers and transformers

### Phase 3: Content Import
Execute the import to produce EDS-ready HTML content files.

- Run the import script against the source URL
- Generate the content HTML in the project's content directory
- Verify content structure and completeness

### Phase 4: Design Migration
Apply visual design from the source page to the EDS blocks.

- Extract design tokens (colors, typography, spacing) from the source
- Create/update block CSS to match original styling
- Write global styles as needed
- Visually verify against the original page using the local preview server

### Phase 5: Verification
Validate the migrated page renders correctly.

- Preview the page in the local dev server
- Compare visual output against the original
- Fix any rendering or styling issues
- Run linting to ensure code quality

---

## Checklist

- [ ] Run page analysis on https://www.goindigo.in/information/6e-sme.html
- [ ] Review analysis output and confirm block mappings
- [ ] Generate import infrastructure (parsers and transformers)
- [ ] Execute content import to produce EDS HTML
- [ ] Verify content renders in local preview
- [ ] Migrate site-level design tokens (fonts, colors, spacing)
- [ ] Style each block variant to match the original design
- [ ] Visual comparison and fix pass
- [ ] Run linting (`npm run lint`)
- [ ] Final preview verification

---

## Notes

- The project currently has standard boilerplate blocks (hero, columns, cards, fragment). New block types will be created as identified during analysis.
- The IndiGo page likely contains airline-specific content blocks (e.g., SME program details, benefits lists, CTAs) that will need new block implementations.
- Execution requires exiting Plan mode.
