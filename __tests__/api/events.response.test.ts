import { API_ERROR_MESSAGES } from "../../src/utils/errorMessages";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  BoInvitationResponse,
  BoInvitationValidResponse,
} from "../../src/types";
import { postEvent } from "./events.test";
import responseHandler from "./../../pages/api/events/invitations/response";
import httpMocks from "node-mocks-http";

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

  let event: { [key: string]: any };
  beforeAll(async () => {
    await postEvent(JSON.stringify(fakeEvent())).then((response) => {
      event = response._getJSONData();
    });
  });

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
});

export async function postResponse(body: any) {
  const request = httpMocks.createRequest<NextApiRequest>({
    method: "POST",
    url: "api/events/invitations/response",
    body,
  });

  const response = httpMocks.createResponse<NextApiResponse>();
  await responseHandler(request, response);
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