import type { Prisma } from "@prisma/client";

export type ListWithCards = Prisma.ListGetPayload<{
  include: {
    cards: true;
  };
}>;
