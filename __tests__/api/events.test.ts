import { API_ERROR_MESSAGES } from "../../src/utils/errorMessages";
import type { NextApiRequest, NextApiResponse } from "next";
import eventsHandler from "./../../pages/api/events/index";
import httpMocks from "node-mocks-http";

describe("POST api/events", () => {
  it("should be an error if body is not a JSON", () => {
    postEvent({}).then((res) => {
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({
        error: API_ERROR_MESSAGES.BODY_NOT_JSON,
      });
    });
  });

  it("should be an error if property is missing", () => {
    const body = { title: "test" };
    postEvent(JSON.stringify(body)).then((res) => {
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({
        error:
          "description, address, start_at, end_at, user_id" +
          API_ERROR_MESSAGES.PROPERTY_NOT_FOUND,
      });
    });
  });

  it("should be an error if property is empty", () => {
    const body = { ...fakeEvent(), title: "" };
    postEvent(JSON.stringify(body)).then((res) => {
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({
        error: "title" + API_ERROR_MESSAGES.SHOULD_NOT_BE_EMPTY,
      });
    });
  });

  it("should be an error if property is not a string", () => {
    const body = { ...fakeEvent(), title: 10 };
    postEvent(JSON.stringify(body)).then((res) => {
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({
        error: "title" + API_ERROR_MESSAGES.SHOULD_BE_STRING,
      });
    });
  });

  it("should receive created event", async () => {
    const body = fakeEvent();
    await postEvent(JSON.stringify(body)).then((res) => {
      expect(res.statusCode).toBe(201);
      const { id, created_at, link, ...rest } = res._getJSONData();
      expect(id).toBeDefined();
      expect(created_at).toBeDefined();
      expect(link).toBeDefined();
      expect(rest).toEqual(body);
    });
  });
});

export async function postEvent(body: any) {
  const request = httpMocks.createRequest<NextApiRequest>({
    method: "POST",
    url: "api/events",
    body,
  });

  const response = httpMocks.createResponse<NextApiResponse>();
  await eventsHandler(request, response);
  return response;
}

function fakeEvent() {
  return {
    title: "test",
    description: "test",
    user_id: "test",
    address: "test",
    start_at: new Date().toDateString(),
    end_at: new Date().toDateString(),
  };
}
