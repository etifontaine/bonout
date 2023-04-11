/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, fireEvent, act } from "../test-utils";
import { Form } from "@components/CreateEvent/Form/Form";
import {
  getDateTime,
  add1h,
  add10min,
} from "@components/CreateEvent/Form/utils";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

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
        expect(label).toHaveTextContent("LENGTH_ERROR");
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
        expect(label).toHaveTextContent("LENGTH_ERROR");
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

    it("should have today datetime set + 10min", () => {
      const result = render(<Form onSubmit={() => {}} />);
      const input = result.container.querySelector("#startAt");
      if (input) {
        expect(input).toHaveAttribute(
          "value",
          getDateTime(add10min(new Date()))
        );
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
        if (label && label.textContent) {
          expect(
            label.textContent.startsWith("DATE_PASSED_ERROR")
          ).toBeTruthy();
        } else {
          expect(label).toBeInTheDocument();
        }

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
        expect(input).toHaveAttribute(
          "value",
          getDateTime(add1h(add10min(new Date())))
        );
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
        if (label && label.textContent) {
          expect(
            label.textContent.startsWith("DATE_PASSED_ERROR")
          ).toBeTruthy();
        } else {
          expect(label).toBeInTheDocument();
        }

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
      const label = result.container.querySelector(".help-label");
      expect(label).toBeInTheDocument();
      expect(label).toHaveTextContent("INVALID_PLACE_ERROR");
      const suggestion = result.container.querySelector(".suggestions li");
      if (suggestion) {
        act(() => {
          fireEvent.click(suggestion);
        });
        expect(input).toHaveClass("valid");
        expect(label).not.toBeInTheDocument();
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
