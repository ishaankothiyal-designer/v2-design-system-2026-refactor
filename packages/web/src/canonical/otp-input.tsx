import {
  type ChangeEvent,
  type ClipboardEvent,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState
} from "react";
import type { IconName } from "@geist/icons";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { Icon } from "./icon";
import { HelperText } from "./helper-text";
import { Label } from "./label";
import { LinkButton } from "./link-button";
import { getRequiredThemeTokenValue } from "../theme";

export const canonicalOtpInputWebContract = designSystemRegistry.components.find(
  (component) => component.canonicalId === "component.otpInput"
);

export type OtpInputSize = "Small" | "Large";
export type OtpInputValidationState = "Default" | "Error" | "Success";
export type OtpInputHelperTone = "Default" | "Error" | "Success";
export type OtpInputPreviewState =
  | "Rest"
  | "Hover"
  | "Active"
  | "Typed"
  | "Error"
  | "Success"
  | "Disabled";

type BoxVisualState = "rest" | "hover" | "active" | "typed" | "error" | "success" | "disabled";

type OtpInputSizeTokens = {
  boxGap: number;
  boxSize: number;
  containerGap: number;
  helperGap: number;
  labelPaddingInline: number;
  supportingPaddingInline: number;
};

type OtpInputTypography = {
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
};

type OtpInputFieldColors = {
  background: string;
  border: string;
  placeholder: string;
  value: string;
};

type OtpInputHelperColors = {
  icon: string;
  text: string;
};

function getSizeKey(size: OtpInputSize) {
  return size === "Large" ? "lg" : "sm";
}

function getLabelSize(size: OtpInputSize) {
  return size === "Large" ? "Large" : "Medium";
}

function getFieldRadius(brand: DisplayBrandId, size: OtpInputSize) {
  return Number(getRequiredThemeTokenValue(brand, size === "Large" ? "radius.alt.lg" : "radius.alt.md"));
}

function getSizeTokens(brand: DisplayBrandId, size: OtpInputSize): OtpInputSizeTokens {
  const tokenPrefix = `component.otpInput.size.${getSizeKey(size)}`;

  return {
    boxGap: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.boxGap`)),
    boxSize: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.boxSize`)),
    containerGap: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.containerGap`)),
    helperGap: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.helperGap`)),
    labelPaddingInline: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.labelPaddingInline`)),
    supportingPaddingInline: Number(getRequiredThemeTokenValue(brand, `${tokenPrefix}.supportingPaddingInline`))
  };
}

function getTypography(brand: DisplayBrandId, path: string): OtpInputTypography {
  return {
    fontSize: Number(getRequiredThemeTokenValue(brand, `${path}.fontSize`)),
    letterSpacing: Number(getRequiredThemeTokenValue(brand, `${path}.letterSpacing`)),
    lineHeight: Number(getRequiredThemeTokenValue(brand, `${path}.lineHeight`))
  };
}

function getFieldColors(brand: DisplayBrandId, state: BoxVisualState): OtpInputFieldColors {
  const tokenPrefix = `component.textInput.color.field.${state}`;

  return {
    background: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.background`)),
    border: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.border`)),
    placeholder: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.placeholder`)),
    value: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.value`))
  };
}

function getHelperColors(brand: DisplayBrandId, tone: OtpInputHelperTone): OtpInputHelperColors {
  const toneKey = tone === "Error" ? "error" : tone === "Success" ? "success" : "default";
  const tokenPrefix = `component.textInput.color.helper.${toneKey}`;

  return {
    icon: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.icon`)),
    text: String(getRequiredThemeTokenValue(brand, `${tokenPrefix}.text`))
  };
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
  typography: OtpInputTypography;
}): CSSProperties {
  return {
    color,
    fontFamily: `${String(getRequiredThemeTokenValue(brand, "typography.fontFamily.sans"))}, sans-serif`,
    fontSize: `${typography.fontSize}px`,
    fontWeight: Number(getRequiredThemeTokenValue(brand, fontWeightPath)),
    letterSpacing: `${typography.letterSpacing}px`,
    lineHeight: `${typography.lineHeight}px`,
    margin: 0
  };
}

function sanitizeOtpValue(value: string) {
  return value.replace(/\D+/g, "");
}

function createCharacterArray(value: string | undefined, length: number) {
  const sanitizedValue = sanitizeOtpValue(value ?? "").slice(0, length);
  const characters = sanitizedValue.split("");

  return Array.from({ length }, (_, index) => characters[index] ?? "");
}

function compactCharacters(characters: string[]) {
  return characters.join("");
}

function replaceCharacters(previous: string[], index: number, insertedValue: string, length: number) {
  const insertedCharacters = sanitizeOtpValue(insertedValue)
    .slice(0, Math.max(length - index, 0))
    .split("");
  const next = [...previous];

  next.splice(index, insertedCharacters.length, ...insertedCharacters);

  return next.slice(0, length);
}

