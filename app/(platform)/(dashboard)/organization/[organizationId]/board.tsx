import { deleteBoard } from "@/actions/delete-board";
import { Button } from "@/components/ui/button";
import { FormDelete } from "./form-delete";

interface BoardProps {
    title: string;
    id: string;
}

const Board = ({
    title,
    id
}: BoardProps) => {

    const deleteBoardById = deleteBoard.bind(null, id);

    return (
        <form className=" flex flex-center gap-x-2" action={deleteBoardById}>
            <p>
            Board title : {title}
            </p>
             <FormDelete />
        </form>
    );
};

export default Board;