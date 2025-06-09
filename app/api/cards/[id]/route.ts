import { HttpStatus } from "@/app/lib/constants";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.card.delete({
      where: {
        id: params.id,
      },
    });

    return new Response(null, { status: HttpStatus.NO_CONTENT });
  } catch (error) {
    console.error("Failed to delete card:", error);
    return NextResponse.json(
      { error: "Failed to delete card" },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cardId = params.id;
    const data = await req.json();

    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data,
    });

    return NextResponse.json(updatedCard);
  } catch (error) {
    console.error("Failed to update card:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: HttpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}
