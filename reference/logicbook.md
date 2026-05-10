# LLM Logicbook - Widgets

## Purpose

This Logicbook teaches AI how to use the Storybook widget library to design Cars24 digital experiences from a user prompt. It acts as a decision-making guide for selecting widgets, composing layouts, respecting brand/page rules, and producing designs that feel intentional instead of randomly assembled.

The AI must treat this file as the source of truth before creating any design using this repository.

---

## 1. Repository Context

This repository is fully dedicated to design systems, templates, and widgets for:

- CARS24
- Team BHP
- CarInfo
- VehicleInfo

The repository contains multiple reusable widgets. Each widget has a specific purpose and should be used only when it supports the user prompt, page type, flow, and brand context.

The AI must refer to the provided Storybook examples, design templates, and existing layouts for inspiration, but must not blindly copy them unless a rule explicitly says that a widget or pattern is mandatory.

---

## 2. Reference Folder Usage

The Storybook repository includes a Reference folder. This folder contains previous designs created using the available components and widgets.

The AI must use the Reference folder to understand how widgets visually look, behave, and combine inside real CARS24 design contexts. It helps the AI learn the visual language, spacing, hierarchy, page structure, and interaction patterns used across CARS24 experiences.

The Reference folder is meant for ideation and understanding, not direct copying.

For CARS24 specifically, the reference pages should also be used to understand why many L1 pages are more visual-heavy than text-heavy. This is intentional behavior design, not decorative styling.

### How AI Should Use the Reference Folder

Do:

- Use it to understand visual treatment of widgets.
- Use it to learn how components are arranged in real page layouts.
- Use it to understand CARS24 design patterns, spacing, hierarchy, and flow logic.
- Use it for inspiration when deciding layout composition.
- Adapt patterns thoughtfully based on the user prompt.

Don't:

- Do not copy complete screens blindly.
- Do not assume every reference design is mandatory.
- Do not reuse layouts without checking the current prompt, brand, page type, and user goal.
- Do not treat visual references as fixed templates unless explicitly marked mandatory.

The AI must extract the design logic from references, then create a suitable design for the current prompt.

---

## Reference Usage Rules

The `reference` folder is a required design decision system, not just a visual library.

### Page References

Use `reference/pages/*` as the source of truth for macro composition.

Page references must be used to evaluate:

- hero structure
- section sequence
- CTA behavior
- navigation pattern
- trust module placement
- spacing rhythm
- card density
- footer behavior
- overall page pacing

These references define how a page should feel and flow at the full-screen level.

### Widget References

Use `reference/widget/*` as the source of truth for micro composition.

Widget references must be used to evaluate:

- internal padding
- alignment
- header structure
- content stacking
- media usage
- CTA placement
- density
- state behavior
- section-level spacing

These references define how each widget should behave inside the page.

## Macro vs Micro Rule

- `reference/pages/*` defines macro layout behavior.
- `reference/widget/*` defines micro layout behavior.

A correct design must satisfy both.

## Design Decision Rule

Written rules alone are not enough to justify implementation.

A valid design decision must be supported by:

1. page-type logic
2. brand logic
3. page reference review
4. widget reference review

## Extraction Rule

AI must extract logic from references, not copy screens verbatim.

Allowed:

- learning layout patterns
- learning spacing rhythm
- learning hierarchy
- learning CTA placement
- learning widget behavior

Not allowed:

- copying full screens
- copying full widget layouts without adaptation
- ignoring prompt context in favor of reference duplication

## Validation Rule

If the correct page folder was not reviewed, page composition is unvalidated.

If the correct widget folder was not reviewed, widget usage is unvalidated.

If both were not reviewed, the output should be treated as process-invalid even if visually acceptable or technically working.

## External Reference Fallback Rule

If the AI is out of context, needs additional UI reference support, or cannot understand the design behavior clearly enough from the repository references alone, it may use Mobbin as a secondary visual reference source.

Mobbin should be used to study:

- layout patterns
- spacing rhythm
- hierarchy
- visual pacing
- interaction ideas
- section composition

Mobbin must not replace the repository reference system.

The priority order is:

1. `reference/logicbook.md`
2. `reference/ai-execution.json`
3. `reference/pages/*`
4. `reference/widget/*`
5. Mobbin as additional support when needed

When using Mobbin:

- use it to recover context or strengthen design judgment
- do not copy screens directly
- do not override repository-specific widget rules with Mobbin patterns
- always adapt Mobbin inspiration back into the Cars24 widget system and reference logic

