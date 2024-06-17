import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ListContainer } from "../../_components/list-container";

interface BoardIdPageProps {
    params: {
        boardId: string;
    };
}

const BoardIdPage = async({
    params,
}: BoardIdPageProps) => {
    const { boardId } = params;
    const { orgId } = auth();
    if (!orgId) {
       redirect("select-org")
    }
    const list = await db.list.findMany({
        where: {
            boardId,
            board: {
                orgId,
            },
        },
        include: {
            cards: {
                orderBy: {
                    order: "asc",
                },
            },
        },
        orderBy: {
            order: "asc",
        }
    });

    return (
        <div className=" p-4 h-full overflow-x-auto">
        <ListContainer
            data={list}
            boardId={boardId}
        />
        </div>
    );
};

export default BoardIdPage;