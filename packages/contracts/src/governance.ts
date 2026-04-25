import type { GovernanceRule } from "./types";

export const governanceRules: GovernanceRule[] = [
  {
    id: "rule.approved-entities-only",
    title: "Approved entities only",
    description:
      "Generated UI must use approved design-system entities. No freeform invention is allowed."
  },
  {
    id: "rule.tokens-owned-in-code",
    title: "Tokens owned in code",
    description:
      "Token values are authoritative in code and JSON. Figma variables must mirror, not originate, token truth."
  },
  {
    id: "rule.canonical-mapping",
    title: "Canonical mapping",
    description:
      "Each Figma component must map 1:1 to a canonical code component with preserved identity, variants, states, and token bindings."
  },
  {
    id: "rule.theme-safe",
    title: "Theme safe",
    description:
      "Theme and brand overrides may adjust approved token scopes only. They must not break canonical contracts."
  },
  {
    id: "rule.brand-alt-scope",
    title: "Brand alt scope",
    description:
      "Brand alt color tokens are reserved for solid and outline button treatments plus approved input-field and text-field components only."
  },
  {
    id: "rule.registry-first",
    title: "Registry first",
    description:
      "Storybook and the contracts package must expose queryable metadata for future AI composition workflows."
  }
];
