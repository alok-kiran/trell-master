'use client'
import { FormInput } from "@/components/form/form-input";
import { Button } from "@/components/ui/button"
import { Board } from "@prisma/client";
import { updateBoard } from "@/actions/update-board";
import { useAction } from "@/hooks/use-action";
import { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";

interface BoardTitleFormProps {
    data: Board;
}

export const BoardTitleForm = ({
    data,
}: BoardTitleFormProps) => {
    const formRef = useRef<ElementRef<'form'>>(null);
    const inputRef = useRef<ElementRef<'input'>>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(data.title);
    const disableEditing = () => setIsEditing(false);

    const { run } = useAction(updateBoard, {
      onSuccess: (data) => {
        toast.success(`Board ${data.title} updated`);
        setTitle(data.title);
        disableEditing();
      },
        onError: (error) => {
            toast.error(error);
        },
    });

    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.select();
        }, 0);
    };

    const onSubmit = async (formData: FormData) => {
        const title = formData.get('title') as string;
        run({
            id: data.id,
            title,
        })
 
    };

    const onBlur = () => {
        formRef?.current?.requestSubmit();
    };

    if(isEditing) {
        return (
           <form className=" flex items-center gap-x-2" ref={formRef} action={onSubmit}>
                <FormInput 
                    ref={inputRef}
                    id="title"
                    className=" text-lg font-bold px-[7px] py-1 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none"
                    defaultValue={title}
                    onBlur={onBlur}
                />
            </form>
        );
    }
    return (
        <Button 
            className=" font-bold text-lg h-auto w-auto p-1 px-2" variant={"transparent"}
            onClick={enableEditing}
            >
            {title}
        </Button>
    );
};