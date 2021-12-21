/**
 * @jest-environment jsdom
 */

import { render } from "@testing-library/react";
import React from "react";

import { TestWrapper } from "../../utils/TestWrapper";

import { UserForm } from "./UserForm";

test("should render a component with essential props", function () {
  // TODO avoid to pass the global variable implicitly
  window.django_context = {
    user: {
      is_superuser: false,
    },
  };

  expect(() => render(<UserForm />, { wrapper: TestWrapper })).not.toThrow();
});
