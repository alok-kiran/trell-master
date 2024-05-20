"use server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteBoard(boardId: string) {
  await db.board.delete({
    where: {
      id: boardId
    }
  })
  revalidatePath('/organization/org_2c6JagorQGsteRVrr9bX1NZ74Kz');
}