import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "system",
  useSystemColorMode: false,
};

const font =
  "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

export const theme = extendTheme({
  config,
  fonts: { heading: font, body: font },
  colors: {
    yellow: {
      light: "#FFE094",
      default: "#FFD369",
      dark: "#FFC029",
    },
    gray: {
      light: "#EEEEEE",
      light_dark: "#838a96",
      default: "#393E46",
      dark: "#222831",
    },
  },
  semanticTokens: {
    colors: {
      "app.bg": { default: "#F4F5F7", _dark: "#222831" },
      "app.surface": { default: "#FFFFFF", _dark: "#2D333B" },
      "app.surfaceHover": { default: "#FAFAFB", _dark: "#343B44" },
      "app.border": { default: "#E5E7EB", _dark: "#434A54" },
      "app.text": { default: "#222831", _dark: "#EEEEEE" },
      "app.muted": { default: "#838a96", _dark: "#9AA1AD" },
      "app.accent": { default: "#FFD369", _dark: "#FFD369" },
      "app.accentText": { default: "#222831", _dark: "#222831" },
    },
  },
  styles: {
    global: {
      "body.chakra-ui-dark": { colorScheme: "dark" }, // dark date pickers / scrollbars
      body: {
        bg: "app.bg",
        color: "app.text",
        transition: "background-color .3s ease, color .3s ease",
      },
    },
  },
});
