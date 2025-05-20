type RequestParams = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  url: string;
  body?: unknown;
  options?: RequestInit;
};

type BaseParams = Omit<RequestParams, "method">;
type NoBodyParams = Omit<BaseParams, "body">;

async function request<TResponse = any>({
  method,
  url,
  body,
  options,
}: RequestParams): Promise<TResponse> {
  const { headers = {}, ...restOptions } = options || {};

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...(body !== undefined && { body: JSON.stringify(body) }),
    ...restOptions,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `${method} ${url} failed: ${res.status} ${res.statusText} - ${errorText}`
    );
  }

  if (method === "DELETE") return undefined as TResponse;
  return res.json();
}

export function getRequest<TResponse = any>(
  params: NoBodyParams
): Promise<TResponse> {
  return request({ method: "GET", ...params });
}

export function postRequest<TResponse = any>(
  params: BaseParams
): Promise<TResponse> {
  return request({ method: "POST", ...params });
}

export function putRequest<TResponse = any>(
  params: BaseParams
): Promise<TResponse> {
  return request({ method: "PUT", ...params });
}

export function patchRequest<TResponse = any>(
  params: BaseParams
): Promise<TResponse> {
  return request({ method: "PATCH", ...params });
}

export function deleteRequest(params: NoBodyParams): Promise<void> {
  return request({ method: "DELETE", ...params });
}
