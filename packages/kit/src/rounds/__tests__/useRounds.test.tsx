import { describe, test, expect } from "vitest";
import { mockCreateRound, renderHook, screen, waitFor } from "../../test-utils";
import { useCreateRound } from "../..";

import { zeroAddress } from "viem";
describe("Round Hooks", async () => {
  test("render", async () => {
    const { result } = renderHook(() => useCreateRound());

    await waitFor(() => expect(result.current?.mutateAsync).toBeDefined());
    await result.current.mutateAsync({
      strategy: zeroAddress,
      token: undefined,
      metadata: { protocol: BigInt(1), pointer: "cid" },
      managers: [],
    });
    console.log(result);

    expect(mockCreateRound).toHaveBeenCalled();
  });
});
