export type DesignLayer = "token" | "component" | "widget" | "page" | "flow";
export type CanonicalStatus = "draft" | "approved" | "deprecated" | "blocked" | "unsupported";
export type Platform = "web" | "native" | "shared";

export interface GovernanceRule {
  id: string;
  title: string;
  description: string;
}

export interface TokenBinding {
  slot: string;
  token: string;
}

export interface CanonicalEntity {
  canonicalId: string;
  canonicalName: string;
  layer: DesignLayer;
  status: CanonicalStatus;
  platform: Platform;
  figmaComponentName?: string;
  description: string;
}

export interface ComponentContract extends CanonicalEntity {
  layer: "component";
  figmaComponentName: string;
  webExport: string;
  nativeExport: string;
  variants: Array<{
    name: string;
    values: string[];
  }>;
  states: string[];
  tokenBindings: TokenBinding[];
  themeScopes: string[];
}

export interface WidgetContract extends CanonicalEntity {
  layer: "widget";
  composition: string[];
  allowedChildren: string[];
}

export interface PageContract extends CanonicalEntity {
  layer: "page";
  composition: string[];
}

export interface FlowContract extends CanonicalEntity {
  layer: "flow";
  pages: string[];
}

export interface DesignSystemRegistry {
  governance: GovernanceRule[];
  components: ComponentContract[];
  widgets: WidgetContract[];
  pages: PageContract[];
  flows: FlowContract[];
}

