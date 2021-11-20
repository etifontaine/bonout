/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, fireEvent } from "../test-utils";
import { Form } from "@components/CreateEvent/Form/Form";
import { LENGTH_ERROR } from "@components/CreateEvent/Form/errors.text";
import { getDateTime } from "@components/CreateEvent/Form/utils";

describe("CreateEventPage <Form />", () => {
  describe("name input", () => {
    it("should exist", () => {
      const result = render(<Form />);
      const input = result.container.querySelector("#name");
      expect(input).toBeInTheDocument();
    });

    it("should have a label", () => {
      const result = render(<Form />);
      const label = result.container.querySelector("label[for='name']");
      expect(label).toBeInTheDocument();
    });

    it("should have a invalid class and a help-label if < 3 chars", () => {
      const result = render(<Form />);
      const input = result.container.querySelector("#name");
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
  });

  describe("description input", () => {
    it("should exist", () => {
      const result = render(<Form />);
      const input = result.container.querySelector("#description");
      expect(input).toBeInTheDocument();
    });

    it("should have a label", () => {
      const result = render(<Form />);
      const label = result.container.querySelector("label[for='description']");
      expect(label).toBeInTheDocument();
    });

    it("should have a invalid class and a help-label if < 5 chars", () => {
      const result = render(<Form />);
      const input = result.container.querySelector("#description");
      if (input) {
        fireEvent.change(input, { target: { value: "a" } });
        expect(input).toHaveClass("invalid");
        const label = result.container.querySelector(".help-label");
        expect(label).toBeInTheDocument();
        expect(label).toHaveTextContent(LENGTH_ERROR(5));
        fireEvent.change(input, { target: { value: "abcde" } });
        expect(input).toHaveClass("valid");
      }
    });
  });
});
