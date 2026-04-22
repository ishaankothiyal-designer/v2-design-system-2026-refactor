import {
  type ChangeEvent,
  type CSSProperties,
  type FocusEvent,
  type InputHTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  useId,
  useRef,
  useState
} from "react";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { Icon } from "./icon";
import { HelperText } from "./helper-text";
import { Label } from "./label";
import { getRequiredThemeTokenValue, pxToRem } from "../theme";

export const canonicalRegInputWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.regInput"
);

export type RegInputSize = "Small" | "Large";
export type RegInputPreviewState =
  | "Rest"
  | "Hover"
  | "Active"
  | "Typing"
  | "Filled"
  | "Disabled";
export type RegInputHelperTone = "Default" | "Destructive";
export type RegInputTrailingAction = "Camera" | "Dismiss" | "Search";
export type RegInputActionMode = "capture" | "clear" | "search";

type FieldVisualState = "rest" | "hover" | "active" | "filled" | "destructive" | "disabled";

type RegInputSizeTokens = {
  actionSize: number;
  fieldGap: number;
  fieldHeight: number;
  fieldPaddingBlock: number;
  fieldPaddingInline: number;
  helperGap: number;
  labelFieldGap: number;
  labelPaddingInline: number;
};

type RegInputTypography = {
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
};

type RegInputFieldColors = {
  actionBorder: string;
  actionIcon: string;
  background: string;
  border: string;
  divider: string;
  placeholder: string;
  value: string;
};

