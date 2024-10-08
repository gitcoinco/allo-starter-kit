import React from "react";
import type { Preview } from "@storybook/react";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import { initialize, mswLoader } from "msw-storybook-addon";
import { handlers } from "../src/mocks/handlers";

initialize();

import "../src/styles.css";

import { ApiProvider, Web3Provider } from "../src";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    msw: {
      handlers,
    },
  },
  loaders: [mswLoader],
  decorators: [
    withThemeByDataAttribute({
      defaultTheme: "light",
      themes: { light: "light", dark: "dark" },
      attributeName: "data-mode",
    }),
    (Story, { parameters: { theme = "light" } }) => {
      return (
        <ApiProvider>
          <Web3Provider>
            <Story />
          </Web3Provider>
        </ApiProvider>
      );
    },
  ],
};

// NOTE: Example of global loaders
// export const loaders = [
//   async () => ({
//     userData: await fetch('/api/user').then((res) => res.json()),
//   }),
// ];

export default preview;
