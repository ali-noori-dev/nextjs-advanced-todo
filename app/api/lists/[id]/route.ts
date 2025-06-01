import { HttpStatus } from "@/app/lib/constants";
import { prisma } from "@/app/lib/prisma";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const listId = params.id;

    await prisma.list.delete({
      where: { id: listId },
    });

    return new Response(null, { status: HttpStatus.NO_CONTENT });
  } catch (error) {
    console.error("Error deleting list:", error);
    return new Response("Failed to delete list", {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const listId = params.id;
    const { title } = await request.json();

    const updatedList = await prisma.list.update({
      where: { id: listId },
      data: { title },
    });

    return Response.json(updatedList);
  } catch (error) {
    console.error("Error updating list:", error);
    return new Response("Failed to update list", {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
