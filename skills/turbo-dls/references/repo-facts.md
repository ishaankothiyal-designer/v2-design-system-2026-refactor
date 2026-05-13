# DLS Repo Facts

Use this file when you need concrete repo facts before building a standalone app.

## Clone and setup

- GitHub repo: `ishaankothiyal-designer/v2-design-system-2026-refactor`
- Preferred clone command: `gh repo clone ishaankothiyal-designer/v2-design-system-2026-refactor`
- Package manager in the repo root: `pnpm@10.0.0`
- Practical setup flow:
  1. Ensure `npm` exists.
  2. Run `corepack enable`.
  3. Run `corepack pnpm install`.

## Important folders

- `reference`
  Purpose: Cars24 design execution context.
  Read `reference/logicbook.md` and `reference/ai-execution.json` before building designs.
  Use `reference/pages/` and `reference/widget/` to learn layout, spacing, and widget patterns without copying full screens.

- `apps/storybook`
  Purpose: documentation and Storybook only.
  Do not place the user's design deliverable here.

- `packages/web`
  Purpose: canonical React web components exposed through `@geist/web`.

- `packages/tokens`
  Purpose: token definitions and brand helpers exposed through `@geist/tokens`.

- `packages/icons`
  Purpose: icon helpers and font CSS exposed through `@geist/icons`.

## Real exports you should use

- `@geist/web`
  Use DS components from here.

- `@geist/tokens`
  Useful exports:
  - `DisplayBrandId`
  - `STORYBOOK_BRAND_OPTIONS`
  - `coreTokenCatalog`

- `@geist/web`
  Useful helpers:
  - `getRequiredThemeTokenValue`

- `@geist/icons/style.css`
  Import this in the standalone app entry so icon fonts render.

## Supported brands

- `Cars24`
- `Team BHP`
- `CarInfo`
- `VehicleInfo`

Use these exact values for the brand switcher.

## Standalone app rule

Always build the user-facing design as a separate app or separate project.

Preferred pattern inside the cloned repo:

- `apps/<project-name>/package.json`
- `apps/<project-name>/tsconfig.json`
- `apps/<project-name>/vite.config.ts`
- `apps/<project-name>/index.html`
- `apps/<project-name>/src/main.tsx`
- `apps/<project-name>/src/App.tsx`
- `apps/<project-name>/src/styles.css`
- `apps/<project-name>/src/vite-env.d.ts`

If the user wants the design outside the repo, create a sibling project that still depends on this repo's packages.

## Guardrails

- Do not build in Storybook.
- Do not create new visual primitives when an existing DS component can be composed.
- Do not hardcode colors, spacing, radii, or typography values when a token exists.
- Do not import random external UI libraries.
- Keep custom code limited to composition, data mapping, app state, layout containers, and token-driven wrappers.
- Make every design responsive on desktop and mobile.
- Keep layouts breathable instead of content-heavy by default.
- Follow `reference/logicbook.md` as the design-decision source of truth for widget usage, page types, and brand behavior.
- Use `reference/ai-execution.json` as the execution checklist for page classification, widget selection, layout ordering, and validation.
- Review the relevant examples in `reference/pages/` and `reference/widget/` before composing the UI.
- Do not add blanket page padding on the left, right, top, or bottom when the design uses repo widgets. The widgets already handle that spacing.
- Do not pile on extra inner padding around widget-based, Section Header, or Module-based sections unless the section clearly needs it.
- If the prompt is underspecified, add the missing but expected flow pieces and support content instead of shipping an overly sparse screen.
- If the design needs imagery and none is provided, use the `imagegen` skill to create content-relevant imagery.
- Automatically analyze the requested UI and decide where generated imagery is actually needed.
- When imagery would materially improve the design, invoke the `imagegen` skill as part of the normal workflow instead of waiting for a separate prompt.
- Do not use Section Header title/subtitle icons by default.
- Treat Title 1 and Title 2 in Section Header as a connected two-line heading system.
- If the first title line runs too long, continue the overflow into the second line instead of cramming line 1.

## Required controls in every design

- Add a floating brand switcher trigger.
  Keep the trigger always visible.
  Open the actual brand choices as a menu/popover/sheet when tapped or clicked.
  Let the user switch among `Cars24`, `Team BHP`, `CarInfo`, and `VehicleInfo`.

- Recompute token-based styles from the selected brand.
  Set `data-brand={brand}` on the root app container.

- Do not add extra persistent utility controls by default.
  Avoid default inverse mode toggles, export buttons, and filler action clusters unless the user explicitly asked for them.

## Header and navigation defaults

- Use L1 App Header for landing pages.
- Use L2 App Header for secondary pages and internal pages.
- If a bottom action area or bottom nav exists, make it sticky at the bottom.

## Section Header defaults

- Prefer clean text-first Section Headers.
- Add heading icons only when they are clearly justified by the content.
- Keep Title 1 and Title 2 visually related as one heading block, not two disconnected labels.

## Good building pattern

1. Read `reference/logicbook.md`.
2. Read `reference/ai-execution.json`.
3. Inspect the most relevant examples in `reference/pages/` and `reference/widget/`.
4. Read the user prompt and convert it into page type, brand, sections, and goals.
5. Find matching components in `@geist/web` and follow repo widget patterns.
6. Create a standalone app shell first.
7. Decide whether the page should use the L1, L2, or internal-page structure.
8. Add the floating brand switcher immediately.
9. Compose the page with DS components only.
10. Analyze whether the page needs generated imagery for hero sections, banners, editorial cards, empty states, or supporting modules.
11. If imagery is needed, use the `imagegen` skill.
12. Use `getRequiredThemeTokenValue(brand, "...")` for any non-component surface/layout styling you still need.
13. Check mobile spacing, sticky bottom behavior, and header choice before handing off without re-adding padding the widgets already provide.
14. Run app typecheck/build/dev before handing off.
