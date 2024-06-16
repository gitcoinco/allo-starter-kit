import type { Meta, StoryObj } from "@storybook/react";
import { RoundDetails } from "@allo/kit";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Rounds/Details",
  component: RoundDetails,
  parameters: {
    layout: "centered",
  },
  argTypes: {},
  args: {},
} satisfies Meta<typeof RoundDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "0xf89aad3fad6c3e79ffa3ccc835620fcc7e55f919",
    opts: { chainId: 10 },
  },
};
