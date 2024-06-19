'use server'

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateCard } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { orgId, userId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized",
        };
        }
    const { id, boardId, ...values } = data;  
    console.log(['values', values])
    let card;  
        try {
            card = await db.card.update({
                where: {
                    id,
                    list: {
                        board: {
                            orgId,
                        }
                    }
                },
                data: {
                    ...values,
                },
            });
            await createAuditLog({
                entityId: card.id,
                entityTitle: card.title,
                entityType: ENTITY_TYPE.CARD,
                action: ACTION.UPDATE,
              });
        } catch (error) {
            console.error(error);
            return {
                error: "Failed to update card",
            };
        }

        revalidatePath(`/board/${boardId}`);
        return {
            data: card,
        };
}

export const updateCard = createSafeAction(UpdateCard, handler);