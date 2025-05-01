import { prisma } from "@/app/lib/prisma";
import type { ListWithCards } from "@/app/lib/types";

export async function getListsWithCards(
  email: string
): Promise<ListWithCards[]> {
  return await prisma.list.findMany({
    where: {
      user: {
        email,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      cards: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
}
