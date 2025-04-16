import { PriorityEnum, StatusEnum } from "@/app/lib/schemas";
import { z } from "zod";

export type Priority = z.infer<typeof PriorityEnum>;
export type Status = z.infer<typeof StatusEnum>;