function RegInputBadgeGlyph({ color }: { color: string }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="10"
      viewBox="0 0 10 10"
      width="10"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3.3459 3.3459H6.93297V6.93297H3.3459V3.3459Z" fill={color} />
      <path d="M9.99998 5.21496C9.99998 5.36895 9.87515 5.49379 9.72116 5.49379C9.56717 5.49379 9.44233 5.36895 9.44233 5.21496C9.44233 5.06097 9.56717 4.93614 9.72116 4.93614C9.87515 4.93614 9.99998 5.06097 9.99998 5.21496Z" fill={color} />
      <path d="M9.77403 6.50175C9.73418 6.65049 9.58129 6.73876 9.43254 6.69891C9.2838 6.65905 9.19553 6.50616 9.23538 6.35742C9.27524 6.20868 9.42813 6.1204 9.57687 6.16026C9.72562 6.20012 9.81389 6.35301 9.77403 6.50175Z" fill={color} />
      <path d="M9.22263 7.68615C9.14563 7.81951 8.97511 7.8652 8.84175 7.7882C8.70839 7.71121 8.66269 7.54068 8.73969 7.40732C8.81668 7.27396 8.98721 7.22827 9.12057 7.30526C9.25393 7.38226 9.29962 7.55279 9.22263 7.68615Z" fill={color} />
      <path d="M8.38355 8.68754C8.27467 8.79643 8.09812 8.79643 7.98924 8.68754C7.88035 8.57865 7.88035 8.40211 7.98924 8.29322C8.09812 8.18433 8.27467 8.18433 8.38355 8.29322C8.49244 8.40211 8.49244 8.57865 8.38355 8.68754Z" fill={color} />
      <path d="M7.31389 9.4376C7.18053 9.5146 7.01001 9.4689 6.93301 9.33554C6.85602 9.20218 6.90171 9.03166 7.03507 8.95466C7.16843 8.87767 7.33896 8.92336 7.41595 9.05672C7.49295 9.19008 7.44725 9.3606 7.31389 9.4376Z" fill={color} />
      <path d="M6.08648 9.88528C5.93774 9.92513 5.78485 9.83686 5.74499 9.68812C5.70514 9.53938 5.79341 9.38649 5.94215 9.34663C6.0909 9.30678 6.24379 9.39505 6.28364 9.54379C6.3235 9.69253 6.23523 9.84542 6.08648 9.88528Z" fill={color} />
      <path d="M4.78509 9.99998C4.6311 9.99998 4.50626 9.87515 4.50626 9.72116C4.50626 9.56717 4.6311 9.44233 4.78509 9.44233C4.93908 9.44233 5.06391 9.56717 5.06391 9.72116C5.06391 9.87515 4.93908 9.99998 4.78509 9.99998Z" fill={color} />
      <path d="M3.4982 9.774C3.34945 9.73414 3.26118 9.58125 3.30104 9.43251C3.34089 9.28376 3.49378 9.19549 3.64253 9.23535C3.79127 9.27521 3.87954 9.4281 3.83969 9.57684C3.79983 9.72558 3.64694 9.81385 3.4982 9.774Z" fill={color} />
      <path d="M2.31383 9.22263C2.18048 9.14563 2.13478 8.97511 2.21178 8.84175C2.28877 8.70839 2.4593 8.66269 2.59266 8.73969C2.72602 8.81668 2.77171 8.98721 2.69472 9.12057C2.61772 9.25393 2.44719 9.29962 2.31383 9.22263Z" fill={color} />
      <path d="M1.31251 8.38352C1.20362 8.27463 1.20362 8.09809 1.31251 7.9892C1.4214 7.88031 1.59794 7.88031 1.70683 7.9892C1.81572 8.09809 1.81572 8.27463 1.70683 8.38352C1.59794 8.49241 1.4214 8.49241 1.31251 8.38352Z" fill={color} />
      <path d="M0.562382 7.31383C0.485387 7.18047 0.531079 7.00994 0.664439 6.93294C0.797799 6.85595 0.968326 6.90164 1.04532 7.035C1.12232 7.16836 1.07662 7.33889 0.943264 7.41588C0.809904 7.49288 0.639377 7.44719 0.562382 7.31383Z" fill={color} />
      <path d="M0.114703 6.08645C0.0748472 5.93771 0.163118 5.78482 0.311862 5.74496C0.460605 5.7051 0.613495 5.79337 0.653351 5.94212C0.693207 6.09086 0.604936 6.24375 0.456192 6.28361C0.307449 6.32346 0.154559 6.23519 0.114703 6.08645Z" fill={color} />
      <path d="M0 4.78502C0 4.63103 0.124834 4.50619 0.278825 4.50619C0.432816 4.50619 0.55765 4.63103 0.55765 4.78502C0.55765 4.93901 0.432816 5.06384 0.278825 5.06384C0.124834 5.06384 0 4.93901 0 4.78502Z" fill={color} />
      <path d="M0.22595 3.49827C0.265806 3.34952 0.418696 3.26125 0.567439 3.30111C0.716183 3.34096 0.804454 3.49385 0.764598 3.6426C0.724743 3.79134 0.571853 3.87961 0.423109 3.83976C0.274365 3.7999 0.186094 3.64701 0.22595 3.49827Z" fill={color} />
      <path d="M0.777355 2.31383C0.85435 2.18048 1.02488 2.13478 1.15824 2.21178C1.2916 2.28877 1.33729 2.4593 1.26029 2.59266C1.1833 2.72602 1.01277 2.77171 0.879412 2.69472C0.746052 2.61772 0.70036 2.44719 0.777355 2.31383Z" fill={color} />
      <path d="M1.61643 1.31248C1.72532 1.20359 1.90186 1.20359 2.01075 1.31248C2.11963 1.42136 2.11963 1.59791 2.01075 1.70679C1.90186 1.81568 1.72532 1.81568 1.61643 1.70679C1.50754 1.59791 1.50754 1.42136 1.61643 1.31248Z" fill={color} />
      <path d="M2.68622 0.562382C2.81958 0.485387 2.99011 0.531079 3.06711 0.664439C3.1441 0.797799 3.09841 0.968326 2.96505 1.04532C2.83169 1.12232 2.66116 1.07662 2.58417 0.943264C2.50717 0.809904 2.55286 0.639377 2.68622 0.562382Z" fill={color} />
      <path d="M3.9135 0.114737C4.06224 0.0748813 4.21513 0.163152 4.25499 0.311896C4.29484 0.46064 4.20657 0.613529 4.05783 0.653385C3.90909 0.693241 3.7562 0.60497 3.71634 0.456226C3.67648 0.307483 3.76476 0.154593 3.9135 0.114737Z" fill={color} />
      <path d="M5.21503 0C5.36902 0 5.49386 0.124834 5.49386 0.278825C5.49386 0.432816 5.36902 0.55765 5.21503 0.55765C5.06104 0.55765 4.93621 0.432816 4.93621 0.278825C4.93621 0.124834 5.06104 0 5.21503 0Z" fill={color} />
      <path d="M6.50178 0.226018C6.65053 0.265874 6.7388 0.418764 6.69894 0.567508C6.65909 0.716251 6.5062 0.804522 6.35745 0.764666C6.20871 0.724811 6.12044 0.571921 6.16029 0.423177C6.20015 0.274434 6.35304 0.186162 6.50178 0.226018Z" fill={color} />
      <path d="M7.68615 0.777355C7.81951 0.85435 7.8652 1.02488 7.7882 1.15824C7.71121 1.2916 7.54068 1.33729 7.40732 1.26029C7.27396 1.1833 7.22827 1.01277 7.30526 0.879412C7.38226 0.746052 7.55279 0.70036 7.68615 0.777355Z" fill={color} />
      <path d="M8.68747 1.61646C8.79636 1.72535 8.79636 1.90189 8.68747 2.01078C8.57858 2.11967 8.40204 2.11967 8.29315 2.01078C8.18427 1.90189 8.18427 1.72535 8.29315 1.61646C8.40204 1.50757 8.57858 1.50757 8.68747 1.61646Z" fill={color} />
      <path d="M9.4376 2.68616C9.5146 2.81952 9.4689 2.99004 9.33554 3.06704C9.20218 3.14403 9.03166 3.09834 8.95466 2.96498C8.87767 2.83162 8.92336 2.66109 9.05672 2.5841C9.19008 2.5071 9.3606 2.5528 9.4376 2.68616Z" fill={color} />
      <path d="M9.88528 3.91353C9.92513 4.06228 9.83686 4.21517 9.68812 4.25502C9.53938 4.29488 9.38649 4.20661 9.34663 4.05786C9.30678 3.90912 9.39505 3.75623 9.54379 3.71637C9.69253 3.67652 9.84542 3.76479 9.88528 3.91353Z" fill={color} />
    </svg>
  );
}

