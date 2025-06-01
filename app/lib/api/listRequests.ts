import { deleteRequest, patchRequest, postRequest } from "@/app/lib/utils";
import type { List } from "@prisma/client";

export function createListRequest(title: string): Promise<List> {
  return postRequest<List>({ url: "/api/lists", body: { title } });
}

export function deleteListRequest(id: string): Promise<void> {
  return deleteRequest({ url: `/api/lists/${id}` });
}

export function updateListRequest(
  id: string,
  data: { title: string }
): Promise<List> {
  return patchRequest<List>({
    url: `/api/lists/${id}`,
    body: data,
  });
}
