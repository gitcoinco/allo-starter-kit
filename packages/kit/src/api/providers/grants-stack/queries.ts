import { gql } from "graphql-request";

const ROUND_FRAGMENT = `
id
chainId
tags
roundMetadata
roundMetadataCid
applicationsStartTime
applicationsEndTime
donationsStartTime
donationsEndTime
matchAmountInUsd
matchAmount
matchTokenAddress
strategyId
strategyName
strategyAddress
`;
export const roundsQuery = gql`
  query Rounds($first: Int, $offset: Int, $orderBy: [RoundsOrderBy!], $filter: RoundFilter) {
    rounds(first: $first, offset: $offset, orderBy: $orderBy, filter: $filter) {
      ${ROUND_FRAGMENT}
      applications(first: 1000, filter: { status: { equalTo: APPROVED } }) {
        id
      }
    }
  }
`;
export const roundsByIdQuery = gql`
  query Round($id: String!, $chainId: Int!) {
    round(id: $id, chainId: $chainId) {
      ${ROUND_FRAGMENT}
      applications(first: 1000, filter: { status: { equalTo: APPROVED } }) {
        id
      }
    }
  }
`;

export const applicationsQuery = gql`
  query Applications(
    $first: Int
    $offset: Int
    $orderBy: [ApplicationsOrderBy!]
    $filter: ApplicationFilter
  ) {
    applications(
      first: $first
      offset: $offset
      orderBy: $orderBy
      filter: $filter
    ) {
      id
      chainId
      roundId
      projectId
      status
      totalAmountDonatedInUsd
      uniqueDonorsCount
      totalDonationsCount
      anchorAddress
      round {
        strategyName
        donationsStartTime
        donationsEndTime
        applicationsStartTime
        applicationsEndTime
        matchTokenAddress
        roundMetadata
      }
      metadata
      project: canonicalProject {
        tags
        id
        metadata
        anchorAddress
      }
    }
  }
`;

const PROJECT_FRAGMENT = `
id
name
projectType
chainId
createdByAddress
metadata
`;
export const projectsQuery = gql`
  query Projects($first: Int, $offset: Int, $orderBy: [ProjectsOrderBy!], $filter: ProjectFilter) {
    projects(first: $first, offset: $offset, orderBy: $orderBy, filter: $filter) {
      ${PROJECT_FRAGMENT}
    }
  }
`;
export const projectsByIdQuery = gql`
  query Project($id: String!, $chainId: Int!) {
    project(id: $id, chainId: $chainId) {
      ${PROJECT_FRAGMENT}
    }
  }
`;
