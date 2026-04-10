---
name: figma-designer-read
description: Use when reading, inspecting, extracting, comparing, or documenting values from Figma so Figma remains the source of truth for components, tokens, typography, icons, and visual structure. Also use when syncing exact Figma values into Storybook, the registry, or code without inventing new styles.
---

# Figma Designer Read

## Overview

Use this skill when the task starts in Figma and the goal is to preserve exact design truth in the repo. Figma is the source of truth for component identity, token values, typography, icon selection, spacing, and visual states.

## When To Use

- Reading a Figma file, frame, component, or token set
- Extracting exact values for Storybook, registry entries, or code comments
- Comparing Figma against code to confirm nothing drifted
- Translating a Figma spec into documented design-system data

## Required Rules

1. Treat Figma as the source of truth for any component, token, type style, or icon reference.
2. Capture exact values. Do not normalize, simplify, or guess.
3. If Figma and code disagree, document the mismatch instead of inventing a compromise.
4. If a component, token, or style is not explicitly present, flag it as unsupported.
5. Keep naming aligned across Figma, Storybook, and the registry.

## Reading Workflow

1. Identify the exact Figma node, file, or component being referenced.
2. Extract the visual facts:
   - token names and values
   - typography family, size, weight, and line height
   - icon name or asset reference
   - spacing, radius, borders, and layout structure
   - variants and states
3. Map those facts to the repository source of truth:
   - tokens in `packages/tokens`
   - canonical entity registry in `packages/contracts`
   - documentation surface in `apps/storybook`
4. Record the exact values in Storybook or the relevant code location without changing their meaning.
5. If the design implies a new entity, verify whether it is truly new or just a composition of existing approved entities.

## Sync Rules

- Storybook should reflect the same values that were read from Figma.
- The registry should preserve canonical names and identities.
- Code should reuse approved tokens and existing component contracts.
- Never create a new font, token, or icon name just to make the mapping easier.

## Output Standard

When this skill is used, the output should clearly state:

- what Figma source was read
- which exact values were captured
- what repo files need to reflect them
- whether anything was unsupported or ambiguous
