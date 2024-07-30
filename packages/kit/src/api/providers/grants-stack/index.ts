import { request } from "graphql-request";
import { API, Application, Project, Round, Transformers } from "../../types";
import {
  roundsQuery,
  applicationsQuery,
  roundsByIdQuery,
  projectsQuery,
  applicationsByIdQuery,
} from "./queries";
import { ipfsGateway, queryToFilter } from "./utils";
import { GSRound, GSApplication, GSProject } from "./types";
import { isValid } from "date-fns";
import { getAddress } from "viem";

const apiURL = "https://grants-stack-indexer-v2.gitcoin.co/graphql";

export const grantsStackAPI: Partial<API> = {
  rounds: async (query) => {
    return request<{ rounds: GSRound[] }>({
      url: apiURL,
      document: roundsQuery,
      variables: queryToFilter(query),
    }).then((res) => (res?.rounds ?? []).map(transformers.round));
  },
  roundById: (id, opts) => {
    return request<{ round: GSRound }>({
      url: apiURL,
      document: roundsByIdQuery,
      variables: {
        id,
        chainId: Number(opts?.chainId),
      },
    }).then((res) => (res.round ? transformers.round(res.round) : undefined));
  },
  applications: (query) => {
    return request<{ applications: GSApplication[] }>({
      url: apiURL,
      document: applicationsQuery,
      variables: queryToFilter(query),
    }).then((res) => (res?.applications ?? []).map(transformers.application));
  },
  applicationById: (id, opts) => {
    return request<{ application: GSApplication }>({
      url: apiURL,
      document: applicationsByIdQuery,
      variables: {
        id,
        chainId: Number(opts?.chainId),
        roundId: opts?.roundId,
      },
    }).then((res) =>
      res.application ? transformers.application(res.application) : undefined,
    );
  },
  projects: (query) => {
    return request<{ rounds: GSProject[] }>({
      url: apiURL,
      document: projectsQuery,
      variables: queryToFilter(query),
    }).then((res) => (res?.rounds ?? []).map(transformers.project));
  },
  projectById: (id, opts) => {
    return request<{ projects: GSProject[] }>({
      url: apiURL,
      // Query projectById requires chainId and doesn't always match with the rounds chainId
      document: projectsQuery,
      variables: {
        first: 1,
        filter: { id: { equalTo: id }, projectType: { equalTo: "CANONICAL" } },
      },
    }).then((res) =>
      res.projects?.[0] ? transformers.project(res.projects?.[0]) : undefined,
    );
  },
};

function validateDate(date?: string) {
  return date && isValid(new Date(date)) ? date : undefined;
}

/* 
TODO: Are these transformers really needed if we only use Grants Indexer? 
Is it simpler and easier to just use the shape from the Indexer without re-mapping?

A better approach would be to use a Zod schema that handles the validation and parsing:
- BigInt
- getAddress
- validateDate
- ipfsGateway

const RoundSchema = z.object({
  ...
  matching: z.object({ amount: z.coerce.bigint(), token: z.string().transform(getAddress). })
  bannerImage: z.string().transform(ipfsGateway)
  ...
})
  
And then each request simply parses the schema:

}).then(mapSchema(RoundSchema, "rounds"))
}).then(mapSchema(ApplicationSchema, "application"))

const mapSchema = (schema: z.Schema, key: string) => (res) => {
  const items = Array.isArray(res[key]) ? res[key] : [res[key]];
  return items.map((item) => schema.safeParse(item).data);
};


If that's too clever, we can just call it inline for each request like this:

(res => res?.rounds?.map(round => RoundSchema.safeParse(round).data)

*/
export const transformers: Transformers<GSRound, GSApplication, GSProject> = {
  round: ({
    id,
    chainId,
    roundMetadata: { name, title, description, eligibility },
    matchAmount,
    matchTokenAddress,
    applications,
    applicationsStartTime,
    applicationsEndTime,
    donationsStartTime,
    donationsEndTime,
    strategyAddress,
    strategyName,
  }: GSRound): Round => ({
    id,
    chainId,
    name: name || title || "?",
    description: description || eligibility?.description,
    eligibility: eligibility,
    applications,
    matching: { amount: BigInt(matchAmount), token: matchTokenAddress },
    strategy: getAddress(strategyAddress),
    strategyName,
    phases: {
      applicationsStartTime: validateDate(applicationsStartTime),
      applicationsEndTime: validateDate(applicationsEndTime),
      donationsStartTime: validateDate(donationsStartTime),
      donationsEndTime: validateDate(donationsEndTime),
    },
  }),
  application: ({
    id,
    chainId,
    status,
    answers,
    project,
    anchorAddress,
    totalAmountDonatedInUsd,
    uniqueDonorsCount,
  }: GSApplication): Application => {
    return {
      id,
      chainId,
      name: project?.metadata?.title,
      description: project?.metadata?.description,
      projectId: project?.id,
      status,
      answers,
      recipient: anchorAddress,
      avatarUrl: ipfsGateway(project?.metadata.logoImg),
      bannerUrl: ipfsGateway(project?.metadata.bannerImg),
      contributors: {
        count: uniqueDonorsCount,
        amount: totalAmountDonatedInUsd,
      },
    };
  },

  project: ({ id, chainId, name, metadata }: GSProject): Project => ({
    id,
    chainId,
    name,
    description: metadata?.description,
    avatarUrl: ipfsGateway(metadata.logoImg),
    bannerUrl: ipfsGateway(metadata?.bannerImg),
  }),
};
