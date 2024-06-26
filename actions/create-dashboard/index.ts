'use server'

import { auth } from "@clerk/nextjs"
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateBoard } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { incrementAvailableCount, hasAvailableCount} from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  if(!userId || !orgId) {
    return {
      error: 'User not authenticated'
    }
  }

  const canCreate = await hasAvailableCount();
  const isPro = await checkSubscription();
  if(!canCreate && !isPro){
    return {
      error: 'You have reached the limit of boards you can create. Upgrade to premium to create more boards.'
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
    if(!isPro){
      await incrementAvailableCount();
    }
    await createAuditLog({
      entityId: board.id,
      entityTitle: board.title,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.CREATE,
    });
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