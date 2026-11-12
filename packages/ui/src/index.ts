/**
 * Shared design tokens for web and mobile. Placeholder values until the
 * product and design lead lands the brand; components import from here so
 * the brand swap is one file.
 */
export const colors = {
  brand: "#7C3AED",
  brandContrast: "#FFFFFF",
  surface: "#FFFFFF",
  surfaceDark: "#0B0B10",
  text: "#111118",
  textDark: "#F4F4F8",
  danger: "#DC2626",
} as const;

export const radii = { sm: 6, md: 10, lg: 16, pill: 999 } as const;
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

export type ColorToken = keyof typeof colors;
