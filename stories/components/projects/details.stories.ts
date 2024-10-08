import type { Meta, StoryObj } from "@storybook/react";
import { ProjectDetails, ProjectDetailsWithHook } from "../../../src";
import { application } from "../../mocks/data/applications";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Legacy/Projects/Details",
  component: ProjectDetailsWithHook,
  parameters: {
    layout: "centered",
  },
  argTypes: {},
  args: {},
} satisfies Meta<typeof ProjectDetailsWithHook>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: application.projectId,
    opts: { chainId: application.chainId },
  },
};
