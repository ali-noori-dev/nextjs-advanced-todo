import type { CardInput } from "@/app/lib/types";
import { post } from "@/app/lib/utils";
import type { Card } from "@prisma/client";

export async function createCard(
  listId: string,
  card: CardInput
): Promise<Card> {
  return post<Card>("/api/cards", { ...card, listId });
}
