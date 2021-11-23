import { API_ERROR_MESSAGES } from "../../src/utils/errorMessages";
import {
  BoInvitationResponse,
  BoInvitationValidResponse,
} from "../../src/types";
import {
  mockCreateEvent,
  mockNextApiHttp,
} from "../../__mocks__/mockNextApiHttp";
import { mockEvent } from "../../__mocks__/mockEvent";
import responseHandler from "./../../pages/api/events/invitations/response";

type BoInvitationResponseTest = Omit<BoInvitationResponse, "response"> & {
  response: string;
};

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

  const event: { [key: string]: any } = {
    ...mockEvent,
    id: "1",
    user_id: "user1",
    link: "test-link-1",
  };

  const event2: { [key: string]: any } = {
    ...mockEvent,
    id: "2",
    user_id: "user2",
    link: "test-link-2",
  };

  it("should status 201 created", async () => {
    const test = async (body: BoInvitationResponse) =>
      await postResponse(JSON.stringify(body)).then((res) => {
        expect(res.statusCode).toBe(201);
        expect(res._getJSONData()).toEqual({ message: "created" });
      });
    await test({
      response: BoInvitationValidResponse.YES,
      name: "test1",
      link: event.link,
    });
    await test({
      response: BoInvitationValidResponse.NO,
      name: "test2",
      link: event.link,
    });
    await test({
      response: BoInvitationValidResponse.MAYBE,
      name: "test3",
      link: event.link,
    });
  });

  it("should status 201 updated", async () => {
    const test = async (body: BoInvitationResponse) =>
      await postResponse(JSON.stringify(body)).then((res) => {
        expect(res.statusCode).toBe(201);
        expect(res._getJSONData()).toEqual({ message: "updated" });
      });
    await test({
      response: BoInvitationValidResponse.YES,
      name: "test1",
      link: event2.link,
    });
    await test({
      response: BoInvitationValidResponse.NO,
      name: "test2",
      link: event2.link,
    });
    await test({
      response: BoInvitationValidResponse.MAYBE,
      name: "test3",
      link: event2.link,
    });
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
