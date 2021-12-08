import type { NextApiRequest, NextApiResponse } from "next";
import httpMocks from "node-mocks-http";
import eventsHandler from "../pages/api/events/index";

export async function mockNextApiHttp(
  param: httpMocks.RequestOptions,
  nextHandler: (req: NextApiRequest, res: NextApiResponse<any>) => Promise<any>
) {
  const request = httpMocks.createRequest<NextApiRequest>(param);

  const response = httpMocks.createResponse<NextApiResponse>();
  await nextHandler(request, response).catch((err) => {
    console.log(err);
  });
  return response;
}

export async function mockCreateEvent(event: any) {
  return mockHttpRequestEvent("POST", event);
}

export async function mockUpdateEvent(event: any) {
  return mockHttpRequestEvent("PUT", event);
}

export async function mockDeleteEvent(event: any) {
  return mockHttpRequestEvent("DELETE", event);
}

function mockHttpRequestEvent(method: httpMocks.RequestMethod, event: any) {
  return mockNextApiHttp(
    {
      method,
      url: "api/events",
      body: event,
    },
    eventsHandler
  );
}
