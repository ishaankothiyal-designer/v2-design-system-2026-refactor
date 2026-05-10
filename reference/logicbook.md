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

#### L1 Design Rules

- Start with a strong hero section.
- Clearly communicate the primary value proposition above the fold.
- Include one clear primary call to action.
- Use brand-specific tone, color, visual rhythm, and content hierarchy.
- Introduce the key product/service journey early.
- Use trust-building widgets where relevant.
- Avoid overly dense layouts in the first screen.
- Do not start with low-priority widgets such as FAQs, testimonials, or footers.

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

1. Hero / value proposition
2. Primary action or search/input
3. Key benefits or feature highlights
4. Product/service journey
5. Popular categories or recommended options
6. Trust markers
7. Social proof or testimonials
8. FAQ
9. Footer

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

### Avoid

- Generic headings like "Welcome" without context
- Long paragraphs in functional flows
- Multiple competing CTAs
- Repeating the same message in multiple sections
- Over-promising or unrealistic claims
- Using unrelated widgets only to fill space

---

## 11. CTA Rules

Every primary page must have a clear main action.

### CTA Guidelines

- Use one dominant primary CTA per screen section.
- Secondary CTAs are allowed only when they support exploration.
- CTA labels must be specific.
- Avoid vague labels like "Click Here" or "Submit" unless the context is obvious.

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
- Ensure consistency with overall design system.
- Define clear structure and purpose.

Don't:

- Do not overuse for simple cases.
- Do not break design consistency.
- Do not create overly complex or unclear layouts.

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
