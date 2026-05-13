# Legacy Storybook Prop Merge Documentation

## Scope

This document compares the legacy component prop model exported in `/Users/a38695/Downloads/component props.json` with the current canonical web component APIs and Storybook stories in this repository.

This is an analysis and migration-planning document only. It does not recommend directly merging the legacy prop contract into the canonical component APIs.

## Sources

- Legacy prop export: `/Users/a38695/Downloads/component props.json`
- Current Storybook stories: `apps/storybook/src/stories/*.stories.tsx`
- Current canonical exports: [packages/web/src/index.ts](./packages/web/src/index.ts)
- Representative canonical component APIs:
  - [packages/web/src/canonical/accordion.tsx](./packages/web/src/canonical/accordion.tsx)
  - [packages/web/src/canonical/banner.tsx](./packages/web/src/canonical/banner.tsx)
  - [packages/web/src/canonical/bottom-nav.tsx](./packages/web/src/canonical/bottom-nav.tsx)
  - [packages/web/src/canonical/button-group.tsx](./packages/web/src/canonical/button-group.tsx)
  - [packages/web/src/canonical/button.tsx](./packages/web/src/canonical/button.tsx)
  - [packages/web/src/canonical/dropdown.tsx](./packages/web/src/canonical/dropdown.tsx)
  - [packages/web/src/canonical/otp-input.tsx](./packages/web/src/canonical/otp-input.tsx)
  - [packages/web/src/canonical/phone-input.tsx](./packages/web/src/canonical/phone-input.tsx)
  - [packages/web/src/canonical/text-input.tsx](./packages/web/src/canonical/text-input.tsx)
  - [packages/web/src/canonical/top-tab.tsx](./packages/web/src/canonical/top-tab.tsx)
  - [packages/web/src/canonical/tooltip.tsx](./packages/web/src/canonical/tooltip.tsx)

## Executive Summary

- `25/25` legacy components already have a corresponding Storybook story in the current repo.
- The legacy export contains `198` top-level props.
- `97` legacy props match a current prop name directly.
- `101` legacy props do not match directly and would require:
  - prop rename mapping
  - story-level wrapper/adaptor logic
  - or actual component API changes
- Direct match coverage is `49%`.

### What This Means

The current Storybook can support migration analysis for every legacy component, but it should not absorb the old contract 1:1 into the canonical components.

The safest path is:

1. Keep canonical component APIs as the source of truth.
2. Add temporary Storybook migration wrappers only where necessary.
3. Document legacy-to-current mappings explicitly.
4. Avoid permanent dual APIs in `packages/web` unless a product dependency requires them.

## Ownership Model

This document uses three ownership buckets:

- `Backend` means business content, configuration objects, lists, navigation metadata, or values likely coming from API or CMS payloads.
- `Frontend` means rendering, styling, DOM/accessibility, visual toggles, and Storybook controls.
- `Shared` means controlled state and event handlers. These are often initialized by backend data but ultimately owned by frontend runtime behavior.

## Storybook Merge Guidance

### Lowest-risk merge

Merge at the Storybook layer only:

- add legacy-to-current mapping logic in stories or wrappers
- keep canonical component props unchanged
- mark legacy props as migration-only

### Highest-risk merge

Merge at the component API layer:

- canonical component signatures become larger and less consistent
- Storybook docs stop reflecting the true source of truth cleanly
- testing and maintenance cost rise sharply

## Component Summary Table

