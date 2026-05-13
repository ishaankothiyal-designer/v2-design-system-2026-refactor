import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { DisplayBrandId } from "@geist/tokens";
import { designSystemRegistry } from "@geist/contracts";
import { getRequiredThemeTokenValue, pxToRem } from "../theme";
import { Button, type ButtonProps } from "./button";
import { Icon } from "./icon";

export const canonicalShowroomAddressWidgetWebContract = designSystemRegistry.widgets.find(
  (widget) => widget.canonicalId === "widget.showroomAddress"
);

export type ShowroomStatusState = "Open" | "Closed" | "Closing soon";

export interface ShowroomAddressAction
  extends Omit<ButtonProps, "brand" | "children" | "onDark" | "shape" | "size" | "styleVariant"> {
  label: ReactNode;
}

export interface ShowroomAddressProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  brand?: DisplayBrandId;
  addressLine1?: ReactNode;
  addressLine2?: ReactNode;
  distance?: ReactNode;
  status?: ShowroomStatusState;
  showroomTiming?: ReactNode;
  showRating?: boolean;
  ratingValue?: ReactNode;
  callAction?: ShowroomAddressAction | null;
  directionsAction?: ShowroomAddressAction | null;
}

const TOKEN_ROOT = "component.showroomAddress";
const googleLogoSrc = new URL("./assets/showroom-address/google-logo.svg", import.meta.url).href;

const statusTokenKey: Record<ShowroomStatusState, "open" | "closed" | "closingSoon"> = {
  Open: "open",
  Closed: "closed",
  "Closing soon": "closingSoon"
};

function tokenPath(path: string) {
  return `${TOKEN_ROOT}.${path}`;
}

function tokenNumber(brand: DisplayBrandId, path: string) {
  return Number(getRequiredThemeTokenValue(brand, tokenPath(path)));
}

function tokenString(brand: DisplayBrandId, path: string) {
  return String(getRequiredThemeTokenValue(brand, tokenPath(path)));
}

function themeString(brand: DisplayBrandId, path: string) {
  return String(getRequiredThemeTokenValue(brand, path));
}

function toPx(value: number) {
  return pxToRem(value);
}

function textStyle({
  brand,
  color,
  token,
  weight
}: {
  brand: DisplayBrandId;
  color: string;
  token: "addressLine1" | "addressLine2" | "distance" | "status" | "separator" | "timing" | "rating";
  weight: "regular" | "medium" | "semibold";
}) {
  return {
    color,
    fontFamily: `${themeString(brand, "typography.fontFamily.sans")}, sans-serif`,
    fontSize: toPx(tokenNumber(brand, `typography.${token}.fontSize`)),
    fontWeight: Number(getRequiredThemeTokenValue(brand, `typography.fontWeight.${weight}`)),
    letterSpacing: toPx(tokenNumber(brand, `typography.${token}.letterSpacing`)),
    lineHeight: toPx(tokenNumber(brand, `typography.${token}.lineHeight`)),
    margin: 0
  } satisfies CSSProperties;
}

function buildCallAction(brand: DisplayBrandId) {
  return {
    label: "Call now",
    leadingIcon: <Icon brand={brand} decorative name="call-1" />
  } satisfies ShowroomAddressAction;
}

function buildDirectionsAction(brand: DisplayBrandId) {
  return {
    label: "Directions",
    leadingIcon: <Icon brand={brand} decorative name="arrow-lbow-up-right" />
  } satisfies ShowroomAddressAction;
}

function ShowroomStatus({ brand, status }: { brand: DisplayBrandId; status: ShowroomStatusState }) {
  const color = tokenString(brand, `color.status.${statusTokenKey[status]}`);

  return (
    <span
      data-status={status}
      style={{
        ...textStyle({ brand, color, token: "status", weight: "semibold" }),
        display: "inline-flex",
        flex: "0 0 auto",
        whiteSpace: "nowrap"
      }}
    >
      {status}
    </span>
  );
}

function ShowroomActionButton({
  action,
  brand
}: {
  action: ShowroomAddressAction;
  brand: DisplayBrandId;
}) {
  const {
    label,
    style,
    type,
    ...buttonProps
  } = action;

  return (
    <Button
      {...buttonProps}
      brand={brand}
      onDark={false}
      shape="Regular"
      size="Medium"
      style={{
        flex: "1 1 0",
        minWidth: 0,
        ...style
      }}
      styleVariant="Outline"
      type={type ?? "button"}
    >
      {label}
    </Button>
  );
}

/**
 * Showroom address widget with address copy, distance, status/timing, Google rating, and two primary actions.
 */
