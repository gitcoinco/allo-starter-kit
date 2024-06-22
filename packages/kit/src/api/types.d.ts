import { Address, Hash, WalletClient } from "viem";

type OrderBy = "asc" | "desc";

interface Query {
  orderBy?: { [key: string]: OrderBy };
  skip?: number;
  take?: number;
}
export interface RoundsQuery extends Query {
  where?: RoundQueryWhere;
}
type Compare<T = string | number> = {
  equals?: T;
  in?: T[];
  contains?: T[];
  gte?: number;
};
type RoundQueryRolesWhere = {
  address?: Compare;
  role?: Compare;
};
type RoundQueryApplicationsWhere = {
  status?: Compare;
};
type RoundQueryWhere = {
  id?: Compare;
  strategy?: Compare;
  strategyName?: Compare<
    | "allov2.DirectGrantsLiteStrategy"
    | "allov2.DonationVotingMerkleDistributionDirectTransferStrategy"
    | "allov2.SQFSuperFluidStrategy"
  >;
  chainId?: Compare;
  tags?: Compare; // GrantsStack only (create a type in gs to extend)
  roundId?: Compare;
  status?: Compare;
  createdAt?: Compare;
  createdBy?: Compare;
  roundStart?: Compare;
  allocateStart?: Compare;
  distributeStart?: Compare;
  roundEnd?: Compare;
  application?: RoundQueryApplicationsWhere;
  roles?: RoundQueryRolesWhere;
  AND?: RoundQueryWhere[];
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
  projects: (query: RoundsQuery) => Promise<Project[]>;
  projectById: (id: string, opts?: QueryOpts) => Promise<Project | undefined>;
  createProject: (
    data: ProjectInput,
    signer: WalletClient,
  ) => Promise<ProjectCreated>;
  applications: (query: RoundsQuery) => Promise<Application[]>;
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
  upload: (data: FormData) => Promise<string>;
  sendTransaction: (
    tx: { to: `0x${string}`; data: `0x${string}`; value: string | bigint },
    signer: WalletClient, // TODO: Use something more generic than WalletClient?
  ) => Promise<Hash>;
}
// Transforms data from API into a common shape

export interface Transformers<TRound, TApplication, TProject> {
  round: (round: TRound) => Round;
  application: (application: TApplication) => Application;
  project: (project: TProject) => Project;
}

type BaseRound = {
  token?: Address;
  strategy: Address;
  managers?: Address[];
};
export type Round = BaseRound & {
  id: string;
  name: string;
  description: string;
  bannerUrl?: string;
  chainId: number;
  applications?: { id: string }[];
  matching: { amount: bigint; token: Address };
  avatarUrl?: string;
  bannerUrl?: string;
  strategyName?: string;
  phases: {
    roundStart?: string;
    allocateStart?: string;
    distributeStart?: string;
    roundEnd?: string;
  };
};

export type RoundInput = BaseRound & {
  metadata: { protocol: bigint; pointer: string };
  initStrategyData?: Address;
  amount?: bigint;
};
export type RoundCreated = { id: string; chainId: number };

type BaseApplication = {};
export type Application = BaseApplication & {
  id: string;
  name: string;
  description?: string;
  recipient: Address;
  avatarUrl?: string;
  bannerUrl?: string;
  chainId: number;
  projectId: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
};

export type ApplicationInput = BaseApplication & {
  roundId: bigint;
  strategyData?: Address;
};

export type ApplicationCreated = { id: string; chainId: number };

type BaseProject = {
  name: string;
  description?: string;
  avatarUrl?: string;
  bannerUrl?: string;
};
export type Project = BaseProject & {
  id: string;
  chainId: number;
};
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
