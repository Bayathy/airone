/**
 * @jest-environment jsdom
 */

import { render } from "@testing-library/react";
import React from "react";

import { UserList } from "./UserList";

test("should render a component with essential props", function () {
  expect(() => render(<UserList users={[]} />)).not.toThrow();
});
