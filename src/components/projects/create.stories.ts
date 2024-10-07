import type { Meta, StoryObj } from "@storybook/react";
import { CreateProject } from "./create";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Legacy/Projects/Create",
  component: CreateProject,
  parameters: {
    // layout: "centered",
  },
  argTypes: {},
  args: {},
} satisfies Meta<typeof CreateProject>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { onCreated: () => null },
};
