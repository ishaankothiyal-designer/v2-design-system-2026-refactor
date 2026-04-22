import {
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  useEffect,
  useId,
  useInsertionEffect,
  useRef,
  useState
} from "react";
import { normalizeBrandId, type DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { Icon } from "./icon";
import type { IconName } from "@geist/icons";
import { ensureStyleSheet, joinClassNames, runtimeTokenVar, runtimeTokenVarPx, toCssRule } from "./runtime-styles";
import { tokenValueToRem } from "../theme";

export const canonicalAccordionWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.accordion"
);

export type AccordionSize = "sm" | "lg";
export type AccordionInteractionState = "default" | "hover" | "focus" | "active";
export type AccordionSelectionMode = "single" | "multiple";

const ACCORDION_ROOT_CLASS = "geist-accordion";
const ACCORDION_BUTTON_CLASS = "geist-accordion__button";
const ACCORDION_HEADER_ROW_CLASS = "geist-accordion__header-row";
const ACCORDION_LEADING_CLASS = "geist-accordion__leading";
const ACCORDION_TEXT_STACK_CLASS = "geist-accordion__text-stack";
const ACCORDION_TITLE_CLASS = "geist-accordion__title";
const ACCORDION_SUPPORTING_CLASS = "geist-accordion__supporting";
const ACCORDION_BADGE_CLASS = "geist-accordion__badge";
const ACCORDION_CHEVRON_CLASS = "geist-accordion__chevron";
const ACCORDION_PANEL_CLASS = "geist-accordion__panel";
const ACCORDION_PANEL_INNER_CLASS = "geist-accordion__panel-inner";
const ACCORDION_PANEL_INDENT_CLASS = "geist-accordion__panel-indent";
const ACCORDION_BODY_CLASS = "geist-accordion__body";
const ACCORDION_GROUP_CLASS = "geist-accordion-group";
const ACCORDION_STYLESHEET_ID = "geist-accordion-styles";

const ACCORDION_TRANSITION = "180ms cubic-bezier(0.2, 0, 0, 1)";
const ACCORDION_DEFAULT_ICON_NAME = "gift-1-present-outline" satisfies IconName;

function resolveInteractiveState({
  disabled,
  forceState,
  hovered,
  focused,
  pressed
}: {
  disabled: boolean;
  forceState: AccordionInteractionState | undefined;
  hovered: boolean;
  focused: boolean;
  pressed: boolean;
}) {
  if (disabled) {
    return "default";
  }

  if (forceState) {
    return forceState;
  }

  if (pressed) {
    return "active";
  }

  if (focused) {
    return "focus";
  }

  if (hovered) {
    return "hover";
  }

  return "default";
}

