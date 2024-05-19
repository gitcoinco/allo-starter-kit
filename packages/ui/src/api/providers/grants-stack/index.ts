import { request } from "graphql-request";
import { API, Application, Project, Round, Transformers } from "../types";
import {
  roundsQuery,
  applicationsQuery,
  roundsByIdQuery,
  projectsQuery,
  projectsByIdQuery,
} from "./queries";
import { ipfsGateway, queryToFilter } from "./utils";
import { GSRound, GSApplication, GSProject } from "./types";

const apiURL = "https://grants-stack-indexer-v2.gitcoin.co/graphql";

export const grantsStackAPI: Partial<API> = {
  rounds: (query) => {
    return request({
      url: apiURL,
      document: roundsQuery,
      variables: queryToFilter(query),
    }).then((res: { rounds: GSRound[] }) =>
      (res?.rounds ?? []).map(transformers.round)
    );
  },
  roundById: (id: string, opts) => {
    return request({
      url: apiURL,
      document: roundsByIdQuery,
      variables: {
        id,
        chainId: Number(opts?.chainId),
      },
    }).then((res: { round: GSRound }) => transformers.round(res.round));
  },
  applications: (query) => {
    return request({
      url: apiURL,
      document: applicationsQuery,
      variables: queryToFilter(query),
    }).then((res: { applications: GSApplication[] }) =>
      (res?.applications ?? []).map(transformers.application)
    );
  },
  projects: (query) => {
    return request({
      url: apiURL,
      document: projectsQuery,
      variables: queryToFilter(query),
    }).then((res: { rounds: GSProject[] }) =>
      (res?.rounds ?? []).map(transformers.project)
    );
  },
  projectById: (id: string, opts) => {
    return request({
      url: apiURL,
      document: projectsByIdQuery,
      variables: {
        id,
        chainId: Number(opts?.chainId),
      },
    }).then((res: { project: GSProject }) => transformers.project(res.project));
  },
};

const transformers: Transformers<GSRound, GSApplication, GSProject> = {
  round: ({
    id,
    chainId,
    roundMetadata: {
      name,
      eligibility: { description },
    },
    applications,
  }: GSRound): Round => ({ id, chainId, name, description, applications }),

  application: ({ id, chainId, project }: GSApplication): Application => {
    return {
      id,
      chainId,
      name: project?.metadata?.title,
      description: project?.metadata?.description,
      projectId: project?.id,
      coverImageUrl: ipfsGateway(project?.metadata.bannerImg),
    };
  },

  project: ({ id, chainId, name, metadata }: GSProject): Project => ({
    id,
    chainId,
    name,
    description: metadata?.description,
    coverImageUrl: ipfsGateway(metadata?.bannerImg),
  }),
};
