import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { API, ApiProvider, Web3Provider } from ".";
import { vi } from "vitest";

vi.mock("posthog-js/react", () => {
  return { PostHogProvider: ({ children }) => children };
});

const mockApi: API = {
  roundById: async () => ({
    id: "test",
    name: "Test Round",
  }),
};
const Providers = ({ children }: { children: React.ReactNode }) => {
  return <ApiProvider api={mockApi}>{children}</ApiProvider>;
  return (
    <Web3Provider>
      <ApiProvider api={mockApi}>{children}</ApiProvider>
    </Web3Provider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: Providers, ...options });

export * from "@testing-library/react";
export { customRender as render };
