import { governanceRules } from "./governance";
import type { DesignSystemRegistry } from "./types";

export const designSystemRegistry: DesignSystemRegistry = {
  governance: governanceRules,
  components: [
    {
      canonicalId: "component.button",
      canonicalName: "Button",
      layer: "component",
      status: "approved",
      platform: "shared",
      figmaComponentName: "Button",
      description: "Primary canonical action component.",
      webExport: "@geist/web/canonical/button",
      nativeExport: "@geist/native/canonical/button",
      variants: [
        { name: "tone", values: ["primary", "secondary", "ghost"] },
        { name: "size", values: ["sm", "md", "lg"] }
      ],
      states: ["default", "hover", "pressed", "disabled", "loading"],
      tokenBindings: [
        { slot: "container.background", token: "color.brand.primary.600" },
        { slot: "container.border", token: "color.border.default" },
        { slot: "content.text", token: "color.text.inverse" },
        { slot: "radius.container", token: "radius.md" }
      ],
      themeScopes: ["core", "acme"]
    }
  ],
  widgets: [
    {
      canonicalId: "widget.auth-card",
      canonicalName: "Auth Card",
      layer: "widget",
      status: "approved",
      platform: "shared",
      description: "Composable authentication surface built from approved components.",
      composition: ["component.button"],
      allowedChildren: ["component.button"]
    }
  ],
  pages: [
    {
      canonicalId: "page.sign-in",
      canonicalName: "Sign In",
      layer: "page",
      status: "approved",
      platform: "shared",
      description: "Login page assembled only from approved widgets and components.",
      composition: ["widget.auth-card"]
    }
  ],
  flows: [
    {
      canonicalId: "flow.authentication",
      canonicalName: "Authentication Flow",
      layer: "flow",
      status: "approved",
      platform: "shared",
      description: "A governed sequence of pages for signing in and recovery.",
      pages: ["page.sign-in"]
    }
  ]
};

