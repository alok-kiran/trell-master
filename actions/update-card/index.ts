'use server'

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateCard } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { orgId, userId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized",
        };
        }
    const { id, boardId, ...values } = data;  
    let card;  
        try {
            console.log(['card update']);

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
            console.log(card);
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