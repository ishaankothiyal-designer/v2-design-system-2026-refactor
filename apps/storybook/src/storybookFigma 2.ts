const storybookEnv = import.meta.env as Record<string, string | boolean | undefined>;

const FIGMA_ACCESS_TOKEN =
  typeof storybookEnv.STORYBOOK_FIGMA_ACCESS_TOKEN === "string"
    ? storybookEnv.STORYBOOK_FIGMA_ACCESS_TOKEN
    : undefined;

export function createFigspecDesign(url: string) {
  if (FIGMA_ACCESS_TOKEN) {
    return {
      type: "figspec" as const,
      url,
      accessToken: FIGMA_ACCESS_TOKEN
    };
  }

  return {
    type: "figspec" as const,
    url
  };
}
