// import "@testing-library/jest-dom";
import { describe, test, expect } from "vitest";
import { render, screen } from "../../test-utils";
import { RoundDetailsWithHook } from "../details";

describe("Round Details", async () => {
  test("render", async () => {
    render(<RoundDetailsWithHook id="id" chainId={10} />);
    screen.debug();
    // expect(true).toBe(false);
    //   // ARRANGE  //   render(<Fetch url="/greeting" />)

    //   // ACT
    //   await userEvent.click(screen.getByText('Load Greeting'))
    await screen.findByRole("heading");

    //   // ASSERT
    //   expect(screen.getByRole('heading')).toHaveTextContent('hello there')
    //   expect(screen.getByRole('button')).toBeDisabled()
  });
});
