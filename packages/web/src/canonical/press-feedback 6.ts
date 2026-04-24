import type { CSSProperties } from "react";

const TAP_TRANSITION = "transform 140ms cubic-bezier(0.2, 0, 0, 1)";
const TAP_TRANSFORM = "translateY(1px) scale(0.985)";

export function getTapFeedbackStyles({
  disabled,
  pressed,
  transition,
  transform
}: {
  disabled: boolean;
  pressed: boolean;
  transition?: CSSProperties["transition"];
  transform?: CSSProperties["transform"];
}): CSSProperties {
  const nextTransform = [transform, !disabled && pressed ? TAP_TRANSFORM : undefined].filter(Boolean).join(" ") || undefined;

  return {
    transform: nextTransform,
    transformOrigin: "center",
    transition: [transition, TAP_TRANSITION].filter(Boolean).join(", "),
    willChange: disabled ? undefined : "transform"
  };
}
