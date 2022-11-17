export default async function fetcher(
  path: string,
  method: string,
  body?: string
): Promise<Response> {
  return fetch(path, {
    method,
    body,
  });
}
