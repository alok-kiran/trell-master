'use server'

import { auth } from "@clerk/nextjs"
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateBoard } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  if(!userId || !orgId) {
    return {
      error: 'User not authenticated'
    }
  }
  const { title, image } = data;
  const [imageId, imageThumbUrl, imageFullUrl, imageUserName, imageLinkHtml] = image.split('|');
  if(!title || !imageId || !imageThumbUrl || !imageFullUrl || !imageUserName || !imageLinkHtml) {
    return {
      error: 'Invalid image data'
    }
  }
  let board;
  try {
    board = await db.board.create({
      data: {
        orgId,
        title,
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageUserName,
        imageLinkHtml,
      }
    })
  } catch (error) {
    return {
      error: "Failed to create board"
    }
  }
  revalidatePath(`/board/${board.id}`)
  return {
    data: board
  }
}
export const createBoard = createSafeAction(CreateBoard, handler)