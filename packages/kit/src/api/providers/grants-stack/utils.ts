import { RoundsQuery } from "../../types";

export const ipfsGateway = (cid: string) =>
  `https://gateway.pinata.cloud/ipfs/${cid}`;

export function queryToFilter(query: RoundsQuery) {
  const orderBy = Object.entries(query.orderBy ?? {})[0]
    ?.map((v) => v.toUpperCase())
    .join("_");
  return {
    filter: renameKeys(query, {
      AND: "and",
      equals: "equalTo",
      gte: "greaterThanOrEqualTo",
    }).where,
    offset: query.skip,
    first: query.take,
    orderBy,
  };
}

function renameKeys(
  query: RoundsQuery,
  keys: Record<string, string>,
): RoundsQuery {
  function rename(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(rename);
    } else if (obj !== null && typeof obj === "object") {
      return Object.keys(obj).reduce((acc, key) => {
        const renamedKey = keys[key] || key;
        acc[renamedKey] = rename(obj[key]);
        return acc;
      }, {} as any);
    } else {
      return obj;
    }
  }

  return rename(query) as RoundsQuery;
}
