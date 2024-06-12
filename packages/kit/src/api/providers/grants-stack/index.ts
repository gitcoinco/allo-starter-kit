import { request } from "graphql-request";
import { API, Application, Project, Round, Transformers } from "../../types";
import {
  roundsQuery,
  applicationsQuery,
  roundsByIdQuery,
  projectsQuery,
  projectsByIdQuery,
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
    }).then((res) => transformers.round(res.round));
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
    }).then((res) => transformers.application(res.application));
  },
  projects: (query) => {
    return request<{ rounds: GSProject[] }>({
      url: apiURL,
      document: projectsQuery,
      variables: queryToFilter(query),
    }).then((res) => (res?.rounds ?? []).map(transformers.project));
  },
  projectById: (id, opts) => {
    return request<{ project: GSProject }>({
      url: apiURL,
      document: projectsByIdQuery,
      variables: {
        id,
        chainId: Number(opts?.chainId),
      },
    }).then((res) => transformers.project(res.project));
  },
};

function validateDate(date?: string) {
  return date && isValid(new Date(date)) ? date : undefined;
}
const transformers: Transformers<GSRound, GSApplication, GSProject> = {
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
  }: GSRound): Round => ({
    id,
    chainId,
    name: name || title || "?",
    description: description || eligibility?.description,
    applications,
    matching: { amount: BigInt(matchAmount), token: matchTokenAddress },
    strategy: getAddress(strategyAddress),
    phases: {
      roundStart: validateDate(applicationsStartTime),
      allocateStart: validateDate(donationsStartTime),
      distributeStart: validateDate(donationsEndTime),
      roundEnd: validateDate(donationsEndTime),
    },
  }),

  application: ({
    id,
    chainId,
    status,
    project,
  }: GSApplication): Application => {
    return {
      id,
      chainId,
      name: project?.metadata?.title,
      description: project?.metadata?.description,
      projectId: project?.id,
      status,
      avatarUrl: ipfsGateway(project?.metadata.logoImg),
      bannerUrl: ipfsGateway(project?.metadata.bannerImg),
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
