import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";
import { BoardNavbar } from "../../_components/board-navbar";

export async function generateMetadata({
    params: { boardId },
}: {
    params: { boardId: string };
}) {    
    const { orgId } = auth();
    if(!orgId) {
        return {
            title: 'Board'
        }
    }
    const board = await db.board.findUnique({
        where: {
            id: boardId,
            orgId,
        },
    });
    
    return {
        title: board?.title || 'Board',
    };
}

const BoardIdLayout = async ({
    children,
    params: { boardId},
}: {
    children: React.ReactNode;
    params: { boardId: string };
}) => {
    const { orgId } = auth();
    if (!orgId) {
        redirect('/select-org');
    }

    const board = await db.board.findUnique({
        where: {
            id: boardId,
            orgId,
        },
    
    });

    if(!board) {
        notFound();
    }

    return (
        <div
        className=" relative h-full w-full bg-center bg-cover bg-no-repeat"
            style={{
                backgroundImage: `url(${board.imageFullUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            
            }}
        >
            <BoardNavbar 
                data={board}
            />
            <div 
                className="absolute inset-0 bg-black/10"
            />
            <main className=" relative pt-28 h-full">
                {children}
            </main>
        </div>
    );
};

export default BoardIdLayout;