import type { Meta, StoryObj } from "@storybook/react";
import { ApplicationDetailsWithHook } from "../../../../src";
import { application } from "../../data/applications";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Legacy/Applications/Details",
  component: ApplicationDetailsWithHook,
  parameters: {
    layout: "centered",
  },
  argTypes: {},
  args: {},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof ApplicationDetailsWithHook>;

export const Default: Story = {
  args: {
    id: application.id,
    opts: { chainId: application.chainId, roundId: application.roundId },
  },
};

export const WithAction: Story = {
  args: {
    id: application.id,
    opts: { chainId: application.chainId, roundId: application.roundId },
    // action: <Button onClick={() => fn()}>Approve</Button>,
  },
};
