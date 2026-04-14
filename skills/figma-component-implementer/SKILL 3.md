---
name: figma-component-implementer
description: Use when implementing or updating a UI component from a Figma component node in this Geist design-system repo. Start from the Figma node, inspect every variant, size, state, and token, search existing canonical components first, reuse patterns in packages/web and apps/storybook, map Figma variables to repo tokens exactly, and avoid hardcoded values when a token already exists.
---

# Figma Component Implementer

Use this skill for Figma-to-code component work in this repository.

The target stack is:

- Figma component node as the visual spec
- `packages/web/src/canonical` for web implementation
- `apps/storybook/src/stories` for visual review and docs
- `packages/contracts/src/registry.ts` for canonical component metadata
- `packages/tokens` for token truth and brand-safe mappings

## Core Rules

1. Start from the Figma node, not from assumptions.
2. Check existing repo components before creating anything new.
3. Reuse repo patterns, composition, exports, and Storybook structure.
4. Map every Figma token to the exact repo token path or established token-backed usage.
5. Check every visible variant, size, and state before implementation is considered complete.
6. Do not hardcode raw values when the repo already has a token or token-backed contract for that value.
7. Do not hand-edit generated Storybook token artifacts in `apps/storybook/src/generated`.
8. If Figma defines the visual answer, do not guess.

## Repo Search Order

Before writing code, inspect in this order:

1. `packages/contracts/src/registry.ts`
   - Search `canonicalName`, `figmaComponentName`, and nearby `tokenBindings`.
   - Use the registry to confirm whether the component already exists and which variants and states are already approved.
2. `packages/web/src/canonical`
   - Search for a direct match first.
   - Then search for reusable primitives or adjacent patterns that can compose the target UI.
3. `apps/storybook/src/stories`
   - Find the closest story to mirror matrix layout, controls, naming, and Figma link usage.
4. `packages/tokens`
   - Confirm token paths in code-owned token sources before introducing any visual value.
5. `packages/icons`
   - Reuse approved icons only.

Prefer `rg` for all searches.

## Figma-To-Repo Truth Model

Use Figma as the source of truth for:

- structure
- variant names
- size names
- state coverage
- spacing relationships
- visual hierarchy
- icon placement
- interaction affordances

Use repo token sources as the authoritative implementation source for raw token values:

- `packages/tokens/tokens/base.json`
- `packages/tokens/src`
- brand-safe token lookup through `packages/web/src/theme.ts`

If Figma variables are present, preserve their intent by resolving them to the exact repo token path. Do not replace a named token with a guessed raw value.

## Implementation Workflow

### 1. Inspect the Figma node

Capture:

- frame and child structure
- auto-layout direction, alignment, gaps, and padding
- all variant axes
- all size axes
- visible states
- typography details
- icon usage and sizes
- radius, border, fill, shadow, and opacity treatment

If the node links to variables, carry those token names forward into the mapping step.

### 2. Identify reusable repo pieces first

Check whether the target is:

- an existing canonical component that already matches
- a close canonical component that needs a small extension
- a composition of existing primitives such as `Icon`, `Text`, Button-family components, label wrappers, or other canonical elements

Do not create a new component if the existing repo can express the design with a small safe extension.

### 3. Map tokens exactly

Use this order:

1. existing `tokenBindings` in `packages/contracts/src/registry.ts`
2. existing token lookups already used by nearby canonical components
3. token paths in `packages/tokens/tokens/base.json` or brand overrides

Map exact values for:

- color
- spacing
- typography
- border radius
- border width
- shadows
- sizing
- layout gaps
- icon sizes
- state styling

Never edit generated CSS token files as the source of truth.

### 4. Implement with repo patterns

Follow surrounding conventions exactly:

- canonical components live in `packages/web/src/canonical/*.tsx`
- exports are wired through `packages/web/src/index.ts`
- token access typically uses `getRequiredThemeTokenValue`
- metadata often comes from `designSystemRegistry`
- styling is generally inline React `style` objects and typed unions, not a new styling framework

Keep props minimal. Only expose props that correspond to Figma or existing repo conventions. Avoid speculative behavior.

### 5. Add or update Storybook

Stories belong in `apps/storybook/src/stories`.

Mirror repo conventions:

- use `StoryPage` and `StoryCard` where appropriate
- add the Figma reference with `createFigspecDesign(...)`
- make the default story match the primary/default Figma variant
- include variant, size, and state coverage suitable for visual review
- expose controls only when they reflect real variant or size axes from Figma

### 6. Validate

At minimum, run the relevant typechecks after edits:

- `pnpm typecheck`
- `pnpm --filter @geist/storybook typecheck`

Use a Storybook run or build when visual review is needed:

- `pnpm storybook`
- `pnpm --filter @geist/storybook build`

## Decision Rules

- Reuse an existing canonical component if it already matches.
- Extend an existing component only in the smallest safe way.
- Create a new canonical component only when no approved entity can represent the Figma node.
- If token mapping is unclear, inspect nearby canonical components and registry bindings before considering any raw value.
- If a new canonical component is required, update the relevant exports and Storybook coverage so the component is queryable and reviewable in the repo.

## Hard Stops

Stop and flag the issue instead of guessing when:

- the Figma node is missing a needed variant or state
- the repo has no exact token match and the mapping cannot be proven
- the design would require inventing a new primitive without approval
- the icon in Figma does not exist in `packages/icons`
- generated files appear to be the only place holding a value

## Output Contract

For each task, respond in this order:

1. Identify reusable repo components or confirm none fit.
2. Briefly explain the exact token mapping approach.
3. Implement the component.
4. Add or update Storybook stories.
5. Summarize what was reused versus newly created.
