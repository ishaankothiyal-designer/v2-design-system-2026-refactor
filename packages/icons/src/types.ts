import type { IconName } from "./icon-data";

export type { IconName };

export interface IconMarkupOptions {
  className?: string;
  color?: string;
  decorative?: boolean;
  label?: string;
  size?: number | string;
  title?: string;
}

export interface IconStyleOptions {
  color?: string;
  size?: number | string;
}
