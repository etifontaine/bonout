import { API_ERROR_MESSAGES } from "../../src/utils/errorMessages";
import {
  mockCreateEvent,
  mockDeleteEvent,
  mockUpdateEvent,
} from "../../__mocks__/mockNextApiHttp";
import { mockEvent } from "../../__mocks__/mockEvent";
import * as EventModel from "../../src/models/events";

jest.mock("../../src/models/events.ts", () => ({
  createEvent: jest.fn((d) => d),
}));
jest.mock("../../src/firebase/auth.ts", () => ({
  checkFirebaseAuth: jest.fn((appCheck) => true),
}));

describe("Events API", () => {
  it("should be an error if body is not a JSON", () => {
    [mockCreateEvent, mockDeleteEvent, mockUpdateEvent].forEach((mock) => {
      mock({}).then((res) => {
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({
          error: API_ERROR_MESSAGES.BODY_NOT_JSON,
        });
      });
    });
  });

  it("should be an error if property is missing", () => {
    const toTests: Array<[CallableFunction, {}, string]> = [
      [
        mockCreateEvent,
        { title: "test" },
        "description, address, start_at, end_at, user_name",
      ],
      [
        mockUpdateEvent,
        { title: "test" },
        "description, address, start_at, end_at, user_name, id",
      ],
      [mockDeleteEvent, { id: "test" }, "user_id"],
    ];
    toTests.forEach(([mock, body, missing]) => {
      // @ts-ignore
      mock(JSON.stringify(body)).then((res) => {
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({
          error: missing + API_ERROR_MESSAGES.PROPERTY_NOT_FOUND,
        });
      });
    });
  });

  it("should be an error if property is not a string", () => {
    const toTests: Array<[CallableFunction, {}, string]> = [
      [mockCreateEvent, { ...mockEvent, title: 10 }, "title"],
      [mockUpdateEvent, { ...mockEvent, id: "test", title: 10 }, "title"],
      [mockDeleteEvent, { user_id: "ede", id: 10 }, "id"],
    ];
    toTests.forEach(([mock, body, notString]) => {
      // @ts-ignore
      mock(JSON.stringify(body)).then((res) => {
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({
          error: notString + API_ERROR_MESSAGES.SHOULD_BE_STRING,
        });
      });
    });
  });
});

describe("POST api/events", () => {
  it("should receive created event with link", async () => {
    const body = mockEvent;
    await mockCreateEvent(JSON.stringify(body)).then((res) => {
      expect(res.statusCode).toBe(201);
      const spy = jest.spyOn(EventModel, "createEvent");
      expect(spy).toHaveBeenCalled();
      const call = spy.mock.calls[0][0];
      expect(call.link).toBeDefined();
      expect(call.link).toHaveLength(10);
      spy.mockClear();
    });
  });

  it("should receive created event with user_id if not set", async () => {
    const body = { ...mockEvent, user_id: undefined };
    await mockCreateEvent(JSON.stringify(body)).then((res) => {
      expect(res.statusCode).toBe(201);
      const spy = jest.spyOn(EventModel, "createEvent");
      expect(spy).toHaveBeenCalled();
      const call = spy.mock.calls[0][0];
      expect(call.user_id).toBeDefined();
      expect(call.user_id).toHaveLength(10);
      spy.mockClear();
    });
  });
});
