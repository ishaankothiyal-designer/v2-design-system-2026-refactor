# Geist Design System Sandbox

This repository is a governed foundation for a multi-brand design system spanning React web, React Native, Figma, and Storybook.

## Ownership

- Tokens are authoritative in code and JSON.
- Visual component specs are authoritative in Figma.
- Implementation is authoritative in GitHub.
- Documentation and runnable behavior are authoritative in Storybook.

## Layers

1. Tokens
2. Components
3. Widgets
4. Pages
5. Flows

Widgets and templates are treated as the same layer in this sandbox.

## Packages

- `packages/tokens` - shared tokens, brand overrides, Figma variable bridges, and documentation
- `packages/icons` - reusable IcoMoon icon library, metadata, and font assets
- `packages/contracts` - canonical component/widget/page/flow registry and governance rules
- `packages/web` - React web implementation layer
- `packages/native` - React Native implementation layer
- `apps/storybook` - documentation portal and machine-queryable registry surface

## Tokens

The token system is documented in [`packages/tokens/README.md`](packages/tokens/README.md).

- Base tokens live in `packages/tokens/tokens/base.json`.
- Brand overrides live in `packages/tokens/tokens/brands/core.json` and `packages/tokens/tokens/brands/acme.json`.
- The legacy Figma export remains in `Tokens/token-bible.json` for reference.

## Icons

The reusable icon library lives in `packages/icons`.

- Import `@geist/icons/style.css` once in a web app or Storybook entry.
- Use `renderIconMarkup(name)` for framework-agnostic HTML markup.
- Use `iconNames` and `iconDefinitions` when you need typed icon metadata or lookups.

## Core rules

- Use only approved design-system entities.
- Keep canonical component identity stable across Figma, code, and Storybook.
- Derive Figma variables from code-owned token definitions.
- Allow brand overrides without breaking the shared contract.
- Flag unsupported patterns instead of inventing new ones.
