import { RoundsQuery } from "../../types";

export const ipfsGateway = (cid: string) =>
  cid?.includes("http") ? cid : `https://gateway.pinata.cloud/ipfs/${cid}`;

export function queryToFilter(query: RoundsQuery) {
  const orderBy = Object.entries(query.orderBy ?? {})[0]
    ?.map((v) => v.toUpperCase())
    .join("_");

  const filter = renameKeys(query, {
    AND: "and",
    OR: "or",
    NOT: "not",
    equals: "equalTo",
    gte: "greaterThanOrEqualTo",
    createdBy: "createdByAddress",
    roundStart: "applicationsStartTime",
    allocateStart: "donationsStartTime",
    distributeStart: "donationsEndTime",
    roundEnd: "donationsEndTime",
  }).where;

  return {
    filter: removeEmpty(omit(filter, ["application", "roles"])),
    application_filter: pick(filter, ["application"])?.application,
    roles_filter: pick(filter, ["roles"])?.roles,
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
function removeEmpty(obj: unknown) {
  return Object.keys(obj as {}).length ? obj : undefined;
}
function omit(obj: unknown, keys: string[]) {
  return Object.fromEntries(
    Object.entries(obj as {}).filter(([key]) => !keys.includes(key)),
  );
}
function pick(obj: unknown, keys: string[]) {
  return Object.fromEntries(
    Object.entries(obj as {}).filter(([key]) => keys.includes(key)),
  );
}