| Component | Backend / Data Props | Frontend Props | Shared Props | Storybook Impact | API Risk | Recommendation |
|---|---|---|---|---|---|---|
| Accordion | `title`, `description`, `leadingIcon`, `leadingIconColor` | `disabled`, `className`, `theme` | `isOpen`, `defaultOpen`, `onToggle` | Low | Low | Story-level rename mapping is safe |
| Badge | `text`, `leadingIcon`, `trailingIcon` | `variant`, `appearance`, `size`, `borderRadius` | — | Medium | Medium | Wrapper mapping only |
| Banner | `widgetHeader`, `cta` | `children`, `theme`, `showHeader`, `showCta`, `className` | `onCtaClick`, `onHeaderCtaClick` | High | High | Do not merge directly into canonical API |
| Bottom Nav | `navItems` | `theme`, `hideOnScroll`, `className` | `activeTab`, `onTabChange` | Medium | Medium | Wrapper and schema mapping |
| Button | `cta`, `loadingText` | `disabled`, `isLoading`, `tabIndex` | `onClick` | Low | Low | Safe adapter candidate |
| Button Group | `buttons` | `size`, `style` | `onClick` | High | High | Prefer separate migration story |
| Checkbox | `label`, `required` | `disabled`, `id`, `size`, `className`, `tabIndex` | `checked`, `indeterminate`, `onChange`, `onClick` | Medium | Medium | Likely needs composition with label wrapper |
| Divider | `text` | `className` | — | Low | Low | Safe story mapping |
| Dropdown | `label`, `caption`, `icon` | `showIconBg`, `inverse`, `disabled`, `className`, `id` | `selected`, `onClick` | Medium | Medium | Wrapper mapping |
| Horizontal Tab | `items` | `className`, `showIcon`, `animationDuration`, `ImageLoader` | `activeIndex`, `onTabChange` | Medium | Medium | Wrapper mapping |
| Icon Button | `icon` | `children`, `theme`, `showBorder`, `disabled`, `ariaLabel`, `type`, `style`, `size`, `iconSize`, `shadow` | `onClick` | Medium | Medium | Keep canonical API unchanged |
| Link Button | `widgetHeader` | `size`, `tone`, `type`, `disabled`, `trailingIconClass`, `textWrapAllowed`, `underline`, `className` | `onLinkClick` | Medium | Medium | Wrapper mapping |
| Notification Badge | `title`, `leftIcon` | `variant`, `size` | — | High | High | Current component is conceptually different |
| OTP Input | `configuration`, `widgetHeader` | `className` | `onChange`, `onFocus`, `onBlur`, `onComplete` | Medium | Medium | Wrapper mapping, not API merge |
| Phone Input | `label`, `required`, `error`, `errorText`, `success`, `successText`, `helperText`, `value`, `placeholder`, `maxLength`, `name`, `showCountryCode` | `disabled`, `id`, `autoFocus` | `onChange`, `onBlur`, `onFocus` | Low | Medium | Good migration candidate via adapter |
| Progress Bar | `totalSteps`, `completedSteps` | `className` | — | Low | Low | Simple derivation to `percentage` |
| Progress Stepper | `steps`, `headerContent` | — | `currentIndex`, `onStepClick` | Medium | Medium | Wrapper mapping |
| Radio | `name`, `value`, `label`, `required` | `disabled`, `id`, `size`, `className`, `tabIndex` | `checked`, `onChange`, `onClick` | Medium | Medium | Likely composition with label wrapper |
| Ratings | `widgetHeader`, `configuration`, `ratingInput`, `cta` | `className` | `onRatingChange`, `onSubmit` | High | High | Current canonical component is much flatter |
| Segmented Control | `tabs` | `variant`, `size`, `rounded`, `className` | `activeTabId`, `onTabChange` | Medium | Medium | Wrapper mapping |
| Social Button | `cta`, `loadingText` | `disabled`, `isLoading`, `className` | `onClick` | Medium | Medium | Wrapper mapping |
| Switch | `label`, `description` | `size`, `disabled` | `checked`, `defaultChecked`, `onChecked` | Medium | Medium | Prefer composition with `SwitchLabel` |
| Text Input | `configuration`, `widgetHeader` | — | `onChange`, `onFocus`, `onBlur`, `onCtaClick` | High | High | Do not merge directly into canonical input API |
| Tooltip | `content` | `children`, `direction`, `alignment`, `theme`, `disabled`, `className`, `triggerClassName`, `showArrow`, `offset`, `zIndex` | — | Medium | Medium | Story-level mapping is fine |
| Top Tab | `tabs`, `searchPlaceholder`, `banner`, `filters` | `backgroundColor`, `tabStyle`, `showSearch`, `showActionIcon`, `className`, `ImageLoader` | `onSearchClick`, `onActionIconClick` | High | High | Separate migration layer recommended |

## Detailed Component Documentation

### Accordion

- Backend: `title`, `description`, `leadingIcon`, `leadingIconColor`
- Frontend: `disabled`, `className`, `theme`
- Shared: `isOpen`, `defaultOpen`, `onToggle`
- Current API direction:
  - `description` is closer to `supportingText`
  - `isOpen` maps to `expanded`
  - `defaultOpen` maps to `defaultExpanded`
  - `onToggle` maps to `onExpandedChange`
- Storybook impact: low
- Recommendation: safe to support with a thin compatibility story

### Badge

- Backend: `text`, `leadingIcon`, `trailingIcon`
- Frontend: `variant`, `appearance`, `size`, `borderRadius`
- Shared: none
- Current API direction:
  - `text` is closer to `labelText`
  - `variant`, `appearance`, and `borderRadius` do not map directly to the canonical `type`, `priority`, and `pillShape` model
- Storybook impact: medium
- Recommendation: use wrapper mapping only

### Banner

- Backend: `widgetHeader`, `cta`
- Frontend: `children`, `theme`, `showHeader`, `showCta`, `className`
- Shared: `onCtaClick`, `onHeaderCtaClick`
- Current API direction:
  - canonical banner is flatter and token-driven
  - legacy banner expects nested widget configuration
- Storybook impact: high
- Recommendation: do not merge directly into the canonical component API