const ACCORDION_STYLESHEET = [
  toCssRule(`.${ACCORDION_ROOT_CLASS}`, {
    "align-items": "stretch",
    background: runtimeTokenVar("component.accordion.color.rest.background"),
    border: `${runtimeTokenVarPx("component.accordion.border.width")} solid ${runtimeTokenVar(
      "component.accordion.color.rest.border"
    )}`,
    "border-radius": runtimeTokenVarPx("radius.md"),
    "box-shadow": "none",
    "box-sizing": "border-box",
    display: "flex",
    "flex-direction": "column",
    gap: "0",
    opacity: "1",
    padding: runtimeTokenVarPx("component.accordion.size.sm.padding"),
    transition: `background-color ${ACCORDION_TRANSITION}, box-shadow ${ACCORDION_TRANSITION}, opacity ${ACCORDION_TRANSITION}`,
    width: runtimeTokenVarPx("component.accordion.layout.width")
  }),
  toCssRule(`.${ACCORDION_ROOT_CLASS}[data-size="lg"]`, {
    "border-radius": runtimeTokenVarPx("radius.lg"),
    padding: runtimeTokenVarPx("component.accordion.size.lg.padding")
  }),
  toCssRule(`.${ACCORDION_ROOT_CLASS}[data-disabled="true"]`, {
    opacity: "0.52"
  }),
  toCssRule(`.${ACCORDION_ROOT_CLASS}[data-expanded="true"]`, {
    gap: runtimeTokenVarPx("component.accordion.size.sm.sectionGap")
  }),
  toCssRule(`.${ACCORDION_ROOT_CLASS}[data-size="lg"][data-expanded="true"]`, {
    gap: runtimeTokenVarPx("component.accordion.size.lg.sectionGap")
  }),
  toCssRule(`.${ACCORDION_ROOT_CLASS}[data-state="hover"], .${ACCORDION_ROOT_CLASS}[data-state="active"]`, {
    background: runtimeTokenVar("component.accordion.color.hover.background")
  }),
  toCssRule(`.${ACCORDION_ROOT_CLASS}[data-state="focus"]`, {
    outline: `${runtimeTokenVarPx("component.accordion.focus.outlineWidth")} solid ${runtimeTokenVar(
      "color.border.focus"
    )}`,
    "outline-offset": runtimeTokenVarPx("component.accordion.focus.outlineOffset")
  }),
  toCssRule(`.${ACCORDION_BUTTON_CLASS}`, {
    "align-items": "center",
    background: "transparent",
    border: "0",
    "border-radius": "0",
    cursor: "pointer",
    display: "flex",
    "font": "inherit",
    gap: runtimeTokenVarPx("component.accordion.size.sm.headerGap"),
    padding: "0",
    "text-align": "left",
    width: "100%"
  }),
  toCssRule(`.${ACCORDION_ROOT_CLASS}[data-size="lg"] .${ACCORDION_BUTTON_CLASS}`, {
    gap: runtimeTokenVarPx("component.accordion.size.lg.headerGap")
  }),
  toCssRule(`.${ACCORDION_BUTTON_CLASS}[disabled]`, {
    cursor: "not-allowed"
  }),
  toCssRule(`.${ACCORDION_HEADER_ROW_CLASS}`, {
    "align-items": "center",
    display: "flex",
    flex: "1",
    gap: runtimeTokenVarPx("component.accordion.size.sm.contentGap"),
    "min-width": "0"
  }),
  toCssRule(`.${ACCORDION_ROOT_CLASS}[data-size="lg"] .${ACCORDION_HEADER_ROW_CLASS}`, {
    gap: runtimeTokenVarPx("component.accordion.size.lg.contentGap")
  }),
  toCssRule(`.${ACCORDION_LEADING_CLASS}`, {
    "align-items": "center",
    color: runtimeTokenVar("component.accordion.color.rest.leadingIcon"),
    display: "inline-flex",
    "flex-shrink": "0",
    "font-size": runtimeTokenVarPx("component.accordion.size.sm.iconSize"),
    height: runtimeTokenVarPx("component.accordion.size.sm.iconSize"),
    "justify-content": "center",
    "line-height": "1",
    width: runtimeTokenVarPx("component.accordion.size.sm.iconSize")
  }),
  toCssRule(`.${ACCORDION_ROOT_CLASS}[data-size="lg"] .${ACCORDION_LEADING_CLASS}`, {
    "font-size": runtimeTokenVarPx("component.accordion.size.lg.iconSize"),
    height: runtimeTokenVarPx("component.accordion.size.lg.iconSize"),
    width: runtimeTokenVarPx("component.accordion.size.lg.iconSize")
  }),
  toCssRule(`.${ACCORDION_TEXT_STACK_CLASS}`, {
    display: "flex",
    "flex": "1",
    "flex-direction": "column",
    gap: runtimeTokenVarPx("component.accordion.size.sm.titleGap"),
    "min-width": "0"
  }),
  toCssRule(`.${ACCORDION_ROOT_CLASS}[data-size="lg"] .${ACCORDION_TEXT_STACK_CLASS}`, {
    gap: runtimeTokenVarPx("component.accordion.size.lg.titleGap")
  }),
  toCssRule(`.${ACCORDION_TITLE_CLASS}`, {
    color: runtimeTokenVar("component.accordion.color.rest.title"),
    "font-family": `${runtimeTokenVar("typography.fontFamily.sans")}, sans-serif`,
    "font-size": runtimeTokenVarPx("component.accordion.typography.title.sm.fontSize"),
    "font-weight": runtimeTokenVar("typography.fontWeight.semibold"),
    "letter-spacing": runtimeTokenVarPx("component.accordion.typography.title.sm.letterSpacing"),
    "line-height": runtimeTokenVarPx("component.accordion.typography.title.sm.lineHeight"),
    margin: "0"
  }),
  toCssRule(`.${ACCORDION_ROOT_CLASS}[data-size="lg"] .${ACCORDION_TITLE_CLASS}`, {
    "font-size": runtimeTokenVarPx("component.accordion.typography.title.lg.fontSize"),
    "letter-spacing": runtimeTokenVarPx("component.accordion.typography.title.lg.letterSpacing"),
    "line-height": runtimeTokenVarPx("component.accordion.typography.title.lg.lineHeight")
  }),
  toCssRule(`.${ACCORDION_SUPPORTING_CLASS}`, {
    color: runtimeTokenVar("component.accordion.color.rest.supporting"),
    "font-family": `${runtimeTokenVar("typography.fontFamily.sans")}, sans-serif`,
    "font-size": runtimeTokenVarPx("component.accordion.typography.supporting.fontSize"),
    "font-weight": runtimeTokenVar("typography.fontWeight.regular"),
    "letter-spacing": runtimeTokenVarPx("component.accordion.typography.supporting.letterSpacing"),
    "line-height": runtimeTokenVarPx("component.accordion.typography.supporting.lineHeight"),
    margin: "0"
  }),
  toCssRule(`.${ACCORDION_BADGE_CLASS}`, {
    "flex-shrink": "0"
  }),
  toCssRule(`.${ACCORDION_CHEVRON_CLASS}`, {
    "align-items": "center",
    color: runtimeTokenVar("component.accordion.color.rest.chevron"),
    display: "inline-flex",
    "flex-shrink": "0",
    "font-size": runtimeTokenVarPx("component.accordion.size.sm.iconSize"),
    height: runtimeTokenVarPx("component.accordion.size.sm.iconSize"),
    "justify-content": "center",
    "line-height": "1",
    transition: `color ${ACCORDION_TRANSITION}`,
    width: runtimeTokenVarPx("component.accordion.size.sm.iconSize")
  }),
  toCssRule(`.${ACCORDION_ROOT_CLASS}[data-size="lg"] .${ACCORDION_CHEVRON_CLASS}`, {
    "font-size": runtimeTokenVarPx("component.accordion.size.lg.iconSize"),
    height: runtimeTokenVarPx("component.accordion.size.lg.iconSize"),
    width: runtimeTokenVarPx("component.accordion.size.lg.iconSize")
  }),
  toCssRule(`.${ACCORDION_PANEL_CLASS}`, {
    opacity: "0",
    overflow: "hidden",
    "pointer-events": "none",
    transition: `max-height ${ACCORDION_TRANSITION}, opacity ${ACCORDION_TRANSITION}`,
    width: "100%"
  }),
  toCssRule(`.${ACCORDION_ROOT_CLASS}[data-expanded="true"] .${ACCORDION_PANEL_CLASS}`, {
    opacity: "1",
    "pointer-events": "auto"
  }),
  toCssRule(`.${ACCORDION_PANEL_INNER_CLASS}`, {
    "align-items": "flex-start",
    display: "flex",
    gap: runtimeTokenVarPx("component.accordion.size.sm.contentGap"),
    width: "100%"
  }),
  toCssRule(`.${ACCORDION_ROOT_CLASS}[data-size="lg"] .${ACCORDION_PANEL_INNER_CLASS}`, {
    gap: runtimeTokenVarPx("component.accordion.size.lg.contentGap")
  }),
  toCssRule(`.${ACCORDION_PANEL_INDENT_CLASS}`, {
    "flex-shrink": "0",
    width: runtimeTokenVarPx("component.accordion.size.sm.indent")
  }),
  toCssRule(`.${ACCORDION_ROOT_CLASS}[data-size="lg"] .${ACCORDION_PANEL_INDENT_CLASS}`, {
    width: runtimeTokenVarPx("component.accordion.size.lg.indent")
  }),
  toCssRule(`.${ACCORDION_ROOT_CLASS}[data-has-supporting="true"] .${ACCORDION_BUTTON_CLASS}`, {
    "align-items": "flex-start"
  }),
  toCssRule(`.${ACCORDION_ROOT_CLASS}[data-has-supporting="true"] .${ACCORDION_HEADER_ROW_CLASS}`, {
    "align-items": "flex-start"
  }),
  toCssRule(`.${ACCORDION_BODY_CLASS}`, {
    color: runtimeTokenVar("component.accordion.color.rest.body"),
    display: "flex",
    "flex": "1",
    "flex-direction": "column",
    gap: runtimeTokenVarPx("component.accordion.size.sm.bodyGap"),
    "min-width": "0"
  }),
  toCssRule(`.${ACCORDION_ROOT_CLASS}[data-size="lg"] .${ACCORDION_BODY_CLASS}`, {
    gap: runtimeTokenVarPx("component.accordion.size.lg.bodyGap")
  }),
  toCssRule(`.${ACCORDION_BODY_CLASS} > p`, {
    color: "inherit",
    "font-family": `${runtimeTokenVar("typography.fontFamily.sans")}, sans-serif`,
    "font-size": runtimeTokenVarPx("component.accordion.typography.body.fontSize"),
    "font-weight": runtimeTokenVar("typography.fontWeight.regular"),
    "letter-spacing": runtimeTokenVarPx("component.accordion.typography.body.letterSpacing"),
    "line-height": runtimeTokenVarPx("component.accordion.typography.body.lineHeight"),
    margin: "0"
  }),
  toCssRule(`.${ACCORDION_GROUP_CLASS}`, {
    display: "grid",
    width: "100%"
  })
].join("");

