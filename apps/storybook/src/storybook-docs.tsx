import { type CSSProperties, useEffect, useMemo, useRef } from "react";
import type { Decorator } from "@storybook/react";
import { designSystemRegistry, type ComponentContract } from "@geist/contracts";
import { Canvas, Controls, Description, DocsPage, Stories, Subtitle, Title, useOf } from "@storybook/addon-docs/blocks";
import { coreTokenCatalog } from "@geist/tokens";
import { Text } from "@geist/web";

const sectionHeadingStyles: CSSProperties = {
  margin: "32px 0 16px"
};

const centeredStageStyles: CSSProperties = {
  minHeight: 400,
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 80,
  boxSizing: "border-box",
  fontFamily: `var(--typography-font-family-sans, ${String(coreTokenCatalog.typography.fontFamily.sans)}), sans-serif`
};

const fullscreenStageStyles: CSSProperties = {
  width: "100%",
  minHeight: "100%",
  boxSizing: "border-box"
};

type RemarkValue = "Dev only";

type ArgTypeWithRemark = {
  remark?: RemarkValue;
  table?: {
    disable?: boolean;
    remark?: RemarkValue;
  };
};

type ArgTypeMap = Record<string, ArgTypeWithRemark>;

const remarkBadgeBaseStyles: CSSProperties = {
  alignItems: "center",
  borderRadius: 999,
  boxSizing: "border-box",
  display: "inline-flex",
  fontFamily: `var(--typography-font-family-sans, ${String(coreTokenCatalog.typography.fontFamily.sans)}), sans-serif`,
  fontSize: 12,
  fontWeight: 600,
  justifyContent: "center",
  lineHeight: "16px",
  minHeight: 24,
  padding: "4px 10px",
  whiteSpace: "nowrap"
};

function getRemarkChipStyles(remark: RemarkValue): CSSProperties {
  return {
    ...remarkBadgeBaseStyles,
    background: String(coreTokenCatalog.color.surface.subtle),
    border: `1px solid ${String(coreTokenCatalog.color.border.default)}`,
    color: String(coreTokenCatalog.color.text.secondary)
  };
}

function sanitizeArgName(value: string | null | undefined) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\*+$/, "");
}

function normalizeComponentKey(value: string | null | undefined) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

const componentTitleAliases: Record<string, string[]> = {
  otp: ["otpinput"],
  phonenumber: ["phoneinput"]
};

function resolveComponentContract(title: string) {
  const titleLeaf = title.split("/").at(-1);
  const normalizedTitle = normalizeComponentKey(titleLeaf);
  const candidateKeys = new Set([normalizedTitle, ...(componentTitleAliases[normalizedTitle] ?? [])]);

  return designSystemRegistry.components.find((component) => {
    const canonicalKey = normalizeComponentKey(component.canonicalName);
    const figmaKey = normalizeComponentKey(component.figmaComponentName);
    return candidateKeys.has(canonicalKey) || candidateKeys.has(figmaKey);
  });
}

function getFigmaBackedArgNames(component: ComponentContract) {
  const names = new Set(component.variants.map((variant) => normalizeComponentKey(variant.name)));

  if (component.states.length > 0) {
    names.add("state");
  }

  return names;
}

function buildRemarkMap(argTypes: ArgTypeMap, title: string) {
  const explicitEntries = Object.entries(argTypes).flatMap(([name, value]) => {
    const remark = value.table?.remark ?? value.remark;
    return remark ? [[name, remark] as const] : [];
  });

  const contract = resolveComponentContract(title);
  if (!contract) {
    return Object.fromEntries(explicitEntries);
  }

  const figmaBackedArgNames = getFigmaBackedArgNames(contract);
  const inferredEntries = Object.entries(argTypes).flatMap(([name, value]) => {
    if (value.table?.disable) {
      return [];
    }

    if (explicitEntries.some(([explicitName]) => explicitName === name)) {
      return [];
    }

    return figmaBackedArgNames.has(normalizeComponentKey(name)) ? [] : [[name, "Dev only"] as const];
  });

  return Object.fromEntries([...explicitEntries, ...inferredEntries]);
}

function clearRemarkColumn(wrapper: HTMLDivElement) {
  wrapper.querySelector("[data-remark-column='true']")?.remove();
  wrapper.querySelectorAll("[data-remark-cell='true']").forEach((cell) => cell.remove());
}

