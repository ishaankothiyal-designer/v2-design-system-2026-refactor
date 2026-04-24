# DLS Library Reference

Primary shared file:

- URL: `https://www.figma.com/design/skMLeeIF8mbzAT265CI8nP/-TEST--Design-Language-System--DLS-v2.0-2026-`
- file key: `skMLeeIF8mbzAT265CI8nP`

User-supplied entry node:

- node id: `18481:44681`
- metadata name: `0. Audit on Tokens`

Important guardrail:

- The provided node is an audit canvas, not a component node.
- Do not map this node directly to Storybook or code.
- Use it as a file anchor only, then resolve the real component node by component name or nearby instance/component inspection.

Repo surfaces used by this skill:

- registry: `packages/contracts/src/registry.ts`
- web implementation: `packages/web/src/canonical`
- storybook stories: `apps/storybook/src/stories`
- Storybook Figma helper: `apps/storybook/src/storybookFigma.ts`

Useful matching hints in this repo:

- Registry entries usually expose both `canonicalName` and `figmaComponentName`.
- Storybook stories often attach Figma links through `parameters.design = createFigspecDesign(FIGMA_URL)`.
- The safest match is the one that aligns across Figma name, registry identity, implementation file, and story coverage.
