import z from "zod";

import { StrategyExtension } from "..";
import { supportedChains } from "../..";

export const quadraticFunding: StrategyExtension = {
  name: "Quadratic Funding",
  type: "quadraticFunding",
  // Deployed strategy contract address for networks
  contracts: supportedChains.reduce(
    (acc, x) => ({ ...acc, [x.id]: x.contracts.quadraticFunding }),
    {},
  ),
  components: {
    createRound: {
      schema: z.any(),
      component: () => <div>QF Component</div>,
    },
  },
};
