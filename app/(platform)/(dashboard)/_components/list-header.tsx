'use client';
import { useState, useRef, ElementRef } from "react";
import { List } from "@prisma/client";
import { useEventListener } from "usehooks-ts";
import { FormInput } from "@/components/form/form-input";
import { useAction } from "@/hooks/use-action";
import { updateList } from "@/actions/update-list";
import { toast } from "sonner";

interface ListHeaderProps {
    data: List;
}

const ListHeader = ({
    data
}: ListHeaderProps) => {
    const [title, setTitle] = useState(data.title);
    const [isEditing, setIsEditing] = useState(false);

    const formRef = useRef<ElementRef<"form">>(null);
    const inputRef = useRef<ElementRef<"input">>(null);

    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.select();
        }, 0);
    };

    const disableEditing = () => {
        setIsEditing(false);
    };

    const { run } = useAction(updateList, {
        onSuccess: (data) => {
            toast.success(`Renamed to ${data.title}`);
            setTitle(data.title);
            disableEditing();
        },
        onError: (error) => {
            console.error(error);
        },
    });

    const handleSubmit = async (formData: FormData) => {
        const title = formData.get("title") as string;
        const id = formData.get("id") as string;
        const boardId = formData.get("boardId") as string;
        if(title === data.title) {
            return disableEditing();
        }
        run({ id, title, boardId });
    };

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            formRef.current?.requestSubmit();
        }
    };

    const onBlur = () => {
        formRef.current?.requestSubmit();
    };

    useEventListener("keydown", onKeyDown);

    return (
        <div className=" pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2">
            {
                isEditing ? (
                   <form 
                        className=" flex-1 px-[2px" 
                        action={handleSubmit}
                        ref={formRef}
                        
                        >
                        <input 
                            hidden
                            id="id"
                            name="id"
                            value={data.id}
                        />  
                           <input 
                            hidden
                            id="boardId"
                            name="boardId"
                            value={data.boardId}
                        />  
                        <FormInput 
                            ref={inputRef}
                            id="title"
                            placeholder="Enter list title..."
                            defaultValue={title}
                            onBlur={onBlur}
                            className=" text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
                        />
                        <button 
                            type="submit"
                            hidden
                        />
                   </form>
                ) : <div onClick={enableEditing} className=" w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent">
                    {title}
                </div>
            }

        </div>
    )
};

export default ListHeader;