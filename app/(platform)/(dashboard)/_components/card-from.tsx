'use client';

import { createCard } from "@/actions/create-card";
import { FormSubmit } from "@/components/form/form-submit";
import { FormTextarea } from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { Plus, X } from "lucide-react";
import { useParams } from "next/navigation";
import { ElementRef, forwardRef, useRef } from "react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

interface CardFormProps {
    isEditing: boolean;
    enableEditing: () => void;
    disableEditing: () => void;
    listId: string;
}


export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(({
    isEditing,
    enableEditing,
    disableEditing,
    listId,
}, ref) => {

    const params = useParams();
    const formRef = useRef<ElementRef<'form'>>(null);

    const { run, fieldErrors } = useAction(createCard, {
        onSuccess: (data) => {
            toast.success(`Card ${data.title} created`);
            formRef.current?.reset();
            disableEditing();
        },
        onError: (error) => {
            console.error(error);
        }
    })

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            disableEditing();
        }
    };

    useOnClickOutside(formRef, disableEditing);

    useEventListener('keydown', onKeyDown);

    const onTextareakeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if(e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            formRef.current?.requestSubmit();
        }
    };

    const onSubmit = async (formData: FormData) => {
        const title = formData.get('title') as string;
        const listId = formData.get('listId') as string;
        const boardId = params.boardId as string;
        run({
            title,
            listId,
            boardId,
        });
    };


    if(isEditing) {
        return (
            <form className=" m-1 py-0.5 px-1 space-y-4" ref={formRef} action={onSubmit}>
                <FormTextarea  
                    id={'title'}
                    placeholder="Enter a title for this card..."
                    required
                    className=" w-full"
                    onBlur={disableEditing}
                    onKeyDown={onTextareakeyDown}
                    ref={ref}
                    errors={fieldErrors}
                />
                <input 
                    hidden
                    id="listId"
                    name="listId"
                    defaultValue={listId}
                />
                <div className=" flex items-center gap-x-1">
                    <FormSubmit>
                        Add card
                    </FormSubmit>
                    <Button onClick={disableEditing} size={'sm'} variant={'ghost'}>
                        <X className=" h-4 w-4"/>
                    </Button>
                </div>
            </form>
        )
    }
    return (
        <div className=" pt-2 px-2">
            <Button onClick={enableEditing} className=" h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm" size='sm' variant={'ghost'}>
           <Plus className=" h-4 w-4 mr-2"/> Add a card
            </Button>
        </div>
    )
});

CardForm.displayName = 'CardForm';