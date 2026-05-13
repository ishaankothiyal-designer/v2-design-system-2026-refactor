# Turbo Design System

Turbo Design System is the central workspace for the multi-brand design system used across:

- CARS24
- Team BHP
- CarInfo
- VehicleInfo

This repository contains the governed building blocks used to design, document, and implement product experiences across web, native, Storybook, and AI-assisted design workflows.

## What This Repo Contains

The system is organized across a few core layers:

1. Tokens
2. Components
3. Widgets
4. Pages
5. Flows

These layers work together to keep design decisions consistent across brands while still allowing brand-specific behavior, content tone, and visual treatment.

## Core Packages And Apps

- `packages/tokens` - shared tokens, brand overrides, token exports, and supporting documentation
- `packages/icons` - reusable icon assets and icon metadata
- `packages/contracts` - canonical registry and system governance rules
- `packages/web` - React web implementation of components and widgets
- `packages/native` - React Native implementation layer
- `packages/cli` - CLI utilities for querying and exposing the design system registry
- `apps/storybook` - the primary documentation, preview, and registry surface for the system

## Design-System Principles

- Tokens are the foundation for visual consistency.
- Approved contracts define what can be used across the system.
- Components and widgets should be reused before new patterns are created.
- Brand variation should come from governed tokens and approved design logic, not ad hoc styling.
- Storybook is the main place to inspect, review, and understand available UI building blocks.

## Reference-Driven Design

The `reference/` folder is a required design input for AI-assisted and guided design work.

- `reference/logicbook.md` defines widget logic, page rules, brand behavior, and design decision rules.
- `reference/ai-execution.json` provides execution guidance for page type, layout order, and validation.
- `reference/pages/` provides page-level reference material for macro composition.
- `reference/widget/` provides widget-level reference material for micro composition.

These references should be used to understand composition logic, spacing rhythm, pacing, hierarchy, and widget behavior. They are not meant to be copied screen-for-screen.

## Storybook

Storybook is the main documentation and exploration environment for the Turbo Design System.

Use it to:

- browse approved widgets and components
- inspect design-system patterns
- review layout behavior
- verify implementation decisions
- access the generated registry output

Common commands:

1. Install dependencies with `corepack pnpm install`
2. Start Storybook with `corepack pnpm storybook`
3. Build Storybook with `corepack pnpm --filter @turbo/storybook build`

The Storybook app also emits a machine-readable registry at `apps/storybook/public/design-system-registry.json`.

## Tokens

The token system is documented in [packages/tokens/README.md](/Users/a38695/Desktop/v2-design-system-2026-refactor/packages/tokens/README.md).

- Base tokens live in `packages/tokens/tokens/base.json`.
- Brand token overrides live under `packages/tokens/tokens/brands/`.
- Legacy exports may still exist for compatibility or migration support.

## CLI And Machine Access

The CLI in `packages/cli` provides a machine-friendly way to inspect the approved design system without manually browsing the repository.

Examples:

- `turbo-ds registry`
- `turbo-ds components button`
- `turbo-ds component component.button`
- `turbo-ds serve --port 3210`

Local API endpoints include:

- `GET /health`
- `GET /manifest`
- `GET /registry`
- `GET /components?q=button`
- `GET /components/component.button`

## Recommended Workflow

For designers, engineers, and AI agents working in this repo:

1. Review the relevant logic in `reference/logicbook.md`.
2. Review `reference/ai-execution.json`.
3. Inspect the appropriate page and widget references.
4. Reuse approved components and widgets from Storybook and package implementations.
5. Validate the result against brand rules, page intent, and reference alignment.

## Repository Goal

The goal of this repository is not just to store UI code. It is to provide a governed, reusable, reference-backed system for building consistent product experiences across multiple automotive brands and product surfaces.
