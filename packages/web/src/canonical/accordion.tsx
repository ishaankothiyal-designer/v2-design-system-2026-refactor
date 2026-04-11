import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState
} from "react";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { Icon } from "./icon";
import { getRequiredThemeTokenValue } from "../theme";

export const canonicalAccordionWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.accordion"
);

export type AccordionSize = "sm" | "lg";
export type AccordionInteractionState = "default" | "hover" | "focus" | "active";
export type AccordionSelectionMode = "single" | "multiple";

const FIGMA_ACCORDION_TOKENS = {
  background: "#FFFFFF",
  backgroundHover: "#F1F5F9",
  border: "#E2E8F0",
  textPrimary: "#020617",
  textSecondary: "#64748B",
  transition: {
    duration: 180,
    timing: "cubic-bezier(0.2, 0, 0, 1)"
  }
} as const;

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((segment) => `${segment}${segment}`)
          .join("")
      : normalized;
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function getAccordionToken(slot: string) {
  return canonicalAccordionWebContract?.tokenBindings.find((binding) => binding.slot === slot)?.token;
}

function withTokenFallback(token: string | undefined, fallback: string) {
  if (!token) {
    return fallback;
  }

  if (token.startsWith("var(") && !token.includes(",")) {
    return token.replace(/\)$/, `, ${fallback})`);
  }

  return token;
}

