import { HttpStatus } from "@/app/lib/constants";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const card = await prisma.card.create({ data });
    return Response.json(card, { status: HttpStatus.CREATED });
  } catch (error) {
    console.error("Error creating card:", error);
    return Response.json(
      { message: "Failed to create card" },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}
