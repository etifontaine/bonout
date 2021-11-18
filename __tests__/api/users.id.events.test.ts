import { API_ERROR_MESSAGES } from "../../src/utils/errorMessages";
import eventsHandler from "../../pages/api/users/[id]/events";
// import { postEvent } from "./events.test";
import { BoEvent } from "../../src/types";
import { mockNextApiHttp } from "../../__mocks__/mockNextApiHttp";
import { mockEvent } from "../../__mocks__/mockEvent";
import { RequestMethod } from "node-mocks-http";

describe("GET api/users/[id]/events", () => {
  // let event: { [key: string]: any };
  // beforeAll(async () => {
  //   await postEvent(JSON.stringify(fakeEvent())).then((response) => {
  //     event = response._getJSONData();
  //   });
  // });
  it("should be an error if not a get request", async () => {
    await mockGetEvents("", "POST").then((res) => {
      expect(res.statusCode).toBe(405);
    });
  });

  it("should be an error if id is undefined", async () => {
    await mockGetEvents(null).then((res) => {
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({
        error: API_ERROR_MESSAGES.MISSING_PARAMETER,
      });
    });
  });

  it("should be an error if id is not a string", async () => {
    await mockGetEvents(10).then((res) => {
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({
        error: API_ERROR_MESSAGES.INVALID_PARAMETER,
      });
    });
  });
});

async function mockGetEvents(id: any, method: RequestMethod = "GET") {
  return mockNextApiHttp(
    {
      method: method,
      url: `api/users/${id}/events/`,
      query: { id },
    },
    eventsHandler
  );
}
