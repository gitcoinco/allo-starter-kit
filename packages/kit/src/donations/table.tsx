"use client";
import { UseQueryResult } from "@tanstack/react-query";
import { Application, Donation, DonationsQuery } from "../api/types";
import { DataTable } from "../ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { ReactNode, useMemo } from "react";
import { useDonations } from "../hooks/useDonations";
import { formatMoney } from "../lib/utils";
import { supportedChains } from "../api/web3-provider";
import { formatUnits, getAddress, parseUnits, zeroAddress } from "viem";
import { Button } from "../ui/button";
import { ExternalLink } from "lucide-react";

type Props = {
  query?: DonationsQuery;
};

export function DonationsTableWithHook({ query, ...props }: Props) {
  return <DonationsTable {...useDonations(query)} {...props} />;
}

function findToken(chainId: number, token: string) {
  if (token === zeroAddress) return "ETH";
  return supportedChains?.reduce((match, chain) => {
    const t = chain.tokens.find(
      (token) => chain.id === chainId && token.address === token,
    );

    console.log("token", t, token, match);

    return "asd";
  }, "");
}

export function DonationsTable({
  data = [],
  isPending,
  error,
}: Partial<UseQueryResult<Donation[] | undefined, unknown>> & Props) {
  console.log(data, error);
  console.log(supportedChains);

  const columns: ColumnDef<Donation>[] = useMemo(
    () => [
      {
        accessorKey: "amountInUsd",
        header: "USD",
        cell: ({ row }) => formatMoney(row.getValue("amountInUsd"), "usd"),
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => {
          const { tokenAddress, chainId, amount } = row.original;
          const token = findToken(chainId, tokenAddress);
          const decimals = 18;
          return <div>{formatUnits(BigInt(amount), decimals)} ETH</div>;
        },
      },

      {
        accessorKey: "donorAddress",
        header: "Donor",
      },
      {
        accessorKey: "transactionHash",
        header: "Tx",
        cell: ({ row }) => <Button variant={"ghost"} icon={ExternalLink} />,
      },
    ],
    [],
  );
  return <DataTable isLoading={isPending} columns={columns} data={data} />;
}
