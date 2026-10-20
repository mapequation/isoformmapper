import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

// Restore the Chakra v2 "blue" palette (anchored on #3182CE). Chakra v3's
// default blue is Tailwind-style (#3b82f6 at 500), which reads slightly
// cooler and less saturated than the mapequation brand blue.
const config = defineConfig({
  globalCss: {
    // Chakra v3's solid Button hover is `colorPalette.solid/90` (90% alpha of
    // the resting bg). With our remap of `gray.solid` to the v2 light-gray
    // (gray.100), that alpha-blend is visually identical to the rest state on
    // a light page — buttons look dead. Define explicit hover/active steps
    // here. `!important` is needed because Chakra puts globalCss into the
    // `base` cascade layer and the variant's hover rule lives in `recipes`,
    // which comes after `base` in the layer order — recipes wins without it.
    ".chakra-button:not(:disabled, [data-disabled]):is(:hover, [data-hover])": {
      bg: "gray.200 !important",
    },
    ".chakra-button:not(:disabled, [data-disabled]):active": {
      bg: "gray.300 !important",
    },
  },
  theme: {
    tokens: {
      colors: {
        blue: {
          50: { value: "#ebf8ff" },
          100: { value: "#bee3f8" },
          200: { value: "#90cdf4" },
          300: { value: "#63b3ed" },
          400: { value: "#4299e1" },
          500: { value: "#3182ce" },
          600: { value: "#2b6cb0" },
          700: { value: "#2c5282" },
          800: { value: "#2a4365" },
          900: { value: "#1a365d" },
          950: { value: "#142a4a" },
        },
      },
    },
    // Chakra v3's default gray solid Button is near-black (gray.800 bg, white
    // text). v2 rendered the default gray Button as a light gray pill
    // (gray.100 bg, gray.800 text). Remap gray's solid/contrast semantic
    // tokens to that v2 treatment so unstyled Buttons read as neutral
    // affordances, not heavy primary CTAs.
    semanticTokens: {
      colors: {
        gray: {
          solid: {
            value: { _light: "{colors.gray.100}", _dark: "{colors.gray.700}" },
          },
          contrast: {
            value: { _light: "{colors.gray.800}", _dark: "{colors.gray.100}" },
          },
        },
      },
    },
    // Default `layerStyle: "disabled"` is just opacity 0.5; on a solid button
    // that still reads as a pressable CTA. Flatten the bg to neutral so the
    // disabled state clearly cannot be pressed.
    layerStyles: {
      disabled: {
        value: {
          bg: "gray.50",
          color: "gray.400",
          borderColor: "gray.100",
          cursor: "not-allowed",
          opacity: 1,
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
