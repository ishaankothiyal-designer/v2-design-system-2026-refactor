import * as React from "react";
import { addons, types, useStorybookApi, useStorybookState } from "storybook/manager-api";
import { create } from "storybook/theming";

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
    }
  }

  return undefined;
}

type CodeToken = {
  color: string;
  value: string;
};

const codeColors = {
  attribute: "#9CDCFE",
  boolean: "#4FC1FF",
  comment: "#6A9955",
  default: "#D4D4D4",
  function: "#DCDCAA",
  keyword: "#F472B6",
  dim: "#9CA3AF",
  gutter: "#5B6475",
  jsx: "#4FC1FF",
  number: "#B5CEA8",
  punctuation: "#808AA0",
  string: "#CE9178"
} as const;

const keywordPattern =
  /\b(import|from|export|function|const|let|var|return|if|else|null|undefined|type|interface|extends|as|new)\b/g;
const booleanPattern = /\b(true|false)\b/g;
const commentPattern = /\/\/.*$/g;
const stringPattern = /(["'`])(?:\\.|(?!\1).)*\1/g;
const numberPattern = /\b\d+(?:\.\d+)?\b/g;
const jsxPattern = /<\/?[A-Za-z][A-Za-z0-9._-]*/g;
const functionPattern = /\b[A-Za-z_$][A-Za-z0-9_$]*(?=\()/g;
const punctuationPattern = /[{}[\]().,;:=<>/]/g;

function addMatches(
  line: string,
  matches: Array<{ color: string; end: number; priority: number; start: number }>,
  expression: RegExp,
  color: string,
  priority: number,
  captureGroup = 0
) {
  for (const match of line.matchAll(expression)) {
    if (match.index === undefined) {
      continue;
    }

    const captured = match[captureGroup];
    if (!captured) {
      continue;
    }

    const offset = captureGroup === 0 ? 0 : match[0].indexOf(captured);
    const start = match.index + Math.max(offset, 0);

    matches.push({
      start,
      end: start + captured.length,
      color,
      priority
    });
  }
}

function buildTokens(line: string) {
  const matches: Array<{ color: string; end: number; priority: number; start: number }> = [];

  addMatches(line, matches, commentPattern, codeColors.comment, 7);
  addMatches(line, matches, stringPattern, codeColors.string, 6);
  addMatches(line, matches, jsxPattern, codeColors.jsx, 5);
  addMatches(
    line,
    matches,
    /(?:^|[\s<(])([A-Za-z_:][A-Za-z0-9:._-]*)(?==)/g,
    codeColors.attribute,
    4,
    1
  );
  addMatches(line, matches, keywordPattern, codeColors.keyword, 3);
  addMatches(line, matches, booleanPattern, codeColors.boolean, 3);
  addMatches(line, matches, numberPattern, codeColors.number, 2);
  addMatches(line, matches, functionPattern, codeColors.function, 1);
  addMatches(line, matches, punctuationPattern, codeColors.punctuation, 0);

  matches.sort((left, right) => left.start - right.start || right.priority - left.priority || right.end - left.end);

  const filtered: typeof matches = [];
  for (const match of matches) {
    const overlaps = filtered.some(
      (existing) => match.start < existing.end && match.end > existing.start
    );

    if (!overlaps) {
      filtered.push(match);
    }
  }

  const tokens: CodeToken[] = [];
  let cursor = 0;

  for (const match of filtered) {
    if (cursor < match.start) {
      tokens.push({ value: line.slice(cursor, match.start), color: codeColors.default });
    }

    tokens.push({
      value: line.slice(match.start, match.end),
      color: match.color
    });
    cursor = match.end;
  }

  if (cursor < line.length) {
    tokens.push({ value: line.slice(cursor), color: codeColors.default });
  }

  if (tokens.length === 0) {
    tokens.push({ value: line, color: codeColors.default });
  }

  return tokens;
}

function renderCodeLine(line: string, lineNumber: number) {
  const printableLine = line.length > 0 ? line : " ";

  return React.createElement(
    "div",
    {
      key: `${lineNumber}-${line}`,
      style: {
        display: "grid",
        gridTemplateColumns: "48px minmax(0, 1fr)",
        alignItems: "start",
        gap: 16
      }
    },
    React.createElement(
      "span",
      {
        style: {
          color: codeColors.gutter,
          fontSize: 13,
          lineHeight: "24px",
          textAlign: "right",
          userSelect: "none",
          paddingRight: 4
        }
      },
      String(lineNumber)
    ),
    React.createElement(
      "span",
      {
        style: {
          color: codeColors.default,
          fontSize: 13,
          lineHeight: "24px",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word"
        }
      },
      buildTokens(printableLine).map((token, index) =>
        React.createElement(
          "span",
          {
            key: `${lineNumber}-${index}`,
            style: { color: token.color }
          },
          token.value
        )
      )
    )
  );
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
        background:
          "radial-gradient(circle at top left, rgba(30, 41, 59, 0.55), transparent 32%), #09090B",
        color: "#E5E7EB",
        padding: 20,
        boxSizing: "border-box"
      }
    },
    React.createElement(
      "div",
      {
        style: {
          display: "grid",
          gap: 16,
          minHeight: "100%"
        }
      },
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "0 4px"
          }
        },
        React.createElement("div", { style: { display: "grid", gap: 6 } },
          React.createElement(
            "strong",
            {
              style: {
                fontSize: 14,
                lineHeight: "20px",
                color: "#F9FAFB"
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
                color: codeColors.dim
              }
            },
            heading
          )
        ),
        React.createElement(
          "span",
          {
            style: {
              alignSelf: "start",
              border: "1px solid rgba(148, 163, 184, 0.18)",
              borderRadius: 999,
              color: "#CBD5E1",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.04em",
              lineHeight: "16px",
              padding: "5px 10px",
              textTransform: "uppercase",
              background: "rgba(15, 23, 42, 0.72)"
            }
          },
          "tsx"
        )
      ),
      sourceCode
        ? React.createElement(
            "div",
            {
              style: {
                minHeight: "calc(100vh - 120px)",
                background: "linear-gradient(180deg, rgba(10, 10, 14, 0.98), rgba(8, 8, 12, 1))",
                border: "1px solid rgba(148, 163, 184, 0.12)",
                borderRadius: 18,
                boxShadow: "0 18px 48px rgba(0, 0, 0, 0.28)",
                overflow: "hidden"
              }
            },
            React.createElement(
              "div",
              {
                style: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "14px 18px",
                  borderBottom: "1px solid rgba(148, 163, 184, 0.1)",
                  background:
                    "linear-gradient(180deg, rgba(17, 24, 39, 0.9), rgba(10, 10, 14, 0.75))"
                }
              },
              React.createElement(
                "div",
                {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 8
                  }
                },
                React.createElement("span", {
                  style: {
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    background: "#FF5F56",
                    boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.18) inset"
                  }
                }),
                React.createElement("span", {
                  style: {
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    background: "#FFBD2E",
                    boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.18) inset"
                  }
                }),
                React.createElement("span", {
                  style: {
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    background: "#27C93F",
                    boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.18) inset"
                  }
                })
              ),
              React.createElement(
                "span",
                {
                  style: {
                    color: "#D1D5DB",
                    fontSize: 12,
                    lineHeight: "16px",
                    flex: 1,
                    textAlign: "center"
                  }
                },
                heading
              ),
              React.createElement(
                "span",
                {
                  style: {
                    color: codeColors.dim,
                    fontSize: 12,
                    lineHeight: "16px"
                  }
                },
                `${sourceCode.split("\n").length} lines`
              )
            ),
            React.createElement(
              "div",
              {
                style: {
                  padding: "18px 20px 24px",
                  background:
                    "linear-gradient(180deg, rgba(12, 12, 16, 0.96), rgba(8, 8, 12, 1))",
                  fontFamily:
                    "ui-monospace, SFMono-Regular, SF Mono, Menlo, Monaco, Consolas, Liberation Mono, monospace"
                }
              },
              React.createElement(
                "div",
                {
                  style: {
                    borderLeft: "1px solid rgba(148, 163, 184, 0.08)",
                    marginLeft: 34,
                    paddingLeft: 14
                  }
                },
                sourceCode.split("\n").map((line, index) => renderCodeLine(line, index + 1))
              )
            )
          )
        : React.createElement(
            "p",
            {
              style: {
                margin: 0,
                fontSize: 13,
                lineHeight: "20px",
                color: "#D1D5DB",
                background: "rgba(17, 24, 39, 0.84)",
                border: "1px solid rgba(148, 163, 184, 0.12)",
                borderRadius: 14,
                padding: 16
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
  addons.setConfig({
    theme: create({
      base: "dark",
      appBg: "#09090B",
      appContentBg: "#09090B",
      appPreviewBg: "#09090B",
      appHoverBg: "#111827",
      appBorderColor: "rgba(148, 163, 184, 0.12)",
      appBorderRadius: 14,
      textColor: "#E5E7EB",
      textMutedColor: "#94A3B8",
      textInverseColor: "#09090B",
      barBg: "#111111",
      barTextColor: "#A1A1AA",
      barHoverColor: "#F8FAFC",
      barSelectedColor: "#60A5FA",
      colorPrimary: "#60A5FA",
      colorSecondary: "#38BDF8",
      buttonBg: "#111827",
      buttonBorder: "rgba(148, 163, 184, 0.14)",
      booleanBg: "#0F172A",
      booleanSelectedBg: "#1D4ED8",
      inputBg: "#09090B",
      inputBorder: "rgba(148, 163, 184, 0.14)",
      inputTextColor: "#E5E7EB",
      inputBorderRadius: 12,
      fontBase:
        "'Inter', 'SF Pro Text', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
      fontCode:
        "ui-monospace, SFMono-Regular, SF Mono, Menlo, Monaco, Consolas, Liberation Mono, monospace"
    })
  });

  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: "Code Snippet",
    render: ({ active }) => React.createElement(CodeSnippetPanel, { active: Boolean(active) })
  });
});
