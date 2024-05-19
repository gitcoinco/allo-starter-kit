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
  AND?: RoundQueryWhere[];
};

// For passing random data to the request in API provider (for example chainId)
export type QueryOpts = Record<string, string | number>;
export type Allocation = { id: string; amount?: number };
export type Ballot = Record<string, Allocation>;

export interface API {
  rounds: (query: RoundsQuery) => Round[];
  roundById: (id: string, opts?: QueryOpts) => Round | undefined;
  projects: (query: RoundsQuery) => Project[];
  projectById: (id: string, opts?: QueryOpts) => Project | undefined;
  applications: (query: RoundsQuery) => Application[];
  ballot: () => Ballot | undefined;
  addToBallot: (ballot: Ballot) => Ballot;
  saveBallot: (ballot: Ballot) => Ballot;
  allocate: () => void;
  distribute: () => void;
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
};
export type Application = {
  id: string;
  chainId: number;
  projectId: string;
  name: string;
  description?: string;
  coverImageUrl?: string;
};
export type Project = {
  id: string;
  name: string;
  chainId: number;
  description?: string;
  coverImageUrl?: string;
};
