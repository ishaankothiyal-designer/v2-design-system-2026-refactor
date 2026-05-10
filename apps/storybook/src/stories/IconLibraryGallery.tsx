import { useMemo, useState, type CSSProperties } from "react";
import { IconGallery, IconItem } from "@storybook/addon-docs/blocks";
import { coreTokenCatalog } from "@turbo/tokens";
import { Icon } from "@turbo/web";
import { iconFamilies, type IconFamily, type IconVariantLabel } from "./iconLibraryData";

type IconFilter = "all" | "outline" | "filled";

const filterLabels: Record<IconFilter, string> = {
  all: "All",
  outline: "Outline",
  filled: "Filled"
};

const filterDescriptions: Record<IconFilter, string> = {
  all: "Shows every icon family and variant.",
  outline: "Shows outline and outlined variants only.",
  filled: "Shows fill and filled variants only."
};

const controlsStyles: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 12,
  marginBottom: 24
};

const sectionStyles: CSSProperties = {
  display: "grid",
  gap: 18,
  paddingTop: 8,
  paddingBottom: 20
};

const sectionHeadingStyles: CSSProperties = {
  margin: 0
};

const sectionMetaStyles: CSSProperties = {
  margin: 0,
  color: String(coreTokenCatalog.color.text.secondary),
  lineHeight: "24px"
};

const buttonBaseStyles: CSSProperties = {
  appearance: "none",
  borderRadius: 999,
  padding: "8px 14px",
  fontSize: 13,
  fontWeight: 700,
  lineHeight: "18px",
  cursor: "pointer",
  transition: "all 160ms ease"
};

function matchesFilter(variantLabel: IconVariantLabel, filter: IconFilter) {
  if (filter === "all") {
    return true;
  }

  if (filter === "outline") {
    return variantLabel === "Outline" || variantLabel === "Outlined";
  }

  return variantLabel === "Fill" || variantLabel === "Filled";
}

function filterFamilies(filter: IconFilter): IconFamily[] {
  return iconFamilies
    .map((family) => ({
      ...family,
      icons: family.icons.filter((icon) => matchesFilter(icon.variantLabel, filter))
    }))
    .filter((family) => family.icons.length > 0);
}

export function IconLibraryGallery() {
  const [activeFilter, setActiveFilter] = useState<IconFilter>("all");

  const visibleFamilies = useMemo(() => filterFamilies(activeFilter), [activeFilter]);
  const visibleIconCount = useMemo(
    () => visibleFamilies.reduce((count, family) => count + family.icons.length, 0),
    [visibleFamilies]
  );
  const visibleIcons = useMemo(() => visibleFamilies.flatMap((family) => family.icons), [visibleFamilies]);

  return (
    <>
      <div style={controlsStyles}>
        {(["all", "outline", "filled"] as const).map((filter) => {
          const isActive = activeFilter === filter;

          return (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              style={{
                ...buttonBaseStyles,
                border: `1px solid ${
                  isActive
                    ? String(coreTokenCatalog.color.brand.primary[600])
                    : String(coreTokenCatalog.color.border.default)
                }`,
                background: isActive
                  ? String(coreTokenCatalog.color.brand.primary[50])
                  : String(coreTokenCatalog.color.surface.canvas),
                color: isActive
                  ? String(coreTokenCatalog.color.brand.primary[700])
                  : String(coreTokenCatalog.color.text.primary)
              }}
            >
              {filterLabels[filter]}
            </button>
          );
        })}
      </div>

      <p style={{ color: String(coreTokenCatalog.color.text.secondary), lineHeight: "24px", marginTop: 0 }}>
        {filterDescriptions[activeFilter]} Currently showing {visibleIconCount} icons across {visibleFamilies.length}{" "}
        families.
      </p>

      {activeFilter === "all" ? (
        visibleFamilies.map((family) => (
          <section key={`${activeFilter}-${family.key}`} style={sectionStyles}>
            <h2 style={sectionHeadingStyles}>{family.label}</h2>
            <p style={sectionMetaStyles}>
              {family.icons.length} variant{family.icons.length === 1 ? "" : "s"} in this family.
            </p>
            <IconGallery>
              {family.icons.map((icon) => (
                <IconItem key={icon.name} name={icon.name}>
                  <Icon name={icon.name} size="lg" decorative />
                </IconItem>
              ))}
            </IconGallery>
          </section>
        ))
      ) : (
        <IconGallery>
          {visibleIcons.map((icon) => (
            <IconItem key={icon.name} name={icon.name}>
              <Icon name={icon.name} size="lg" decorative />
            </IconItem>
          ))}
        </IconGallery>
      )}
    </>
  );
}
