import * as React from "react";
import { addons, types, useStorybookApi, useStorybookState } from "storybook/manager-api";

const ADDON_ID = "geist/code-snippet";
const PANEL_ID = `${ADDON_ID}/panel`;

function getSourceCode(parameters: Record<string, any> | undefined) {
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

function CodeSnippetPanel({ active }: { active: boolean }) {
  const api = useStorybookApi();
  const { storyId } = useStorybookState();

  if (!active) {
    return null;
  }

  const entry = storyId ? api.getData(storyId) : undefined;
  const parameters = storyId ? (api.getParameters(storyId) as Record<string, any> | undefined) : undefined;
  const sourceCode = getSourceCode(parameters);
  const heading = entry && "title" in entry ? `${entry.title} / ${entry.name}` : "Current story";

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
          "Code Snippet"
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
        )
      ),
      sourceCode
        ? React.createElement(
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
            sourceCode
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
            React.createElement("code", null, "parameters.docs.source.code"),
            " if you want to control the exact snippet shown here."
          )
    )
  );
}

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: "Code Snippet",
    render: ({ active }) => React.createElement(CodeSnippetPanel, { active: Boolean(active) })
  });
});
