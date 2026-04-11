import type { CSSProperties } from "react";
import type { Decorator } from "@storybook/react";
import { Canvas, Controls, Description, DocsPage, Subtitle, Title, useOf } from "@storybook/addon-docs/blocks";

const sectionHeadingStyles: CSSProperties = {
  margin: "32px 0 16px",
  fontSize: 20,
  lineHeight: "28px"
};

const centeredStageStyles: CSSProperties = {
  minHeight: 400,
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 24,
  boxSizing: "border-box"
};

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

function resolveStories(moduleExports: Record<string, unknown>, exportNames?: readonly string[]) {
  if (!exportNames) {
    return [];
  }

  return exportNames
    .map((exportName) => ({
      exportName,
      storyExport: resolveStory(moduleExports, exportName)
    }))
    .filter((entry): entry is { exportName: string; storyExport: unknown } => entry.storyExport !== undefined);
}

function DocsSection({
  title,
  stories
}: {
  title: string;
  stories: Array<{ exportName: string; storyExport: unknown }>;
}) {
  if (stories.length === 0) {
    return null;
  }

  return (
    <>
      <h2 style={sectionHeadingStyles}>{title}</h2>
      <div style={{ display: "grid", gap: 16 }}>
        {stories.map(({ exportName, storyExport }) => (
          <Canvas key={exportName} of={storyExport as never} sourceState="shown" story={{ height: "400px" }} />
        ))}
      </div>
    </>
  );
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
  const variantStories = resolveStories(stories, ["Variants"]);
  const usageStories = resolveStories(stories, ["UsageGuidelines"]);

  return (
    <>
      <Title />
      <Subtitle />

      <h2 style={sectionHeadingStyles}>Docs</h2>
      <Description of="meta" />
      {playgroundStory ? (
        <Controls of={playgroundStory as never} />
      ) : (
        <Controls />
      )}

      {playgroundStory ? (
        <>
          <h2 style={sectionHeadingStyles}>Playground</h2>
          <Canvas of={playgroundStory as never} sourceState="shown" story={{ height: "400px" }} />
        </>
      ) : null}

      <DocsSection title="Variants" stories={variantStories} />
      <DocsSection title="Usage Guidelines" stories={usageStories} />
    </>
  );
}

export const centeredCanvasDecorator: Decorator = (Story, context) => {
  if (context.parameters.layout === "fullscreen") {
    return <Story />;
  }

  return (
    <div style={centeredStageStyles}>
      <Story />
    </div>
  );
};