function applyRemarkColumn(wrapper: HTMLDivElement, remarkMap: Record<string, RemarkValue>) {
  if (Object.keys(remarkMap).length === 0) {
    clearRemarkColumn(wrapper);
    return;
  }

  const table = wrapper.querySelector("table");
  const headerRow = table?.querySelector("thead tr");

  if (!table || !headerRow) {
    return;
  }

  const headerCells = Array.from(headerRow.children) as HTMLElement[];
  const controlIndex = headerCells.findIndex((cell) =>
    sanitizeArgName(cell.textContent).toLowerCase().includes("control")
  );

  if (controlIndex === -1) {
    return;
  }

  headerRow.querySelector("[data-remark-column='true']")?.remove();

  const remarkHeader = document.createElement("th");
  remarkHeader.dataset.remarkColumn = "true";
  remarkHeader.textContent = "Remark";
  remarkHeader.style.textAlign = "left";
  remarkHeader.style.verticalAlign = "top";
  remarkHeader.style.minWidth = "140px";
  remarkHeader.style.width = "140px";

  const controlHeaderCell = headerCells[controlIndex];
  if (!controlHeaderCell) {
    return;
  }
  controlHeaderCell.insertAdjacentElement("afterend", remarkHeader);

  const rows = Array.from(table.querySelectorAll("tbody tr"));
  rows.forEach((row) => {
    row.querySelector("[data-remark-cell='true']")?.remove();

    const cells = Array.from(row.children) as HTMLElement[];
    if (cells.length === 0) {
      return;
    }

    const name = sanitizeArgName(cells[0]?.textContent);
    const remark = remarkMap[name];
    const remarkCell = document.createElement("td");
    remarkCell.dataset.remarkCell = "true";
    remarkCell.style.minWidth = "140px";
    remarkCell.style.width = "140px";
    remarkCell.style.verticalAlign = "top";

    if (remark) {
      const chip = document.createElement("span");
      chip.textContent = remark;
      Object.assign(chip.style, getRemarkChipStyles(remark));
      remarkCell.appendChild(chip);
    }

    const controlCell = cells[controlIndex];
    if (controlCell) {
      controlCell.insertAdjacentElement("afterend", remarkCell);
    }
  });
}

function ControlsWithRemarks({
  argTypes,
  story,
  title
}: {
  argTypes?: ArgTypeMap;
  story?: unknown;
  title: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const remarkMap = useMemo(() => {
    return buildRemarkMap(argTypes ?? {}, title);
  }, [argTypes, title]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) {
      return;
    }

    let frame = 0;
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => applyRemarkColumn(wrapper, remarkMap));
    };

    sync();

    const observer = new MutationObserver(sync);
    observer.observe(wrapper, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [remarkMap]);

  return <div ref={wrapperRef}>{story ? <Controls of={story as never} /> : <Controls />}</div>;
}

function resolveStory(moduleExports: Record<string, unknown>, exportName?: string) {
  if (!exportName) {
    return undefined;
  }

  const storyName = exportName.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  return Object.values(moduleExports).find(
    (story): story is { moduleExport: unknown; name: string } =>
      typeof story === "object" &&
      story !== null &&
      "moduleExport" in story &&
      "name" in story &&
      (story as { name: string }).name === storyName
  )?.moduleExport;
}

export function ComponentDocsPage() {
  const resolvedMeta = useOf("meta", ["meta"]);
  const preparedMeta = resolvedMeta.preparedMeta;
  const title = preparedMeta.title;

  if (!title.startsWith("Components/")) {
    return <DocsPage />;
  }

  const stories = resolvedMeta.csfFile.stories as Record<string, unknown>;
  const playgroundStory = resolveStory(stories, "Playground");

  return (
    <>
      <Title />
      <Subtitle />

      <Description of="meta" />

      {playgroundStory ? (
        <>
          <Text as="strong" brand="Cars24" size="xl" tone="primary" style={{ display: "block", ...sectionHeadingStyles }}>
            Playground
          </Text>
          <Canvas of={playgroundStory as never} sourceState="shown" story={{ height: "400px" }} />
        </>
      ) : null}

      <Text as="strong" brand="Cars24" size="xl" tone="primary" style={{ display: "block", ...sectionHeadingStyles }}>
        Docs
      </Text>
      {playgroundStory ? (
        <ControlsWithRemarks
          argTypes={(preparedMeta.argTypes ?? {}) as ArgTypeMap}
          story={playgroundStory}
          title={title}
        />
      ) : (
        <ControlsWithRemarks argTypes={(preparedMeta.argTypes ?? {}) as ArgTypeMap} title={title} />
      )}

      <Stories includePrimary={!playgroundStory} />
    </>
  );
}

export const centeredCanvasDecorator: Decorator = (Story, context) => {
  const useDarkCanvas = context.args?.onDark === true || context.args?.inverse === true;
  const stageBackground = useDarkCanvas ? String(coreTokenCatalog.color.surface.inverse) : "transparent";
  const canvasBackgroundCss = useDarkCanvas
    ? `html, body, #storybook-root,
       .sbdocs, .sbdocs-wrapper, .sbdocs-preview,
       .docs-story, .docblock-story,
       .innerZoomElementWrapper,
       .innerZoomElementWrapper > div,
       .innerZoomElementWrapper > div > div {
         background: ${stageBackground} !important;
       }
       .sbdocs-preview,
       .docs-story,
       .docblock-story,
       .innerZoomElementWrapper,
       .innerZoomElementWrapper > div,
       .innerZoomElementWrapper > div > div {
         width: 100% !important;
         max-width: 100% !important;
       }`
    : "html, body, #storybook-root { background: transparent !important; }";
  const fluidDarkStageStyles: CSSProperties = useDarkCanvas
    ? {
        width: "100vw",
        maxWidth: "100vw",
        marginLeft: "calc(50% - 50vw)",
        marginRight: "calc(50% - 50vw)"
      }
    : {};

  if (context.parameters.layout === "fullscreen") {
    return (
      <>
        <style>{canvasBackgroundCss}</style>
        <div style={{ ...fullscreenStageStyles, ...fluidDarkStageStyles, background: stageBackground }}>
          <Story />
        </div>
      </>
    );
  }

  return (
    <>
      <style>{canvasBackgroundCss}</style>
      <div style={{ ...centeredStageStyles, ...fluidDarkStageStyles, background: stageBackground }}>
        <Story />
      </div>
    </>
  );
};