## Page-Type Evaluation Rule

L1, L2, and internal pages must be judged against:

- textual rules
- visual page references
- widget-specific references

Text-only compliance is not sufficient.

---

## 3. Core Design Principle

The AI must design with intent.

Do not place widgets just because they are available. Every section must answer one of these questions:

- What does the user need to understand?
- What action should the user take?
- What trust, clarity, or confidence is needed at this step?
- Which widget best solves this requirement?

A good output should feel like a real product page, not a collection of disconnected components.

## 3. Prompt Understanding Rules

Before designing, the AI must understand the prompt using the following checklist:

1. Brand - Which brand is being designed for?
   Example: CARS24, Team BHP, CarInfo, VehicleInfo.
2. Page category - Is the page L1, L2, or Internal?
3. User goal - What is the main user intent?
   Example: buy a car, sell a car, check car details, compare options, explore services, complete a form.
4. Business goal - What should the design encourage?
   Example: lead generation, search, trust building, booking, conversion, education.
5. Mandatory widgets - Does the prompt mention required widgets or sections?
6. Optional widgets - Which widgets can improve clarity, trust, navigation, or conversion?
7. Restrictions - Are there any page-type, brand, or flow-specific rules?

If the prompt is incomplete, the AI must make a reasonable assumption and continue. It should not stop unless the missing information prevents a usable design.

---

## 4. Page Categories

### 4.1 L1 Pages

L1 pages are first-level pages such as:

- Landing pages
- Homepages
- Brand entry pages
- Main campaign pages

L1 pages define the first impression of the brand or product experience.

Each L1 page must have a strong visual identity. The AI must not use a generic layout for all brands. Every L1 page should feel distinct based on brand, audience, and objective.

For CARS24 specifically, L1 pages are entry-point pages. Their job is to help users quickly understand the major journeys, bucket services and information clearly, and move into the right next step without friction.

L1 pages for CARS24 are not just marketing surfaces. They are structured entry points into the ecosystem.

#### L1 Design Rules

- Start with a strong hero section.
- Clearly communicate the primary value proposition above the fold.
- Include one clear primary call to action.
- Use brand-specific tone, color, visual rhythm, and content hierarchy.
- Introduce the key product/service journey early.
- Use trust-building widgets where relevant.
- Avoid overly dense layouts in the first screen.
- Do not start with low-priority widgets such as FAQs, testimonials, or footers.
- Use container-style grouping to bucket services and information into clear entry points.
- Learn the layout language from the provided reference pages before composing the screen.
- Keep the design clean and simple. Do not add unnecessary boxed treatments or rounded card shells inside widgets unless the widget itself explicitly requires it.
- Prefer visual recognition over text explanation in the early parts of the page.
- Keep text context minimal when the visual and service bucket already communicate the intent.
- Use widgets as service containers that help users recognize the right journey quickly.
- Treat the first scroll as an entry surface, not a reading surface.
- Let the first content blocks move users into journeys such as buy, sell, loans, checks, and vehicle management quickly.
- Prefer direct service labels over abstract category copy.
- Choose Grid Widget or Static Slider based on how much content sits inside a given service bucket.
- Do not add blanket overall page padding to push the entire layout inward on mobile pages.
- Let widgets define most of the page-edge spacing unless a specific structure clearly requires something else.

#### L1 Purpose For CARS24

An L1 page for CARS24 should solve these needs:

- establish the main entry points into the platform
- group services into understandable buckets
- help users discover the right journey quickly
- reduce confusion in the first screen
- create confidence and clarity before deeper exploration
- help users recognize services visually, not only by reading
- support fast consumption behavior by making service groups easy to scan

#### Visual Consumption Rule For CARS24

CARS24 L1 pages are often visually heavy on purpose.

This is not because more decoration is better. It is because users recognize visual service cues faster than they read long text blocks.

Both text and visuals have different purposes:

- visuals help fast recognition
- text helps confirmation and clarity

The system should therefore prioritize visual recognition first, with text used only where it adds necessary support.

#### Service Bucketing Rule

L1 pages for CARS24 should use container-style grouping to bucket services and information.

Examples:

- buy can contain multiple buying services
- sell can contain multiple selling services
- loans can contain multiple finance services
- trust or pre-buying can contain checks, inspection, or history services

The goal is not to describe every service in detail. The goal is to help the user recognize the right bucket quickly and enter the right flow.

