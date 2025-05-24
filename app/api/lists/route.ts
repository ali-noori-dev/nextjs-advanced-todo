import { HttpStatus } from "@/app/lib/constants";
import { withCurrentUserAPI } from "@/app/lib/middleware";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  return withCurrentUserAPI(async (email) => {
    const body = await req.json();

    const list = await prisma.list.create({
      data: {
        title: body.title,
        user: { connect: { email } },
      },
    });

    return Response.json(list, { status: HttpStatus.CREATED });
  });
}
