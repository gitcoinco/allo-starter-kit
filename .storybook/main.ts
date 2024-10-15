import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/features/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../stories/ui/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../stories/components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
    "@storybook/addon-themes",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {},
  core: {
    disableTelemetry: true, // 👈 Used to ignore update notifications.
  },
};
export default config;
