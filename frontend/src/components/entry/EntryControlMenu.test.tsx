/**
 * @jest-environment jsdom
 */

import { render } from "@testing-library/react";
import React from "react";

import { EntryControlMenu } from "components/entry/EntryControlMenu";
import { TestWrapper } from "TestWrapper";

test("should render a component with essential props", function () {
  const anchorElem = document.createElement("button");
  const handleClose = () => undefined;

  expect(() =>
    render(
      <EntryControlMenu
        entityId={0}
        entryId={0}
        anchorElem={anchorElem}
        handleClose={handleClose}
      />,
      {
        wrapper: TestWrapper,
      }
    )
  ).not.toThrow();
});
