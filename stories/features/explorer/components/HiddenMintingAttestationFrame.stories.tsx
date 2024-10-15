import type { Meta, StoryObj } from "@storybook/react";
import { HiddenMintingAttestationFrame } from "../../../../src/features/explorer/components/HiddenMintingAttestationFrame";
import { imageBase64Mock } from "./mocks";

const meta = {
  title: "Features/Explorer/Components/MintingAttestationFrame/HiddenMintingAttestationFrame",
  component: HiddenMintingAttestationFrame,
  argTypes: {
    selectedBackground: {
      control: {
        type: "select",
      },
      options: ["background1", "background2", "background3", "background4", "background5"],
      mapping: {
        background1: "../../../src/features/explorer/assets/alt1.svg",
        background2: "../../../src/features/explorer/assets/alt2.svg",
        background3: "../../../src/features/explorer/assets/alt3.svg",
        background4: "../../../src/features/explorer/assets/alt4.svg",
        background5: "../../../src/features/explorer/assets/alt5.svg",
      },
    },
  },
  args: {
    frameId: "1",
    topRound: "OSS Round",
    projectsFunded: 22,
    roundsSupported: 3,
    checkedOutChains: 4,
    selectedBackground: "../../../src/features/explorer/assets/alt1.svg",
    projects: [
      {
        rank: 1,
        name: "Saving forests around the world",
        round: "Climate Round",
        image: "bafkreig6tpuhw7h6xeambh36afiemiqleih7q25yywdj36cvqnvpjegsqi",
      },
      {
        rank: 2,
        name: "Funding schools in Mexico",
        round: "Education Round",
        image: "bafkreig6tpuhw7h6xeambh36afiemiqleih7q25yywdj36cvqnvpjegsqi",
      },
      {
        rank: 3,
        name: "Accessible software for humans",
        round: "OSS Round",
        image: "bafkreig6tpuhw7h6xeambh36afiemiqleih7q25yywdj36cvqnvpjegsqi",
      },
    ],
    address: "0x632A9882fb748853669b94a11b05E38a6cE3D7F2",
    ensName: "fundingmaxi.ens",
    hidden: false,
    imagesBase64: [imageBase64Mock, imageBase64Mock, imageBase64Mock],
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof HiddenMintingAttestationFrame>;

export const Default: Story = {};

export const WithoutENS: Story = {
  args: {
    ensName: undefined,
  },
};

export const OneProject: Story = {
  args: {
    projects: [
      {
        rank: 1,
        name: "Saving forests around the world",
        round: "Climate Round",
        image: "bafkreig6tpuhw7h6xeambh36afiemiqleih7q25yywdj36cvqnvpjegsqi",
      },
    ],
  },
};

export const TwoProjects: Story = {
  args: {
    projects: [
      {
        rank: 1,
        name: "Saving forests around the world",
        round: "Climate Round",
        image: "bafkreig6tpuhw7h6xeambh36afiemiqleih7q25yywdj36cvqnvpjegsqi",
      },
      {
        rank: 2,
        name: "Funding schools in Mexico",
        round: "Education Round",
        image: "bafkreig6tpuhw7h6xeambh36afiemiqleih7q25yywdj36cvqnvpjegsqi",
      },
    ],
  },
};

export const ThreeProjects: Story = {
  args: {
    projects: [
      {
        rank: 1,
        name: "Saving forests around the world",
        round: "Climate Round",
        image: "bafkreig6tpuhw7h6xeambh36afiemiqleih7q25yywdj36cvqnvpjegsqi",
      },
      {
        rank: 2,
        name: "Funding schools in Mexico",
        round: "Education Round",
        image: "bafkreig6tpuhw7h6xeambh36afiemiqleih7q25yywdj36cvqnvpjegsqi",
      },
      {
        rank: 3,
        name: "Accessible software for humans",
        round: "OSS Round",
        image: "bafkreig6tpuhw7h6xeambh36afiemiqleih7q25yywdj36cvqnvpjegsqi",
      },
    ],
  },
};

export const WithLongNames: Story = {
  args: {
    ensName: "fundingmaxisomelongname.ens",
    frameId: "1",
    topRound:
      "OSS Round Extended to overflow until it ellipsis or there is no space but actually there is a lot of space",
    projectsFunded: 1000000,
    roundsSupported: 1000000,
    checkedOutChains: 1000000,
    projects: [
      {
        rank: 1,
        name: "Saving forests around the world",
        round: "Climate Round long name extended to overflow",
        image: "bafkreig6tpuhw7h6xeambh36afiemiqleih7q25yywdj36cvqnvpjegsqi",
      },
      {
        rank: 2,
        name: "Funding schools in Mexico",
        round: "Education Round",
        image: "bafkreig6tpuhw7h6xeambh36afiemiqleih7q25yywdj36cvqnvpjegsqi",
      },
      {
        rank: 3,
        name: "Accessible software for humans",
        round: "OSS Round",
        image: "bafkreig6tpuhw7h6xeambh36afiemiqleih7q25yywdj36cvqnvpjegsqi",
      },
    ],
  },
};