Buckets should be concrete and product-real.

Good bucket content examples:

- Buy used car
- Buy new car
- Sell your car
- Check car price
- Used car loan
- Credit score
- Car service history
- Pay challan

Avoid abstract bucket content such as:

- mobility options
- automotive solutions
- explore more
- everything cars

If the reference page shows concrete service actions, the AI should stay concrete in both section composition and card labels.

#### Single Bucket Composition Rule

Each service bucket should be resolved as one composition system.

This means:

- do not create a Module Widget first and then place another widget under it for the same bucket
- do not wrap a bucket in one abstract container and then start the real bucket again below it
- if Grid is the right bucket solution, let Grid be the bucket
- if Static Slider is the right bucket solution, let Static Slider be the bucket
- if no exact bucket pattern exists, use Module Widget itself to build that bucket directly

The AI must not stack "wrapper bucket" and "real bucket" patterns for the same section. That creates unnecessary layers and breaks the visual rhythm.

#### Grid vs Static Slider Rule

When building a service bucket:

- use Grid when the content count is small and should be seen together at once
- use Static Slider when the bucket contains more items, or when horizontal browsing improves scan behavior
- choose the widget based on content amount and recognition behavior, not personal preference
- do not add a separate heading block above a widget if the widget header itself already resolves the section cleanly
- prefer one resolved bucket widget over a heading plus another loose widget under it

#### L1 Mandatory Widget Combination For CARS24

For a complete CARS24 L1 page, the AI should strongly consider this widget combination as the default page-building system:

- Top Tab Header Widget
- Grid Widget
- Static Slider
- Module Widget
- List Widget
- FAQ Widget
- Banner Widget

This does not mean every widget must be repeated multiple times. It means the L1 page should usually be assembled from these building blocks unless the prompt clearly requires a different structure.

#### Common L1 Widget Types

Use widgets such as:

- Hero/banner widget
- Search or input widget
- Primary CTA widget
- Category navigation widget
- Trust markers
- Feature highlights
- Popular items/cards
- Process explanation
- Testimonials or social proof
- FAQ
- Footer

---

### 4.2 L2 Pages

L2 pages come after a landing page. These include pages such as:

- CLP / category listing pages
- Detail pages
- Search result pages
- Product/service detail pages
- City or location pages
- Comparison or exploration pages

L2 pages are usually more functional than L1 pages. Their purpose is to help the user evaluate, filter, compare, decide, or move deeper into the flow.

#### L2 Design Rules

- Prioritize clarity and task completion.
- Use widgets that help users compare, filter, scan, or make decisions.
- Keep navigation and context visible.
- Use cards, lists, tables, filters, details, specs, pricing, and trust widgets based on need.
- Do not overuse marketing-heavy sections unless the prompt asks for it.
- Place conversion widgets at natural decision points.

#### Common L2 Widget Types

Use widgets such as:

- Listing cards
- Filter widgets
- Sort widgets
- Detail summary widgets
- Specification widgets
- Price breakdown widgets
- Comparison widgets
- Sticky CTA
- Similar/recommended items
- Trust and verification widgets
- FAQ

---

### 4.3 Internal Flow Pages

Internal flow pages are screens inside a user journey. These may include:

- Forms
- Booking flows
- Step-by-step flows
- Verification flows
- Payment-related flows
- Confirmation screens
- Status pages
- Custom task screens

Internal pages have fewer restrictions than L1 and L2 pages. They can use widgets where helpful, but may also require custom design patterns.

#### Internal Flow Design Rules

- Prioritize completion, clarity, and reduced friction.
- Use minimal distractions.
- Show progress where the journey has multiple steps.
- Provide clear validation, error, and success states.
- Use simple CTAs with direct labels.
- Keep content short and action-focused.
- Use widgets only when they support the task.
- Custom layouts are allowed when existing widgets do not fit the flow.

---

## 5. Widget Selection Logic

The AI must select widgets based on purpose, not appearance alone.

### 5.1 Widget Decision Framework

For every widget, the AI must check:

1. Does it match the user goal?
2. Does it fit the page category?
3. Does it match the brand identity?
4. Does it improve clarity, trust, conversion, or navigation?
5. Is it mandatory, recommended, optional, or unsuitable?

If a widget does not satisfy at least one clear purpose, do not use it.

### Widget Contract Compliance Rule

The AI must also respect the actual structural contract of each widget, not just its visual intent.

