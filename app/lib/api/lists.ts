import { deleteRequest, postRequest } from "@/app/lib/utils";
import type { List } from "@prisma/client";

export async function createList(title: string): Promise<List> {
  return postRequest<List>({ url: "/api/lists", body: { title } });
}

export async function deleteList(id: string): Promise<void> {
  await deleteRequest({ url: `/api/lists/${id}` });
}
