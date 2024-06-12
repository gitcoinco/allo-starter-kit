import { useChainId } from "wagmi";
import { supportedChains } from "../wagmi";

export function useNetwork() {
  const chainId = useChainId();
  const network = supportedChains?.find((chain) => chain.id === chainId);
  return network;
}
