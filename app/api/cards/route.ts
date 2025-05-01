import { HttpStatus } from "@/app/lib/constants";
import { withCurrentUserAPI } from "@/app/lib/middleware";
import { prisma } from "@/app/lib/prisma";
import { createCardSchema } from "@/app/lib/schemas";
import { validateJsonBody } from "@/app/lib/utils";

export async function POST(req: Request) {
  return withCurrentUserAPI(async () => {
    const validation = await validateJsonBody(req, createCardSchema);
    if (!validation.success) return validation.response;

    const { listId, title, description } = validation.data;

    const card = await prisma.card.create({
      data: {
        listId,
        title,
        description,
      },
    });

    return Response.json(card, { status: HttpStatus.CREATED });
  });
}
