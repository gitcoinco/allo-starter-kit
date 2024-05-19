import type { RoundQuery } from "../..";

export const ipfsGateway = (cid: string) =>
  `https://gateway.pinata.cloud/ipfs/${cid}`;

export function queryToFilter(query: RoundQuery) {
  const orderBy = Object.entries(query.orderBy ?? {})[0]
    ?.map((v) => v.toUpperCase())
    .join("_");
  return {
    filter: renameKeys(query, {
      equals: "equalTo",
      gte: "greaterThanOrEqualTo",
    }).where,
    offset: query.skip,
    first: query.take,
    orderBy,
  };
}

function renameKeys(
  query: RoundQuery,
  keys: Record<string, string>
): RoundQuery {
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

  return rename(query) as RoundQuery;
}
