import { API_ERROR_MESSAGES } from "../../src/utils/errorMessages";
import { mockCreateEvent } from "../../__mocks__/mockNextApiHttp";
import { mockEvent } from "../../__mocks__/mockEvent";
import * as EventModel from "../../src/models/events";

jest.mock("../../src/models/events.ts", () => ({
  createEvent: jest.fn((d) => d),
}));
describe("POST api/events", () => {
  it("should be an error if body is not a JSON", () => {
    mockCreateEvent({}).then((res) => {
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({
        error: API_ERROR_MESSAGES.BODY_NOT_JSON,
      });
    });
  });

  it("should be an error if property is missing", () => {
    const body = { title: "test" };
    mockCreateEvent(JSON.stringify(body)).then((res) => {
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({
        error:
          "description, address, start_at, end_at" +
          API_ERROR_MESSAGES.PROPERTY_NOT_FOUND,
      });
    });
  });

  it("should be an error if property is empty", () => {
    const body = { ...mockEvent, title: "" };
    mockCreateEvent(JSON.stringify(body)).then((res) => {
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({
        error: "title" + API_ERROR_MESSAGES.SHOULD_NOT_BE_EMPTY,
      });
    });
  });

  it("should be an error if property is not a string", () => {
    const body = { ...mockEvent, title: 10 };
    mockCreateEvent(JSON.stringify(body)).then((res) => {
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({
        error: "title" + API_ERROR_MESSAGES.SHOULD_BE_STRING,
      });
    });
  });

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
