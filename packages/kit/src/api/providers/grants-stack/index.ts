import { request } from "graphql-request";
import { API } from "../../types";
import {
  roundsQuery,
  applicationsQuery,
  roundsByIdQuery,
  projectsQuery,
  applicationsByIdQuery,
} from "./queries";
import { ipfsGateway, queryToFilter } from "./utils";
import { isValid } from "date-fns";
import z from "zod";
import { EthAddressSchema } from "../../../schemas";

const apiURL = "https://grants-stack-indexer-v2.gitcoin.co/graphql";

export const grantsStackAPI: Partial<API> = {
  rounds: async (query) => {
    return request({
      url: apiURL,
      document: roundsQuery,
      variables: queryToFilter(query),
    }).then(mapSchema(RoundSchema, "rounds"));
  },
  roundById: (id, opts) => {
    return request({
      url: apiURL,
      document: roundsByIdQuery,
      variables: {
        id,
        chainId: Number(opts?.chainId),
      },
    }).then(mapSchema(RoundSchema, "round"));
  },
  applications: (query) => {
    return request({
      url: apiURL,
      document: applicationsQuery,
      variables: queryToFilter(query),
    }).then(mapSchema(ApplicationSchema, "applications"));
  },
  applicationById: (id, opts) => {
    return request({
      url: apiURL,
      document: applicationsByIdQuery,
      variables: {
        id,
        chainId: Number(opts?.chainId),
        roundId: opts?.roundId,
      },
    }).then(mapSchema(ApplicationSchema, "application"));
  },
  projects: (query) => {
    return request({
      url: apiURL,
      document: projectsQuery,
      variables: queryToFilter(query),
    }).then(mapSchema(ProjectSchema, "projects"));
  },
  projectById: (id, opts) => {
    return request({
      url: apiURL,
      // Query projectById requires chainId and doesn't always match with the rounds chainId
      document: projectsQuery,
      variables: {
        first: 1,
        filter: { id: { equalTo: id }, projectType: { equalTo: "CANONICAL" } },
      },
    }).then(mapSchema(ProjectSchema, "project"));
  },
};

function mapSchema(schema: z.Schema, key: string) {
  return (res: unknown) => {
    const _items = (res as Record<string, unknown>)?.[key];
    const items = Array.isArray(_items) ? _items : [_items];
    const { data, error } = z.array(schema).safeParse(items);

    console.log(data, error, items);
    if (error) {
      throw new Error(JSON.stringify(error, null, 2));
    }
    return Array.isArray(_items) ? data : data?.[0];
  };
}

function validateDate(date?: string) {
  return date && isValid(new Date(date)) ? date : undefined;
}

const RoundMetadataSchema = z.object({
  name: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  eligibility: z.object({
    description: z.string().optional(),
    requirements: z.array(z.object({ requirement: z.string() })).optional(),
  }),
  quadraticFundingConfig: z.object({
    matchingCap: z.boolean(),
    sybilDefense: z.boolean(),
    matchingCapAmount: z.number().optional(),
    minDonationThreshold: z.boolean().optional(),
    matchingFundsAvailable: z.number(),
    minDonationThresholdAmount: z.number().optional(),
  }),
});

export const RoundSchema = z.object({
  id: z.string(),
  chainId: z.number(),
  tags: z.array(z.string()),
  roundMetadata: RoundMetadataSchema,
  roundMetadataCid: z.string(),
  applicationsStartTime: z.string().transform(validateDate),
  applicationsEndTime: z.string().transform(validateDate),
  donationsStartTime: z.string().transform(validateDate),
  donationsEndTime: z.string().transform(validateDate),
  matchAmountInUsd: z.number(),
  matchAmount: z.any(),
  matchTokenAddress: EthAddressSchema,
  strategyId: z.string(),
  strategyName: z.string(),
  strategyAddress: EthAddressSchema,
  applications: z.array(z.object({ id: z.string() })).optional(),
});
const AnswersSchema = z.array(
  z.object({
    questionId: z.number(),
    type: z.string(),
    answer: z.string().optional(),
    hidden: z.boolean(),
    question: z.string(),
  }),
);
const ProjectMetadataSchema = z.object({
  title: z.string(),
  website: z.string(),
  logoImg: z.string().optional(),
  bannerImg: z
    .string()
    .optional()
    .transform((cid) => (cid ? ipfsGateway(cid) : null)),
  createdAt: z.number(),
  credentials: z.any(), // ?
  description: z.string(),
  lastUpdated: z.number().optional(),
  projectTwitter: z.string().optional(),
});
const ApplicationMetadataSchema = z.object({
  signature: z.string(),
  application: z.object({
    round: z.string(),
    answers: AnswersSchema.optional(),
    recipient: z.string(),
    project: ProjectMetadataSchema,
  }),
});

export const ApplicationSchema = z.object({
  id: z.string(),
  chainId: z.number(),
  roundId: z.string(),
  projectId: z.string(),
  status: z.enum(["APPROVED", "PENDING"]),
  totalAmountDonatedInUsd: z.number(),
  uniqueDonorsCount: z.number(),
  totalDonationsCount: z.number(),
  round: RoundSchema,
  metadata: ApplicationMetadataSchema,
  anchorAddress: z.string().nullish(),
  project: z.object({
    tags: z.array(z.string()),
    id: z.string(),
    metadata: ProjectMetadataSchema,
  }),
});

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  projectType: z.enum(["CANONICAL"]),
  chainId: z.number(),
  createdByAddress: z.string(),
  metadata: ProjectMetadataSchema,
});
