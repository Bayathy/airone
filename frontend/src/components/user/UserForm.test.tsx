/**
 * @jest-environment jsdom
 */

import { render } from "@testing-library/react";
import React from "react";

import { TestWrapper } from "../../utils/TestWrapper";

import { UserForm } from "./UserForm";

test("should render a component with essential props", function () {
  Object.defineProperty(window, "django_context", {
    value: {
      user: {
        is_superuser: false,
      },
    },
    writable: false,
  });

  expect(() => render(<UserForm />, { wrapper: TestWrapper })).not.toThrow();
});