function RegInputBadgeWordmark({ color }: { color: string }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="8.52"
      viewBox="0 0 19.15 8.52"
      width="19.15"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 8.52V0H1.56V8.52H0Z" fill={color} />
      <path d="M3.29297 8.52V0H5.11697L8.78897 6.408V0H10.349V8.52H8.47697L4.85297 2.292V8.52H3.29297Z" fill={color} />
      <path d="M12.082 8.52V0H14.914C16.274 0 17.318 0.372 18.046 1.116C18.782 1.852 19.15 2.904 19.15 4.272C19.15 5.632 18.79 6.68 18.07 7.416C17.35 8.152 16.322 8.52 14.986 8.52H12.082ZM13.642 7.164H14.914C16.666 7.164 17.542 6.2 17.542 4.272C17.542 2.328 16.666 1.356 14.914 1.356H13.642V7.164Z" fill={color} />
    </svg>
  );
}

function getSizeKey(size: RegInputSize) {
  return size === "Large" ? "lg" : "sm";
}

function getLabelSize(size: RegInputSize) {
  return size === "Large" ? "Large" : "Medium";
}

function getFieldRadius(brand: DisplayBrandId, size: RegInputSize) {
  return Number(getRequiredThemeTokenValue(brand, size === "Large" ? "radius.alt.lg" : "radius.alt.md"));
}

function getSizeTokens(brand: DisplayBrandId, size: RegInputSize): RegInputSizeTokens {
  const sizeKey = getSizeKey(size);

  return {
    actionSize: Number(getRequiredThemeTokenValue(brand, `component.phoneInput.size.${sizeKey}.actionSize`)),
    fieldGap: Number(getRequiredThemeTokenValue(brand, `component.phoneInput.size.${sizeKey}.contentGap`)),
    fieldHeight: Number(getRequiredThemeTokenValue(brand, `component.phoneInput.size.${sizeKey}.height`)),
    fieldPaddingBlock: Number(getRequiredThemeTokenValue(brand, `component.phoneInput.size.${sizeKey}.fieldPaddingBlock`)),
    fieldPaddingInline: Number(
      getRequiredThemeTokenValue(brand, `component.phoneInput.size.${sizeKey}.fieldPaddingInline`)
    ),
    helperGap: Number(getRequiredThemeTokenValue(brand, `component.textInput.size.${sizeKey}.helperGap`)),
    labelFieldGap: Number(getRequiredThemeTokenValue(brand, `component.textInput.size.${sizeKey}.containerGap`)),
    labelPaddingInline: Number(
      getRequiredThemeTokenValue(brand, `component.textInput.size.${sizeKey}.labelPaddingInline`)
    )
  };
}

