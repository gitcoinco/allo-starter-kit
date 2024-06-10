import z from "zod";
import { Address, isAddress } from "viem";

export const EthAddressSchema = z.custom<Address>(
  (val) => isAddress(val as Address),
  "Invalid address",
);
