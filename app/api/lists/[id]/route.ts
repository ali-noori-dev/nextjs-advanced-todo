import { HttpStatus } from "@/app/lib/constants";
import { withCurrentUserAPI } from "@/app/lib/middleware";
import { prisma } from "@/app/lib/prisma";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  return withCurrentUserAPI(async (email) => {
    try {
      const listId = params.id;

      // Ensure list belongs to current user
      const existingList = await prisma.list.findUnique({
        where: { id: listId },
        select: { user: { select: { email: true } } },
      });

      if (!existingList || existingList.user.email !== email) {
        return new Response("List not found or unauthorized", {
          status: HttpStatus.FORBIDDEN,
        });
      }

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
  });
}
