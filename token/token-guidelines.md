# Token Guidelines

> **Source file:** `Tokens/Tokens-variables-full.json`
> **Type:** Figma variable export reference
> **Current shape:** 6 collections, 549 variables

## Purpose

This file is reference source for design-token structure coming from Figma.

Use it to:

- inspect available token names
- understand collection and mode structure
- map design values to code tokens
- audit naming consistency before adding new tokens

Do not treat this file as primary source of truth for runtime code.
Code-owned token definitions still live in `packages/tokens/`.

## File Structure

Top-level keys:

- `schemaVersion`
- `lastModified`
- `collections`
- `fileName`

Each collection contains:

- collection name
- one or more modes
- variable list

Each variable usually represents one design token path such as:

- `brand/500`
- `font/family/primary`
- `size/headline/h1`
- `bg/primary`
- `alpha/white/500`
- `opacity/50`

## Collections

### 1. Theme

Brand-aware tokens.

Modes:

- `Cars24`
- `Team BHP`
- `CarInfo`
- `Vehicle Info`

Typical usage:

- brand colors
- brand alt colors
- brand-specific font family
- brand-specific font weight

Examples:

- `brand/50`
- `brand/500`
- `font/family/primary`
- `font/weight/regular`

Rule:
Use Theme collection only for values that can change by brand.

### 2. Typography

Responsive type scale tokens.

Modes:

- `Mobile`
- `Desktop`

Typical usage:

- font sizes
- line heights
- letter spacing

Examples:

- `size/title/display-1`
- `size/headline/h1`
- `size/paragraph/body-1`
- `line-height/utility/label-2`
- `letter-spacing/caption/sm`

Rule:
Typography tokens must be used as matched sets, not mixed ad hoc.

Current note:
This export currently exposes only `Mobile` mode in the Typography collection. If tablet or desktop scales are needed, add them deliberately instead of assuming they exist in this file.

### 3. Primitive

Raw foundational values.

Mode:

- `Value`

Typical usage:

- base black/white
- grayscale ramps
- raw color ramps

Examples:

- `base/black`
- `slate/500`

Rule:
Do not bind components directly to Primitive tokens when Semantic token exists.

### 4. Semantic

Meaning-based UI tokens.

Mode:

- `Default`

Typical usage:

- backgrounds
- text colors
- borders
- states
- surfaces

Examples:

- `bg/primary`
- `bg/secondary-hover`

Rule:
Component styling should prefer Semantic tokens over Primitive tokens.

### 5. Utility

Support tokens for alpha and helper value sets.

Mode:

- `Mode 1`

Examples:

- `alpha/white/500`
- `alpha/black/700`

Rule:
Use only when semantic layer does not already define needed state.

### 6. Misc

Non-color utility scales.

Mode:

- `Mode 1`

Typical usage:

- opacity
- spacing-like helper values
- stroke widths
- size ramps

Examples:

- `opacity/50`
- `gap/16`
- `stroke/regular`
- `size/24`

Rule:
Use for shared system primitives, not component-specific magic numbers.

## Naming Rules

Token names follow slash-separated hierarchy:

```text
category/subcategory/item/state
```

Examples:

- `size/headline/h2`
- `line-height/paragraph/body-2`
- `bg/primary-hover`
- `font/weight/semibold`

Guidelines:

- keep names semantic and predictable
- use shared hierarchy before adding new branch
- prefer state suffixes like `hover`, `inverse`, `alpha`
- avoid brand names inside token names unless token is explicitly brand-owned by mode

## Usage Rules

### Do

- use Theme tokens for brand variance
- use Typography tokens for responsive text systems
- use Semantic tokens in components
- use Primitive tokens as base building blocks only
- keep token paths stable after adoption
- add new tokens only when existing path cannot express need

### Do Not

- do not hardcode values in components if token exists
- do not bind product UI directly to raw Primitive tokens without reason
- do not create duplicate tokens for same meaning
- do not encode one-off component names into shared token paths
- do not change token names casually after code or Figma starts depending on them

## Update Workflow

When updating token system:

1. Check whether token already exists in `Tokens/Tokens-variables-full.json`.
2. If token is for shared UI meaning, prefer Semantic layer.
3. If token is raw foundation, add to Primitive or Misc.
4. If token differs by brand, place in Theme mode structure.
5. If token differs by responsive breakpoint, place in Typography modes.
6. Mirror approved changes into code-owned tokens in `packages/tokens/`.
7. Validate downstream usage in Storybook and implementation packages.

## Mapping Rule For Code

Use this export as reference map.
Use `packages/tokens/` as implementation map.

Practical order:

1. find token in Figma export
2. map it to semantic or brand token contract in code
3. consume token through shared package APIs
4. avoid direct JSON coupling in app code

## Review Checklist

Before approving new token work:

- Is token name reusable?
- Is collection correct?
- Is mode correct?
- Is there existing semantic token for same meaning?
- Will web, native, and Storybook interpret same meaning?
- Does token avoid brand leakage where not needed?
- Does token avoid one-off component naming?

## Related Paths

- `Tokens/Tokens-variables-full.json`
- `packages/tokens/README.md`
- `packages/tokens/tokens/base.json`
- `packages/tokens/tokens/brands/core.json`
- `packages/tokens/tokens/brands/acme.json`
