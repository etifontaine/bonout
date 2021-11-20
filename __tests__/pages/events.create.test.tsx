/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, fireEvent } from "../test-utils";
import { Form } from "@components/CreateEvent/Form/Form";
import {
  LENGTH_ERROR,
  DATE_PASSED_ERROR,
} from "@components/CreateEvent/Form/errors.text";
import { getDateTime, add1h } from "@components/CreateEvent/Form/utils";

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

  describe("startAt Input", () => {
    it("should exist", () => {
      const result = render(<Form />);
      const input = result.container.querySelector("#startAt");
      expect(input).toBeInTheDocument();
    });

    it("should have a label", () => {
      const result = render(<Form />);
      const label = result.container.querySelector("label[for='startAt']");
      expect(label).toBeInTheDocument();
    });

    it("should have today datetime set", () => {
      const result = render(<Form />);
      const input = result.container.querySelector("#startAt");
      if (input) {
        expect(input).toHaveAttribute("value", getDateTime(new Date()));
      }
    });

    it("should have datetime > today dateime onChange", () => {
      const result = render(<Form />);
      const input = result.container.querySelector("#startAt");
      if (input) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        fireEvent.change(input, {
          target: { value: getDateTime(yesterday) },
        });

        expect(input).toHaveClass("invalid");

        const label = result.container.querySelector(".help-label");
        expect(label).toBeInTheDocument();
        expect(label).toHaveTextContent(DATE_PASSED_ERROR("aujourd'hui"));

        const tomorow = new Date();
        tomorow.setDate(tomorow.getDate() + 1);
        fireEvent.change(input, { target: { value: getDateTime(tomorow) } });
        expect(input).toHaveClass("valid");
      }
    });
  });

  describe("endAt Input", () => {
    it("should exist", () => {
      const result = render(<Form />);
      const input = result.container.querySelector("#endAt");
      expect(input).toBeInTheDocument();
    });

    it("should have a label", () => {
      const result = render(<Form />);
      const label = result.container.querySelector("label[for='endAt']");
      expect(label).toBeInTheDocument();
    });

    it("should have today + 1h datetime set", () => {
      const result = render(<Form />);
      const input = result.container.querySelector("#endAt");
      if (input) {
        expect(input).toHaveAttribute("value", getDateTime(add1h(new Date())));
      }
    });

    it("should have datetime > startAt datetime onChange", () => {
      const result = render(<Form />);
      const input = result.container.querySelector("#endAt");
      const startAtInput = result.container.querySelector(
        "#startAt"
      ) as HTMLInputElement;
      if (input && startAtInput) {
        fireEvent.change(input, {
          target: { value: startAtInput.value },
        });

        expect(input).toHaveClass("invalid");

        const label = result.container.querySelector(".help-label");
        expect(label).toBeInTheDocument();
        expect(label).toHaveTextContent(
          DATE_PASSED_ERROR("date de commencement")
        );

        const tomorow = new Date();
        tomorow.setDate(tomorow.getDate() + 1);
        fireEvent.change(input, { target: { value: getDateTime(tomorow) } });
        expect(input).toHaveClass("valid");
      }
    });
  });
});
