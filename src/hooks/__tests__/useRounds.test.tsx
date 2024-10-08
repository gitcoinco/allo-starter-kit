import { describe, test, expect } from "vitest";
import { mockCreateRound, renderHook, screen, waitFor } from "../../test-utils";

import { zeroAddress } from "viem";
import { useCreateRound } from "../useRounds";

describe("Round Hooks", async () => {
  test("useCreateRound", async () => {
    const { result } = renderHook(() => useCreateRound());

    await waitFor(() => expect(result.current?.mutateAsync).toBeDefined());
    await result.current.mutateAsync({
      strategy: zeroAddress,
      token: undefined,
      metadata: { protocol: BigInt(1), pointer: "cid" },
      managers: [],
      profileId: "0x",
    });

    expect(mockCreateRound).toHaveBeenCalled();
  });
});
