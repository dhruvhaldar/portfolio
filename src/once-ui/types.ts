// Base size types
export type TShirtSizes = "xs" | "s" | "m" | "l" | "xl";

// Spacing and sizing types
export type StaticSpacingToken =
  | "0"
  | "1"
  | "2"
  | "4"
  | "8"
  | "12"
  | "16"
  | "20"
  | "24"
  | "32"
  | "40"
  | "48"
  | "56"
  | "64"
  | "80"
  | "104"
  | "128"
  | "160";

export type ResponsiveSpacingToken = TShirtSizes;
export type SpacingToken = StaticSpacingToken | ResponsiveSpacingToken;

// Visual effect types
export type ShadowSize = TShirtSizes;

// Color system types
export type ColorScheme =
  | "neutral"
  | "brand"
  | "accent"
  | "info"
  | "danger"
  | "warning"
  | "success";

export type ColorCategory = "on-solid" | "on-background";
export type ColorWeight = "weak" | "medium" | "strong";

// Border radius types
export type RadiusSize = TShirtSizes | "full";
export type RadiusNest = "4" | "8";

// Typography types
export type TextType = "body" | "heading" | "display" | "label" | "code";
export type TextWeight = "default" | "strong";
export type TextSize = TShirtSizes;
export type TextVariant = `${TextType}-${TextWeight}-${TextSize}`;

// Layout types
export type gridColumns =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12;

export type flex =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12;