function getAccordionMetrics(brand: DisplayBrandId, size: AccordionSize) {
  return {
    background: withTokenFallback(
      getAccordionToken("container.background.rest"),
      FIGMA_ACCORDION_TOKENS.background
    ),
    backgroundHover: withTokenFallback(
      getAccordionToken("container.background.hover"),
      FIGMA_ACCORDION_TOKENS.backgroundHover
    ),
    border: withTokenFallback(getAccordionToken("container.border"), FIGMA_ACCORDION_TOKENS.border),
    textPrimary: withTokenFallback(
      getAccordionToken("content.title.color"),
      FIGMA_ACCORDION_TOKENS.textPrimary
    ),
    supportingColor: withTokenFallback(
      getAccordionToken("content.supporting.color"),
      FIGMA_ACCORDION_TOKENS.textSecondary
    ),
    bodyColor: withTokenFallback(
      getAccordionToken("content.body.color"),
      FIGMA_ACCORDION_TOKENS.textSecondary
    ),
    titleGap: withTokenFallback(getAccordionToken("spacing.titleGap"), "2px"),
    contentGap: withTokenFallback(getAccordionToken("spacing.contentGap"), "6px"),
    sectionGap: withTokenFallback(getAccordionToken("spacing.sectionGap"), "8px"),
    headerGap: withTokenFallback(getAccordionToken("spacing.headerGap"), "12px"),
    padding: withTokenFallback(getAccordionToken("spacing.padding"), "16px"),
    contentStackGap: "10px",
    contentIndent: "20px",
    radius: `${Number(getRequiredThemeTokenValue(brand, size === "lg" ? "radius.lg" : "radius.md"))}px`,
    iconSize:
      size === "lg"
        ? withTokenFallback(getAccordionToken("icon.size.lg"), "20px")
        : withTokenFallback(getAccordionToken("icon.size.sm"), "18px"),
    titleFontSize: size === "lg" ? "16px" : "14px",
    titleLineHeight: size === "lg" ? "20px" : "18px",
    supportingFontSize: "14px",
    supportingLineHeight: "18px",
    bodyFontSize: "14px",
    bodyLineHeight: "20px"
  };
}

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
  const metrics = getAccordionMetrics(brand, size);
  const fontFamily = String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"));
  const semibold = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.semibold"));
  const regular = Number(getRequiredThemeTokenValue(brand, "typography.fontWeight.regular"));
  const focusColor = String(getRequiredThemeTokenValue(brand, "color.border.focus"));
  const transition = `${FIGMA_ACCORDION_TOKENS.transition.duration}ms ${FIGMA_ACCORDION_TOKENS.transition.timing}`;
  const resolvedContent = children ?? content;
  const usesLeadingIcon = leadingIcon !== false;

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

  const rootStyles: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    width: 328,
    boxSizing: "border-box",
    alignItems: "center",
    gap: isExpanded ? metrics.sectionGap : 0,
    border: `1px solid ${metrics.border}`,
    borderRadius: metrics.radius,
    background:
      activeState === "hover" || activeState === "active"
        ? metrics.backgroundHover
        : metrics.background,
    boxShadow:
      activeState === "focus" ? `0 0 0 3px ${hexToRgba(focusColor, 0.28)}` : "none",
    opacity: disabled ? 0.52 : 1,
    padding: metrics.padding,
    transition: `background-color ${transition}, box-shadow ${transition}, opacity ${transition}`,
    ...style
  };

  const headerButtonStyles: CSSProperties = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: metrics.headerGap,
    padding: 0,
    border: 0,
    background: "transparent",
    borderRadius: 0,
    cursor: disabled ? "not-allowed" : "pointer",
    font: "inherit",
    textAlign: "left"
  };

  const leadingIconStyles: CSSProperties = {
    flexShrink: 0,
    color: withTokenFallback(getAccordionToken("icon.color.primary"), FIGMA_ACCORDION_TOKENS.textPrimary),
    fontSize: metrics.iconSize,
    lineHeight: 1,
    width: metrics.iconSize,
    height: metrics.iconSize,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center"
  };

  const chevronStyles: CSSProperties = {
    flexShrink: 0,
    color: withTokenFallback(getAccordionToken("icon.color.secondary"), FIGMA_ACCORDION_TOKENS.textSecondary),
    fontSize: metrics.iconSize,
    lineHeight: 1,
    width: metrics.iconSize,
    height: metrics.iconSize,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
    transformOrigin: "center",
    transition: `transform ${transition}, color ${transition}`
  };

  return (
    <div
      className={className}
      style={rootStyles}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
    >
      <button
        type="button"
        aria-controls={panelId}
        aria-expanded={isExpanded}
        disabled={disabled}
        style={headerButtonStyles}
        onClick={toggle}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          setPressed(false);
        }}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            setPressed(true);
          }
        }}
        onKeyUp={() => setPressed(false)}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: metrics.contentGap, flex: 1, minWidth: 0 }}>
          {usesLeadingIcon ? (
            leadingIcon ?? (
              <Icon
                brand={brand}
                name="calendar-line"
                decorative
                style={leadingIconStyles}
              />
            )
          ) : null}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: metrics.titleGap,
              flex: 1,
              minWidth: 0
            }}
          >
            <span
              style={{
                margin: 0,
                color: metrics.textPrimary,
                fontFamily: `${fontFamily}, sans-serif`,
                fontSize: metrics.titleFontSize,
                lineHeight: metrics.titleLineHeight,
                fontWeight: semibold
              }}
            >
              {title}
            </span>
            {supportingText ? (
              <span
                style={{
                  margin: 0,
                  color: metrics.supportingColor,
                  fontFamily: `${fontFamily}, sans-serif`,
                  fontSize: metrics.supportingFontSize,
                  lineHeight: metrics.supportingLineHeight,
                  fontWeight: regular
                }}
              >
                {supportingText}
              </span>
            ) : null}
          </div>
        </div>
        {badge ? <div style={{ flexShrink: 0 }}>{badge}</div> : null}
        <Icon
          brand={brand}
          name="chevron-down-large-outline"
          decorative
          style={chevronStyles}
        />
      </button>

      <div
        id={panelId}
        style={{
          maxHeight: isExpanded ? contentHeight : 0,
          opacity: isExpanded ? 1 : 0,
          overflow: "hidden",
          transition: `max-height ${transition}, opacity ${transition}`,
          pointerEvents: isExpanded ? "auto" : "none"
        }}
      >
        <div
          ref={contentRef}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: metrics.contentGap
          }}
        >
          {usesLeadingIcon ? (
            <div aria-hidden="true" style={{ width: metrics.contentIndent, flexShrink: 0 }} />
          ) : null}
          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              gap: metrics.contentStackGap
            }}
          >
            {resolvedContent ? (
              typeof resolvedContent === "string" ? (
                <p
                  style={{
                    margin: 0,
                    color: metrics.bodyColor,
                    fontFamily: `${fontFamily}, sans-serif`,
                    fontSize: metrics.bodyFontSize,
                    lineHeight: metrics.bodyLineHeight,
                    fontWeight: regular
                  }}
                >
                  {resolvedContent}
                </p>
              ) : (
                resolvedContent
              )
            ) : null}
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
      className={className}
      style={{
        display: "grid",
        gap,
        width: "100%",
        ...style
      }}
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