export function ShowroomAddress({
  brand = "Cars24",
  addressLine1 = "Address line 1",
  addressLine2 = "Address line 2",
  distance = "4.5 Km from Connaught Place",
  status = "Open",
  showroomTiming = "Closes at 8:00 PM",
  showRating = true,
  ratingValue = "4.4",
  callAction,
  directionsAction,
  className,
  style,
  ...rest
}: ShowroomAddressProps) {
  const rootPadding = tokenNumber(brand, "layout.padding");
  const contentGap = tokenNumber(brand, "layout.gap");
  const detailsGap = tokenNumber(brand, "layout.detailsGap");
  const textGap = tokenNumber(brand, "layout.textGap");
  const addressGap = tokenNumber(brand, "layout.addressGap");
  const statusGap = tokenNumber(brand, "layout.statusGap");
  const actionGap = tokenNumber(brand, "layout.actionGap");
  const ratingGap = tokenNumber(brand, "layout.ratingGap");
  const ratingIconSize = tokenNumber(brand, "layout.ratingIconSize");
  const background = tokenString(brand, "color.background");
  const titleColor = tokenString(brand, "color.title");
  const bodyColor = tokenString(brand, "color.body");
  const distanceColor = tokenString(brand, "color.distance");
  const ratingColor = tokenString(brand, "color.rating");
  const resolvedCallAction = callAction === undefined ? buildCallAction(brand) : callAction;
  const resolvedDirectionsAction = directionsAction === undefined ? buildDirectionsAction(brand) : directionsAction;
  const ratingLabel =
    typeof ratingValue === "string" || typeof ratingValue === "number"
      ? `Google rating ${ratingValue}`
      : "Google rating";

  const rootStyles: CSSProperties = {
    alignItems: "flex-start",
    background,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: toPx(contentGap),
    maxWidth: "100%",
    padding: toPx(rootPadding),
    width: toPx(tokenNumber(brand, "layout.width")),
    ...style
  };

  const detailsStyles: CSSProperties = {
    alignItems: "flex-start",
    display: "flex",
    gap: toPx(detailsGap),
    width: "100%"
  };

  const textColumnStyles: CSSProperties = {
    alignItems: "flex-start",
    display: "flex",
    flex: "1 1 0",
    flexDirection: "column",
    gap: toPx(textGap),
    minWidth: 0
  };

  const addressStackStyles: CSSProperties = {
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "column",
    gap: toPx(addressGap),
    width: "100%"
  };

  const statusRowStyles: CSSProperties = {
    alignItems: "center",
    display: "flex",
    gap: toPx(statusGap),
    maxWidth: "100%",
    minWidth: 0
  };

  const actionRowStyles: CSSProperties = {
    alignItems: "center",
    display: "flex",
    gap: toPx(actionGap),
    width: "100%"
  };

  const ratingStyles: CSSProperties = {
    alignItems: "center",
    display: "flex",
    flex: "0 0 auto",
    gap: toPx(ratingGap),
    justifyContent: "center"
  };

  const timingStyles: CSSProperties = {
    ...textStyle({ brand, color: bodyColor, token: "timing", weight: "medium" }),
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  };

  return (
    <div {...rest} className={className} style={rootStyles}>
      <div style={detailsStyles}>
        <div style={textColumnStyles}>
          <div style={addressStackStyles}>
            <p
              style={{
                ...textStyle({ brand, color: titleColor, token: "addressLine1", weight: "semibold" }),
                maxWidth: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                width: "100%"
              }}
            >
              {addressLine1}
            </p>
            <p style={{ ...textStyle({ brand, color: bodyColor, token: "addressLine2", weight: "regular" }), width: "100%" }}>
              {addressLine2}
            </p>
          </div>

          <p style={{ ...textStyle({ brand, color: distanceColor, token: "distance", weight: "medium" }), width: "100%" }}>
            {distance}
          </p>

          <div style={statusRowStyles}>
            <ShowroomStatus brand={brand} status={status} />
            <span
              aria-hidden="true"
              style={{
                ...textStyle({ brand, color: bodyColor, token: "separator", weight: "medium" }),
                flex: "0 0 auto"
              }}
            >
              {"\u2022"}
            </span>
            <p style={timingStyles}>{showroomTiming}</p>
          </div>
        </div>

        {showRating ? (
          <div aria-label={ratingLabel} style={ratingStyles}>
            <img
              alt=""
              aria-hidden="true"
              src={googleLogoSrc}
              style={{
                display: "block",
                height: toPx(ratingIconSize),
                objectFit: "contain",
                pointerEvents: "none",
                width: toPx(ratingIconSize)
              }}
            />
            <p style={textStyle({ brand, color: ratingColor, token: "rating", weight: "semibold" })}>
              {ratingValue}
            </p>
          </div>
        ) : null}
      </div>

      {resolvedCallAction || resolvedDirectionsAction ? (
        <div style={actionRowStyles}>
          {resolvedCallAction ? <ShowroomActionButton action={resolvedCallAction} brand={brand} /> : null}
          {resolvedDirectionsAction ? <ShowroomActionButton action={resolvedDirectionsAction} brand={brand} /> : null}
        </div>
      ) : null}
    </div>
  );
}
