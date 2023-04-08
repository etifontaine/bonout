export const fetcher = async (url: string, settings?: any) => {
  const res = await fetch(url, settings);
  const data = await res.json();

  if (res.status >= 400) {
    throw new Error(data.message);
  }
  return data;
};
