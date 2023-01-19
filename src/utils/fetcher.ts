export default async function fetcher(
  path: string,
  method: string,
  body?: string
): Promise<any> {
  return fetch(path, {
    method,
    body,
  });

}
