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
- The legacy Figma export remains in `token/token.json` for reference.

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

## Storybook setup

1. Install dependencies with `corepack pnpm install`.
2. Start Storybook locally with `corepack pnpm storybook`.
3. Build the static site with `corepack pnpm --filter @geist/storybook build`.
4. Publish `apps/storybook/storybook-static` to any static host such as Chromatic, Vercel, Netlify, or S3 + CloudFront.

The Storybook build now also emits a machine-readable registry at `apps/storybook/public/design-system-registry.json`, so your hosted Storybook can expose a stable JSON endpoint alongside the visual docs.

## Designer access without GitHub

The easiest operating model for designers is:

1. Host Storybook publicly or behind SSO so they can browse components without cloning the repo.
2. Publish the CLI package from `packages/cli` to npm.
3. Ask designers to install it with `npm install -g v2-design-system-cli` or run it with `npx v2-design-system-cli`.

Useful commands:

- `geist-ds registry` prints the full approved registry as JSON.
- `geist-ds components button` searches approved components.
- `geist-ds component component.button` prints one component contract.
- `geist-ds serve --port 3210` starts a local API for AI tools.

Local API endpoints:

- `GET /health`
- `GET /manifest`
- `GET /registry`
- `GET /components?q=button`
- `GET /components/component.button`

This gives non-engineering teammates a safe way to work with the governed system through Claude, Codex, or other AI tools without giving direct repository access. A prompt can point the AI tool to the hosted Storybook URL for visuals and the local CLI API for approved component metadata.

## Recommended sharing model

- Keep `packages/contracts` as the source of truth for what is allowed.
- Keep Storybook as the human-friendly documentation portal.
- Use the CLI/API as the machine-friendly gateway for designers and AI agents.
- Publish only the pieces designers need: hosted Storybook, the CLI, and optionally token JSON exports.

## GitHub main branch automation

This repo is now ready for GitHub Actions driven releases from the `main` branch:

- [`.github/workflows/deploy-storybook.yml`](.github/workflows/deploy-storybook.yml) builds Storybook on every push to `main` and deploys it to GitHub Pages.
- [`.github/workflows/publish-cli.yml`](.github/workflows/publish-cli.yml) builds `v2-design-system-cli` on every push to `main` and publishes it to npm only when the package version is newer than the already published version.

Required one-time GitHub setup:

1. Push these workflow files to the repository default branch.
2. In GitHub repository settings, enable Pages and choose `GitHub Actions` as the source.
3. Add a repository secret named `NPM_TOKEN` with an npm automation token that has publish access to your package scope.
4. Bump `packages/cli/package.json` version each time you want a new CLI release from `main`.

After that, your release flow is:

1. Merge to `main`.
2. GitHub Actions deploys Storybook.
3. GitHub Actions publishes the CLI if the version changed.
4. Designers use the GitHub Pages Storybook URL plus `npx v2-design-system-cli` or `npm install -g v2-design-system-cli`.

If you prefer a private package registry instead of npmjs, update the `publish-cli.yml` registry URL and authentication token accordingly.
