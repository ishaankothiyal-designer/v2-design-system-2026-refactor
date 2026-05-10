---
name: turbo-dls
description: Install and use the GitHub repo `ishaankothiyal-designer/v2-design-system-2026-refactor` to turn plain-English UI prompts into standalone frontend apps for beginners. Use when a user says `install DLS`, asks to clone or set up that repo, or wants a page, dashboard, or app built with that design system without using Storybook. Always build a separate project/app, use only the repo library packages (`@geist/web`, `@geist/tokens`, `@geist/icons`), avoid hardcoded design values when a token exists, make the design responsive and breathable, use a floating brand switcher opened from a floating button as the default persistent utility control, and invoke the `imagegen` skill when the UI needs generated imagery.
---

# TurboDLS

## Overview

Use this skill to do two things in order:

1. Install the DLS repo when the user says `install DLS`.
2. Build the user's requested design as a separate app that consumes the repo's library packages.

Read [references/repo-facts.md](references/repo-facts.md) before making structural decisions or naming brands.
Before building any design inside the repo, always inspect the repo-level `reference/` folder and treat its files as required execution context.

## Install Flow

When the user says `install DLS` or the repo is missing:

1. Run [scripts/install_dls.sh](scripts/install_dls.sh).
2. Default the install target to the user's current project folder unless they clearly asked for another location.
3. Let the script:
   - ensure `npm` exists,
   - clone `gh repo clone ishaankothiyal-designer/v2-design-system-2026-refactor`,
   - run `corepack pnpm install`.
4. Confirm the repo path after install and continue working from there.

If the repo already exists, skip cloning and continue.

## Build Flow

When the user asks for a design:

1. Work inside the cloned repo.
2. Read `reference/logicbook.md` first and follow its widget, page-type, brand, and composition rules as the primary design logic source.
3. Read `reference/ai-execution.json` next and use it to identify page type, brand tone, widget priority, layout order, and validation checks.
4. Inspect only the relevant examples in `reference/pages/` and `reference/widget/` to learn Cars24 layout patterns, spacing behavior, and widget usage. Extract logic, not full-page copies.
5. Create a separate app or project.
6. Never put the deliverable in `apps/storybook`.
7. Prefer `apps/<kebab-name>` inside the repo unless the user explicitly wants another location.
8. Set up a small standalone React app, typically with Vite.
9. Import only from:
   - `@geist/web`
   - `@geist/tokens`
   - `@geist/icons`
10. Import `@geist/icons/style.css` in the app entry.
11. Build the requested UI by composing existing DS components only.
12. Make the design responsive from the first pass, not as a later polish step.
13. If the prompt is underspecified, fill in the missing but expected product flow, sections, states, and supporting content instead of leaving the screen feeling empty.
14. Automatically analyze whether the UI needs generated imagery, and if it does, invoke the `imagegen` skill.

## Non-Negotiable Rules

- Do not create the design in Storybook.
- Do not add external UI kits.
- Do not invent new visual primitives when existing DS components can be composed.
- Treat `reference/logicbook.md` as the source of truth for widget usage, brand behavior, page intent, and design decision-making.
- Use `reference/ai-execution.json` as the execution checklist for page type, widget selection, layout assembly, and validation.
- Review the relevant files in `reference/pages/` and `reference/widget/` before composing the UI so the output reflects Cars24 design patterns.
- Learn from the reference files without copying entire screens verbatim.
- Do not hardcode colors, spacing, radii, typography, or brand values when a token exists.
- Use `getRequiredThemeTokenValue(brand, "...")` for any remaining shell/layout styling.
- Keep custom code limited to app structure, data mapping, layout composition, and state management.
- Every design must be responsive across mobile and desktop.
- Keep the page breathable. Avoid overpacking content, tiny cards, and overly dense grids.
- Do not add blanket page padding on the left, right, top, or bottom when the layout is built from repo widgets. The widgets already handle that spacing.
- Avoid redundant inner padding around sections that already come from widgets, Section Headers, or Module patterns.
- If the design calls for imagery and no suitable image asset exists, use the `imagegen` skill to create a content-relevant image instead of leaving a broken or generic placeholder.
- If the prompt is light on detail, infer and add the supporting pieces the screen would reasonably need, such as empty states, summary cards, helper copy, filters, tables, banners, CTAs, or supporting panels.
- Do not add icons in Section Header titles and subtitles by default. Use heading icons only when the content clearly needs that extra visual cue.
- Treat Section Header Title 1 and Title 2 as a flowing two-line heading system, not as two unrelated labels.
- If the primary title line gets too long, move the overflow naturally into the second line instead of forcing a crowded first line.
- Automatically inspect the requested UI and decide where generated imagery would materially improve the design, such as hero visuals, banners, empty states, editorial cards, or supporting modules.
- When imagery is needed for the design, do not wait for a separate explicit image request. Invoke the `imagegen` skill as part of the normal UI-building workflow.

