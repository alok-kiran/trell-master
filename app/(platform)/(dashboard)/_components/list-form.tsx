'use client';

import { Plus, X } from "lucide-react";
import { ListWrapper } from "./list-wrapper";
import { ElementRef, KeyboardEvent, useRef, useState } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { FormInput } from "@/components/form/form-input";
import { useParams, useRouter } from "next/navigation";
import { FormSubmit } from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { createList } from "@/actions/create-list";
import { toast } from "sonner";

export const ListForm = () => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const formRef = useRef<ElementRef<"form">>(null);
    const inputRef = useRef<ElementRef<"input">>(null);
    const params = useParams();

    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    }

    const disableEditing = () => {
        setIsEditing(false);
    };

    const { run, fieldErrors } = useAction(createList, {
        onSuccess: (data) => {
            console.log(['data', data]);
            toast.success("List created");
            disableEditing();
            router.refresh();
        },
        onError: (error) => {
            console.error(error);
            toast.error(error);
        },
    })

    const onSubmit = async(formData: FormData) => {
        const title = formData.get("title") as string;
        const boardId = params?.boardId as string;
        console.log(title);
        run({ title, boardId });
    };

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            disableEditing();
        }
    };
    
    useEventListener("keydown", onKeyDown as unknown as EventListener);
    useOnClickOutside(formRef, disableEditing);

    if(isEditing) {
        return (
            <ListWrapper>
                <form
                    action={onSubmit}
                    ref={formRef}
                    className=" w-full rounded-md bg-white p-3 shadow-md"
                >
                    <FormInput 
                        className="text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition"
                        ref={inputRef}
                        id="title"
                        placeholder="Enter list title..."
                        errors={fieldErrors}
                    />
                    <input 
                        className="hidden"
                        type="submit"
                        value={params?.boardId}
                        name="boardId"
                    />
                    <div className=" flex items-center gap-x-1">
                        <FormSubmit>
                            Add List
                        </FormSubmit>
                        <Button onClick={disableEditing} size={'sm'} variant={'ghost'}>
                            <X className=" w-5 h-5"/>
                        </Button>
                    </div>  
                </form>
            </ListWrapper>
        );
    }

    return (
       <ListWrapper>
            <button
                onClick={enableEditing}
                className=" w-full rounded-md bg-white/80 hover:bg-white/50 transition p-3 flex items-center font-medium text-sm"
            >
               <Plus className=" w-4 h-4 mr-2"/> Add a list
            </button>
       </ListWrapper>
    )
};