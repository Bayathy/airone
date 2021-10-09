/**
 * @jest-environment jsdom
 */

import { render, waitFor } from "@testing-library/react";
import React from "react";

import { WebhookForm } from "./WebhookForm.js";

test("should render a component with essential props", async () => {
  jest
    .spyOn(require("../../utils/AironeAPIClient"), "getWebhooks")
    .mockResolvedValueOnce({
      json() {
        return Promise.resolve([]);
      },
    });

  await waitFor(() => {
    expect(() => render(<WebhookForm entityId={"0"} />)).not.toThrow();
  });

  jest.clearAllMocks();
});
