import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/lib/Either";
import { filter } from "fp-ts/lib/Array";
import { API_ERROR_MESSAGES } from "@src/utils/errorMessages";

export function validateJson(toParse: string) {
  return E.tryCatch(
    () => JSON.parse(toParse),
    () => API_ERROR_MESSAGES.BODY_NOT_JSON
  );
}

export function validateProperties<T>(properties: Array<string>) {
  return (body: { [key: string]: any }) =>
    pipe(
      properties,
      filter((key) => !(key in body)),
      (keys) =>
        keys.length === 0
          ? E.right(body as T)
          : E.left(API_ERROR_MESSAGES.VALUE_MISSING + " : " + keys.join(", "))
    );
}
