/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, fireEvent } from "../test-utils";
import { Form } from "@components/CreateEvent/Form/Form";
import { LENGTH_ERROR } from "@components/CreateEvent/Form/errors.text";

describe("CreateEventPage <Form />", () => {
  it("should have input name required min 3 chars", () => {
    const result = render(<Form />);
    const input = result.container.querySelector("#name");
    expect(input).toBeInTheDocument();
    if (input) {
      fireEvent.change(input, { target: { value: "a" } });
      expect(input).toHaveClass("invalid");
      const label = result.container.querySelector(".help-label");
      expect(label).toBeInTheDocument();
      expect(label).toHaveTextContent(LENGTH_ERROR(3));
      fireEvent.change(input, { target: { value: "abc" } });
      expect(input).toHaveClass("valid");
    }
  });

  it("should have input description required min 5 chars", () => {
    const result = render(<Form />);
    const input = result.container.querySelector("#description");
    expect(input).toBeInTheDocument();
    if (input) {
      fireEvent.change(input, { target: { value: "a" } });
      expect(input).toHaveClass("invalid");
      const label = result.container.querySelector(".help-label");
      expect(label).toBeInTheDocument();
      expect(label).toHaveTextContent(LENGTH_ERROR(5));
      fireEvent.change(input, { target: { value: "abcef" } });
      expect(input).toHaveClass("valid");
    }
  });
});
