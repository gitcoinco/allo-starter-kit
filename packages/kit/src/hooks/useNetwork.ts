import { useChainId } from "wagmi";
import { supportedChains } from "..";

export function useNetwork() {
  const chainId = useChainId();
  const network = supportedChains.find((chain) => chain.id === chainId);
  return network;
}
