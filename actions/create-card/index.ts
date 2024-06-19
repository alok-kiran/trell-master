'use server'

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateCard } from "./schema";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { createAuditLog } from "@/lib/create-audit-log";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { orgId, userId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized",
        };
        }
    const { boardId, title, listId } = data;  
    let card;
        try {
            const list = await db.list.findUnique({
                where: {
                    id: listId,
                    board: {
                        orgId,
                    }
                },
            });
            if(!list) {
                return {
                    error: "List not found",
                };
            }
            const lastCard = await db.card.findFirst({
                where: {
                    listId,
                },
                orderBy: {
                    order: "desc",
                },
                select: {
                    order: true,
                },
            });

           const newOrder = lastCard ? lastCard.order + 1 : 1; 
           card = await db.card.create({
               data: {
                   title,
                   listId,
                   order: newOrder,
               },
           });

           await createAuditLog({
            entityId: card.id,
            entityTitle: card.title,
            entityType: ENTITY_TYPE.CARD,
            action: ACTION.CREATE,
          });
        } catch (error) {
            console.error(error);
            return {
                error: "Failed to create Card",
            };
        }

        revalidatePath(`/board/${boardId}`);
        return {
            data: card,
        };
}

export const createCard = createSafeAction(CreateCard, handler);