### Bottom Nav

- Backend: `navItems`
- Frontend: `theme`, `hideOnScroll`, `className`
- Shared: `activeTab`, `onTabChange`
- Current API direction:
  - `navItems` is conceptually close to canonical `items`
  - `activeTab` is closer to `value`
  - `onTabChange` is closer to `onValueChange`
- Storybook impact: medium
- Recommendation: use a migration wrapper that remaps list shape and selected value

### Button

- Backend: `cta`, `loadingText`
- Frontend: `disabled`, `isLoading`, `tabIndex`
- Shared: `onClick`
- Current API direction:
  - `cta` already exists
  - `isLoading` maps closely to `loading`
- Storybook impact: low
- Recommendation: strong adapter candidate with minimal risk

### Button Group

- Backend: `buttons`
- Frontend: `size`, `style`
- Shared: `onClick`
- Current API direction:
  - canonical model expects `primaryAction`, `secondaryAction`, and `contextualAction`
  - legacy model is a generic array
- Storybook impact: high
- Recommendation: document as non-isomorphic; prefer a dedicated migration story

### Checkbox

- Backend: `label`, `required`
- Frontend: `disabled`, `id`, `size`, `className`, `tabIndex`
- Shared: `checked`, `indeterminate`, `onChange`, `onClick`
- Current API direction:
  - canonical checkbox is more primitive
  - labeled use cases may belong in `CheckboxLabel`
- Storybook impact: medium
- Recommendation: prefer composition over expanding the checkbox API

### Divider

- Backend: `text`
- Frontend: `className`
- Shared: none
- Current API direction:
  - canonical divider uses `label`, not `text`
- Storybook impact: low
- Recommendation: safe direct story mapping

### Dropdown

- Backend: `label`, `caption`, `icon`
- Frontend: `showIconBg`, `inverse`, `disabled`, `className`, `id`
- Shared: `selected`, `onClick`
- Current API direction:
  - label maps well
  - other props need reinterpretation against canonical field-style dropdown
- Storybook impact: medium
- Recommendation: wrapper mapping only

### Horizontal Tab

- Backend: `items`
- Frontend: `className`, `showIcon`, `animationDuration`, `ImageLoader`
- Shared: `activeIndex`, `onTabChange`
- Current API direction:
  - legacy item objects are richer than canonical item props
  - active state is index-based in legacy and value-based in canonical
- Storybook impact: medium
- Recommendation: wrapper with item normalization

### Icon Button

- Backend: `icon`
- Frontend: `children`, `theme`, `showBorder`, `disabled`, `ariaLabel`, `type`, `style`, `size`, `iconSize`, `shadow`
- Shared: `onClick`
- Current API direction:
  - several visual concepts differ from canonical `shape`, `styleVariant`, and `onDark`
- Storybook impact: medium
- Recommendation: keep canonical API unchanged and document legacy mapping separately

### Link Button

- Backend: `widgetHeader`
- Frontend: `size`, `tone`, `type`, `disabled`, `trailingIconClass`, `textWrapAllowed`, `underline`, `className`
- Shared: `onLinkClick`
- Current API direction:
  - canonical component is inline text-link oriented
  - legacy nested header payload does not belong directly on this component
- Storybook impact: medium
- Recommendation: wrapper mapping only

### Notification Badge

- Backend: `title`, `leftIcon`
- Frontend: `variant`, `size`
- Shared: none
- Current API direction:
  - canonical component is a compact dot indicator
  - legacy component appears to be a richer badge-like surface
- Storybook impact: high
- Recommendation: treat as concept drift, not a prop rename problem

### OTP Input

- Backend: `configuration`, `widgetHeader`
- Frontend: `className`
- Shared: `onChange`, `onFocus`, `onBlur`, `onComplete`
- Current API direction:
  - canonical API is flatter, with explicit fields like `label`, `helperText`, `length`, and `onValueChange`
- Storybook impact: medium
- Recommendation: use a wrapper that explodes `configuration` into canonical props

### Phone Input

- Backend: `label`, `required`, `error`, `errorText`, `success`, `successText`, `helperText`, `value`, `placeholder`, `maxLength`, `name`, `showCountryCode`
- Frontend: `disabled`, `id`, `autoFocus`
- Shared: `onChange`, `onBlur`, `onFocus`
- Current API direction:
  - several props already align directly
  - validation flags still need translation into canonical tone/state props
- Storybook impact: low
- Recommendation: one of the better migration candidates

### Progress Bar

- Backend: `totalSteps`, `completedSteps`
- Frontend: `className`
- Shared: none
- Current API direction:
  - legacy step counts can be converted to canonical `percentage`
- Storybook impact: low
- Recommendation: safe and simple adapter

### Progress Stepper