export interface AccordionProps {
  brand?: DisplayBrandId;
  title: string;
  supportingText?: string;
  content?: ReactNode;
  children?: ReactNode;
  size?: AccordionSize;
  disabled?: boolean;
  defaultExpanded?: boolean;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  leadingIcon?: ReactNode | false;
  badge?: ReactNode;
  forceState?: AccordionInteractionState;
  className?: string;
  style?: CSSProperties;
}

function resolveAccordionLeadingIcon(brand: DisplayBrandId, leadingIcon: ReactNode | false): ReactNode | null {
  if (leadingIcon === false) {
    return null;
  }

  if (leadingIcon) {
    return leadingIcon;
  }

  return (
    <Icon
      brand={brand}
      decorative
      name={ACCORDION_DEFAULT_ICON_NAME}
      style={{ color: "inherit", fontSize: "inherit" }}
    />
  );
}

function resolveAccordionChevron(brand: DisplayBrandId, expanded: boolean): ReactElement {
  return (
    <Icon
      brand={brand}
      className={ACCORDION_CHEVRON_CLASS}
      decorative
      name={expanded ? "chevron-large-top-outline" : "chevron-down-large-outline"}
      style={{ color: "inherit", fontSize: "inherit" }}
    />
  );
}

export interface AccordionGroupItem
  extends Omit<AccordionProps, "brand" | "expanded" | "defaultExpanded" | "onExpandedChange"> {
  id: string;
}

