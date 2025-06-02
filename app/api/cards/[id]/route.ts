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
