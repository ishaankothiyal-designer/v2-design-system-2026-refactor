import { designSystemRegistry } from "./registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

const allEntityIds = new Set<string>();
const componentIds = new Set<string>();
const widgetIds = new Set<string>();
const pageIds = new Set<string>();

for (const component of designSystemRegistry.components) {
  assert(
    !allEntityIds.has(component.canonicalId),
    `Duplicate canonical ID: ${component.canonicalId}`
  );
  allEntityIds.add(component.canonicalId);
  componentIds.add(component.canonicalId);
  assert(component.figmaComponentName.length > 0, `Missing Figma mapping for ${component.canonicalId}`);
  assert(component.tokenBindings.length > 0, `Missing token bindings for ${component.canonicalId}`);
}

for (const widget of designSystemRegistry.widgets) {
  assert(!allEntityIds.has(widget.canonicalId), `Duplicate canonical ID: ${widget.canonicalId}`);
  allEntityIds.add(widget.canonicalId);
  widgetIds.add(widget.canonicalId);
}

for (const page of designSystemRegistry.pages) {
  assert(!allEntityIds.has(page.canonicalId), `Duplicate canonical ID: ${page.canonicalId}`);
  allEntityIds.add(page.canonicalId);
  pageIds.add(page.canonicalId);
}

for (const flow of designSystemRegistry.flows) {
  assert(!allEntityIds.has(flow.canonicalId), `Duplicate canonical ID: ${flow.canonicalId}`);
  allEntityIds.add(flow.canonicalId);
}

for (const widget of designSystemRegistry.widgets) {
  for (const child of widget.composition) {
    assert(
      componentIds.has(child),
      `Widget ${widget.canonicalId} references unknown child entity: ${child}`
    );
  }
  for (const allowed of widget.allowedChildren) {
    assert(
      componentIds.has(allowed),
      `Widget ${widget.canonicalId} declares unknown allowed child: ${allowed}`
    );
  }
}

for (const page of designSystemRegistry.pages) {
  for (const item of page.composition) {
    assert(widgetIds.has(item), `Page ${page.canonicalId} references unknown entity: ${item}`);
  }
}

for (const flow of designSystemRegistry.flows) {
  for (const pageId of flow.pages) {
    assert(
      pageIds.has(pageId),
      `Flow ${flow.canonicalId} references unknown page: ${pageId}`
    );
  }
}

console.log("Registry validation passed.");
