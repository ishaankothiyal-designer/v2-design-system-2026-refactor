import * as React from "react";
import { addons, types, useStorybookApi, useStorybookState } from "storybook/manager-api";

const ADDON_ID = "storybook-code-panel";
const PANEL_ID = `${ADDON_ID}/panel`;

type StoryParameters = Record<string, any>;

type CodePanelParameters = {
  disabled?: boolean;
  extensionMapping?: Record<string, string>;
  allowedExtensions?: string[];
  files?: Array<{
    fileName?: string;
    language?: string;
    code?: unknown;
  }>;
};

type CodePanelFile = {
  fileName: string;
  language?: string;
  code: string;
};

function getSourceCode(parameters: StoryParameters | undefined) {
  if (!parameters) {
    return undefined;
  }

  const docs = parameters.docs;
  if (docs && typeof docs === "object") {
    const source = docs.source;
    if (source && typeof source === "object") {
      if (typeof source.code === "string" && source.code.trim()) {
        return source.code;
      }

      if (typeof source.originalSource === "string" && source.originalSource.trim()) {
        return source.originalSource;
      }
    }
  }

  return undefined;
}

function getCodeString(input: unknown) {
  if (typeof input === "string") {
    return input;
  }

  if (input && typeof input === "object" && "default" in input) {
    const candidate = (input as { default?: unknown }).default;
    if (typeof candidate === "string") {
      return candidate;
    }
  }

  return undefined;
}

function getFileExtension(fileName: string) {
  const match = /\.([a-z0-9]+)$/i.exec(fileName);
  return match?.[1]?.toLowerCase();
}

function getLanguageForFile(
  fileName: string,
  language: string | undefined,
  extensionMapping: Record<string, string> | undefined
) {
  if (language) {
    return language;
  }

  const extension = getFileExtension(fileName);
  if (!extension) {
    return undefined;
  }

  return extensionMapping?.[extension] ?? extension;
}

function getConfiguredFiles(parameters: StoryParameters | undefined): CodePanelFile[] {
  const codePanel =
    parameters?.storybookCodePanel && typeof parameters.storybookCodePanel === "object"
      ? (parameters.storybookCodePanel as CodePanelParameters)
      : undefined;

  if (!codePanel || codePanel.disabled || !Array.isArray(codePanel.files)) {
    return [];
  }

  const allowedExtensions = Array.isArray(codePanel.allowedExtensions)
    ? new Set(codePanel.allowedExtensions.map((extension) => extension.toLowerCase()))
    : undefined;

  return codePanel.files.flatMap((file, index) => {
    if (!file || typeof file !== "object") {
      return [];
    }

    const code = getCodeString(file.code);
    if (!code || !code.trim()) {
      return [];
    }

    const fileName =
      typeof file.fileName === "string" && file.fileName.trim()
        ? file.fileName
        : `source-${index + 1}.txt`;
    const extension = getFileExtension(fileName);

    if (extension && allowedExtensions && !allowedExtensions.has(extension)) {
      return [];
    }

    const language = getLanguageForFile(
      fileName,
      typeof file.language === "string" ? file.language : undefined,
      codePanel.extensionMapping
    );

    return [
      {
        fileName,
        ...(language ? { language } : {}),
        code
      }
    ];
  });
}

function getFallbackFile(parameters: StoryParameters | undefined): CodePanelFile | undefined {
  const sourceCode = getSourceCode(parameters);
  if (!sourceCode) {
    return undefined;
  }

  return {
    fileName: "story.tsx",
    language: "tsx",
    code: sourceCode
  };
}