function removeCharacter(previous: string[], index: number) {
  return [...previous.slice(0, index), ...previous.slice(index + 1), ""].slice(0, previous.length);
}

function resolveBoxState({
  forceState,
  disabled,
  focusedIndex,
  hovered,
  index,
  validationState,
  value
}: {
  forceState: OtpInputPreviewState | undefined;
  disabled: boolean;
  focusedIndex: number | null;
  hovered: boolean;
  index: number;
  validationState: OtpInputValidationState;
  value: string;
}): BoxVisualState {
  if (forceState === "Disabled") {
    return "disabled";
  }

  if (forceState === "Error") {
    return "error";
  }

  if (forceState === "Success") {
    return "success";
  }

  if (forceState === "Hover") {
    return "hover";
  }

  if (forceState === "Active") {
    return focusedIndex === index ? "active" : value.length > 0 ? "typed" : "rest";
  }

  if (forceState === "Typed") {
    return value.length > 0 ? "typed" : "rest";
  }

  if (forceState === "Rest") {
    return "rest";
  }

  if (disabled) {
    return "disabled";
  }

  if (validationState === "Error") {
    return "error";
  }

  if (validationState === "Success") {
    return "success";
  }

  if (focusedIndex === index) {
    return "active";
  }

  if (value.length > 0) {
    return "typed";
  }

  if (hovered) {
    return "hover";
  }

  return "rest";
}

export interface OtpInputProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onChange"> {
  autoComplete?: string;
  autoFocus?: boolean;
  brand?: DisplayBrandId;
  defaultValue?: string;
  disabled?: boolean;
  forceState?: OtpInputPreviewState;
  getInputAriaLabel?: (index: number, length: number) => string;
  helperText?: ReactNode;
  helperTone?: OtpInputHelperTone;
  inputMode?: "numeric" | "text" | "decimal" | "tel" | "search" | "email" | "url";
  label?: ReactNode;
  length?: number;
  name?: string;
  onComplete?: (value: string) => void;
  onResendActionClick?: () => void;
  onValueChange?: (value: string) => void;
  placeholderCharacter?: string;
  required?: boolean;
  resendActionIconName?: IconName;
  resendActionLabel?: ReactNode;
  resendPrompt?: ReactNode;
  showHelperIcon?: boolean;
  showLabelInfoIcon?: boolean;
  size?: OtpInputSize;
  timerPrompt?: ReactNode;
  timerValue?: ReactNode;
  validationState?: OtpInputValidationState;
  value?: string;
}

