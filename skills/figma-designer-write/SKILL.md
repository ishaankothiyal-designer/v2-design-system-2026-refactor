---
name: figma-designer-write
description: Use when creating or updating Figma content from the repo so tokens, typography, icons, and component composition stay synchronized across Figma, Storybook, and GitHub. Also use when writing widgets or screen specs that must follow approved design-system rules without hallucinating styles or assets.
---

# Figma Designer Write

## Overview

Use this skill when the repo is the source of implementation and Figma must be updated to match it, or when a new Figma design must be authored without breaking the design-system contract. The goal is a one-to-one relationship between Figma, Storybook, and code.

## When To Use

- Writing or editing Figma components, widgets, pages, or flows
- Updating Figma after a code or token change
- Building a widget from approved components
- Validating that Figma, Storybook, and GitHub still match

## Required Rules

1. Use only approved tokens when expressing color, spacing, radius, and typography.
2. Use only the approved icon library or icon book for icon selection.
3. Preserve typographic families, sizes, line heights, and weights exactly.
4. Build widgets by composition from approved components, not by inventing new primitives.
5. Keep Figma, Storybook, and GitHub synchronized at the same canonical level.
6. If a design cannot be represented cleanly, flag it instead of approximating.

## Writing Workflow

1. Find the canonical source in the repo:
   - tokens in `packages/tokens`
   - canonical contracts in `packages/contracts`
   - implementation in `packages/web` and `packages/native`
   - documentation in `apps/storybook`
2. Check whether an approved component already exists before introducing any new structure.
3. Apply the matching token values and type styles exactly.
4. Use existing icon names only. Do not create custom icon substitutes.
5. When assembling a widget, reuse approved components and preserve their canonical identities.
6. Update Storybook and registry documentation so the same entity is visible everywhere.
7. Validate that Figma, Storybook, and code all describe the same thing.

## Sync Rules

- Figma should not drift away from the registry.
- Storybook should document what is actually implemented.
- Code should not contain styles, tokens, or icons that do not exist in the approved system.
- Component composition must stay one-to-one where the system already defines a canonical mapping.

## Hard Stops

Stop and flag the issue if:

- a font is missing from the approved typography set
- a token value is not defined in the token source
- an icon is not in the approved icon book
- a widget would require freeform invention instead of approved composition
- Figma and code would diverge on canonical identity
