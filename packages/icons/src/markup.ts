import { iconDefinitions, type IconName } from "./icon-data";
import type { IconMarkupOptions, IconStyleOptions } from "./types";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatStyle(options: IconStyleOptions): string {
  const rules: string[] = [];

  if (options.size !== undefined) {
    const size = typeof options.size === "number" ? `${options.size}px` : options.size;
    rules.push(`font-size: ${size}`);
  }

  if (options.color) {
    rules.push(`color: ${options.color}`);
  }

  return rules.length > 0 ? ` style="${escapeHtml(rules.join("; "))}"` : "";
}

function formatAccessibility(
  name: IconName,
  options: Pick<IconMarkupOptions, "decorative" | "label" | "title">
): string {
  if (options.label) {
    return ` role="img" aria-label="${escapeHtml(options.label)}"`;
  }

  if (options.title) {
    return ` role="img" aria-label="${escapeHtml(options.title)}" title="${escapeHtml(options.title)}"`;
  }

  if (options.decorative === false) {
    return ` role="img" aria-label="${escapeHtml(name)}"`;
  }

  return ` aria-hidden="true"`;
}

export function getIconClassName(name: IconName): string {
  return `icon-${name}`;
}

export function getIconDefinition(name: IconName) {
  return iconDefinitions[name];
}

export function getIconAliases(name: IconName): readonly string[] {
  return iconDefinitions[name].aliases;
}

export function getIconPathCount(name: IconName): number {
  return iconDefinitions[name].pathCount;
}

export function isMulticolorIcon(name: IconName): boolean {
  return getIconPathCount(name) > 1;
}

export function renderIconMarkup(name: IconName, options: IconMarkupOptions = {}): string {
  const definition = getIconDefinition(name);
  const classes = [getIconClassName(name), options.className].filter(Boolean).join(" ");
  const style = formatStyle(options);
  const accessibility = formatAccessibility(name, options);
  const base = `<span class="${escapeHtml(classes)}" data-icon-name="${escapeHtml(name)}"${style}${accessibility}>`;

  if (definition.pathCount <= 1) {
    return `${base}</span>`;
  }

  const children = Array.from({ length: definition.pathCount }, (_, index) => {
    const pathClass = `path${index + 1}`;
    return `<span class="${pathClass}" aria-hidden="true"></span>`;
  }).join("");

  return `${base}${children}</span>`;
}