function getInputTypography(brand: DisplayBrandId): RegInputTypography {
  return {
    fontSize: Number(getRequiredThemeTokenValue(brand, "component.phoneInput.typography.input.fontSize")),
    letterSpacing: Number(getRequiredThemeTokenValue(brand, "component.phoneInput.typography.input.letterSpacing")),
    lineHeight: Number(getRequiredThemeTokenValue(brand, "component.phoneInput.typography.input.lineHeight"))
  };
}

function getBadgeTypography(brand: DisplayBrandId): RegInputTypography {
  return {
    fontSize: Number(getRequiredThemeTokenValue(brand, "component.captionButton.typography.caption.md.fontSize")),
    letterSpacing: Number(getRequiredThemeTokenValue(brand, "component.captionButton.typography.caption.md.letterSpacing")),
    lineHeight: Number(getRequiredThemeTokenValue(brand, "component.captionButton.typography.caption.md.lineHeight"))
  };
}

function getFieldColors(brand: DisplayBrandId, state: FieldVisualState): RegInputFieldColors {
  if (state === "disabled") {
    return {
      actionBorder: String(getRequiredThemeTokenValue(brand, "component.phoneInput.color.field.rest.actionBorder")),
      actionIcon: String(getRequiredThemeTokenValue(brand, "component.phoneInput.color.field.disabled.actionIcon")),
      background: String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.disabled.background")),
      border: String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.disabled.border")),
      divider: String(getRequiredThemeTokenValue(brand, "component.phoneInput.color.field.rest.actionBorder")),
      placeholder: String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.disabled.placeholder")),
      value: String(getRequiredThemeTokenValue(brand, "component.textInput.color.field.disabled.value"))
    };
  }

  const tokenPrefix =
    state === "destructive"
      ? "component.phoneInput.color.field.destructive"
      : state === "filled"
        ? "component.phoneInput.color.field.filled"
        : state === "active"
          ? "component.phoneInput.color.field.active"
          : state === "hover"
            ? "component.phoneInput.color.field.hover"
            : "component.phoneInput.color.field.rest";

  return {
    actionBorder: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.actionBorder`)),
    actionIcon: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.actionIcon`)),
    background: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.background`)),
    border: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.border`)),
    divider: String(getRequiredThemeTokenValue(brand, "component.phoneInput.color.field.rest.actionBorder")),
    placeholder: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.placeholder`)),
    value: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.value`))
  };
}

function resolveVisualState({
  destructive,
  disabled,
  focused,
  forceState,
  hovered,
  hasValue
}: {
  destructive: boolean;
  disabled: boolean;
  focused: boolean;
  forceState: RegInputPreviewState | undefined;
  hovered: boolean;
  hasValue: boolean;
}): FieldVisualState {
  if (forceState === "Disabled") {
    return "disabled";
  }

  if (disabled) {
    return "disabled";
  }

  if (destructive) {
    return "destructive";
  }

  if (forceState === "Hover") {
    return "hover";
  }

  if (forceState === "Active" || forceState === "Typing") {
    return "active";
  }

  if (forceState === "Filled") {
    return "filled";
  }

  if (forceState === "Rest") {
    return "rest";
  }

  if (focused) {
    return "active";
  }

  if (hovered) {
    return "hover";
  }

  if (hasValue) {
    return "filled";
  }

  return "rest";
}

function makeTypographyStyles({
  brand,
  color,
  fontWeightPath,
  typography
}: {
  brand: DisplayBrandId;
  color: string;
  fontWeightPath: string;
  typography: RegInputTypography;
}): CSSProperties {
  return {
    color,
    fontFamily: `${String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"))}, sans-serif`,
    fontSize: pxToRem(typography.fontSize),
    fontWeight: Number(getRequiredThemeTokenValue(brand, fontWeightPath)),
    letterSpacing: pxToRem(typography.letterSpacing),
    lineHeight: pxToRem(typography.lineHeight),
    margin: 0
  };
}