This means:

- do not assume a widget can support more items than its approved layout allows
- do not force extra cards, rows, or content into a widget if the widget is designed for a smaller fixed composition
- do not treat Storybook widgets like generic containers
- confirm whether a widget is single-row, multi-item, scrollable, fixed-count, or CTA-bound before using it in a real page

If a bucket needs more items than a widget supports:

- switch to a widget that structurally supports that content count
- or use Module Widget only if no existing widget fits

Breaking widget structure in a way that causes layout failure, overflow, clipped content, or unstable composition should be treated as a critical implementation mistake.

### Widget Filtering Rule

Before creating any custom section, the AI must filter through the existing widget system first.

The decision order should be:

1. Check whether an existing widget already fulfills the requirement.
2. If yes, use the existing widget.
3. If not, check whether the requirement can be solved by `Grid Widget`, `Static Slider`, or `Module Widget`.
4. Only if the requirement still cannot be satisfied cleanly should the AI create a custom composition.

In practice:

- do not create custom sections just because they feel easier to design manually
- do not bypass existing widgets when they already solve the requirement
- always evaluate `Grid` and `Static Slider` before inventing a custom layout
- use custom composition only when the widget library genuinely does not fulfill the requirement

If an existing widget fulfills the requirement, using a custom-built section instead should be treated as a design-system compliance mistake.

### Variant Filtering Rule

Checking a widget is not enough. The AI must also check whether the widget already has a supported variant that fulfills the requirement.

This means:

- do not stop at the widget name level
- inspect supported variants such as `Text Inside`, `Text Outside`, `With Icon`, size options, and column-count options
- if a required pattern already exists as a widget variant, use that variant instead of custom-building the pattern

Example:

- if `GridCard` already supports a `With Icon` variant for utility cards, do not draw fake icon blocks manually inside a custom card

If the right variant exists and the AI still creates a manual replacement, that should be treated as a design-system compliance mistake.

### Screenshot To Widget Mapping Rule

If the user shares a screenshot, mock, visual reference, or existing design sample, the AI must evaluate the visual against the repository widget system before starting implementation.

The AI must ask:

1. Which existing widget does this section most closely match?
2. Which existing component or variant does this card or block most closely match?
3. Which parts are already solved by the design system?
4. Which parts genuinely require custom composition only after widget filtering is complete?

Required execution order:

1. analyze the screenshot section by section
2. map each section to the closest widget
3. map each card or block to the closest component or variant
4. use the approved widget/component first
5. only then add custom composition where the system truly cannot satisfy the reference

Do:

- use screenshots to reverse-map design patterns into widgets and components
- identify the closest approved widget before writing UI code
- identify the closest approved component variant before drawing a custom block
- treat visual references as component-selection input, not just visual inspiration

Don't:

- do not start building blindly from the screenshot
- do not jump directly into hardcoded layouts
- do not recreate cards or sections manually if the repo already provides a close widget or component
- do not use custom wrappers as the first move before checking widget compatibility
- do not hardcode a section just because it looks simple

If screenshot-to-widget evaluation was skipped, the implementation should be treated as incomplete even if the page looks visually acceptable.

### Grid And Block Card Rule

If a section is being built as a grid layout, block layout, or grouped card layout, the AI should not define a new manual card first.

The AI must check:

1. can this be solved by `GridWidget`?
2. can this be solved by `GridCard`?
3. can this be solved by `StaticSliderWidget` with approved slider cards?
4. can this be solved by an existing card variant already available in the system?

Do:

- use `GridCard` when building card-based grid or block layouts
- use the widget shell first, then approved cards inside it
- use card variants instead of drawing a new custom card shell

Don't:

- do not define a new custom card inside a grid or block section if `GridCard` already fits
- do not manually recreate card borders, radius, spacing, and text structure when the system already provides the card
- do not mix widget-level section structure with handmade cards unless the system truly has no matching card pattern

If the layout is grid-led or block-led and the AI still builds manual cards where `GridCard` or an approved card variant would work, that should be treated as a design-system compliance mistake.

### Filled Image Rule

If the AI is placing images inside:

- `GridCard`
- `GridWidget`
- `StaticSliderCard`
- `StaticSliderWidget`
- rotating banner cards
- banner media slots

the image treatment should be `Filled`.

This means:

- the media should fill the available image slot
- the image should not sit like a small contained sticker unless the component pattern explicitly requires that behavior
- the visual should feel integrated with the card, not floating inside unused empty space

