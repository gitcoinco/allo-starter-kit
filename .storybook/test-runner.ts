import type { TestRunnerConfig } from "@storybook/test-runner";
import { injectAxe, checkA11y } from "axe-playwright";
import { accessibilityTestsEnabled } from "../config/storybook";

const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page);
  },
  async postVisit(page) {
    if (accessibilityTestsEnabled) {
      await checkA11y(page, "#storybook-root", {
        detailedReport: true,
        detailedReportOptions: {
          html: true,
        },
      });
    } else {
      console.log("Accessibility tests are skipped.");
    }
  },
};

export default config;