export function OtpInput({
  autoComplete = "one-time-code",
  autoFocus = false,
  brand = "Cars24",
  defaultValue,
  disabled = false,
  forceState,
  getInputAriaLabel,
  helperText,
  helperTone,
  id,
  inputMode = "numeric",
  label,
  length = 6,
  name,
  onComplete,
  onResendActionClick,
  onValueChange,
  placeholderCharacter = "-",
  required = false,
  resendActionIconName = "arrow-rotate-left-right-outline",
  resendActionLabel,
  resendPrompt,
  showHelperIcon = true,
  showLabelInfoIcon = true,
  size = "Small",
  style,
  timerPrompt,
  timerValue,
  validationState = "Default",
  value,
  ...rest
}: OtpInputProps) {
  const generatedId = useId();
  const rootId = id ?? `otp-input-${generatedId}`;
  const labelId = `${rootId}-label`;
  const supportId = `${rootId}-support`;
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const autoFocusAppliedRef = useRef(false);
  const [hovered, setHovered] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [characters, setCharacters] = useState(() => createCharacterArray(value ?? defaultValue, length));

  useEffect(() => {
    if (value === undefined) {
      return;
    }

    setCharacters(createCharacterArray(value, length));
  }, [length, value]);

  useEffect(() => {
    if (!autoFocus || disabled || autoFocusAppliedRef.current) {
      return;
    }

    const firstOpenIndex = Math.min(compactCharacters(characters).length, Math.max(length - 1, 0));
    inputRefs.current[firstOpenIndex]?.focus();
    autoFocusAppliedRef.current = true;
  }, [autoFocus, characters, disabled, length]);

  const sizeKey = getSizeKey(size);
  const sizeTokens = getSizeTokens(brand, size);
  const codeTypography = getTypography(brand, `component.otpInput.typography.code.${sizeKey}`);
  const helperTypography = getTypography(brand, `component.otpInput.typography.helper.${sizeKey}`);
  const codeFontWeightPath = size === "Large" ? "typography.fontWeight.semibold" : "typography.fontWeight.medium";
  const borderWidth = Number(getRequiredThemeTokenValue(brand, "component.otpInput.border.width"));
  const fieldRadius = getFieldRadius(brand, size);
  const resolvedHelperTone =
    forceState === "Error"
      ? "Error"
      : forceState === "Success"
        ? "Success"
        : validationState === "Error"
          ? "Error"
          : validationState === "Success"
            ? "Success"
            : helperTone ?? "Default";
  const helperColors = getHelperColors(brand, resolvedHelperTone);
  const groupValue = compactCharacters(characters);
  const showLabel = label !== undefined && label !== null;
  const showTimerSupport = (timerPrompt !== undefined && timerPrompt !== null) || (timerValue !== undefined && timerValue !== null);
  const showResendSupport =
    !showTimerSupport &&
    ((resendPrompt !== undefined && resendPrompt !== null) ||
      (resendActionLabel !== undefined && resendActionLabel !== null));
  const showHelperSupport =
    !showTimerSupport &&
    !showResendSupport &&
    helperText !== undefined &&
    helperText !== null;
  const timerValueColor = String(getRequiredThemeTokenValue(brand, "color.text.primary"));
  const resendLeadingIcon = resendActionLabel ? (
    <Icon decorative brand={brand} name={resendActionIconName} />
  ) : undefined;
  const previewFocusedIndex =
    forceState === "Active"
      ? Math.min(groupValue.length, Math.max(length - 1, 0))
      : focusedIndex;

  function commitValue(nextCharacters: string[]) {
    setCharacters(nextCharacters);

    const nextValue = compactCharacters(nextCharacters);
    onValueChange?.(nextValue);

    if (nextValue.length === length) {
      onComplete?.(nextValue);
    }
  }

  function focusInput(index: number) {
    const clampedIndex = Math.min(Math.max(index, 0), Math.max(length - 1, 0));
    inputRefs.current[clampedIndex]?.focus();
  }

  function handleInputChange(index: number, event: ChangeEvent<HTMLInputElement>) {
    const incomingValue = event.currentTarget.value;
    const sanitizedIncomingValue = sanitizeOtpValue(incomingValue);

    if (sanitizedIncomingValue.length === 0) {
      const nextCharacters = characters[index] ? removeCharacter(characters, index) : [...characters];
      commitValue(nextCharacters);
      return;
    }

    const nextCharacters = replaceCharacters(characters, index, sanitizedIncomingValue, length);
    commitValue(nextCharacters);
    focusInput(index + sanitizedIncomingValue.length);
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusInput(index - 1);
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusInput(index + 1);
      return;
    }

    if (event.key !== "Backspace") {
      return;
    }

    event.preventDefault();

    if (characters[index]) {
      const nextCharacters = removeCharacter(characters, index);
      commitValue(nextCharacters);
      focusInput(index);
      return;
    }

    if (index === 0) {
      return;
    }

    const nextCharacters = removeCharacter(characters, index - 1);
    commitValue(nextCharacters);
    focusInput(index - 1);
  }

  function handlePaste(index: number, event: ClipboardEvent<HTMLInputElement>) {
    const pastedValue = sanitizeOtpValue(event.clipboardData.getData("text"));

    if (pastedValue.length === 0) {
      return;
    }

    event.preventDefault();
    const nextCharacters = replaceCharacters(characters, index, pastedValue, length);
    commitValue(nextCharacters);
    focusInput(index + pastedValue.length);
  }

  const labelNode = (
    <Label
      brand={brand}
      label={label}
      required={required}
      showInfoIcon={showLabelInfoIcon}
      size={getLabelSize(size)}
    />
  );

  return (
    <div
      {...rest}
      aria-describedby={showHelperSupport || showResendSupport || showTimerSupport ? supportId : undefined}
      aria-labelledby={showLabel ? labelId : undefined}
      role="group"
      style={{
        display: "grid",
        gap: `${sizeTokens.containerGap}px`,
        maxWidth: "100%",
        minWidth: 0,
        width: "fit-content",
        ...style
      }}
    >
      {name ? <input name={name} type="hidden" value={groupValue} /> : null}

      {showLabel ? (
        <div
          id={labelId}
          style={{
            display: "block",
            paddingInline: `${sizeTokens.labelPaddingInline}px`
          }}
        >
          {labelNode}
        </div>
      ) : null}

      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          alignItems: "center",
          display: "flex",
          gap: `${sizeTokens.boxGap}px`,
          width: "fit-content"
        }}
      >
        {Array.from({ length }, (_, index) => {
          const character = characters[index] ?? "";
          const visualState = resolveBoxState({
            forceState,
            disabled,
            focusedIndex: previewFocusedIndex,
            hovered,
            index,
            validationState,
            value: character
          });
          const fieldColors = getFieldColors(brand, visualState);
          const showPlaceholder = character.length === 0 && focusedIndex !== index;

          return (
            <div
              key={`${rootId}-slot-${index}`}
              style={{
                alignItems: "center",
                background: fieldColors.background,
                border: `${borderWidth}px solid ${fieldColors.border}`,
                borderRadius: `${fieldRadius}px`,
                boxSizing: "border-box",
                display: "flex",
                height: `${sizeTokens.boxSize}px`,
                justifyContent: "center",
                position: "relative",
                width: `${sizeTokens.boxSize}px`
              }}
            >
              {showPlaceholder ? (
                <span
                  aria-hidden="true"
                  style={{
                    ...makeTypographyStyles({
                      brand,
                      color: fieldColors.placeholder,
                      fontWeightPath: codeFontWeightPath,
                      typography: codeTypography
                    }),
                    left: "50%",
                    pointerEvents: "none",
                    position: "absolute",
                    top: "50%",
                    transform: "translate(-50%, -50%)"
                  }}
                >
                  {placeholderCharacter}
                </span>
              ) : null}
              <input
                aria-describedby={showHelperSupport || showResendSupport || showTimerSupport ? supportId : undefined}
                aria-invalid={forceState === "Error" || validationState === "Error" ? true : undefined}
                aria-label={getInputAriaLabel?.(index, length)}
                autoComplete={index === 0 ? autoComplete : "off"}
                disabled={disabled}
                inputMode={inputMode}
                maxLength={1}
                onBlur={() => setFocusedIndex((previousIndex) => (previousIndex === index ? null : previousIndex))}
                onChange={(event) => handleInputChange(index, event)}
                onFocus={() => setFocusedIndex(index)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                onPaste={(event) => handlePaste(index, event)}
                ref={(element) => {
                  inputRefs.current[index] = element;
                }}
                style={{
                  ...makeTypographyStyles({
                    brand,
                    color: fieldColors.value,
                    fontWeightPath: codeFontWeightPath,
                    typography: codeTypography
                  }),
                  appearance: "none",
                  background: "transparent",
                  border: "none",
                  boxSizing: "border-box",
                  caretColor: fieldColors.border,
                  height: "100%",
                  minWidth: 0,
                  outline: "none",
                  padding: 0,
                  textAlign: "center",
                  width: "100%"
                }}
                type="text"
                value={character}
              />
            </div>
          );
        })}
      </div>

      {showHelperSupport ? (
        <HelperText
          align="center"
          brand={brand}
          fullWidth
          id={supportId}
          helperText={helperText}
          iconColor={helperColors.icon}
          iconName={
            resolvedHelperTone === "Error"
              ? "error-outline"
              : resolvedHelperTone === "Success"
                ? "circle-check-line"
                : "info-outline"
          }
          iconSize={Number(getRequiredThemeTokenValue(brand, "component.otpInput.icon.helperSize"))}
          showIcon={showHelperIcon}
          size={size}
          style={{ paddingInline: `${sizeTokens.supportingPaddingInline}px` }}
          textColor={helperColors.text}
          typography={helperTypography}
          tone={resolvedHelperTone}
        />
      ) : null}

      {showResendSupport ? (
        <div
          id={supportId}
          style={{
            alignItems: "center",
            display: "flex",
            gap: `${sizeTokens.helperGap}px`,
            minWidth: 0,
            paddingInline: `${sizeTokens.supportingPaddingInline}px`
          }}
        >
          {resendPrompt ? (
            <p
              style={{
                ...makeTypographyStyles({
                  brand,
                  color: helperColors.text,
                  fontWeightPath: "typography.fontWeight.regular",
                  typography: helperTypography
                }),
                minWidth: 0
              }}
            >
              {resendPrompt}
            </p>
          ) : null}
          {resendActionLabel ? (
            <LinkButton
              brand={brand}
              disabled={disabled}
              leadingIcon={resendLeadingIcon}
              onClick={onResendActionClick}
              size="Small"
              underline={false}
            >
              {resendActionLabel}
            </LinkButton>
          ) : null}
        </div>
      ) : null}

      {showTimerSupport ? (
        <div
          id={supportId}
          style={{
            alignItems: "center",
            display: "flex",
            gap: `${sizeTokens.helperGap}px`,
            minWidth: 0,
            paddingInline: `${sizeTokens.supportingPaddingInline}px`
          }}
        >
          {timerPrompt ? (
            <p
              style={{
                ...makeTypographyStyles({
                  brand,
                  color: helperColors.text,
                  fontWeightPath: "typography.fontWeight.regular",
                  typography: helperTypography
                }),
                minWidth: 0
              }}
            >
              {timerPrompt}
            </p>
          ) : null}
          {timerValue ? (
            <p
              style={{
                ...makeTypographyStyles({
                  brand,
                  color: timerValueColor,
                  fontWeightPath: "typography.fontWeight.medium",
                  typography: helperTypography
                }),
                minWidth: 0
              }}
            >
              {timerValue}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
