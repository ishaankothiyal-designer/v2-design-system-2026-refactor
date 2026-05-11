---
name: turbo-visual
description: Use when generating Cars24 product visuals for GridCard, StaticSliderCard, Banner, or rotating-banner media. This skill teaches imagegen how Cars24 visuals should look by using bundled reference assets, matching widget ratios, using filled image treatment, and preserving the product’s visual structure instead of generating generic ad art.
---

# Turbo Visual

## Purpose

Use this skill whenever image generation is needed for:

- `GridCard`
- `GridWidget`
- `StaticSliderCard`
- `StaticSliderWidget`
- banner visuals
- rotating-banner visuals

This skill exists to help `imagegen` follow the Cars24 product visual language instead of producing generic or mismatched marketing images.

The bundled assets in `assets/` are the source of truth for visual structure, crop style, foreground scale, whitespace balance, and copy-safe composition.

## Skill Pairing Rule

`turbo-visual` should automatically use the `imagegen` skill whenever the task requires creating or regenerating bitmap visual assets for cards, sliders, banners, or rotating-banner media.

This means:

- the user does not need to name `imagegen` separately if they already invoked `turbo-visual`
- `turbo-visual` decides the Cars24 visual structure and reference pattern
- `imagegen` produces the actual asset following that structure

Only skip `imagegen` when the task is not image generation at all, such as:

- reviewing reference structure only
- mapping a screenshot to the correct widget
- choosing between existing repo assets
- adjusting code without needing new imagery

## Required Workflow

Before generating any visual:

1. Identify the widget or card type.
2. Identify the visual ratio implied by that widget.
3. Open the matching reference image from `assets/`.
4. Extract the composition pattern before writing the image prompt.
5. Generate the visual to match the same structure, not just the same topic.

Do not prompt `imagegen` from text-only assumptions if a matching reference exists in this skill.

## Asset Groups

### Grid card references

Use these for 2x2 and other grid-led card visuals:

- `assets/grid-cards-buy-2x2.png`
- `assets/grid-cards-loan-2x2.png`
- `assets/grid-cards-insurance-2x2.png`
- `assets/grid-cards-feature-tags-2x3.png`

Learn from them:

- headline placement at top-left
- short supporting copy below
- product object or subject anchored low/right
- soft clean background
- large open whitespace for readability
- filled visual treatment inside the card

### Static slider references

Use these for horizontal slider-card visuals:

- `assets/grid-slider-buy-wide.png`
- `assets/grid-slider-sell-wide.png`
- `assets/static-slider-loan-badges-wide.png`
- `assets/static-slider-check-cards-wide.png`
- `assets/static-slider-icon-badges-wide.png`
- `assets/static-slider-rank-cars-wide.png`
- `assets/static-slider-sold-cars-wide.png`

Learn from them:

- wide horizontal crop
- simple bold headline
- object or subject heavily cropped into the frame
- category-color background
- visual should feel immediate and scannable
- cards should not feel poster-like or editorial-heavy

### Banner references

Use these for standalone banner modules:

- `assets/banner-loan-hero-cta.png`
- `assets/banner-30-day-return.png`
- `assets/banner-luxe-interest-rate.png`

Learn from them:

- strong focal subject
- centered or right-weighted subject composition
- large copy-safe zone
- cleaner hero layout than card visuals
- button-safe lower area
- high contrast and direct message support

### Rotating banner references

Use these for carousel or rotating-banner slides:

- `assets/rotating-banner-sell-loan.png`
- `assets/rotating-banner-collateral-free.png`
- `assets/rotating-banner-odometer-warning.png`
- `assets/banner-30-day-return.png`

Learn from them:

- one strong theme per slide
- one clear hero subject
- copy area must stay readable
- visual weight should support swipeable campaign storytelling
- subject placement often favors one side to preserve headline and CTA space

## Ratio Rules

Generate images according to the receiving widget size, not arbitrary aspect ratios.

Use the card or banner’s actual visual slot pattern:

- Grid 2x2 cards:
  Usually closer to `4:3` or slightly wider, with copy at top and subject low/right.
- Small feature grids:
  Use compact filled compositions with simpler object-led framing.
- Static slider wide cards:
  Use wide horizontal crops, often close to `16:9`, `1.9:1`, or the widget’s native wide-card ratio.
- Large banners:
  Use broad hero compositions with strong copy-safe spacing, typically close to `16:9` or the module’s banner ratio.
- Rotating banners:
  Match the slide ratio used by the carousel slot and preserve headline + CTA safety areas.

Never generate a square image for a wide slider just because the topic is simple.
Never generate a wide banner composition for a compact grid card.

## Filled Media Rule

Visuals generated for:

- grid cards
- slider cards
- banner cards
- rotating-banner cards

must be composed for `Filled` treatment.

This means:

- subject should be scaled for the full media slot
- image should survive edge cropping
- important content should not sit tiny in the middle
- whitespace must be intentional, not empty

Do not generate “sticker in a blank box” style outputs for card media.

## Visual Structure Rules

Cars24 visuals should usually follow this structure:

- short headline-safe zone
- clean background field
- one dominant product, person, prop, or benefit object
- subject anchored with confidence, often bottom-right or center-right
- minimal clutter
- strong recognition before fine detail

## Content Style Rules

Prefer:

- cars
- keys
- cash
- money bags
- challan or legal symbols
- clipboards
- gauges
- family or insurance metaphors
- confident human subjects
- direct service-supporting props

Avoid:

- abstract AI gradients with no product meaning
- over-detailed scenes
- busy multi-object collages without hierarchy
- tiny subjects floating in empty space
- unrelated stock-photo aesthetics

## Prompting Rules For Imagegen

When prompting `imagegen`:

- mention the widget type
- mention the expected ratio or visual slot shape
- mention the crop behavior should support filled placement
- mention the copy-safe zone
- mention the reference asset filename being followed
- mention the subject placement direction

Prompt should describe:

- what the visual is for
- what the dominant subject is
- where the subject sits
- what background tone or palette family to use
- how much whitespace to preserve for text

## Example Prompt Shape

Use prompts like:

`Create a Cars24 static-slider visual following assets/grid-slider-buy-wide.png. Wide horizontal ratio, filled composition, bold product-card style, deep blue background, one car hero cropped low-right, clean headline-safe space top-left, high recognition, minimal clutter.`

## Delivery Rule

Generated visuals should feel like they belong inside Cars24 widgets immediately.

The goal is not “make a nice image.”
The goal is:

- make the right image for the right widget
- in the right ratio
- with the right crop behavior
- with the right product composition
- following the bundled visual structure
