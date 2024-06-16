import type { Meta, StoryObj } from "@storybook/react";
import { ApplicationReviewTable } from "@allo/kit";
import { application } from "@/data/applications";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Applications/Review",
  component: ApplicationReviewTable,
  parameters: {},
  argTypes: {},
  args: {},
} satisfies Meta<typeof ApplicationReviewTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    roundId: application.roundId,
    chainId: application.chainId,
    initialTab: "APPROVED",
  },
};
