import type { ComponentContract, DesignSystemRegistry } from "@turbo/contracts";

import { designSystemRegistry } from "./generated/design-system-registry.js";

export { designSystemRegistry };

export interface RegistrySummary {
  governanceRuleCount: number;
  componentCount: number;
  widgetCount: number;
  pageCount: number;
  flowCount: number;
}

export function getRegistry(): DesignSystemRegistry {
  return designSystemRegistry;
}

export function getRegistrySummary(registry: DesignSystemRegistry = designSystemRegistry): RegistrySummary {
  return {
    governanceRuleCount: registry.governance.length,
    componentCount: registry.components.length,
    widgetCount: registry.widgets.length,
    pageCount: registry.pages.length,
    flowCount: registry.flows.length
  };
}

export function searchComponents(query?: string): ComponentContract[] {
  const normalizedQuery = query?.trim().toLowerCase();

  if (!normalizedQuery) {
    return designSystemRegistry.components;
  }

  return designSystemRegistry.components.filter((component) => {
    const haystacks = [
      component.canonicalId,
      component.canonicalName,
      component.figmaComponentName,
      component.description,
      component.webExport,
      component.nativeExport
    ]
      .filter(Boolean)
      .map((value) => value.toLowerCase());

    return haystacks.some((value) => value.includes(normalizedQuery));
  });
}

export function getComponentByIdOrName(idOrName: string): ComponentContract | undefined {
  const normalizedTarget = idOrName.trim().toLowerCase();

  return designSystemRegistry.components.find((component) => {
    return (
      component.canonicalId.toLowerCase() === normalizedTarget ||
      component.canonicalName.toLowerCase() === normalizedTarget ||
      component.figmaComponentName.toLowerCase() === normalizedTarget
    );
  });
}
