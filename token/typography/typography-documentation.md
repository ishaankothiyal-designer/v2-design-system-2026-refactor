# Typography Documentation - v2 LEGO Design System

> **Source node:** [18915-638 - Typography Section](https://www.figma.com/design/AZgWt0KHVuVeWBAcQ6Jcy4/branch/yxI5H0FhaUg0YR0uhNuqR6/%F0%9F%9A%80-v2.0-Global-Component-Library?node-id=18915-638)
> **Token file:** `token/token.json`
> **Last synced:** 2026-04-03

---

## 1. Multi-brand typefaces

Each brand overrides `font/family/primary` through the Theme variable collection. The project build exposes that value as `--lego-font-family-primary`, so component code only needs the shared token.

| Brand | Typeface | Token | Project CSS Variable |
|---|---|---|---|
| Cars24 | Geist | `font/family/primary` | `var(--lego-font-family-primary)` |
| Team BHP | Geist | `font/family/primary` | `var(--lego-font-family-primary)` |
| CarInfo | Manrope | `font/family/primary` | `var(--lego-font-family-primary)` |
| Vehicle Info | Metropolis | `font/family/primary` | `var(--lego-font-family-primary)` |

> **Usage note:** Never hardcode font family names in components. Always reference `var(--lego-font-family-primary)` and let `data-brand` resolve the brand mode.

### 1a. Figma brand-to-repo bridge

This matrix bridges the brand names used in Figma with the repo's current brand token structure.

| Figma brand | Typeface in Figma | Repo font family contract | Repo brand set mapping | Notes |
|---|---|---|---|---|
| Cars24 | Geist | `var(--lego-font-family-primary)` | `core` | Uses the shared typography contract; weight tokens stay 400/500/600/700 |
| Team BHP | Geist | `var(--lego-font-family-primary)` | `core` | Same font stack and weight mapping as Cars24 |
| CarInfo | Manrope | `var(--lego-font-family-primary)` | `acme` | Repo brand set carries the brand override layer; weights are numerically heavier to preserve visual parity |
| Vehicle Info | Metropolis | `var(--lego-font-family-primary)` | `acme` | Shares the same semantic font contract, but with the Vehicle Info typeface in Figma |

> **Bridge note:** The repo currently exposes brand sets as `core` and `acme`. Keep using `var(--lego-font-family-primary)` in component code and let the active brand set resolve the underlying typeface.

---

## 2. Font weight tokens - per brand

Font weights are also brand-aware. CarInfo (Manrope) uses heavier numeric values to preserve the same visual weight as Geist.

| Token | Cars24 | Team BHP | CarInfo | Vehicle Info | Project CSS Variable |
|---|---|---|---|---|---|
| `font/weight/regular` | 400 | 400 | 500 | 400 | `var(--lego-font-weight-regular)` |
| `font/weight/medium` | 500 | 500 | 600 | 500 | `var(--lego-font-weight-medium)` |
| `font/weight/semibold` | 600 | 600 | 700 | 600 | `var(--lego-font-weight-semibold)` |
| `font/weight/bold` | 700 | 700 | 800 | 700 | `var(--lego-font-weight-bold)` |

> **Usage note:** Vehicle Info uses Metropolis, so the numeric mapping matches Cars24 and Team BHP.

---

## 3. Font size tokens - responsive

The Typography collection has three responsive modes: Mobile, Tablet, and Desktop.

### 3a. Title

| Token | Mobile | Tablet | Desktop | Project CSS Variable |
|---|---|---|---|---|
| `size/title/display-1` | 32px | 48px | 56px | `var(--lego-font-size-title-display-1)` |
| `size/title/display-2` | 24px | 32px | 40px | `var(--lego-font-size-title-display-2)` |

> **Usage:** Reserved for hero banners and full-bleed landing sections only. Avoid display styles inside cards or list items.

### 3b. Headline

| Token | Mobile | Tablet | Desktop | Project CSS Variable |
|---|---|---|---|---|
| `size/headline/h1` | 24px | 32px | 40px | `var(--lego-font-size-headline-h1)` |
| `size/headline/h2` | 19px | 24px | 32px | `var(--lego-font-size-headline-h2)` |
| `size/headline/h3` | 17px | 20px | 24px | `var(--lego-font-size-headline-h3)` |
| `size/headline/h4` | 15px | 16px | 20px | `var(--lego-font-size-headline-h4)` |
| `size/headline/h5` | 13px | 14px | 16px | `var(--lego-font-size-headline-h5)` |
| `size/headline/h6` | 11px | 12px | 14px | `var(--lego-font-size-headline-h6)` |

> **Usage:** Use H1-H3 for page and section headings. Use H4-H6 for card titles, sidebar labels, and sub-section headers.

### 3c. Paragraph

| Token | Mobile | Tablet | Desktop | Project CSS Variable |
|---|---|---|---|---|
| `size/paragraph/body-1` | 16px | 18px | 18px | `var(--lego-font-size-paragraph-body-1)` |
| `size/paragraph/body-2` | 14px | 16px | 16px | `var(--lego-font-size-paragraph-body-2)` |
| `size/paragraph/body-3` | 12px | 14px | 14px | `var(--lego-font-size-paragraph-body-3)` |

> **Usage:** Body-1 for primary reading content, Body-2 for supporting descriptions, Body-3 for dense data tables and helper text.

### 3d. Utility labels

| Token | Mobile | Tablet | Desktop | Project CSS Variable |
|---|---|---|---|---|
| `size/utility/label-1` | 16px | 18px | 18px | `var(--lego-font-size-utility-label-1)` |
| `size/utility/label-2` | 14px | 16px | 16px | `var(--lego-font-size-utility-label-2)` |
| `size/utility/label-3` | 12px | 14px | 14px | `var(--lego-font-size-utility-label-3)` |
| `size/utility/label-4` | 11px | 12px | 12px | `var(--lego-font-size-utility-label-4)` |
| `size/utility/fine-print` | 9px | 9px | 10px | `var(--lego-font-size-utility-fine-print)` |

> **Usage:** Labels for form fields, tabs, buttons, and badges. Fine print is strictly for legal disclaimers and footnotes.

### 3e. Caption

| Token | Mobile | Tablet | Desktop | Project CSS Variable |
|---|---|---|---|---|
| `size/caption/md` | 10px | 12px | 12px | `var(--lego-font-size-caption-md)` |
| `size/caption/sm` | 9px | 10px | 10px | `var(--lego-font-size-caption-sm)` |

> **Usage:** Captions for image credits, chart axis labels, and card metadata chips. `caption/sm` is the minimum permitted text size in the system.

---

## 4. Line-height tokens - responsive

### 4a. Title

| Token | Mobile | Tablet | Desktop | Project CSS Variable |
|---|---|---|---|---|
| `line-height/title/display-1` | 36px | 52px | 56px | `var(--lego-line-height-title-display-1)` |
| `line-height/title/display-2` | 28px | 36px | 28px | `var(--lego-line-height-title-display-2)` |

### 4b. Headline

| Token | Mobile | Tablet | Desktop | Project CSS Variable |
|---|---|---|---|---|
| `line-height/headline/h1` | 28px | 36px | 28px | `var(--lego-line-height-headline-h1)` |
| `line-height/headline/h2` | 24px | 24px | 24px | `var(--lego-line-height-headline-h2)` |
| `line-height/headline/h3` | 22px | 22px | 22px | `var(--lego-line-height-headline-h3)` |
| `line-height/headline/h4` | 20px | 20px | 20px | `var(--lego-line-height-headline-h4)` |
| `line-height/headline/h5` | 18px | 18px | 18px | `var(--lego-line-height-headline-h5)` |
| `line-height/headline/h6` | 16px | 16px | 16px | `var(--lego-line-height-headline-h6)` |

### 4c. Paragraph

| Token | Mobile | Tablet | Desktop | Project CSS Variable |
|---|---|---|---|---|
| `line-height/paragraph/body-1` | 24px | 24px | 24px | `var(--lego-line-height-paragraph-body-1)` |
| `line-height/paragraph/body-2` | 20px | 20px | 20px | `var(--lego-line-height-paragraph-body-2)` |
| `line-height/paragraph/body-3` | 18px | 18px | 18px | `var(--lego-line-height-paragraph-body-3)` |

### 4d. Utility and caption

| Token | Mobile | Tablet | Desktop | Project CSS Variable |
|---|---|---|---|---|
| `line-height/utility/label-1` | 20px | 24px | 24px | `var(--lego-line-height-utility-label-1)` |
| `line-height/utility/label-2` | 18px | 18px | 18px | `var(--lego-line-height-utility-label-2)` |
| `line-height/utility/label-3` | 16px | 16px | 16px | `var(--lego-line-height-utility-label-3)` |
| `line-height/utility/label-4` | 14px | 14px | 14px | `var(--lego-line-height-utility-label-4)` |
| `line-height/utility/fine-print` | 13px | 14px | 14px | `var(--lego-line-height-utility-fine-print)` |
| `line-height/caption/md` | 10px | 10px | 10px | `var(--lego-line-height-caption-md)` |
| `line-height/caption/sm` | 10px | 10px | 10px | `var(--lego-line-height-caption-sm)` |

---

## 5. Letter-spacing tokens - responsive

### 5a. Title and headline

| Token | Mobile | Tablet | Desktop | Project CSS Variable |
|---|---|---|---|---|
| `letter-spacing/title/display-1` | -0.05px | -0.05px | -0.05px | `var(--lego-letter-spacing-title-display-1)` |
| `letter-spacing/title/display-2` | -0.05px | -0.05px | -0.05px | `var(--lego-letter-spacing-title-display-2)` |
| `letter-spacing/headline/h1` | -0.05px | -0.05px | -0.05px | `var(--lego-letter-spacing-headline-h1)` |
| `letter-spacing/headline/h2` | -0.03px | -0.03px | -0.03px | `var(--lego-letter-spacing-headline-h2)` |
| `letter-spacing/headline/h3` | -0.02px | -0.02px | -0.02px | `var(--lego-letter-spacing-headline-h3)` |
| `letter-spacing/headline/h4` | -0.02px | -0.02px | -0.02px | `var(--lego-letter-spacing-headline-h4)` |
| `letter-spacing/headline/h5` | 0 | 0 | 0 | `var(--lego-letter-spacing-headline-h5)` |
| `letter-spacing/headline/h6` | 0 | 0 | 0 | `var(--lego-letter-spacing-headline-h6)` |

### 5b. Paragraph, utility, and caption

| Token | Mobile | Tablet | Desktop | Project CSS Variable |
|---|---|---|---|---|
| `letter-spacing/paragraph/body-1` | 0 | 0 | 0 | `var(--lego-letter-spacing-paragraph-body-1)` |
| `letter-spacing/paragraph/body-2` | 0 | 0 | 0 | `var(--lego-letter-spacing-paragraph-body-2)` |
| `letter-spacing/paragraph/body-3` | 0 | 0 | 0 | `var(--lego-letter-spacing-paragraph-body-3)` |
| `letter-spacing/utility/label-1` | 0 | 0 | 0 | `var(--lego-letter-spacing-utility-label-1)` |
| `letter-spacing/utility/label-2` | 0 | 0 | 0 | `var(--lego-letter-spacing-utility-label-2)` |
| `letter-spacing/utility/label-3` | 0 | 0 | 0 | `var(--lego-letter-spacing-utility-label-3)` |
| `letter-spacing/utility/label-4` | 0 | 0 | 0 | `var(--lego-letter-spacing-utility-label-4)` |
| `letter-spacing/utility/fine-print` | 0 | 0 | 0 | `var(--lego-letter-spacing-utility-fine-print)` |
| `letter-spacing/caption/md` | 5px | 10px | 10px | `var(--lego-letter-spacing-caption-md)` |
| `letter-spacing/caption/sm` | 5px | 10px | 10px | `var(--lego-letter-spacing-caption-sm)` |

> **Usage note:** Caption tokens carry positive tracking for all-caps badges and status chips. Do not override that spacing.

---

## 6. Usage guidelines

### Token hierarchy

```
Theme collection        -> font/family/primary, font/weight/*  (brand-aware)
Typography collection   -> size/*, line-height/*, letter-spacing/*  (responsive)
```

Always apply both collections together. A component needs a brand mode and a typography mode to resolve fully.

### Do

- Use `size/*` + matching `line-height/*` + `letter-spacing/*` as a set.
- Reference font weights by semantic token, not raw numbers.
- Apply the responsive typography mode at the page or layout level so breakpoints cascade consistently.

### Do not

- Do not mix tokens from different scales.
- Do not hardcode `font-size`, `line-height`, or `letter-spacing` values in component code.
- Do not use `size/utility/fine-print` or `size/caption/sm` for interactive elements.
- Do not use display styles for long-form content on mobile.

### Breakpoints

| Mode | Breakpoint |
|---|---|
| Mobile | < 768px |
| Tablet | 768px - 1199px |
| Desktop | >= 1200px |

### Platform notes

All tokens have platform equivalents via `tokens.typography.*` in `token/token.json`.

---

*Generated from Figma branch `yxI5H0FhaUg0YR0uhNuqR6` - node `18915:638` - 2026-04-03*