## Required Controls

Every design built with this skill must include the control below:

### Floating brand switcher

- Do not show the brand switcher as an always-open dialog or panel by default.
- Add a floating trigger button that stays visible while the user explores the page.
- When the user taps or clicks the floating trigger, open a menu/popover/sheet that lets them switch brands.
- Let the user switch among:
  - `Cars24`
  - `Team BHP`
  - `CarInfo`
  - `VehicleInfo`
- Recompute token-driven styles from the selected brand.
- Set `data-brand={brand}` on the app root.
- Do not add extra persistent utility controls beside it unless the user explicitly asks for them.
- Do not add default controls such as inverse mode toggles, export buttons, debug controls, or utility action clusters just to fill space.

## Layout Defaults

- Use L1 App Header for landing pages.
- Use L2 App Header for secondary pages and internal pages.
- If the design includes a bottom action bar or bottom navigation, keep it sticky at the bottom.
- Let the widget system define most page spacing. Add outer layout wrappers only when the reference logic or page structure clearly needs them.
- Prefer fewer, clearer sections over crowding many modules into the first screen.
- Use sections to create rhythm: strong header, clear hero or summary area, focused content blocks, and a calm footer or sticky action zone when needed.

## Section Header Rules

- Do not assume every Section Header needs title or subtitle icons.
- Prefer clean text-first Section Headers unless the prompt or product meaning strongly benefits from an icon.
- Think of Title 1 and Title 2 as line 1 and line 2 of the same heading block.
- When Title 1 becomes too long, let the copy continue into Title 2 so the heading stays readable and balanced.
- Avoid visually heavy Section Headers with icon-plus-title-plus-subtitle unless there is a clear reason.

## Good Composition Pattern

Follow this order:

1. Read `reference/logicbook.md`.
2. Read `reference/ai-execution.json`.
3. Inspect the most relevant examples in `reference/pages/` and `reference/widget/`.
4. Turn the prompt into page type, brand, sections, and user goals.
5. Match each section to `@geist/web` components and repo widget patterns.
6. Create the app shell first.
7. Add the floating brand switcher before polishing the content.
8. Apply the correct L1, L2, or internal-page structure from the reference logic.
9. Compose the page using DS components.
10. Analyze whether the design genuinely benefits from custom imagery.
11. If it does, invoke the `imagegen` skill and place the resulting imagery intentionally in the layout.
12. Add only token-driven layout wrappers where components alone are not enough.
13. Check mobile spacing carefully, especially section edges and sticky bottom areas, without re-adding padding the widgets already provide.
14. Run typecheck, build, and the dev server before finishing.

## Beginner-Friendly Behavior

- Make sensible decisions without forcing the user to know repo internals.
- Name the new app from the user's prompt if they did not give a name.
- Keep setup commands simple and narrate them clearly.
- If tooling is missing, fix it when safe instead of pushing the user to do manual setup.
- If you must choose between speed and DS consistency, choose DS consistency.

## Validation

After building the design:

1. Run the app's typecheck.
2. Run the app's build.
3. Start the app locally and provide the URL.
4. Verify the layout on both mobile and desktop widths.
5. Mention any remaining risk, such as a large bundle warning, but only after the app is working.