Do:

- use filled image treatment for grid, slider, and rotating-banner card media
- let the image occupy the full visual slot of the card
- keep card imagery immersive and edge-aware

Don't:

- do not use contained image treatment for card media by default
- do not leave large empty areas around card imagery when the slot is meant to be image-led

If grid, slider, or rotating-banner media is not using filled image treatment where the pattern is image-led, the implementation should be treated as incomplete.

---

## 6. Widget Priority Levels

Each widget should be treated as one of the following:

### Mandatory

Must be used when the prompt, brand, template, or page rule requires it.

### Recommended

Should be used because it strongly supports the page goal.

### Optional

Can be used if it improves the design, but can be skipped.

### Avoid

Should not be used because it does not match the page, flow, brand, or user goal.

---

## 7. Design Inspiration vs Copying

The provided design and template repository is for guidance and inspiration.

The AI may use existing examples to understand:

- Layout structure
- Widget behavior
- Spacing rhythm
- Content hierarchy
- Interaction patterns
- Brand treatment
- Page composition

The AI must not copy an entire existing page unless the prompt explicitly asks for the same pattern or a rule marks that template as mandatory.

When adapting existing designs, the AI must preserve the design logic while customizing the content, order, hierarchy, and visual emphasis for the new prompt.

---

## 8. Brand-Aware Design Rules

The AI must identify the brand before composing the page.

### CARS24

Design should feel trustworthy, conversion-focused, simple, and customer-friendly. Use clear CTAs, helpful content, vehicle-focused visuals, and confidence-building sections.

### Team BHP

Design should feel operational, internal, efficient, and structured. Prioritize workflows, clarity, dashboards, task completion, and internal usability.

### CarInfo

Design should feel informative, utility-driven, data-friendly, and easy to scan. Prioritize car information, records, comparisons, tools, and user education.

### VehicleInfo

Design should feel structured around vehicle data and service information. Prioritize accuracy, clarity, comparison, and detail presentation.

---

## 9. Layout Composition Rules

A page should follow a logical story arc.

### Recommended L1 Flow

1. Top entry layer with context, search, and top-tab navigation
2. Optional banner or rotating hero if it strengthens entry behavior
3. Direct service buckets for major journeys such as buy, sell, loans, checks, and vehicle management
4. Discovery or commerce buckets such as trending cars, deals, or showrooms
5. Trust or proof sections at natural points in the scroll
6. FAQ
7. Footer

For CARS24 specifically, the L1 page should usually behave like:

- users land
- users recognize their journey quickly
- users tap into a bucket
- trust and depth appear after entry, not before

### Recommended L2 Flow

1. Context/header section
2. Search/filter/sort tools
3. Primary content list or detail area
4. Supporting information
5. Recommendation or comparison section
6. Trust/verification section
7. Sticky or repeated CTA
8. FAQ/footer if needed

### Recommended Internal Flow

1. Page title and task context
2. Progress indicator if multi-step
3. Main form/task area
4. Help text or guidance
5. Error/validation states
6. Primary CTA
7. Confirmation or next-step state

---

## 10. Content Rules

The AI must generate content that is clear, realistic, and product-appropriate.

### Content Must Be

- Short and scannable
- Action-oriented
- Brand-appropriate
- Specific to the prompt
- Useful for the user journey
- Free of placeholder text unless explicitly requested
- Minimal when visuals already communicate the meaning clearly
- Supportive rather than dominant in visual-first entry-point sections

### Avoid

- Generic headings like "Welcome" without context
- Long paragraphs in functional flows
- Multiple competing CTAs
- Repeating the same message in multiple sections
- Over-promising or unrealistic claims
- Using unrelated widgets only to fill space
- Explaining every service with too much copy when visual buckets already do the job
- Turning the homepage into a reading-heavy experience

---

## 11. CTA Rules

Every primary page must have a clear main action.

### CTA Guidelines

- Use one dominant primary CTA per screen section.
- Secondary CTAs are allowed only when they support exploration.
- CTA labels must be specific.
- Avoid vague labels like "Click Here" or "Submit" unless the context is obvious.

### Button Group Usage Rule

Button Group inside widgets is not mandatory by default.

Use Button Group only when:

- the section needs a clear next step
- the user must move forward through a distinct action
- the content alone is not enough to complete the section's purpose
- the bucket needs a strong conversion push rather than simple exploration

Do not use Button Group when:

