// import "@testing-library/jest-dom";
import { describe, test, expect } from "vitest";
import { render, screen } from "../../test-utils";
import { RoundDetails } from "../details";

describe("Round Details", async () => {
  test("render", async () => {
    render(
      <RoundDetails
        {...{
          id: "id",
        }}
      />,
    );
    screen.debug();
    // expect(true).toBe(false);
    //   // ARRANGE  //   render(<Fetch url="/greeting" />)

    //   // ACT
    //   await userEvent.click(screen.getByText('Load Greeting'))
    //   await screen.findByRole('heading')

    //   // ASSERT
    //   expect(screen.getByRole('heading')).toHaveTextContent('hello there')
    //   expect(screen.getByRole('button')).toBeDisabled()
  });
});
