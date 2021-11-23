import { API_ERROR_MESSAGES } from "../../src/utils/errorMessages";
import paramsHandler from "./../../pages/api/events/[...params]";
import { mockNextApiHttp } from "../../__mocks__/mockNextApiHttp";
import { mockEvent } from "../../__mocks__/mockEvent";

describe("GET api/events/[...params]/[id/link]", () => {
  const event: { [key: string]: any } = {
    ...mockEvent,
    id: "1",
    user_id: "user1",
    link: "test-link-1",
  };

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
  return mockNextApiHttp(
    {
      method: "GET",
      url: "api/events/" + param1 + "/" + param2,
      query: { params: [param1, param2] },
    },
    paramsHandler
  );
}
