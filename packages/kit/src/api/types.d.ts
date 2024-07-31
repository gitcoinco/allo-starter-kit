import { Address, Hash, WalletClient } from "viem";
import z from "zod";
import {
  ApplicationSchema,
  ProjectSchema,
  RoundSchema,
} from "./providers/grants-stack";

type OrderBy = "asc" | "desc";

type RoundOrderKeys =
  | "created_at_block"
  | "funded_amount_in_usd"
  | "funded_amount"
  | "match_amount_in_usd"
  | "match_amount"
  | "matching_distribution"
  | "total_amount_donated_in_usd"
  | "total_donations_count"
  | "unique_donors_count";

type ProjectOrderKeys = "name" | "created_at_block";
type ApplicationOrderKeys =
  | "created_at_block"
  | "status"
  | "status_updated_at_block"
  | "total_donations_count"
  | "total_amount_donated_in_usd"
  | "unique_donors_count";

interface Query<T> {
  orderBy?: Partial<Record<T, OrderBy>>;
  offset?: number;
  first?: number;
}
export interface RoundsQuery extends Query<RoundOrderKeys> {
  where?: RoundQueryWhere;
}
export interface ProjectsQuery extends Query<ProjectOrderKeys> {
  where?: RoundQueryWhere;
}
export interface ApplicationsQuery extends Query<ApplicationOrderKeys> {
  where?: ApplicationQueryWhere;
}
export interface RolesQuery extends Query<string> {
  where?: RolesQueryWhere;
}
type Compare<T = string | number> = {
  equalTo?: T;
  in?: T[];
  contains?: T[];
  gte?: number;
};
type RolesQueryWhere = {
  address?: Compare<Address>;
  role?: Compare<"ADMIN" | "MANAGER">;
};
type ApplicationQueryWhere = {
  chainId?: Compare<number>;
  status?: Compare<ApplicationStatus>;
  roundId?: Compare<string>;
  projectId?: Compare<string>;
  createdByAddress?: Compare<Address>;
  totalDonationsCount?: Compare<number>;
  totalAmountDonatedInUsd?: Compare<number>;
};
type RoundQueryWhere = {
  id?: Compare;
  strategy?: Compare<Address>;
  strategyName?: Compare<
    | "allov2.DirectGrantsLiteStrategy"
    | "allov2.DonationVotingMerkleDistributionDirectTransferStrategy"
    | "allov2.SQFSuperFluidStrategy"
  >;
  chainId?: Compare<number>;
  tags?: Compare<"allo-v1" | "allo-v2" | "grants-stack">; // GrantsStack only (create a type in gs to extend)
  roundId?: Compare;
  createdAt?: Compare;
  createdBy?: Compare;
  applicationsStartTime?: Compare;
  donationsStartTime?: Compare;
  donationsEndTime?: Compare;
  donationsEndTime?: Compare;
  applications?: ApplicationsQuery;
  roles?: RolesQuery;
  and?: RoundQueryWhere[];
};

// For passing random data to the request in API provider (for example chainId)
export type QueryOpts = Record<string, string | number>;
export type Allocation = { id: string; amount?: number };
export type Ballot = Record<string, Allocation>;

export interface API {
  rounds: (query: RoundsQuery) => Promise<Round[]>;
  roundById: (id: string, opts?: QueryOpts) => Promise<Round | undefined>;
  createRound: (
    data: RoundInput,
    signer: WalletClient,
  ) => Promise<RoundCreated>;
  projects: (query: ProjectsQuery) => Promise<Project[]>;
  projectById: (id: string, opts?: QueryOpts) => Promise<Project | undefined>;
  createProject: (
    data: ProjectInput,
    signer: WalletClient,
  ) => Promise<ProjectCreated>;
  applications: (query: ApplicationsQuery) => Promise<Application[]>;
  applicationById: (
    id: string,
    opts?: QueryOpts,
  ) => Promise<Application | undefined>;
  createApplication: (
    data: ApplicationInput,
    signer: WalletClient,
  ) => Promise<ApplicationCreated>;
  ballot: () => Promise<Ballot>;
  addToBallot: (ballot: Ballot) => Promise<Ballot>;
  saveBallot: (ballot: Ballot) => Promise<Ballot>;
  allocate: (
    tx: TransactionInput,
    signer: WalletClient,
  ) => Promise<Address | undefined>;
  distribute: () => void;
  upload: (data: Record<string, unknown> | File | FormData) => Promise<string>;
  sendTransaction: (
    tx: { to: `0x${string}`; data: `0x${string}`; value: string | bigint },
    signer?: WalletClient, // TODO: Use something more generic than WalletClient?
  ) => Promise<Hash>;
}
// Transforms data from API into a common shape

type BaseRound = {
  token?: Address;
  strategy: Address;
  managers?: Address[];
};

export type Round = z.infer<typeof RoundSchema>;
export type RoundInput = BaseRound & {
  metadata: { protocol: bigint; pointer: string };
  initStrategyData?: Address;
  amount?: bigint;
};
export type RoundCreated = { id: string; chainId: number };

type BaseApplication = {};
export type ApplicationStatus =
  | "APPROVED"
  | "PENDING"
  | "REJECTED"
  | "CANCELLED"
  | "IN_REVIEW";

export type Application = z.infer<typeof ApplicationSchema>;
export type ApplicationInput = BaseApplication & {
  roundId: bigint;
  strategyData?: Address;
};

export type ApplicationCreated = { id: string; chainId: number };

type BaseProject = {
  name: string;
  description?: string;
  logoImg?: string;
  bannerImg?: string;
};

export type Project = z.infer<typeof ProjectSchema>;
export type ProjectInput = BaseProject & {};

export type ProjectCreated = { id: string; chainId: number };

export type AllocateInput = {
  roundId: string;
  data: `0x${string}`;
};

export type TransactionInput = {
  to: `0x${string}`;
  data: `0x${string}`;
  value: string | bigint;
};