function CodeSnippetPanel({ active }: { active: boolean }) {
  const api = useStorybookApi();
  const { storyId } = useStorybookState();
  const [selectedFileIndex, setSelectedFileIndex] = React.useState(0);

  if (!active) {
    return null;
  }

  const entry = storyId ? api.getData(storyId) : undefined;
  const parameters = storyId ? (api.getParameters(storyId) as StoryParameters | undefined) : undefined;
  const heading = entry && "title" in entry ? `${entry.title} / ${entry.name}` : "Current story";
  const configuredFiles = getConfiguredFiles(parameters);
  const fallbackFile = configuredFiles.length === 0 ? getFallbackFile(parameters) : undefined;
  const files = fallbackFile ? [fallbackFile] : configuredFiles;
  const selectedFile = files[selectedFileIndex] ?? files[0];

  React.useEffect(() => {
    setSelectedFileIndex(0);
  }, [storyId]);

  return React.createElement(
    "section",
    {
      style: {
        height: "100%",
        overflow: "auto",
        background: "#111827",
        color: "#E5E7EB",
        padding: 16,
        boxSizing: "border-box"
      }
    },
    React.createElement(
      "div",
      {
        style: {
          display: "grid",
          gap: 12
        }
      },
      React.createElement(
        "div",
        {
          style: {
            display: "grid",
            gap: 4
          }
        },
        React.createElement(
          "strong",
          {
            style: {
              fontSize: 13,
              lineHeight: "18px"
            }
          },
          "Code"
        ),
        React.createElement(
          "span",
          {
            style: {
              fontSize: 12,
              lineHeight: "16px",
              color: "#9CA3AF"
            }
          },
          heading
        ),
        fallbackFile
          ? React.createElement(
              "span",
              {
                style: {
                  fontSize: 12,
                  lineHeight: "16px",
                  color: "#6EE7B7"
                }
              },
              "Using docs.source.code as the fallback snippet source."
            )
          : null
      ),
      files.length > 1
        ? React.createElement(
            "div",
            {
              style: {
                display: "flex",
                gap: 8,
                flexWrap: "wrap"
              }
            },
            files.map((file, index) =>
              React.createElement(
                "button",
                {
                  key: file.fileName,
                  type: "button",
                  onClick: () => setSelectedFileIndex(index),
                  style: {
                    cursor: "pointer",
                    borderRadius: 999,
                    border: index === selectedFileIndex ? "1px solid #60A5FA" : "1px solid #374151",
                    background: index === selectedFileIndex ? "#1D4ED8" : "#111827",
                    color: "#E5E7EB",
                    fontSize: 12,
                    lineHeight: "16px",
                    padding: "6px 10px"
                  }
                },
                file.fileName
              )
            )
          )
        : null,
      selectedFile
        ? React.createElement(
            "div",
            {
              style: {
                display: "grid",
                gap: 8
              }
            },
            React.createElement(
              "div",
              {
                style: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12
                }
              },
              React.createElement(
                "span",
                {
                  style: {
                    fontSize: 12,
                    lineHeight: "16px",
                    color: "#D1D5DB"
                  }
                },
                selectedFile.fileName
              ),
              selectedFile.language
                ? React.createElement(
                    "span",
                    {
                      style: {
                        fontSize: 11,
                        lineHeight: "16px",
                        color: "#9CA3AF",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em"
                      }
                    },
                    selectedFile.language
                  )
                : null
            ),
            React.createElement(
              "pre",
              {
                style: {
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  fontSize: 12,
                  lineHeight: "18px",
                  fontFamily:
                    "ui-monospace, SFMono-Regular, SF Mono, Menlo, Monaco, Consolas, Liberation Mono, monospace",
                  background: "#030712",
                  border: "1px solid #1F2937",
                  borderRadius: 10,
                  padding: 16
                }
              },
              selectedFile.code
            )
          )
        : React.createElement(
            "p",
            {
              style: {
                margin: 0,
                fontSize: 13,
                lineHeight: "20px",
                color: "#D1D5DB"
              }
            },
            "No source snippet is exposed for this story yet. Add ",
            React.createElement("code", null, "parameters.storybookCodePanel.files"),
            " or ",
            React.createElement("code", null, "parameters.docs.source.code"),
            " to control the snippet shown here."
          )
    )
  );
}

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: "Code",
    render: ({ active }) => React.createElement(CodeSnippetPanel, { active: Boolean(active) })
  });
});
