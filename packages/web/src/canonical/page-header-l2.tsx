import { AppHeader, type AppHeaderProps } from "./app-header";

export interface PageHeaderL2Props extends Omit<AppHeaderProps, "level"> {}

/**
 * Backward-compatible alias for App Header rendered in its L2 page variant.
 */
export function PageHeaderL2(props: PageHeaderL2Props) {
  return <AppHeader {...props} level="Page - L2" />;
}
