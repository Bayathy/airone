/**
 * @jest-environment jsdom
 */

import { render } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";

import { EntryReferral } from "components/entry/EntryReferral";
import { TestWrapper } from "utils/TestWrapper";

afterEach(() => {
  jest.clearAllMocks();
});

test("should render a component with essential props", async () => {
  const entryId = 1;

  const referredEntries = {
    entries: [
      {
        id: 1,
        name: "name",
        entity: "entity",
      },
    ],
  };

  jest
    .spyOn(require("utils/AironeAPIClient"), "getReferredEntries")
    .mockResolvedValue({
      json() {
        return Promise.resolve(referredEntries);
      },
    });

  expect(() =>
    render(
      <BrowserRouter>
        <EntryReferral entryId={entryId} />
      </BrowserRouter>,
      { wrapper: TestWrapper }
    )
  ).not.toThrow();
});
