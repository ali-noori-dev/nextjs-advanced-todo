import { HttpStatus } from "@/app/lib/constants";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cardId = params.id;
    const { completed } = await req.json();

    if (typeof completed !== "boolean") {
      return NextResponse.json(
        { message: "Invalid or missing 'completed' value" },
        { status: HttpStatus.BAD_REQUEST }
      );
    }

    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: { completed },
    });

    return NextResponse.json(updatedCard);
  } catch (error) {
    console.error("Failed to update card completion:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}
