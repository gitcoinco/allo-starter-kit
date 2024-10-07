import type { Meta, StoryObj } from "@storybook/react";
import { DiscoverRounds } from "./discover";

const meta = {
  title: "Legacy/Rounds/Discover",
  component: DiscoverRounds,
  parameters: {
    layout: "centered",
  },
  // tags: ["autodocs"],
  argTypes: {},
  args: {},
} satisfies Meta<typeof DiscoverRounds>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    query: {
      where: {
        chainId: { in: [10] },
        applications: { where: { status: { in: ["APPROVED"] } } },
      },
      orderBy: { unique_donors_count: "desc" },
      offset: 0,
      first: 6,
    },
  },
};
