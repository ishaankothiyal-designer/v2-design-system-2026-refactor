import type { CSSProperties } from "react";
import type { Decorator } from "@storybook/react";
import { Canvas, Controls, Description, DocsPage, Subtitle, Title, useOf } from "@storybook/addon-docs/blocks";
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

      <Text as="strong" brand="Cars24" size="xl" tone="primary" style={{ display: "block", ...sectionHeadingStyles }}>
        Docs
      </Text>
      <Description of="meta" />
      {playgroundStory ? (
        <Controls of={playgroundStory as never} />
      ) : (
        <Controls />
      )}

      {playgroundStory ? (
        <>
          <Text as="strong" brand="Cars24" size="xl" tone="primary" style={{ display: "block", ...sectionHeadingStyles }}>
            Playground
          </Text>
          <Canvas of={playgroundStory as never} sourceState="shown" story={{ height: "400px" }} />
        </>
      ) : null}
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
