"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export type State = {
    errors?: {
      title?: string[];
    },
    message?: string | null,
};

const createBoardSchema = z.object({
    title: z.string().min(3, {
        message: 'Title must be at least 3 characters long'
    }),
});

export async function createBoard(prevState: State , formData: FormData) {
    const validatedFields = createBoardSchema.safeParse({
        title: formData.get('title'),
    });
    if(!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing fields'
        }
    
    }

    const { title } = validatedFields.data;
    
    try {
      await db.board.create({
        data: {
          title: title
        }
      })
    } catch (error) {
      return {
        message: 'Database error'
      }
    }

    revalidatePath('/organization/org_2c6JagorQGsteRVrr9bX1NZ74Kz');
    redirect('/organization/org_2c6JagorQGsteRVrr9bX1NZ74Kz');
  }