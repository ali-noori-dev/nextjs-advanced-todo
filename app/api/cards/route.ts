import { HttpStatus } from "@/app/lib/constants";
import { withCurrentUserAPI } from "@/app/lib/middleware";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  return withCurrentUserAPI(async () => {
    const data = await req.json();

    const card = await prisma.card.create({
      data,
    });

    return Response.json(card, { status: HttpStatus.CREATED });
  });
}
