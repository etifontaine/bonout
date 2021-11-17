import { API_ERROR_MESSAGES } from "../../src/utils/errorMessages";
import type { NextApiRequest, NextApiResponse } from "next";
import paramsHandler from "./../../pages/api/events/[...params]";
import { postEvent } from "./events.test";
import httpMocks from "node-mocks-http";
import { BoEvent } from "../../src/types";

describe("GET api/events/[...params]/[id/link]", () => {
  let event: { [key: string]: any };
  beforeAll(async () => {
    await postEvent(JSON.stringify(fakeEvent())).then((response) => {
      event = response._getJSONData();
    });
  });

  it("should be an error if params is not link or id", async () => {
    await getEvent("notIDorLINK", "value").then((res) => {
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({
        error: API_ERROR_MESSAGES.UNKNOWN_PARAMETER,
      });
    });
  });

  it("should be an error if id or link is not found", async () => {
    const test = async (param: string) =>
      await getEvent(param, "eventInconnue").then((res) => {
        expect(res.statusCode).toBe(404);
        expect(res._getJSONData()).toEqual({
          error: "Event" + API_ERROR_MESSAGES.NOT_FOUND,
        });
      });
    await test("id");
    await test("link");
  });

  it("should be an error if id or link value param is not set", async () => {
    const test = async (param: string) =>
      await getEvent(param, "").then((res) => {
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({
          error: param + API_ERROR_MESSAGES.VALUE_MISSING,
        });
      });
    await test("id");
    await test("link");
  });

  it("should get event by link and id", async () => {
    const test = async (param: string) =>
      await getEvent(param, event[param]).then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()[param]).toEqual(event[param]);
      });
    await test("id");
    await test("link");
  });
});

async function getEvent(param1: string, param2: string) {
  const request = httpMocks.createRequest<NextApiRequest>({
    method: "GET",
    url: "api/events/" + param1 + "/" + param2,
    query: { params: [param1, param2] },
  });

  const response = httpMocks.createResponse<NextApiResponse>();
  await paramsHandler(request, response).catch((err) => {
    console.log(err);
  });
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