- cards or service items already act as the main entry actions
- a header action such as "View all" is enough
- the section is primarily for browsing, recognition, or discovery
- adding a button would duplicate the obvious next step

For CARS24 L1 pages specifically:

- do not force Button Group into every widget
- use one strong primary action where the page genuinely needs it
- prefer visual bucket entry and section-level navigation before adding extra button groups

### Good CTA Examples

- Search cars
- Check car price
- Book inspection
- View details
- Compare cars
- Start selling
- Continue

---

## 12. Handling Missing Information

If the prompt does not specify a brand, page type, or widget, the AI must infer the most likely option from the prompt.

Example assumptions:

- "Create homepage for buying cars" -> CARS24, L1
- "Create car listing page" -> CARS24 or CarInfo, L2
- "Create booking flow" -> Internal flow
- "Create car detail page" -> L2

The AI may mention assumptions briefly in its output, but should still generate the design.

---

## 13. Output Expectations

When responding to a design prompt, the AI should provide:

1. Page type identified - L1, L2, or Internal
2. Brand identified - CARS24, Team BHP, CarInfo, or VehicleInfo
3. Widget plan - Ordered list of widgets/sections
4. Reasoning - Why each widget is used
5. Layout guidance - Visual hierarchy, spacing, and interaction notes
6. Content draft - Suggested headings, subtext, CTA labels, and key copy
7. Rules applied - Any mandatory template or widget rules followed

---

## 14. AI Execution Checklist

Before finalizing any design, the AI must verify:

- The selected widgets match the prompt.
- The page type is correct.
- The brand identity is respected.
- The first screen has a clear purpose.
- The primary CTA is obvious.
- The flow order makes sense.
- No unnecessary widgets are added.
- Mandatory widgets or templates are included.
- Existing templates are used as inspiration, not copied blindly.
- Internal flow pages remain simple and task-focused.

---

## 15. Widget Guidelines (Extended)

The following widgets have specific usage rules. Each widget includes a clear description, followed by Do and Don't rules to guide AI decision-making.

### Top Tab

Description:
Top Tab is the primary navigation and entry widget placed at the top of L1 pages. It defines the first interaction layer and helps users quickly switch between key sections, categories, or journeys. It sets the tone for navigation structure across the page.

Do:

- Use on L1 pages for all supported brands.
- Place at the very top as the entry navigation layer.
- Follow patterns from the Template folder.
- Keep labels clear, short, and meaningful.

Don't:

- Do not use in L2 or internal pages unless explicitly required.
- Do not redesign its structure arbitrarily.
- Do not overload with too many tabs.

### Top Tab Header Widget

Description:
Top Tab Header Widget is the preferred L1 entry widget for CARS24 homepage and landing experiences. It combines the branded entry layer, navigation, and top-of-page interaction pattern into one system.

Do:

- Use it as a primary entry-point system on CARS24 L1 pages.
- Keep it sticky at the top of the screen on CARS24 L1 pages.
- Make it collapse smoothly on scroll when the page moves into content.
- Use it to bucket major services and journeys clearly.
- Learn its structure from the reference pages before composing surrounding sections.
- Keep the layout clean and light in the opening screen.

Don't:

- Do not assume the banner inside Top Tab Header Widget is mandatory.
- Do not treat it like a normal scroll-away section on CARS24 L1 pages.
- Do not place other content above it.
- Do not let the collapse state snap abruptly if the widget supports a collapsed mode.

Compliance rule:

- If Top Tab Header Widget is sticky but does not collapse correctly on scroll where the reference behavior expects collapse, the implementation should be treated as incomplete.
- If collapse is supported, the transition should feel smooth and intentional rather than sudden or broken.
- Do not force a banner if the page works better without it.
- Do not overload the first screen with extra content around it.
- Do not add unnecessary boxed summary cards inside or immediately after it unless the prompt clearly needs them.

Banner rule:
The banner inside Top Tab Header Widget is optional, not mandatory.

### Footer (Mobile Web)

Description:
Footer msite is the final section of mobile web pages. It provides access to secondary navigation, legal information, support links, and additional resources. It acts as a closure to the page journey.

Do:

- Always place at the end of mobile web pages.
- Use it as the final navigation and information layer.
- Include essential links like help, policies, and contact.

Don't:

- Do not place it mid-page.
- Do not use in app layouts.
- Do not overload with unnecessary links.

### Footer (App)

