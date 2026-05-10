import { iconCount, iconDefinitions, iconNames, type IconName } from "@turbo/icons";

export type IconVariantLabel = "Default" | "Line" | "Outline" | "Outlined" | "Fill" | "Filled";

export type IconEntry = {
  name: IconName;
  variantLabel: IconVariantLabel;
  pathCount: number;
  code: number;
  aliases: readonly string[];
};

export type IconFamily = {
  key: string;
  label: string;
  icons: IconEntry[];
};

const variantSuffixes: Array<[suffix: string, label: IconVariantLabel]> = [
  ["-filled", "Filled"],
  ["-outline", "Outline"],
  ["-outlined", "Outlined"],
  ["-line", "Line"],
  ["-fill", "Fill"]
];

const variantOrder: Record<IconVariantLabel, number> = {
  Default: 0,
  Line: 1,
  Outline: 2,
  Outlined: 3,
  Fill: 4,
  Filled: 5
};

function splitIconName(name: IconName) {
  for (const [suffix, label] of variantSuffixes) {
    if (name.endsWith(suffix)) {
      const familyKey = name.slice(0, -suffix.length);

      if (familyKey) {
        return {
          familyKey,
          variantLabel: label
        };
      }
    }
  }

  return {
    familyKey: name,
    variantLabel: "Default" as const
  };
}

function toDisplayLabel(value: string) {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function compareNaturally(left: string, right: string) {
  return left.localeCompare(right, undefined, { numeric: true, sensitivity: "base" });
}

function buildIconFamilies(): IconFamily[] {
  const families = new Map<string, IconEntry[]>();

  for (const name of iconNames) {
    const definition = iconDefinitions[name];
    const { familyKey, variantLabel } = splitIconName(name);
    const familyIcons = families.get(familyKey) ?? [];

    familyIcons.push({
      name,
      variantLabel,
      pathCount: definition.pathCount,
      code: definition.code,
      aliases: definition.aliases
    });

    families.set(familyKey, familyIcons);
  }

  return [...families.entries()]
    .map(([key, icons]) => ({
      key,
      label: toDisplayLabel(key),
      icons: [...icons].sort((left, right) => {
        const variantDifference = variantOrder[left.variantLabel] - variantOrder[right.variantLabel];

        if (variantDifference !== 0) {
          return variantDifference;
        }

        return compareNaturally(left.name, right.name);
      })
    }))
    .sort((left, right) => compareNaturally(left.key, right.key));
}

export const totalIconCount = iconCount;
export const iconFamilies = buildIconFamilies();
export const totalIconFamilyCount = iconFamilies.length;
export const multicolorIconCount = iconNames.filter((name) => iconDefinitions[name].pathCount > 1).length;
