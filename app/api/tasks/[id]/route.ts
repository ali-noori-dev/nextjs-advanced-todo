import { HttpStatus } from "@/app/lib/constants";
import { withCurrentUser } from "@/app/lib/middleware";
import { prisma } from "@/app/lib/prisma";
import { updateTaskSchema } from "@/app/lib/schemas";
import { TaskRouteParams } from "@/app/lib/types";
import { validateJsonBody } from "@/app/lib/utils";

export async function PATCH(req: Request, { params }: TaskRouteParams) {
  return withCurrentUser(async () => {
    const validation = await validateJsonBody(req, updateTaskSchema);
    if (!validation.success) return validation.response;

    const task = await prisma.task.update({
      where: { id: params.id },
      data: validation.data,
    });

    return Response.json(task);
  });
}

export async function DELETE(_: Request, { params }: TaskRouteParams) {
  return withCurrentUser(async () => {
    await prisma.task.delete({
      where: { id: params.id },
    });

    return new Response(null, { status: HttpStatus.NO_CONTENT });
  });
}
