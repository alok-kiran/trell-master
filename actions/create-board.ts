"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createBoardSchema = z.object({
    title: z.string()
});

export async function createBoard(formData: FormData) {
    const { title } = createBoardSchema.parse({
        title: formData.get('title'),
    });
    await db.board.create({
      data: {
        title: title
      }
    })

    revalidatePath('/organization/org_2c6JagorQGsteRVrr9bX1NZ74Kz');
  }