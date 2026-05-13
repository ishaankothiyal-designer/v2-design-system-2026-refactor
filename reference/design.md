# Design Analysis & Guidelines
> Extracted from reference pages, logicbook, and ai-execution rules.
> This file is a living document — append new image analysis when new references are attached.

---

## 1. What I Observed From the Reference Images

### 1.1 L1 Page Patterns (14 screens reviewed)

**Navigation Layer**
- The top area is a compound system: brand logo + location pill (left), notification bell + avatar (right), search bar below, then horizontal tab strip.
- Tabs are concrete service labels — "All", "Buy used car", "Sell car", "Get loans", "Car check", "Challan", "Insurance" — never abstract ("Explore more").
- The tab strip scrolls horizontally. The active tab gets an underline indicator in brand primary color.
- The search bar is full-width, rounded pill shape, with a location pin icon inside. It is tappable (triggers a deeper search flow), not inline editable.

**Hero / Above-the-fold Content**
- The first content block immediately after the nav is always a functional, actionable element — not a passive banner.
- The "Orbit" card (vehicle management carousel) shows when the user has a registered vehicle: challan count, FASTag status, insurance dates. Three cards, horizontally swipeable.
- When no vehicle is registered, the hero is a promotional editorial card (e.g. "Like this car? Take it for a spin!") inside a rounded card with car image, price, specs row, and a CTA link.
- Hero is never just a marketing tagline with a background color. It always carries live utility or direct product entry.

**Service Buckets — Visual Pattern**
- Each bucket is a `Grid Widget` with 3-column image tiles: image fills the tile (no whitespace around it), label sits below the image in small text.
- Image is the primary signal. Text confirms it. Not the other way around.
- Grid tiles use 8–12px border radius, ~100px height for image zone, label below in 12px medium weight.
- "Buy vehicle" and "Sell your car" are separate buckets — both 3 tiles wide. No mixing.
- "Get loans" bucket mixes `Static Slider` cards (Used car loan, Loan against car, Personal loan, Credit score) — wider cards with image + title + subtitle.

**Section Header Pattern**
- Every section starts with a left-aligned heading in ~16–17px semibold weight.
- Optional "View all" link is right-aligned, brand primary color, same row as the heading.
- No icons in section headers — text only.
- Section header and first content row have ~8px vertical gap, not 20px.

**Discovery / Commerce Sections**
- "Trending new cars" uses PLP Car Cards with filled photography, price badge, key specs (mileage, fuel, transmission) in a horizontal scroll.
- "Hot car deals" uses a "NEW" badge tag in orange, same card treatment.
- Editorial cards ("why choose cars24") use a portrait image on the left (circular or square cropped), short title + subtitle on the right — row layout, not stacked.

**Trust Section**
- Always near the bottom: a rating bar (4.6/5), user count, city count.
- Uses a centered layout with a large brand tagline — "better drives, better lives".
- Trust items are icon + bold metric + short label, displayed in a 3-column row.

