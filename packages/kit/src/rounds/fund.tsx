"use client";

import { useForm } from "react-hook-form";
import { QueryOpts, Round } from "../api/types";
import { useRoundById } from "../hooks/useRounds";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { TokenAmount } from "../ui/token-amount";
import { supportedChains } from "../wagmi/provider";
import { Address, formatUnits, getAddress, zeroAddress } from "viem";
import { TToken } from "@gitcoin/gitcoin-chain-data";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { NATIVE } from "@allo-team/allo-v2-sdk";
import { useToken } from "../hooks/useToken";

type RoundFundProps = {
  id: string;
  opts?: QueryOpts;
};

export function getNetworkToken(round?: Round) {
  return supportedChains?.reduce<Partial<TToken>>(
    (match, chain) => {
      const token = (chain.tokens ?? {}).find((token) => {
        return (
          round?.chainId === chain.id &&
          token.address === round?.matching?.token
        );
      });

      return token || match;
    },
    { code: "", decimals: 0, icon: "" },
  );
}

function PoolAmount({ round }: { round?: Round }) {
  const token = getNetworkToken(round);
  if (token) {
    const amount = round?.matching.amount ?? BigInt(0);
    return (
      <>
        {amount && formatUnits(amount, token?.decimals ?? 0)} {token?.code}
      </>
    );
  }
  // Token not found in the listed ones in config - query the network
  if (round)
    return (
      <TokenBalance
        address={round.strategy}
        token={getAddress(round?.matching.token!)}
      />
    );

  return null;
}

export function FundRound({ id, opts }: RoundFundProps) {
  const { data, isPending } = useRoundById(id, opts);
  if (isPending) return <div>Loading...</div>;
  if (!data) return <div>Round not found</div>;
  return (
    <section className="mx-auto max-w-sm">
      <div>
        Pool amount: <PoolAmount round={data} />
      </div>
      <FundForm
        funded={data?.matching.amount}
        token={getAddress(data?.matching?.token!)}
      />
    </section>
  );
}

function useTokenBalance(opts: { address?: Address; token?: Address }) {
  const token = [zeroAddress, NATIVE].includes(opts.token?.toLowerCase()!)
    ? undefined
    : opts.token;

  return useBalance({ address: opts.address, token });
}

function TokenBalance({
  address,
  token,
}: {
  address?: Address;
  token?: Address;
}) {
  const { data: balance } = useTokenBalance({ address, token });
  return (
    <>{balance && formatUnits(balance?.value, balance?.decimals).slice(0, 6)}</>
  );
}

function TokenSymbol() {}

function FundForm({ funded, token }: { funded?: bigint; token?: Address }) {
  const { address } = useAccount();
  const form = useForm();

  const { data } = useToken({ token });
  console.log("data", data);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          console.log("Fund pool");
        })}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <div className="relative flex items-center">
                  <Input placeholder="0" {...field} />
                  <div className="absolute right-2 p-2 text-muted-foreground">
                    {token?.code}
                  </div>
                </div>
              </FormControl>
              <FormDescription>
                Wallet balance: <TokenBalance address={address} token={token} />
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
          Fund
        </Button>
      </form>
    </Form>
  );
}