Description:
Footer app is the bottom-most section in mobile app layouts. It aligns with app navigation systems and provides persistent or terminal navigation options.

Do:

- Always place at the end of mobile app pages.
- Maintain consistency with app navigation patterns.
- Align with platform-specific UX guidelines.

Don't:

- Do not use in mobile web layouts.
- Do not modify its structure unnecessarily.
- Do not mix with msite footer patterns.

### Action Bar

Description:
Action Bar is a sticky bottom component used primarily in internal flows. It provides users with immediate access to key actions, ensuring that the next step is always visible and accessible.

Do:

- Use in internal flows for primary actions.
- Keep it sticky at the bottom.
- Ensure CTA is clear and actionable.
- Reflect real-time state when needed (e.g., price, selection).

Don't:

- Do not overload with multiple competing actions.
- Do not use in L1 pages unless explicitly needed.
- Do not hide critical actions outside the bar.

### Address Card

Description:
Address Card displays location-related information such as user address, car location, service availability, or delivery context. It helps anchor the experience geographically.

Do:

- Use where location context is important.
- Keep content concise and relevant.
- Use consistent formatting for readability.

Don't:

- Do not use when location is irrelevant.
- Do not overload with excessive details.
- Do not duplicate the same information elsewhere.

### Brand Card Group

Description:
Brand Card Group is used to display multiple car brands in a structured and visual format. It helps users explore and select brands quickly during discovery flows.

Do:

- Use for brand discovery and selection.
- Maintain clear visual grouping.
- Keep brand representation consistent.

Don't:

- Do not force usage if another widget fits better.
- Do not mix unrelated categories in the same group.
- Do not overcrowd with too many options.

### Module Widget

Description:
Module Widget is a flexible, custom-defined container used when no existing widget satisfies the requirement. It allows designers to create new structured components while staying within system boundaries.

Do:

- Use when no existing widget fits the requirement.
- Use it first when the AI gets stuck because the exact required composition does not exist.
- Ensure consistency with overall design system.
- Define clear structure and purpose.
- Use it to design within system boundaries instead of inventing completely new primitives.
- Use it to create service buckets when the exact bucket pattern does not exist as a ready-made widget.
- Keep it focused on grouping and recognition, not explanation-heavy content.
- If Module Widget is used for a bucket, the bucket should be completed inside Module Widget itself.

Don't:

- Do not overuse for simple cases.
- Do not break design consistency.
- Do not create overly complex or unclear layouts.
- Do not turn Module Widget into a heavy boxed card system by default.
- Do not add unnecessary corner radius or framed container treatment inside the widget just to create visual weight.
- Do not use Module Widget as a wrapper and then place another widget underneath it for the same bucket.

### FAB (Floating Action Button)

Description:
FAB is a floating button used to highlight quick or secondary actions. It sits above the main content layer and acts as a nudge for user interaction.

Do:

- Use as a secondary or quick action trigger.
- Keep it visible but non-intrusive.
- Use clear iconography or short labels.

Don't:

- Do not block important UI elements.
- Do not use for primary actions that require full attention.
- Do not use multiple FABs on one screen.

### FAQ Widget

Description:
FAQ widget provides collapsible question-answer sections to address common user doubts. It reduces friction by answering concerns without leaving the page.

Do:

- Use when users may have common questions.
- Keep answers short and helpful.
- Group related questions logically.

Don't:

- Do not add generic or unnecessary FAQs.
- Do not overload with too many questions.
- Do not repeat information already explained.

### Guide Preview

Description:
Guide Preview is an onboarding or instructional widget shown before starting a flow. It visually explains how a process works using rich media.

Do:

- Use before starting complex flows.
- Keep instructions visual and simple.
- Use GIFs, illustrations, or Lottie effectively.

Don't:

- Do not make it long or text-heavy.
- Do not use for simple flows where guidance is not needed.
- Do not delay entry into the main flow.

### Header Video

Description:
Header Video is a media-driven widget placed at the top of L2 pages to enhance storytelling, explain features, or improve engagement.

Do:

- Use in L2 when video adds clarity or engagement.
- Keep it optimized and quick to load.
- Ensure it supports the page goal.

Don't:

- Do not delay primary content or CTA.
- Do not use autoplay with sound.
- Do not use when static content is sufficient.

### Section Header Usage Rules

Description:
Section Header is a content-organization system used inside many widgets. It contains Title 1, Title 2, tag/badge, link button, and description. Each part is optional except where noted below.

