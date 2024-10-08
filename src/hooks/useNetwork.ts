import { useChainId } from "wagmi";
import { supportedChains } from "../services/web3-provider";

export function useNetwork() {
  const chainId = useChainId();
  const network = supportedChains?.find((chain) => chain.id === chainId);
  return network;
}