**Brand Variations (L1)**
- **Cars24**: Deep purple (#3D1DC8 range). White canvas. Green accent for sell flows. Dark green section backgrounds for sell buckets. Entry is vehicle-action-first.
- **CarInfo**: Teal/green primary. White surface. Hero = "Buy or renew car insurance online" — utility-first. Service grid uses circular icon tiles (not image tiles). Icon tiles: colored background, white icon, label below.
- **VehicleInfo**: Dark navy + teal. "All-in-one vehicle solution". Similar circular icon grid service pattern. Vehicle number input is the entry CTA.
- **Challan** (tab view): Light beige/warm gray background for the branded sub-page. Form-first layout.

---

### 1.2 L2 Page Patterns (3 screens reviewed — RTO check flow)

**Full-bleed Hero**
- Top area is a gradient or illustration-filled banner spanning the full device width with no side margin.
- Contains: brand value statement (2–3 bullet points), vehicle illustration or photography, sometimes overlapping the white card below.
- No page header component — back button is a floating circle (←) over the hero.
- Hero communicates trust and purpose, not just decoration.

**Input + CTA Card**
- White card sits directly below the hero, overlapping it slightly with a top border radius.
- Contains: section label ("Check RTO details"), a single large input (vehicle reg number), a helper text line, then a full-width primary CTA button.
- CTA is strong, full-width, filled pill — brand color.
- "Don't remember?" secondary link sits below the CTA.

**Feature Summary Strip**
- Immediately below the card: horizontal scrollable row of small feature chips (icon in colored container, label below).
- Each chip is ~64–72px wide, fixed height. No border. Background is transparent, relying on proximity grouping.
- Labels: "Ownership and RC info", "Legal records and challans", "Car model performance", "Car value estimate".

---

### 1.3 Login / Auth Pages (5 screens reviewed)

**Structure**
- Top ~45% of screen: brand hero section (gradient background, people photography, brand tagline).
- Bottom ~55%: white sheet snapping from the bottom (borderRadius top 20–24px).
- Sheet content: "Login or sign up" label, phone number input with country code prefix, WhatsApp opt-in checkbox, primary CTA, "OR" separator, social login (Truecaller).

**Photography Treatment**
- Photography is editorial lifestyle, not product shots.
- Subjects make eye contact with the camera — builds trust.
- Photography is edge-to-edge within its zone, not in a rounded card.

**OTP Screen**
- Hero is preserved (same photo from login screen) — no jarring switch.
- Sheet content changes: OTP destination confirmation text, 4-box OTP input, resend countdown, primary "Verify" CTA.
- Native numpad appears — OTP boxes are styled simply (underline or outlined box, 1 per digit).

---

### 1.4 Profile Pages (3 screens reviewed)

**Logged-out State**
- Clean list layout — no dashboard feel.
- Promotional login banner at top: brand primary color background, text + "Login" pill button.
- "Explore" section is a list of services with left icon + label + right chevron (→).
- "Resources" section uses same list pattern but with external link icon (↗) instead of chevron.
- Dividers between items: 1px subtle, full width.

**Logged-in State**
- Avatar: dark circle with initials, surrounded by a membership ring/badge ("MEMBER SINCE 2022").
- Name (semibold, 18px) + phone number (secondary color, 14px) below avatar.
- 3-column quick-action tiles below identity: icon (brand color) + label, rounded card backgrounds.
- "Activities" section: grouped list cards in a single container with slight gray background — My appointments (with red badge count), My bookings, My orders.
- Badge indicator on list items: red pill with number count.

**Edit Profile**
- Avatar centered at top with an "Edit profile picture" text link below it (brand primary color).
- Fields: label above (small, with asterisk for required), full-width rounded input below.
- Disabled field (verified phone): grayed-out background, lock-like treatment.
- Consent checkbox at bottom: small checkbox + longer legal copy below.
- No primary CTA at the top — it would be at the bottom of the form (not visible in the screenshot).

---

## 2. Design Principles Extracted

### 2.1 Visual-First Entry
Service entry points use images and icons as primary recognition signals. Text labels are secondary confirmation. Never lead with a wall of text on an L1 page.

### 2.2 Concrete Service Labels
Every tile, button, and tab uses concrete action-oriented language: "Buy used car", "Sell your car", "Get car price". Never abstract: "Explore", "Learn more", "Solutions".

### 2.3 Bucket-First Architecture
Related services are grouped into buckets before being listed individually. A user should identify their intent bucket first (buy / sell / check / loans) then navigate deeper — not scroll a flat list of all services.

### 2.4 Breathing Rhythm
Sections are separated by a clear visual rhythm: section header → content → gap → next section header. Gap between sections is 20–24px. Within a section, internal gaps are tighter (8–12px).

### 2.5 No Decorative Framing
Cards and tiles do not have visible borders by default unless they need state differentiation (selected, active, disabled). The card boundary is implied by background color contrast, not a drawn border.

### 2.6 Photography + Utility, Never One Without the Other
Every hero section carries both an image signal (establishes brand feel) and a direct utility entry (search input, CTA, vehicle number input). Purely decorative heroes do not exist in this system.

### 2.7 Trust Is Positioned, Not Scattered
Trust markers (ratings, user counts, city counts) appear at a single deliberate moment in the scroll journey — usually after service discovery, before the page ends. They are never sprinkled throughout.

### 2.8 Flat Section Headers
Section headers are plain text. No icons, no decorative elements. Weight and size create hierarchy, not embellishments.

---

## 3. Component Behavior Observations

### Tiles (Service Grid)
| Property | Value |
|---|---|
| Columns | 3 (standard), 2 (premium/large items) |
| Image treatment | Filled, edge-to-edge within tile image zone |
| Border radius | 12–16px |
| Label position | Below image |
| Label size | 12px, medium weight |
| Label color | Primary text |
| Tile background | White or subtle gray |
| Gap between tiles | 8–10px |

### List Items (Navigation List)
| Property | Value |
|---|---|
| Left element | Icon (20–24px, brand or neutral gray) |
| Text | 16px, semibold |
| Right element | Chevron (→) for internal, arrow-up-right for external |
| Divider | 1px, full width, bottom of each item |
| Vertical padding | 14–16px per item |
| Background | White |

### Car Cards (PLP)
| Property | Value |
|---|---|
| Image | Filled, 16:9 or ~3:2 ratio |
| Price | Bold, 16px, below image |
| Specs | Icon + value, inline, small (12px) |
| Tag / Badge | Top-left overlay, pill shape |
| Heart icon | Top-right overlay, white background circle |
| Border radius | 12px |

### Horizontal Feature Strip
| Property | Value |
|---|---|
| Card width | 64–72px |
| Icon container | 40–48px circle, brand-tinted background |
| Icon size | 20–24px |
| Label | 10–12px, 2-line max, centered |
| Scroll behavior | Horizontal, no scrollbar, overflows naturally |

### Section Header
| Property | Value |
|---|---|
| Title | 16–17px, semibold/bold |
| Subtitle / description | 13–14px, secondary color (only when needed) |
| "View all" link | Right-aligned, brand primary color, 13–14px |
| Icon | Never by default |
| Margin below | 8px to first content item |

---

## 4. What the DogBuddy App Should Adopt

Based on this analysis, here are the specific improvements to make DogBuddy feel designed at the same quality level as the reference pages:

### 4.1 Home Screen (L1)
**Current gap:** Hero is a generic gradient box with placeholder icon. Service entry is a single "recent bookings" module.

**Should be:**
- A sticky compound header: Logo left, bell icon + avatar right. Below that, a large tappable search pill ("Postcode or city", location pin icon).
- A service bucket grid immediately below search: 3 tiles — "Boarding", "Day care", "Walking" — each with a filled image (dog in that context), not an icon on a gradient.
- A "Top sitters near you" horizontal scroll of sitter cards (photo, name, rating, distance, price).
- A "Recent bookings" module (current implementation is close, just needs tighter spacing).
- Trust strip at bottom: "4.8 ★ · 2,400+ sitters · 12 cities".

### 4.2 Sitter List Screen (L2)
**Current gap:** Filter chips look fine. Sitter cards use gradient image placeholders. No visual hierarchy between sitter name/price.

**Should be:**
- Filter chip bar scrolls horizontally with the "Filters" chip having a count badge.
- Sitter cards have a full-bleed photo zone (the same way PLP car cards work) — edge-to-edge image, heart icon top-right, service badge top-left.
- Price is bolded (18px, 700 weight) and positioned prominently, with the per-unit label secondary.
- Rating uses the Ratings component, but formatted as "4.8 (127)" — not the default formatter.

### 4.3 Sitter Profile Screen (L2)
**Current gap:** Services module shows 3 mini tiles which are appropriate. The CTA area competes with ActionBar secondary button issue.

**Should be:**
- Profile hero is a full-bleed image zone, not just an avatar circle.
- Quick facts row below the avatar: Badges for "Boarding", "Day care", and response time — horizontal scrollable chips.
- Availability module looks good — keep the Module + calendar icon + "Next available · today" pattern.
- CTA: use a `Button` (Solid, Pill, Large) in a fixed bottom bar — not ActionBar to avoid the secondary label ghost.

### 4.4 My Dogs (L1-adjacent)
**Current gap:** Looks like a simple list but lacks the profile-page sectioning pattern.

**Should be:**
- Header matches the logged-in profile header pattern from reference: avatar with initial, dog name, key stats in a 3-column quick info row (breed, age, weight).
- List cards use the internal list card pattern with avatar + name + subtitle + chevron.
- "Add dog" CTA is a full-width secondary button at the bottom of the list.

### 4.5 Create Dog / Edit Dog (Internal)
**Current gap:** Avatar upload area is a dashed circle — close but the reference shows a solid filled circle with "Edit profile picture" text link below.

**Should be:**
- Solid circular avatar (dark fill + initial) centered at top.
- "Change photo" text link below it in brand primary color.
- Form fields: label above (small text), then full-width rounded input. Consistent pattern.
- Section divider before each new group of fields.
- Submit CTA is at the page bottom — either a sticky `Button` or the existing ActionBar pattern.

### 4.6 Service Select Overlay (Internal Sheet)
**Current gap:** Good sheet behavior. Service options have a custom radio pattern.

**Should be:**
- Keep the bottom sheet pattern.
- The service tiles should look closer to the grid tile pattern — icon in a brand-tinted circle, label, maybe a one-liner description.
- The selected state uses a border + background tint (current implementation is correct — keep it).
- Dates row has the right calendar icon + arrow pattern.

### 4.7 Date Picker (Internal)
**Current gap:** Custom calendar implementation. Mostly fine but bottom buttons feel inconsistent.

**Should be:**
- Header: back/close button left, title center ("Select dates").
- Month navigation: chevron left/right flanking the month + year label.
- Day headers: short day names (M T W T F S S) in secondary color, small weight.
- Date buttons: circle shape, brand primary fill for selected, light tint for in-range.
- Bottom action bar: "Clear" (text-only or ghost button, full left) + "Confirm" (solid pill, brand color, full right). Two equal columns.

---

## 5. Typography Scale Observed

| Usage | Size | Weight |
|---|---|---|
| Page title / brand tagline | 22–28px | 700 |
| Section header | 16–17px | 600–700 |
| Card title / name | 15–16px | 600 |
| Body / description | 13–14px | 400 |
| Secondary / metadata | 12px | 400 |
| Badge / tag label | 11–12px | 500–600 |
| Caption / legal | 10–11px | 400 |

---

## 6. Spacing System Observed

| Context | Value |
|---|---|
| Page horizontal margin (standard content) | 16px |
| Section-to-section vertical gap | 20–24px |
| Header-to-first-content gap | 8–10px |
| Grid tile gap | 8–10px |
| List item vertical padding | 14–16px |
| Card internal padding | 12–16px |
| Pill / chip vertical padding | 6–8px |
| Pill / chip horizontal padding | 12–16px |
| Bottom nav height | 56–64px |
| Sticky CTA bar height | 64–72px (includes safe area) |

---

## 7. Color Usage Patterns

| Token | Usage |
|---|---|
| `color.brand.primary.500` | Primary CTA, active tab underline, links, icons, selected states |
| `color.surface.canvas` | Page background, card surfaces |
| `color.surface.subtle` | Section backgrounds, inactive chips, avatar backgrounds |
| `color.border.default` | Card borders (only when needed), dividers, input borders |
| `color.text.primary` | Headings, card titles, active labels |
| `color.text.secondary` | Subtitles, metadata, placeholders |
| `color.semantic.positive.500` | Success tags (Completed, Verified) |
| `color.semantic.negative.500` | Error states, alert badges |

Never hardcode hex values. Always use `getRequiredThemeTokenValue(brand, path)`.

---

## 8. Image & Media Rules

- Grid tiles and slider cards use **filled** image treatment — image fills the entire media zone, no whitespace borders.
- Avatar images are circular. Default state = dark fill + white initial letter.
- Hero banners are full device width, no border radius at top, only bottom-left and bottom-right radius (or none).
- Photography shows real people, lifestyle context, not product-only shots.
- Use `imagegen` skill when no suitable image asset exists — do not leave placeholder gradients in final builds.

---

## 9. Interaction Patterns

| Pattern | Implementation |
|---|---|
| Tap a service tile | Navigate to L2 listing page |
| Tap search bar | Open service select overlay (bottom sheet) |
| Swipe hero carousel | Horizontal snap scroll |
| Pull to refresh | Not in current scope |
| Heart / favorite | Toggle icon state (filled / outline), persist locally |
| Bottom sheet | Slides up from bottom, backdrop dims to 40% black |
| Date picker | Full-screen overlay (not bottom sheet) |
| FAB brand switcher | Floating above bottom nav, opens a popover upward |

---

## 10. Things to Never Do (Anti-patterns from Reference Review)

1. **Do not use a gradient as a hero substitute.** A gradient circle with an icon is not a hero — it is a placeholder. Replace with real imagery or illustration.
2. **Do not add borders to every card.** Borders create visual noise. Use background tint or shadow instead.
3. **Do not use icons in section header titles** unless the section explicitly needs visual differentiation.
4. **Do not add page-level left/right padding around the entire layout** when widgets already handle their own edge spacing.
5. **Do not use multiple competing CTAs on one screen.** One primary CTA per view.
6. **Do not show a blank empty-state screen** without an illustration, a message, and an action ("Add your first dog").
7. **Do not hardcode colors, font sizes, or spacing values** when a token exists for that decision.
8. **Do not overflow text in a single line** — break into subtitle or second title line rather than truncating.
9. **Do not mix list-item and card patterns** in the same section without clear visual hierarchy separation.
10. **Do not leave the bottom nav item labels in a different language** from the screen titles.

---

## 11. Future References To Add

When new design images are attached, expand this file with a new section following the same structure:

```
## [N+1]. [Category Name] — [Date Added]

**Pages reviewed:** [list them]
**New patterns observed:** [describe]
**Impact on DogBuddy:** [what to update]
```

Images should go into the relevant subfolder in `reference/pages/` or `reference/widget/`.
