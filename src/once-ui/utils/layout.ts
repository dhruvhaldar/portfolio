import { ColorScheme, ColorWeight, SpacingToken, TextVariant } from "../types";

const STATIC_SPACING = new Set([
  "0",
  "1",
  "2",
  "4",
  "8",
  "12",
  "16",
  "20",
  "24",
  "32",
  "40",
  "48",
  "56",
  "64",
  "80",
  "104",
  "128",
  "160",
]);

const RESPONSIVE_SIZES = new Set(["xs", "s", "m", "l", "xl"]);

const SURFACE_VALUES = new Set(["surface", "page", "overlay"]);

export const parseDimension = (
  value: number | SpacingToken | undefined,
  type: "width" | "height",
): string | undefined => {
  if (value === undefined) return undefined;
  if (typeof value === "number") return `${value}rem`;
  if (STATIC_SPACING.has(value as string)) {
    return `var(--static-space-${value})`;
  }
  if (RESPONSIVE_SIZES.has(value as string)) {
    return `var(--responsive-${type}-${value})`;
  }
  return undefined;
};

// Simple cache for variants
const variantCache: Record<string, string[]> = {};

export const getVariantClasses = (variant: TextVariant): string[] => {
  if (variantCache[variant]) return variantCache[variant];
  const [fontType, weight, size] = variant.split("-");
  const classes = [`font-${fontType}`, `font-${weight}`, `font-${size}`];
  variantCache[variant] = classes;
  return classes;
};

export const generateFlexClass = (
  type: string,
  value: string | undefined,
): string | undefined => {
  if (!value) return undefined;

  if (value === "transparent") {
    return `transparent-border`;
  }

  if (SURFACE_VALUES.has(value)) {
    return `${value}-${type}`;
  }

  const hyphenIndex = value.indexOf("-");
  if (hyphenIndex === -1) return undefined;

  const scheme = value.substring(0, hyphenIndex);
  const rest = value.substring(hyphenIndex + 1);

  return `${scheme}-${type}-${rest}`;
};

export const generateGridClass = (
  type: string,
  value: string | "-1" | undefined,
): string | undefined => {
  if (!value) return undefined;

  if (value === "transparent") {
    return `transparent-${type}`;
  }

  if (SURFACE_VALUES.has(value)) {
    return `${value}-${type}`;
  }

  const hyphenIndex = value.indexOf("-");
  if (hyphenIndex === -1) return undefined;

  const scheme = value.substring(0, hyphenIndex);
  const rest = value.substring(hyphenIndex + 1);

  return `${scheme}-${type}-${rest}`;
};

export const generateTextSpacerClass = (
  prefix: string,
  token: SpacingToken | undefined,
): string | undefined => {
  return token ? `${prefix}-${token}` : undefined;
};
