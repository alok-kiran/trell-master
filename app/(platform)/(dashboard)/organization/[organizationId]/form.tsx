'use client'

import { Button } from "@/components/ui/button"
import { useFormState } from "react-dom"
import { FormInput } from "./form-input"
import { FormButton } from "./form-button"
import { createBoard } from "@/actions/create-dashboard"
import { useAction } from "@/hooks/use-action"

export const Form = () => {
    const { run, fieldErrors } = useAction(createBoard, {
        onSuccess: (data) => {
            console.log('success', data)
        },
        onError: (error) => {
            console.log('error', error)
        }
    
    });

    const onSubmit = (formData: FormData) => {
       const title = formData.get('title') as string;
        run({title});
    
    }
    return <form action={onSubmit}>
        <div className=" flex flex-col space-y-2">
            <FormInput errors={fieldErrors} />
        </div>
        <FormButton />
    </form>
}