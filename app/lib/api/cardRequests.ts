import type { CardInput } from "@/app/lib/types";
import { deleteRequest, patchRequest, postRequest } from "@/app/lib/utils";
import type { Card } from "@prisma/client";

export async function createCardRequest(
  listId: string,
  card: CardInput
): Promise<Card> {
  return postRequest<Card>({ url: "/api/cards", body: { ...card, listId } });
}

export function deleteCardRequest(cardId: string): Promise<void> {
  return deleteRequest({ url: `/api/cards/${cardId}` });
}

export async function updateCardRequest(
  id: string,
  data: Partial<Card>
): Promise<Card> {
  return patchRequest<Card>({
    url: `/api/cards/${id}`,
    body: data,
  });
}
