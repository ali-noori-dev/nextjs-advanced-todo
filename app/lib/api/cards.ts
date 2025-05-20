import type { CardInput } from "@/app/lib/types";
import { postRequest } from "@/app/lib/utils";
import type { Card } from "@prisma/client";

export async function createCard(
  listId: string,
  card: CardInput
): Promise<Card> {
  return postRequest<Card>({ url: "/api/cards", body: { ...card, listId } });
}
