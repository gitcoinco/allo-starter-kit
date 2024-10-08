import type { Meta, StoryObj } from "@storybook/react";
import { ApplicationCard } from "../../../src";
import { application } from "../../mocks/data/applications";

const meta = {
  title: "Legacy/Applications/Card",
  component: ApplicationCard,
  parameters: {
    layout: "centered",
  },
  argTypes: {},
  args: {},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof ApplicationCard>;

export const Default: Story = {
  args: application,
};

export const Contributors: Story = {
  args: { ...application, components: ["contributors"] },
};

export const ContributorsAdd: Story = {
  args: { ...application, components: ["contributors", "add_button"] },
};
