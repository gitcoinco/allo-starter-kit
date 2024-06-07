import { Address, WalletClient } from "viem";

type OrderBy = "asc" | "desc";

interface Query {
  orderBy?: { [key: string]: OrderBy };
  skip?: number;
  take?: number;
}
export interface RoundsQuery extends Query {
  where?: RoundQueryWhere;
}
type Compare = {
  equals?: string;
  in?: (string | number)[];
  contains?: (string | number)[];
  gte?: number;
};
type RoundQueryWhere = {
  id?: Compare;
  strategy?: Compare;
  chainId?: Compare;
  tags?: Compare; // GrantsStack only (create a type in gs to extend)
  roundId?: Compare;
  status?: Compare;
  createdAt?: Compare;
  roundStart?: Compare;
  allocateStart?: Compare;
  distributeStart?: Compare;
  roundEnd?: Compare;
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
  applications: (query: RoundsQuery) => Promise<Application[]>;
  applicationById: (
    id: string,
    opts?: QueryOpts,
  ) => Promise<Project | undefined>;
  ballot: () => Promise<Ballot | Error>;
  addToBallot: (ballot: Ballot) => Promise<Ballot | Error>;
  saveBallot: (ballot: Ballot) => Promise<Ballot | Error>;
  allocate: () => void;
  distribute: () => void;
  uploadMetadata: (data: unknown) => Promise<string>;
}
// Transforms data from API into a common shape

export interface Transformers<TRound, TApplication, TProject> {
  round: (round: TRound) => Round;
  application: (application: TApplication) => Application;
  project: (project: TProject) => Project;
}

export type Round = {
  id: string;
  chainId: number;
  name: string;
  description: string;
  strategy?: { name?: string; address: string };
  applications?: { id: string }[];
  matching: { amount: bigint; token: string };
  avatarUrl?: string;
  bannerUrl?: string;
  phases: {
    roundStart?: string;
    allocateStart?: string;
    distributeStart?: string;
    roundEnd?: string;
  };
};

export type RoundInput = {
  name: string;
  description?: string;
  strategyAddress: Address;
  tokenAddress?: Address;
  bannerUrl?: string;
  chainId: number;
  managers?: Address[];
  initStrategyData: Record<string, unknown>;
};
export type RoundCreated = { id: string; chainId: number };
export type Application = {
  id: string;
  chainId: number;
  projectId: string;
  name: string;
  description?: string;
  avatarUrl?: string;
  bannerUrl?: string;
};
export type Project = {
  id: string;
  name: string;
  chainId: number;
  description?: string;
  avatarUrl?: string;
  bannerUrl?: string;
};