function sanitizeRegistrationCharacters(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function takeMatchingPrefix(value: string, pattern: RegExp, maxLength: number) {
  const matchingPrefix = value.match(pattern)?.[0] ?? "";
  return matchingPrefix.slice(0, maxLength);
}

export function formatRegistrationNumber(value: string) {
  const sanitized = sanitizeRegistrationCharacters(value);

  if (!sanitized) {
    return "";
  }

  let remaining = sanitized;
  const firstLetters = takeMatchingPrefix(remaining, /^[A-Z]*/, 2);
  remaining = remaining.slice(firstLetters.length);
  const firstDigits = takeMatchingPrefix(remaining, /^\d*/, 2);
  remaining = remaining.slice(firstDigits.length);
  const secondLetters = takeMatchingPrefix(remaining, /^[A-Z]*/, 2);
  remaining = remaining.slice(secondLetters.length);
  const trailingDigits = takeMatchingPrefix(remaining, /^\d*/, 4);

  return [firstLetters, firstDigits, secondLetters, trailingDigits].filter(Boolean).join(" ");
}

export interface RegInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "defaultValue" | "size" | "value"> {
  actionAriaLabel?: Partial<Record<RegInputActionMode, string>>;
  badgeLabel?: string;
  brand?: DisplayBrandId;
  defaultValue?: string;
  destructive?: boolean;
  forceState?: RegInputPreviewState;
  helperText?: ReactNode;
  helperTone?: RegInputHelperTone;
  label?: ReactNode;
  onActionClick?: (mode: RegInputActionMode) => void;
  trailingAction?: RegInputTrailingAction;
  showHelperIcon?: boolean;
  showLabelInfoIcon?: boolean;
  size?: RegInputSize;
  value?: string;
}

export function RegInput({
  actionAriaLabel,
  badgeLabel = "IND",
  brand = "Cars24",
  defaultValue,
  destructive = false,
  disabled = false,
  forceState,
  helperText,
  helperTone,
  id,
  label,
  onActionClick,
  onBlur,
  onChange,
  onFocus,
  onMouseEnter,
  onMouseLeave,
  placeholder = "(e.g. AB 12 CD 3456)",
  required = false,
  showHelperIcon = true,
  showLabelInfoIcon = true,
  size = "Small",
  style,
  trailingAction,
  type = "text",
  value,
  ...rest
}: RegInputProps) {
  const generatedId = useId();
  const inputId = id ?? `reg-input-${generatedId}`;
  const helperId = `${inputId}-helper`;
  const sanitizedId = generatedId.replace(/[^a-zA-Z0-9_-]/g, "");
  const placeholderClassName = `geist-reg-input-placeholder-${sanitizedId}`;
  const caretKeyframesName = `geist-reg-input-caret-blink-${sanitizedId}`;
  const previewCaretClassName = `geist-reg-input-caret-${sanitizedId}`;
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(formatRegistrationNumber(defaultValue ?? ""));
  const inputRef = useRef<HTMLInputElement>(null);

  const currentValue = formatRegistrationNumber(value ?? uncontrolledValue);
  const hasValue = currentValue.length > 0;
  const previewMode = forceState !== undefined;
  const visualState = resolveVisualState({
    destructive,
    disabled,
    focused,
    forceState,
    hovered,
    hasValue
  });
  const sizeTokens = getSizeTokens(brand, size);
  const inputTypography = getInputTypography(brand);
  const badgeTypography = getBadgeTypography(brand);
  const fieldColors = getFieldColors(brand, visualState);
  const borderWidth = Number(getRequiredThemeTokenValue(brand, "component.textInput.border.width"));
  const fieldRadius = getFieldRadius(brand, size);
  const actionRadius = Number(getRequiredThemeTokenValue(brand, "radius.pill"));
  const badgeGap = Number(getRequiredThemeTokenValue(brand, "spacing.1"));
  const actionIconSize = Number(getRequiredThemeTokenValue(brand, "component.phoneInput.icon.actionSize"));
  const captureIconSize = Number(getRequiredThemeTokenValue(brand, "component.textInput.icon.affixSize"));
  const caretWidth = Number(getRequiredThemeTokenValue(brand, "component.textInput.caret.width"));
  const caretGap = Number(getRequiredThemeTokenValue(brand, "component.textInput.caret.gap"));
  const badgeBackground = String(getRequiredThemeTokenValue(brand, "color.brand.primary.500"));
  const badgeForeground = String(getRequiredThemeTokenValue(brand, "color.text.inverse"));
  const showLabel = label !== undefined && label !== null;
  const showHelper = helperText !== undefined && helperText !== null;
  const labelSize = getLabelSize(size);
  const showClearAction = previewMode ? forceState === "Typing" || forceState === "Filled" : hasValue;
  const badgeInnerWidth = 21;
  const badgeInnerHeight = 22.52;
  const badgePaddingInlineStart = 10;
  const badgePaddingInlineEnd = Number(getRequiredThemeTokenValue(brand, "spacing.2"));
  const resolvedTrailingAction = trailingAction ?? (showClearAction ? "Dismiss" : "Camera");
  const showDismissAction = resolvedTrailingAction === "Dismiss";
  const showFramedTrailingAction = resolvedTrailingAction !== "Dismiss";
  const previewTextValue =
    forceState === "Active"
      ? ""
      : showDismissAction || forceState === "Typing"
        ? currentValue
        : currentValue || String(placeholder ?? "");
  const previewShowsCaret = forceState === "Active" || forceState === "Typing";
  const ariaInvalid = destructive ? true : undefined;

  const fieldStyles: CSSProperties = {
    alignItems: "center",
    background: fieldColors.background,
    border: `${pxToRem(borderWidth)} solid ${fieldColors.border}`,
    borderRadius: pxToRem(fieldRadius),
    boxSizing: "border-box",
    display: "flex",
    height: pxToRem(sizeTokens.fieldHeight),
    minWidth: 0,
    overflow: "hidden",
    width: "100%"
  };

  const prefixStyles: CSSProperties = {
    alignItems: "center",
    alignSelf: "stretch",
    background: badgeBackground,
    boxSizing: "border-box",
    display: "flex",
    flexShrink: 0,
    justifyContent: "center",
    padding: `0 ${badgePaddingInlineEnd}px 0 ${badgePaddingInlineStart}px`
  };

  const badgeContentStyles: CSSProperties = {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: pxToRem(badgeGap),
    height: pxToRem(badgeInnerHeight),
    justifyContent: "center",
    lineHeight: 0,
    width: pxToRem(badgeInnerWidth)
  };

  const badgeGlyphStyles: CSSProperties = {
    display: "block",
    height: pxToRem(10),
    width: pxToRem(10)
  };

  const badgeWordmarkStyles: CSSProperties = {
    display: "block",
    height: pxToRem(8.52),
    width: pxToRem(19.15)
  };

  const badgeLabelStyles: CSSProperties = {
    ...makeTypographyStyles({
      brand,
      color: badgeForeground,
      fontWeightPath: "typography.fontWeight.medium",
      typography: badgeTypography
    }),
    lineHeight: pxToRem(badgeTypography.lineHeight),
    textTransform: "uppercase"
  };

  const inputTextStyles = makeTypographyStyles({
    brand,
    color: hasValue ? fieldColors.value : fieldColors.placeholder,
    fontWeightPath: "typography.fontWeight.semibold",
    typography: inputTypography
  });

  const actualInputStyles: CSSProperties = {
    ...inputTextStyles,
    appearance: "none",
    background: "transparent",
    border: "none",
    caretColor: fieldColors.border,
    flex: "1 1 auto",
    minWidth: 0,
    outline: "none",
    padding: 0,
    textTransform: "uppercase"
  };

  const contentStyles: CSSProperties = {
    alignItems: "center",
    display: "flex",
    flex: "1 1 auto",
    gap: pxToRem(sizeTokens.fieldGap),
    minWidth: 0,
    padding: `${pxToRem(sizeTokens.fieldPaddingBlock)} ${showDismissAction ? 0 : pxToRem(sizeTokens.fieldPaddingInline)} ${pxToRem(sizeTokens.fieldPaddingBlock)} ${pxToRem(sizeTokens.fieldPaddingInline)}`
  };

  const previewTextStyles: CSSProperties = {
    ...makeTypographyStyles({
      brand,
      color: previewTextValue
        ? showDismissAction
          ? fieldColors.value
          : hasValue
            ? fieldColors.value
            : fieldColors.placeholder
        : fieldColors.value,
      fontWeightPath: "typography.fontWeight.semibold",
      typography: inputTypography
    }),
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  };

  const captureActionStyles: CSSProperties = {
    alignItems: "center",
    alignSelf: "stretch",
    appearance: "none",
    background: "transparent",
    border: "none",
    borderLeft: `${pxToRem(borderWidth)} solid ${fieldColors.divider}`,
    cursor: disabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    flexShrink: 0,
    justifyContent: "center",
    margin: 0,
    padding: `0 ${pxToRem(sizeTokens.fieldPaddingInline)} 0 ${pxToRem(Number(getRequiredThemeTokenValue(brand, "spacing.4")))}`
  };

  const clearActionStyles: CSSProperties = {
    alignItems: "center",
    appearance: "none",
    background: "transparent",
    border: `${pxToRem(borderWidth)} solid ${fieldColors.actionBorder}`,
    borderRadius: pxToRem(actionRadius),
    cursor: disabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    flexShrink: 0,
    height: pxToRem(sizeTokens.actionSize),
    justifyContent: "center",
    margin: `0 ${pxToRem(sizeTokens.fieldPaddingInline)} 0 ${pxToRem(Number(getRequiredThemeTokenValue(brand, "spacing.1")))}`,
    padding: 0,
    width: pxToRem(sizeTokens.actionSize)
  };

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const formattedValue = formatRegistrationNumber(event.currentTarget.value);

    if (event.currentTarget.value !== formattedValue) {
      event.currentTarget.value = formattedValue;
    }

    if (value === undefined) {
      setUncontrolledValue(formattedValue);
    }

    onChange?.(event);
  }

  function handleFocus(event: FocusEvent<HTMLInputElement>) {
    setFocused(true);
    onFocus?.(event);
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    setFocused(false);
    onBlur?.(event);
  }

  function handleMouseEnter(event: ReactMouseEvent<HTMLDivElement>) {
    setHovered(true);
    onMouseEnter?.(event as unknown as ReactMouseEvent<HTMLInputElement>);
  }

  function handleMouseLeave(event: ReactMouseEvent<HTMLDivElement>) {
    setHovered(false);
    onMouseLeave?.(event as unknown as ReactMouseEvent<HTMLInputElement>);
  }

  function handleActionMouseDown(event: ReactMouseEvent<HTMLButtonElement>) {
    event.preventDefault();
  }

  function handleActionClick(mode: RegInputActionMode) {
    if (disabled) {
      return;
    }

    if (onActionClick) {
      onActionClick(mode);
      return;
    }

    if (mode === "capture" || mode === "search") {
      inputRef.current?.focus();
      return;
    }

    if (value === undefined) {
      setUncontrolledValue("");
    } else if (inputRef.current) {
      const valueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      )?.set;

      valueSetter?.call(inputRef.current, "");
      inputRef.current.dispatchEvent(new Event("input", { bubbles: true }));
    }

    inputRef.current?.focus();
  }

  const labelNode = (
    <Label
      brand={brand}
      label={label}
      required={required}
      showInfoIcon={showLabelInfoIcon}
      size={labelSize}
    />
  );

  const trailingActionMode: RegInputActionMode =
    resolvedTrailingAction === "Dismiss"
      ? "clear"
      : resolvedTrailingAction === "Search"
        ? "search"
        : "capture";

  const trailingActionAriaLabel =
    trailingActionMode === "clear"
      ? actionAriaLabel?.clear ?? "Clear registration number"
      : trailingActionMode === "search"
        ? actionAriaLabel?.search ?? "Search registration number"
        : actionAriaLabel?.capture ?? "Capture registration number";

  const trailingActionIconName =
    resolvedTrailingAction === "Dismiss"
      ? "close-line"
      : resolvedTrailingAction === "Search"
        ? "magnifying-glass-outline"
        : "camera-picture-image-outline";

  const trailingActionIconPixelSize =
    resolvedTrailingAction === "Dismiss" ? actionIconSize : captureIconSize;

  return (
    <div
      style={{
        display: "grid",
        gap: pxToRem(sizeTokens.helperGap),
        width: "100%",
        ...style
      }}
    >
      <style>{`
        .${placeholderClassName}::placeholder{color:${fieldColors.placeholder};opacity:1;}
        @keyframes ${caretKeyframesName}{
          0%,49%{opacity:1;}
          50%,100%{opacity:0;}
        }
        .${previewCaretClassName}{
          animation:${caretKeyframesName} 1s steps(1, end) infinite;
        }
      `}</style>

      <div
        style={{
          display: "grid",
          gap: pxToRem(sizeTokens.labelFieldGap)
        }}
      >
        {showLabel ? (
          previewMode ? (
            <div
              style={{
                display: "block",
                paddingInline: pxToRem(sizeTokens.labelPaddingInline)
              }}
            >
              {labelNode}
            </div>
          ) : (
            <label
              htmlFor={inputId}
              style={{
                display: "block",
                paddingInline: pxToRem(sizeTokens.labelPaddingInline)
              }}
            >
              {labelNode}
            </label>
          )
        ) : null}

        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={fieldStyles}>
          <div aria-hidden="true" style={prefixStyles}>
            <span style={badgeContentStyles}>
              {badgeLabel.toUpperCase() === "IND" ? (
                <>
                  <span style={badgeGlyphStyles}>
                    <RegInputBadgeGlyph color={badgeForeground} />
                  </span>
                  <span style={badgeWordmarkStyles}>
                    <RegInputBadgeWordmark color={badgeForeground} />
                  </span>
                </>
              ) : (
                <span style={badgeLabelStyles}>{badgeLabel}</span>
              )}
            </span>
          </div>

          <div style={contentStyles}>
            {previewMode ? (
              <div
                aria-hidden="true"
                style={{
                  alignItems: "center",
                  display: "flex",
                  flex: "1 1 auto",
                  minWidth: 0
                }}
              >
                {previewTextValue ? <span style={previewTextStyles}>{previewTextValue}</span> : null}
                {previewShowsCaret ? (
                  <span
                    className={previewCaretClassName}
                    style={{
                      background: fieldColors.border,
                      display: "inline-block",
                      flexShrink: 0,
                      height: pxToRem(inputTypography.lineHeight - 4),
                      marginLeft: previewTextValue ? pxToRem(caretGap) : 0,
                      width: pxToRem(caretWidth)
                    }}
                  />
                ) : null}
              </div>
            ) : (
              <input
                {...rest}
                aria-describedby={showHelper ? helperId : undefined}
                aria-invalid={ariaInvalid}
                autoCapitalize="characters"
                className={placeholderClassName}
                disabled={disabled}
                id={inputId}
                inputMode="text"
                maxLength={13}
                onBlur={handleBlur}
                onChange={handleChange}
                onFocus={handleFocus}
                placeholder={placeholder}
                ref={inputRef}
                spellCheck={false}
                style={actualInputStyles}
                type={type}
                value={currentValue}
              />
            )}
          </div>

          {showDismissAction ? (
            <button
              aria-label={trailingActionAriaLabel}
              disabled={disabled}
              onClick={() => handleActionClick(trailingActionMode)}
              onMouseDown={handleActionMouseDown}
              style={clearActionStyles}
              type="button"
            >
              <Icon
                decorative
                brand={brand}
                name={trailingActionIconName}
                style={{
                  color: fieldColors.actionIcon,
                  fontSize: pxToRem(trailingActionIconPixelSize)
                }}
              />
            </button>
          ) : showFramedTrailingAction ? (
            <button
              aria-label={trailingActionAriaLabel}
              disabled={disabled}
              onClick={() => handleActionClick(trailingActionMode)}
              onMouseDown={handleActionMouseDown}
              style={captureActionStyles}
              type="button"
            >
              <Icon
                decorative
                brand={brand}
                name={trailingActionIconName}
                style={{
                  color: fieldColors.actionIcon,
                  fontSize: pxToRem(trailingActionIconPixelSize)
                }}
              />
            </button>
          ) : null}
        </div>
      </div>

      {showHelper ? (
        <HelperText
          brand={brand}
          fullWidth
          id={showHelper && !previewMode ? helperId : undefined}
          helperText={helperText}
          showIcon={showHelperIcon}
          size={size}
          style={{ paddingInline: pxToRem(sizeTokens.labelPaddingInline) }}
          tone={(helperTone ?? (destructive ? "Destructive" : "Default")) === "Destructive" ? "Error" : "Default"}
        />
      ) : null}
    </div>
  );
}
