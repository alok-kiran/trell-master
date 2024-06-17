'use server'

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteList } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { orgId, userId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized",
        };
        }
    const { id, boardId } = data;  
    let list;  
        try {
            list = await db.list.delete({
                where: {
                    id,
                    boardId,
                    board: {
                        orgId,
                    }
                },
            });
        } catch (error) {
            console.error(error);
            return {
                error: "Failed to delete board",
            };
        }

        revalidatePath(`/board/${orgId}`);
        return {
            data: list
        }
}

export const deleteList = createSafeAction(DeleteList, handler);