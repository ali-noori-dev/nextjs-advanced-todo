// GET (fetch tasks) and POST (create task)
import { prisma } from "@/app/lib/prisma";
import { createTaskSchema } from "@/app/lib/validation";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const tasks = await prisma.task.findMany({
    where: { user: { email: session.user.email } },
  });

  return Response.json(tasks);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const parsed = createTaskSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(parsed.error.flatten(), { status: 400 });
  }

  const { title, description, dueDate, priority, status } = parsed.data;

  const task = await prisma.task.create({
    data: {
      title,
      description,
      dueDate,
      priority,
      status,
      user: { connect: { email: session.user.email } },
    },
  });

  return Response.json(task, { status: 201 });
}
