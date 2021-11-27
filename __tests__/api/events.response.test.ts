import { API_ERROR_MESSAGES } from "../../src/utils/errorMessages";
import {
  BoInvitationResponse,
  BoInvitationValidResponse,
} from "../../src/types";
import {
  mockCreateEvent,
  mockNextApiHttp,
} from "../../__mocks__/mockNextApiHttp";
import { mockEvent as fakeEvent } from "../../__mocks__/mockEvent";
import responseHandler from "./../../pages/api/events/invitations/response";

type BoInvitationResponseTest = Omit<
  BoInvitationResponse,
  "response" | "user_id" | "eventID"
> & {
  response: string | BoInvitationValidResponse;
  user_id?: string;
  eventID?: string;
};

const mockEvent: { [key: string]: any } = {
  ...fakeEvent,
  id: "1",
  user_id: "user1",
  link: "test-link-1",
};
const mockEvent2: { [key: string]: any } = {
  ...fakeEvent,
  id: "2",
  user_id: "user2",
  link: "test-link-2",
  invitations: [
    {
      response: BoInvitationValidResponse.YES,
      name: "test1",
      link: "test-link-2",
    },
    {
      response: BoInvitationValidResponse.YES,
      name: "test2",
      link: "test-link-2",
    },
    {
      response: BoInvitationValidResponse.YES,
      name: "test3",
      link: "test-link-2",
    },
  ] as BoInvitationResponseTest[],
};
jest.mock("../../src/models/events.ts", () => ({
  createInvitationResponse: jest.fn(
    (id, reponse) => new Promise((resolve) => resolve(id))
  ),
  deleteInvitationResponse: jest.fn(),
  getEventByLink: jest.fn((link) =>
    mockEvent.link === link
      ? mockEvent
      : mockEvent2.link === link
      ? mockEvent2
      : null
  ),
}));

describe("POST api/events/invitation/response", () => {
  it("should be an error if body is not a JSON", () => {
    postResponse({}).then((res) => {
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({
        error: API_ERROR_MESSAGES.BODY_NOT_JSON,
      });
    });
  });

  it("should be an error if property is missing", async () => {
    const test = async (body: BoInvitationResponseTest) =>
      await postResponse(JSON.stringify(body)).then((res) => {
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({
          error: getMissingProperty() + API_ERROR_MESSAGES.PROPERTY_NOT_FOUND,
        });
        function getMissingProperty() {
          return Object.entries(body).reduce(
            (acc, [key, val]) => (acc += !val ? key : ""),
            ""
          );
        }
      });
    await test({ response: "", name: "test", link: "test" });
    await test({ response: "test", name: "", link: "test" });
    await test({ response: "test", name: "test", link: "" });
  });

  it("should be an error if response property is invalid", async () => {
    const body: BoInvitationResponseTest = {
      response: "test",
      name: "test",
      link: "test",
    };
    await postResponse(JSON.stringify(body)).then((res) => {
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({
        error: body.response + " is not a valid response",
      });
    });
  });

  it("should status 201 created", async () => {
    const test = async (body: BoInvitationResponseTest) =>
      await postResponse(JSON.stringify(body)).then((res) => {
        expect(res.statusCode).toBe(201);
        expect(res._getJSONData()).toEqual({ message: "created" });
      });
    await test({
      response: BoInvitationValidResponse.YES,
      name: "test1",
      link: mockEvent.link,
    });
    await test({
      response: BoInvitationValidResponse.NO,
      name: "test2",
      link: mockEvent.link,
    });
    await test({
      response: BoInvitationValidResponse.MAYBE,
      name: "test3",
      link: mockEvent.link,
    });
  });

  it("should status 201 updated", async () => {
    const test = async (body: BoInvitationResponse) =>
      await postResponse(JSON.stringify(body)).then((res) => {
        expect(res.statusCode).toBe(201);
        expect(res._getJSONData()).toEqual({ message: "updated" });
      });
    await test(mockEvent2.invitations[0]);
    await test(mockEvent2.invitations[1]);
    await test(mockEvent2.invitations[2]);
  });
});

export async function postResponse(body: any) {
  return mockNextApiHttp(
    {
      method: "POST",
      url: "api/events/invitations/response",
      body,
    },
    responseHandler
  );
}
