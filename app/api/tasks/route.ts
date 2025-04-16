import { HttpStatus } from "@/app/lib/constants";
import { withCurrentUser } from "@/app/lib/middleware";
import { prisma } from "@/app/lib/prisma";
import { createTaskSchema } from "@/app/lib/schemas";
import { validateJsonBody } from "@/app/lib/utils";

export async function GET() {
  return withCurrentUser(async (email) => {
    const tasks = await prisma.task.findMany({
      where: { user: { email } },
    });

    return Response.json(tasks);
  });
}

export async function POST(req: Request) {
  return withCurrentUser(async (email) => {
    const validation = await validateJsonBody(req, createTaskSchema);
    if (!validation.success) return validation.response;

    const { title, description, dueDate, priority, status } = validation.data;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate,
        priority,
        status,
        user: { connect: { email } },
      },
    });

    return Response.json(task, { status: HttpStatus.CREATED });
  });
}
