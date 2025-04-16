import { HttpStatus } from "@/app/lib/constants";
import { z } from "zod";

export async function validateJsonBody<T>(
  req: Request,
  schema: z.Schema<T>
): Promise<
  { success: true; data: T } | { success: false; response: Response }
> {
  const body = await req.json();
  const result = schema.safeParse(body);

  if (!result.success) {
    return {
      success: false,
      response: Response.json(result.error.flatten(), {
        status: HttpStatus.BAD_REQUEST,
      }),
    };
  }

  return { success: true, data: result.data };
}
