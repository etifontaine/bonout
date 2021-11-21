/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, fireEvent, act, RenderResult } from "../test-utils";
import { Form } from "@components/CreateEvent/Form/Form";
import {
  LENGTH_ERROR,
  DATE_PASSED_ERROR,
} from "@components/CreateEvent/Form/errors.text";
import { getDateTime, add1h } from "@components/CreateEvent/Form/utils";
import usePlacesAutocomplete from "use-places-autocomplete";
import type { HookArgs, HookReturn } from "use-places-autocomplete";
const ok = "OK";
const error = "ERROR";
const data = [{ place_id: "0109", description: "test" }];
jest.useFakeTimers();

const getPlacePredictions = jest.fn();
const getMaps = (type = "success", d = data): any => ({
  maps: {
    places: {
      AutocompleteService: class {
        getPlacePredictions =
          type === "opts"
            ? getPlacePredictions
            : (_: any, cb: (dataArg: any, status: string) => void) => {
                setTimeout(() => {
                  cb(
                    type === "success" ? d : null,
                    type === "success" ? ok : error
                  );
                }, 500);
              };
      },
    },
  },
});

describe("CreateEventPage <Form />", () => {
  beforeAll(() => {
    jest.clearAllTimers();
    global.window.google = getMaps();
  });
  describe("name input", () => {
    it("should exist", () => {
      const result = render(<Form onSubmit={() => {}} />);
      const input = result.container.querySelector("#name");
      expect(input).toBeInTheDocument();
    });

    it("should have a label", () => {
      const result = render(<Form onSubmit={() => {}} />);
      const label = result.container.querySelector("label[for='name']");
      expect(label).toBeInTheDocument();
    });

    it("should have a invalid class and a help-label if < 3 chars", () => {
      const result = render(<Form onSubmit={() => {}} />);
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
      const result = render(<Form onSubmit={() => {}} />);
      const input = result.container.querySelector("#description");
      expect(input).toBeInTheDocument();
    });

    it("should have a label", () => {
      const result = render(<Form onSubmit={() => {}} />);
      const label = result.container.querySelector("label[for='description']");
      expect(label).toBeInTheDocument();
    });

    it("should have a invalid class and a help-label if < 5 chars", () => {
      const result = render(<Form onSubmit={() => {}} />);
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
      const result = render(<Form onSubmit={() => {}} />);
      const input = result.container.querySelector("#startAt");
      expect(input).toBeInTheDocument();
    });

    it("should have a label", () => {
      const result = render(<Form onSubmit={() => {}} />);
      const label = result.container.querySelector("label[for='startAt']");
      expect(label).toBeInTheDocument();
    });

    it("should have today datetime set", () => {
      const result = render(<Form onSubmit={() => {}} />);
      const input = result.container.querySelector("#startAt");
      if (input) {
        expect(input).toHaveAttribute("value", getDateTime(new Date()));
      }
    });

    it("should have datetime > today dateime onChange", () => {
      const result = render(<Form onSubmit={() => {}} />);
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
      const result = render(<Form onSubmit={() => {}} />);
      const input = result.container.querySelector("#endAt");
      expect(input).toBeInTheDocument();
    });

    it("should have a label", () => {
      const result = render(<Form onSubmit={() => {}} />);
      const label = result.container.querySelector("label[for='endAt']");
      expect(label).toBeInTheDocument();
    });

    it("should have today + 1h datetime set", () => {
      const result = render(<Form onSubmit={() => {}} />);
      const input = result.container.querySelector("#endAt");
      if (input) {
        expect(input).toHaveAttribute("value", getDateTime(add1h(new Date())));
      }
    });

    it("should have datetime > startAt datetime onChange", () => {
      const result = render(<Form onSubmit={() => {}} />);
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

  describe("location Input", () => {
    it("should exist", () => {
      const result = render(<Form onSubmit={() => {}} />);
      const input = result.container.querySelector("#location");
      expect(input).toBeInTheDocument();
    });

    it("should have a label", () => {
      const result = render(<Form onSubmit={() => {}} />);
      const label = result.container.querySelector("label[for='location']");
      expect(label).toBeInTheDocument();
    });

    it("should suggestion open onChange", () => {
      const result = render(<Form onSubmit={() => {}} />);
      const input = result.container.querySelector("#location");
      fireLocationHelper(input);
      const suggestions = result.container.querySelector(".suggestions");
      expect(suggestions).toBeInTheDocument();
    });

    it("should be valid if an adress is selected", () => {
      const result = render(<Form onSubmit={() => {}} />);
      const input = result.container.querySelector("#location");
      fireLocationHelper(input);
      expect(input).toHaveClass("invalid");
      const suggestion = result.container.querySelector("li");
      if (suggestion) {
        fireEvent.click(suggestion);
        expect(input).toHaveClass("valid");
      }
    });

    it("should be close suggestion if an adress is selected", () => {
      const result = render(<Form onSubmit={() => {}} />);
      const input = result.container.querySelector(
        "#location"
      ) as HTMLInputElement;
      fireLocationHelper(input);
      const suggestions = result.container.querySelector(".suggestions");
      const suggestion = result.container.querySelector("li");
      if (suggestion) {
        fireEvent.click(suggestion);
        expect(suggestions).not.toBeInTheDocument();
      }
    });

    it("should be valid if suggestion is cliked", () => {
      const result = render(<Form onSubmit={() => {}} />);
      const input = result.container.querySelector(
        "#location"
      ) as HTMLInputElement;
      fireLocationHelper(input);
      expect(input).toHaveClass("invalid");
      const suggestion = result.container.querySelector("li");
      if (suggestion) {
        fireEvent.click(suggestion);
        expect(input).toHaveClass("valid");
        const label = result.container.querySelector(".help-label");
        expect(label).toBeInTheDocument();
        expect(label).toHaveTextContent(
          DATE_PASSED_ERROR("date de commencement")
        );
      }
    });

    it("should be close suggestion if user click outside", () => {
      const result = render(<Form onSubmit={() => {}} />);
      const input = result.container.querySelector(
        "#location"
      ) as HTMLInputElement;
      fireLocationHelper(input);

      fireEvent.mouseDown(document.body);

      const suggestions = result.container.querySelector(".suggestions");
      expect(suggestions).not.toBeInTheDocument();
    });

    it("should be re-open suggestion if user focus", () => {
      const result = render(<Form onSubmit={() => {}} />);
      const input = result.container.querySelector(
        "#location"
      ) as HTMLInputElement;
      act(() => {
        fireLocationHelper(input);
        fireEvent.mouseDown(document.body);
        fireEvent.focus(input);
      });

      const suggestions = result.container.querySelector(".suggestions");
      expect(suggestions).toBeInTheDocument();
    });
  });
});

function fireLocationHelper(input: Element | null) {
  if (input) {
    act(() => {
      fireEvent.change(input, {
        target: { value: "test" },
      });
      jest.runAllTimers();
    });
  }
}
