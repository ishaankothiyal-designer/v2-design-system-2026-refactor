---
name: figma-sb-connect
description: Map a Figma node from the DLS library to the closest approved Storybook story and canonical repo component in this Geist design-system repo. Use when the user wants Code Connect style matching for Storybook without inventing unmapped patterns.
---

# Figma SB Connect

Use this skill when the user wants a Figma node to resolve to the best Storybook and code surface in this repository.

This is a repo-local, Storybook-first version of Code Connect.

- Figma stays the visual source of truth
- `packages/contracts/src/registry.ts` stays the canonical identity map
- `packages/web/src/canonical` stays the implementation surface
- `apps/storybook/src/stories` stays the review and documentation surface

If the user asks for real Figma Code Connect mappings or `.figma.js` templates, use the dedicated Code Connect workflow instead. This skill is for matching Figma to this repo's Storybook and code.

## Read First

If the request references the shared DLS file or gives only a broad library link, read [references/dls-library.md](references/dls-library.md) before searching.

## Core Rules

1. Behave like a matcher, not a designer.
2. Start from the Figma node or component name, not from assumptions.
3. Prefer existing canonical components over new code.
4. Prefer existing Storybook stories over new story files.
5. Preserve Figma naming, registry identity, and Storybook naming unless the repo already defines the approved translation.
6. Do not invent props, states, tokens, or component families to make a match fit.
7. If the Figma node is not a component node, treat it as library context and resolve the actual component before editing code.

## Search Order

Use `rg` and inspect in this order:

1. `packages/contracts/src/registry.ts`
   - Search `figmaComponentName`, `canonicalName`, and nearby variant/state metadata.
2. `packages/web/src/canonical`
   - Find the implementation file that matches the approved canonical entity.
3. `apps/storybook/src/stories`
   - Find the current story file and how it documents variants, states, and brands.
4. `apps/storybook/src/storybookFigma.ts`
   - Reuse `createFigspecDesign(...)` for Storybook Figma linking.
5. `packages/tokens` and `packages/icons`
   - Only when checking whether the story or component is drifting from approved tokens or icons.

## Matching Workflow

### 1. Resolve the Figma source

Extract:

- Figma file key
- node id
- node type
- component or instance name
- visible variant axes and states

If the supplied node is a canvas, audit frame, or other non-component structure, do not map it directly to code. Use it only to anchor the file, then identify the actual target component by name or by inspecting nearby component nodes.

### 2. Match to the registry first

Search `packages/contracts/src/registry.ts` before touching Storybook.

Look for:

- exact `figmaComponentName`
- exact `canonicalName`
- near matches with the same purpose and variant axes

If multiple candidates exist, choose the one with the closest match in:

- component name
- variant names
- state coverage
- platform intent

If no approved canonical entity matches, stop and flag it instead of inventing a new one.

### 3. Match the code surface

Once the registry match is known, identify:

- canonical implementation file in `packages/web/src/canonical`
- export surface in `packages/web/src/index.ts` if relevant
- existing Storybook story in `apps/storybook/src/stories`

Prefer the existing story even if it needs cleanup. Do not create a parallel story for the same component unless the current file is clearly for a different entity.

### 4. Compare Figma against Storybook

Check whether Storybook already reflects the Figma truth for:

- default variant
- size coverage
- state coverage
- light and inverse surfaces where applicable
- brand coverage where applicable
- Figma design linkage through `createFigspecDesign(...)`

Record drift explicitly instead of smoothing it over.

### 5. Return or apply the mapping

When the user wants analysis, return the match in this order:

1. Figma source
2. matched canonical component
3. implementation file
4. Storybook story file
5. coverage gaps or mismatches
6. next safe edit

When the user wants changes, make the smallest safe update:

- add or fix the Storybook Figma link
- align story naming with the canonical component
- add missing variant or state coverage that already exists in Figma and the repo
- avoid speculative controls or demo content

## Storybook Rules

- Reuse `createFigspecDesign(...)` from `apps/storybook/src/storybookFigma.ts`.
- Keep the Storybook file focused on the approved component contract.
- Mirror real Figma axes in controls or matrices.
- Prefer `StoryPage`, `StoryCard`, `StoryMatrix`, and nearby repo story patterns before inventing a new layout.
- Do not hand-edit generated files under `apps/storybook/src/generated`.

## Hard Stops

Stop and flag the issue when:

- the Figma node is not a component or instance and the target component cannot be resolved
- no registry entry matches the Figma component
- Storybook would require a new component contract that the repo does not already approve
- the best match would require inventing tokens, icons, or states

## Output Contract

For each mapping task, produce:

1. `Figma:` file key, node id, and resolved component name
2. `Registry:` canonical component and why it matches
3. `Code:` implementation file or export
4. `Storybook:` story file and Figma-link status
5. `Gaps:` missing states, variants, or drift
6. `Action:` exact safe next step
