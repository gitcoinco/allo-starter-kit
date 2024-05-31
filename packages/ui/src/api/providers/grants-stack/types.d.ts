import { RoundPayoutType } from "@/api/types";

type GSRoundMetadata = {
  name: string;
  eligibility: {
    description: string;
    requirements: { requirement: string }[];
  };
  quadraticFundingConfig: {
    matchingCap: true;
    sybilDefense: false;
    matchingCapAmount: 20;
    minDonationThreshold: true;
    matchingFundsAvailable: 7000;
    minDonationThresholdAmount: 1;
  };
};
export type GSRound = {
  id: string;
  chainId: number;
  tags: string;
  roundMetadata: GSRoundMetadata;
  roundMetadataCid: string;
  applicationsStartTime: string;
  applicationsEndTime: string;
  donationsStartTime: string;
  donationsEndTime: string;
  matchAmountInUsd: string;
  matchAmount: string;
  matchTokenAddress: string;
  strategyId: string;
  strategyName: RoundPayoutType;
  strategyAddress: string;
  applications: { id: string }[];
};
type GSCredential = any;
type CID = string;
type GSProjectMetadata = {
  id: string;
  title: string;
  logoImg: CID;
  website: string;
  bannerImg: CID;
  createdAt: number;
  credentials: GSCredential;
  description: string;
  lastUpdated: number;
  projectTwitter: string;
};
type GSApplicationMetadata = {
  signature: string;
  application: {
    round: string;
    answers: [];
    project: GSProjectMetadata;
    recipient: string;
  };
};
export type GSApplication = {
  id: string;
  chainId: number;
  roundId: string;
  projectId: string;
  status: "APPROVED";
  totalAmountDonatedInUsd: number;
  uniqueDonorsCount: number;
  totalDonationsCount: number;
  round: GSRound;
  metadata: GSApplicationMetadata;
  project: {
    tags: string[];
    id: string;
    metadata: GSProjectMetadata;
  };
};
export type GSProject = {
  id: string;
  name: string;
  projectType: "CANONICAL";
  chainId: 10;
  createdByAddress: string;
  metadata: GSProjectMetadata;
};
