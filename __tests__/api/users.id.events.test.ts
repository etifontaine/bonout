import { API_ERROR_MESSAGES } from "@src/utils/errorMessages";
import eventsHandler from "@pages/api/users/[id]/events";
import { mockNextApiHttp } from "../../__mocks__/mockNextApiHttp";
import { mockEvent as fakeEvent } from "../../__mocks__/mockEvent";
import { RequestMethod } from "node-mocks-http";
import * as EventModel from "@src/models/events";
const mockEvent: { [key: string]: any } = {
  ...fakeEvent,
  id: "1",
  user_id: "user1",
  link: "test-link-1",
};
jest.mock("@src/models/events.ts", () => ({
  getEventsByUserID: jest.fn((id) =>
    mockEvent.id === id ? [mockEvent] : null
  ),
}));
jest.mock("../../src/firebase/auth.ts", () => ({
  checkFirebaseAuth: jest.fn((appCheck) => true),
}));
describe("GET api/users/[id]/events", () => {
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

  // it("should be return an array of 1 event", async () => {
  //   await mockGetEvents(mockEvent.user_id).then((res) => {
  //     expect(res.statusCode).toBe(200);
  //     const spy = jest.spyOn(EventModel, "getEventsByUserID");
  //     expect(spy).toHaveBeenCalled();
  //     expect(spy).toHaveBeenCalledWith(mockEvent.user_id);
  //     spy.mockClear();
  //   });
  // });
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
