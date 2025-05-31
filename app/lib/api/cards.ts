import type { CardInput } from "@/app/lib/types";
import { patchRequest, postRequest } from "@/app/lib/utils";
import type { Card } from "@prisma/client";

export async function createCardRequest(
  listId: string,
  card: CardInput
): Promise<Card> {
  return postRequest<Card>({ url: "/api/cards", body: { ...card, listId } });
}

export async function toggleCardCompletionRequest(
  cardData: Card
): Promise<Card> {
  return patchRequest<Card>({
    url: `/api/cards/${cardData.id}/toggle`,
    body: { completed: !cardData.completed },
  });
}
