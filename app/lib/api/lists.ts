import { deleteRequest, postRequest } from "@/app/lib/utils";
import type { List } from "@prisma/client";

export async function createListRequest(title: string): Promise<List> {
  return postRequest<List>({ url: "/api/lists", body: { title } });
}

export async function deleteListRequest(id: string): Promise<void> {
  await deleteRequest({ url: `/api/lists/${id}` });
}