#### Section Header Element Rules

Title 1:

- Title 1 is mandatory in most widget usage.
- It is the main section-heading line and should always carry the primary meaning.
- Exception: do not force Title 1 usage in Banner Widget or Rotating Carousel when the composition already communicates the message correctly without it.

Title 2:

- Title 2 is optional.
- Use it only when the context becomes too long for Title 1.
- Use it to naturally extend or complete the thought started in Title 1.
- Do not use Title 2 as a separate unrelated label.
- If Title 2 is not needed, hide it using the widget's boolean or visibility control instead of leaving fallback text visible.

Tag / Badge:

- Tag or badge is optional.
- Do not use it in every widget by default.
- Use it when the design needs to draw attention to an offer, priority label, or important status.
- If there is no special attention-worthy message, skip it.

Link Button:

- Link button is optional.
- Use it only when the section benefits from a clear secondary navigation or "view all" action.
- Do not add it automatically to every section.

Description:

- Description is optional.
- Do not use description in every widget by default.
- Use it only when extra context is genuinely needed.
- If the heading and widget content already communicate clearly, skip the description.
- If description is not needed, hide it using the widget's boolean or visibility control instead of leaving fallback copy visible.

#### Section Header Compliance Rule

When using Section Header inside widgets:

- keep Title 1 as the primary content anchor
- use Title 2 only for overflow or expansion of Title 1
- use tag only when emphasis is needed
- use description only when context is needed
- avoid filling every available header slot just because the API allows it
- if Title 2 or description do not have real context, explicitly hide them

#### Clean Composition Rule

Within widgets or Module Widget compositions:

- do not make the design look boxed by default
- do not add unnecessary card shells
- do not add rounded-corner framing unless the widget pattern specifically requires it
- prefer clean, simple, open composition aligned with the reference designs
- do not rely on global shell padding as a substitute for proper widget spacing
- do not wrap the full page in generic left-right-top padding when the widget system already handles that spacing

---

## 16. Widget Registry (Source of Truth)

The following is the complete and correct list of widgets available in the Storybook library. The AI must only use widgets from this list unless explicitly using a Module Widget for custom needs.

### Core Widgets

Action Bar
Add more car card
Add on Cards
Address card
Brand card group
Car Hero Display Card
Dialog Popup
EMI Tracker (NBFC)
Error and empty state widget
Expert Card
FAB
FAQ
Footer
Guide Preview
Header video
Hero banner - mobile
Info card
Inline button group
Inner Page - Top Banner
Internal Page header
Loan amount selector (NBFC)
Loan Card (NBFC)
Locator
Offer detail card
Offer details Card (NBFC)
Onboarding Screen
Option List
Page Caption with SEO
Payment card (NBFC)
Profile Hero Section
Reg number input system
SEO Section
Showroom address
State card
Suggestion card
Tile List Widget
To do Card (NBFC)
Video Banner
Webquote
Invoice Card
Progress Circle
App rating banner
Application card
Car context card
Car expert card
Car highlight banner
Filter
Floating Action Button
Footer msite
ID Card details (NBFC)
Inline Choice Widget
List
Loan card NBFC
Orbit Card
Order summary
Package Card
Payment card NBFC
Side Tab - Progress tracker
Single car comparison carousel
Sold car carousel
Stylized Page header
Testimonial
Upcoming detail card
Booking Detail Card
Slot Component
Checklist
Choice chips and Filter Bar - V2 (NEW)
Comparison menu
Date Picker
Dynamic Banner Widget
Feedback form
Fixed action bar
Form Widget (m-Site)
Grid-bento
Inline information bar
Internal List Card
Link Group
Loan Calculator
Multi car Comparison carousel
Showroom Card
Snackbar
Choice tiles (NEW)
Dynamic card slider
Grid
Static Slider + Static Tab Slider
Stories and Videos
Car Card
Comparison Table
PLP Car card (NEW)
Top tab

---

### Rules for Using Widget Registry

Do:

- Treat this list as the single source of truth.
- Select widgets strictly based on relevance to the prompt.
- Prefer existing widgets over creating new ones.
- Use Module Widget only when no listed widget fits.

Don't:

- Do not invent new widget names.
- Do not rename existing widgets.
- Do not assume behavior outside defined usage.

---

## 17. Golden Rule

The AI must not only design how the page looks. It must design how the page works.

Every widget, section, CTA, and layout decision must help the user move forward in the journey.
