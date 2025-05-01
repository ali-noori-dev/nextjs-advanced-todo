import { HttpStatus } from "@/app/lib/constants";
import { withCurrentUserAPI } from "@/app/lib/middleware";
import { prisma } from "@/app/lib/prisma";
import { createListSchema } from "@/app/lib/schemas";
import { validateJsonBody } from "@/app/lib/utils";

export async function POST(req: Request) {
  return withCurrentUserAPI(async (email) => {
    const validation = await validateJsonBody(req, createListSchema);
    if (!validation.success) return validation.response;

    const { title } = validation.data;

    const list = await prisma.list.create({
      data: {
        title,
        user: { connect: { email } },
      },
    });

    return Response.json(list, { status: HttpStatus.CREATED });
  });
}
