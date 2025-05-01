import { post } from "@/app/lib/utils";
import type { List } from "@prisma/client";

export async function createList(title: string): Promise<List> {
  return post<List>("/api/lists", { title });
}