export interface AccordionGroupProps {
  brand?: DisplayBrandId;
  items: AccordionGroupItem[];
  selectionMode?: AccordionSelectionMode;
  defaultExpandedIds?: string[];
  expandedIds?: string[];
  onExpandedIdsChange?: (expandedIds: string[]) => void;
  gap?: number;
  className?: string;
  style?: CSSProperties;
}

export function Accordion({
  brand = "Cars24",
  title,
  supportingText,
  content,
  children,
  size = "sm",
  disabled = false,
  defaultExpanded = false,
  expanded,
  onExpandedChange,
  leadingIcon,
  badge,
  forceState,
  className,
  style
}: AccordionProps) {
  const [uncontrolledExpanded, setUncontrolledExpanded] = useState(defaultExpanded);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pressed, setPressed] = useState(false);
  const panelId = useId();
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  const isExpanded = expanded ?? uncontrolledExpanded;
  const activeState = resolveInteractiveState({
    disabled,
    forceState,
    hovered,
    focused,
    pressed
  });
  const resolvedContent = children ?? content;
  const repoBrand = normalizeBrandId(brand);
  const resolvedLeadingIcon = resolveAccordionLeadingIcon(brand, leadingIcon);
  const usesLeadingIcon = resolvedLeadingIcon !== null;

  useInsertionEffect(() => {
    ensureStyleSheet(ACCORDION_STYLESHEET_ID, ACCORDION_STYLESHEET);
  }, []);

  useEffect(() => {
    const node = contentRef.current;

    if (!node) {
      return;
    }

    const measure = () => {
      setContentHeight(node.scrollHeight);
    };

    measure();

    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(measure);
    observer.observe(node);

    return () => observer.disconnect();
  }, [resolvedContent, supportingText, size, badge, usesLeadingIcon]);

  const toggle = () => {
    if (disabled) {
      return;
    }

    const nextExpanded = !isExpanded;
    if (expanded === undefined) {
      setUncontrolledExpanded(nextExpanded);
    }
    onExpandedChange?.(nextExpanded);
  };

  return (
    <div
      className={joinClassNames(ACCORDION_ROOT_CLASS, className)}
      data-brand={repoBrand}
      data-disabled={String(disabled)}
      data-expanded={String(isExpanded)}
      data-has-supporting={String(Boolean(supportingText))}
      data-size={size}
      data-state={activeState}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      style={{ ...style, width: "328px" }}
    >
      <button
        aria-controls={panelId}
        aria-expanded={isExpanded}
        className={ACCORDION_BUTTON_CLASS}
        disabled={disabled}
        onBlur={() => {
          setFocused(false);
          setPressed(false);
        }}
        onClick={toggle}
        onFocus={() => setFocused(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            setPressed(true);
          }
        }}
        onKeyUp={() => setPressed(false)}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        type="button"
      >
        <div className={ACCORDION_HEADER_ROW_CLASS}>
          {usesLeadingIcon ? (
            <span className={ACCORDION_LEADING_CLASS}>{resolvedLeadingIcon}</span>
          ) : null}
          <div className={ACCORDION_TEXT_STACK_CLASS}>
            <span className={ACCORDION_TITLE_CLASS}>{title}</span>
            {supportingText ? <span className={ACCORDION_SUPPORTING_CLASS}>{supportingText}</span> : null}
          </div>
        </div>
        {badge ? <div className={ACCORDION_BADGE_CLASS}>{badge}</div> : null}
        {resolveAccordionChevron(brand, isExpanded)}
      </button>

      <div
        className={ACCORDION_PANEL_CLASS}
        id={panelId}
        style={{ maxHeight: isExpanded ? contentHeight : 0 } satisfies CSSProperties}
      >
        <div className={ACCORDION_PANEL_INNER_CLASS} ref={contentRef}>
          {usesLeadingIcon ? <div aria-hidden="true" className={ACCORDION_PANEL_INDENT_CLASS} /> : null}
          <div className={ACCORDION_BODY_CLASS}>
            {resolvedContent
              ? typeof resolvedContent === "string"
                ? <p>{resolvedContent}</p>
                : resolvedContent
              : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AccordionGroup({
  brand = "Cars24",
  items,
  selectionMode = "single",
  defaultExpandedIds = [],
  expandedIds,
  onExpandedIdsChange,
  gap = 16,
  className,
  style
}: AccordionGroupProps) {
  const [uncontrolledExpandedIds, setUncontrolledExpandedIds] = useState(defaultExpandedIds);
  const activeExpandedIds = expandedIds ?? uncontrolledExpandedIds;

  useInsertionEffect(() => {
    ensureStyleSheet(ACCORDION_STYLESHEET_ID, ACCORDION_STYLESHEET);
  }, []);

  const setExpandedIds = (nextExpandedIds: string[]) => {
    if (expandedIds === undefined) {
      setUncontrolledExpandedIds(nextExpandedIds);
    }
    onExpandedIdsChange?.(nextExpandedIds);
  };

  const toggleItem = (id: string, nextExpanded: boolean) => {
    if (selectionMode === "multiple") {
      const nextIds = nextExpanded
        ? Array.from(new Set([...activeExpandedIds, id]))
        : activeExpandedIds.filter((value) => value !== id);

      setExpandedIds(nextIds);
      return;
    }

    setExpandedIds(nextExpanded ? [id] : []);
  };

  return (
    <div
      className={joinClassNames(ACCORDION_GROUP_CLASS, className)}
      style={{ gap: tokenValueToRem(gap), ...style }}
    >
      {items.map((item) => (
        <Accordion
          key={item.id}
          brand={brand}
          {...item}
          expanded={activeExpandedIds.includes(item.id)}
          onExpandedChange={(nextExpanded) => toggleItem(item.id, nextExpanded)}
        />
      ))}
    </div>
  );
}
