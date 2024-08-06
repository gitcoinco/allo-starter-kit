import { request } from "graphql-request";
import type {
  API,
  Application,
  Donation,
  Project,
  Round,
  Transformers,
} from "../../types";
import {
  roundsQuery,
  applicationsQuery,
  roundsByIdQuery,
  projectsQuery,
  applicationsByIdQuery,
  donationsQuery,
} from "./queries";
import { ipfsGateway, queryToFilter } from "./utils";
import type { GSRound, GSApplication, GSProject, GSDonation } from "./types";
import { isValid } from "date-fns";
import { getAddress } from "viem";

const apiURL = "https://grants-stack-indexer-v2.gitcoin.co/graphql";

export const indexer: API["indexer"] = {
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
  donations: (query) => {
    return request<{ donations: GSDonation[] }>({
      url: apiURL,
      document: donationsQuery,
      variables: queryToFilter(query),
    }).then((res) => (res?.donations ?? []).map(transformers.donation));
  },
};

function validateDate(date?: string) {
  return date && isValid(new Date(date)) ? date : undefined;
}

export const transformers: Transformers<
  GSRound,
  GSApplication,
  GSProject,
  GSDonation
> = {
  round: ({
    id,
    chainId,
    roundMetadata,
    matchAmount,
    matchTokenAddress,
    applications,
    applicationsStartTime,
    applicationsEndTime,
    donationsStartTime,
    donationsEndTime,
    strategyAddress,
    strategyName,
    roles,
  }: GSRound): Round => {
    const { name, title, description, eligibility } = roundMetadata || {};
    return {
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
      roles,
    };
  },
  application: ({
    id,
    chainId,
    status,
    metadata,
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
      answers: metadata?.application?.answers,
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

  donation: (donation: GSDonation): Donation => ({
    ...donation,
  }),
};
