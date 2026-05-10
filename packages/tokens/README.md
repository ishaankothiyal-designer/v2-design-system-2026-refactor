# Token Documentation - Turbo Design System

> **Source of truth:** `packages/tokens/tokens/base.json`
> **Brand overrides:** `packages/tokens/tokens/brands/core.json`, `packages/tokens/tokens/brands/acme.json`
> **Legacy Figma export:** `token/token.json`

This package owns the shared token catalog for the design system and the brand override layer that sits on top of it.

## What lives here

The token tree is intentionally small and stable:

| Collection | Purpose | Examples |
|---|---|---|
| `color` | Brand, surface, text, border, and status colors | `color.surface.canvas`, `color.text.primary`, `color.status.success` |
| `typography` | Font family, size, line height, and weight scales | `typography.fontFamily.sans`, `typography.fontSize.md`, `typography.fontWeight.semibold` |
| `spacing` | Layout and component spacing scale | `spacing.1`, `spacing.4`, `spacing.12` |
| `radius` | Corner radius scale | `radius.sm`, `radius.md`, `radius.pill` |
| `icon` | Shared icon sizing and stroke defaults | `icon.size.md`, `icon.strokeWidth` |

The base catalog is loaded from `packages/tokens/tokens/base.json` and exported as `coreTokenCatalog`.

## Brand model

The repo currently supports two brand sets:

| Brand ID | Figma brand names | Notes |
|---|---|---|
| `core` | `Cars24`, `Team BHP` | Shared core token overrides |
| `acme` | `CarInfo`, `Vehicle Info` | Alternate brand override layer |

The mapping between Figma and repo brand names is defined in `packages/tokens/src/types.ts` through `FIGMA_BRAND_TO_REPO_BRAND`.

### Merge behavior

Brand tokens are never used on their own. They are merged on top of the base catalog with `deepMergeTokenTrees(base, override)`.

That means:

1. The base catalog defines the full token shape.
2. Brand JSON files override only the values they need.
3. Missing values fall back to the base catalog.

## Current token inventory

### Color

The color system is organized by semantic usage, not by raw hex value:

- `color.brand.primary`
- `color.brand.secondary`
- `color.surface`
- `color.text`
- `color.border`
- `color.status`

Representative values from the base catalog:

| Token | Value |
|---|---|
| `color.surface.canvas` | `#FFFFFF` |
| `color.surface.subtle` | `#F9FAFB` |
| `color.text.primary` | `#101828` |
| `color.text.secondary` | `#475467` |
| `color.border.default` | `#D0D5DD` |
| `color.status.success` | `#12B76A` |
| `color.status.warning` | `#F79009` |
| `color.status.danger` | `#F04438` |

### Typography

The base typography scale is shared across brands:

| Token | Value |
|---|---|
| `typography.fontFamily.sans` | `Inter` |
| `typography.fontFamily.mono` | `ui-monospace` |
| `typography.fontSize.md` | `16` |
| `typography.lineHeight.md` | `24` |
| `typography.fontWeight.semibold` | `600` |

### Spacing

Spacing uses a simple numeric scale in pixels:

| Token | Value |
|---|---|
| `spacing.1` | `4` |
| `spacing.2` | `8` |
| `spacing.4` | `16` |
| `spacing.8` | `32` |
| `spacing.12` | `48` |
| `spacing.16` | `64` |

### Radius

| Token | Value |
|---|---|
| `radius.none` | `0` |
| `radius.sm` | `4` |
| `radius.md` | `8` |
| `radius.lg` | `12` |
| `radius.xl` | `16` |
| `radius.pill` | `999` |

### Icon

| Token | Value |
|---|---|
| `icon.style` | `line` |
| `icon.strokeWidth` | `1.5` |
| `icon.size.sm` | `16` |
| `icon.size.md` | `20` |
| `icon.size.lg` | `24` |

## How to use the tokens

### In web and native code

Prefer the package helpers instead of reading JSON directly:

- `getThemeTokens(brandId)` for web token resolution
- `getNativeThemeTokens(brandId)` for native token resolution
- `getThemeTokenValue(brandId, path)` or `getNativeThemeTokenValue(brandId, path)` for lookup by path
- `getRequiredThemeTokenValue(...)` when a token is mandatory and should throw if missing

### In Figma workflows

The package exposes a bridge for flattening token trees into variable-like records:

- `flattenTokens(tokenTree)` for dot-path traversal
- `toFigmaVariables(collection, tokenTree)` for collection export
- `createFlattenedTokenSet(brandId, mode, tokenTree)` for brand/mode-aware payloads

The legacy `token/token.json` file is retained as a reference export from the earlier Figma variable setup.

## Rules to follow

- Use semantic tokens in components instead of hardcoded values.
- Add a base token first, then override it in a brand file only when necessary.
- Keep the token tree stable so web, native, Storybook, and Figma stay aligned.
- Validate changes with `pnpm --filter @turbo/tokens validate:registry` and `pnpm --filter @turbo/tokens typecheck` when token shapes change.

## Related files

- [`packages/tokens/src/types.ts`](src/types.ts)
- [`packages/tokens/src/base-tokens.ts`](src/base-tokens.ts)
- [`packages/tokens/src/brand-overrides.ts`](src/brand-overrides.ts)
- [`packages/tokens/src/lookup.ts`](src/lookup.ts)
- [`packages/tokens/src/figma-bridge.ts`](src/figma-bridge.ts)