- Backend: `steps`, `headerContent`
- Frontend: none
- Shared: `currentIndex`, `onStepClick`
- Current API direction:
  - canonical steps are state-driven rather than active-index plus content header driven
- Storybook impact: medium
- Recommendation: wrapper mapping

### Radio

- Backend: `name`, `value`, `label`, `required`
- Frontend: `disabled`, `id`, `size`, `className`, `tabIndex`
- Shared: `checked`, `onChange`, `onClick`
- Current API direction:
  - canonical radio is more primitive
  - labeled use cases likely belong with `RadioLabel`
- Storybook impact: medium
- Recommendation: prefer composition instead of API growth

### Ratings

- Backend: `widgetHeader`, `configuration`, `ratingInput`, `cta`
- Frontend: `className`
- Shared: `onRatingChange`, `onSubmit`
- Current API direction:
  - canonical ratings component is much flatter and display-oriented
  - legacy API is a widget/workflow model
- Storybook impact: high
- Recommendation: keep separate from canonical ratings API

### Segmented Control

- Backend: `tabs`
- Frontend: `variant`, `size`, `rounded`, `className`
- Shared: `activeTabId`, `onTabChange`
- Current API direction:
  - tabs are conceptually close to canonical `items`
  - selection is closer to `value` and `onValueChange`
- Storybook impact: medium
- Recommendation: wrapper mapping is reasonable

### Social Button

- Backend: `cta`, `loadingText`
- Frontend: `disabled`, `isLoading`, `className`
- Shared: `onClick`
- Current API direction:
  - canonical social button is icon plus label driven
  - legacy CTA object needs flattening
- Storybook impact: medium
- Recommendation: wrapper mapping only

### Switch

- Backend: `label`, `description`
- Frontend: `size`, `disabled`
- Shared: `checked`, `defaultChecked`, `onChecked`
- Current API direction:
  - canonical switch is primitive
  - labeled/description use cases fit better with `SwitchLabel`
- Storybook impact: medium
- Recommendation: prefer composition over API merge

### Text Input

- Backend: `configuration`, `widgetHeader`
- Frontend: none
- Shared: `onChange`, `onFocus`, `onBlur`, `onCtaClick`
- Current API direction:
  - canonical text input is flatter and field-oriented
  - legacy API is widget-oriented and nested
- Storybook impact: high
- Recommendation: do not merge directly into canonical input props

### Tooltip

- Backend: `content`
- Frontend: `children`, `direction`, `alignment`, `theme`, `disabled`, `className`, `triggerClassName`, `showArrow`, `offset`, `zIndex`
- Shared: none
- Current API direction:
  - `content` maps more closely to canonical `label`
  - `direction` and `alignment` can be remapped into canonical `tip`
- Storybook impact: medium
- Recommendation: story-level mapping is acceptable

### Top Tab

- Backend: `tabs`, `searchPlaceholder`, `banner`, `filters`
- Frontend: `backgroundColor`, `tabStyle`, `showSearch`, `showActionIcon`, `className`, `ImageLoader`
- Shared: `onSearchClick`, `onActionIconClick`
- Current API direction:
  - canonical top tab is value-driven and item-based
  - legacy top tab is a broader page-widget contract
- Storybook impact: high
- Recommendation: treat as a migration wrapper problem, not a canonical API merge target

## Strongly Backend-Owned Nested Props

These nested prop groups are most likely to come from product payloads and should be treated as backend-oriented schemas:

- `widgetHeader.*`
- `configuration.*`
- `cta.*`
- `cta.redirection.*`
- `items.redirection.*`
- `navItems.*`
- `tabs.*`
- `tabs.emptyData.*`
- `steps.*`
- `filters.*`
- `ratingInput.*`

## Priority Order If Migration Support Is Needed

### Start first

- Accordion
- Button
- Divider
- Phone Input
- Progress Bar

These components have the clearest migration path with limited Storybook risk.

### Stage carefully

- Badge
- Bottom Nav
- Checkbox
- Dropdown
- Horizontal Tab
- Icon Button
- Link Button
- OTP Input
- Progress Stepper
- Radio
- Segmented Control
- Social Button
- Switch
- Tooltip

These are workable, but should use wrappers or composition rather than direct API expansion.

### Keep separate unless forced by product need

- Banner
- Button Group
- Notification Badge
- Ratings
- Text Input
- Top Tab

These show structural differences between the legacy widget model and the current canonical component model.

## Final Recommendation

Do not merge the legacy JSON contract directly into the canonical `/web` component APIs.

Use this split instead:

1. Canonical components remain the source of truth.
2. Storybook can expose migration wrappers where business need exists.
3. Legacy nested payloads stay documented as backend-facing schemas.
4. Primitive, composable canonical components stay frontend-facing.

This preserves Storybook clarity, lowers regression risk, and avoids permanent design-system API debt.
