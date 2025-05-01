export async function post<TResponse = any>(
  url: string,
  body: unknown,
  options?: RequestInit
): Promise<TResponse> {
  const { headers = {}, ...restOptions } = options || {};

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
    ...restOptions,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `POST ${url} failed: ${res.status} ${res.statusText} - ${errorText}`
    );
  }

  return res.json();
}
