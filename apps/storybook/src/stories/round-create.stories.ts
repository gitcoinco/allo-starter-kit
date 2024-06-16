import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { CreateRound } from "@allo/kit";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Rounds/Create",
  component: CreateRound,
  parameters: {},
  argTypes: {},
  args: {},
} satisfies Meta<typeof CreateRound>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // strategies: ["0x79A5EEc2C87Cd2116195E71af7A38647f89C8Ffa"],
    onCreated: fn(),
  },
};
