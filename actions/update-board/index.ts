'use server'

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateBoard } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { orgId, userId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized",
        };
        }
    const { id, title } = data;  
    let board;  
        try {
            board = await db.board.update({
                where: {
                    id,
                    orgId,
                },
                data: {
                    title,
                },
            });
        } catch (error) {
            console.error(error);
            return {
                error: "Failed to update board",
            };
        }

        revalidatePath(`/board/${id}`);
        return {
            data: board,
        };
}

export const updateBoard = createSafeAction(UpdateBoard, handler);