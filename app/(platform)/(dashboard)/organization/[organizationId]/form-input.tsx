'use client'
import { Input } from "@/components/ui/input";
import { useFormStatus } from "react-dom";

interface FormInputProps {
    errors: {
        title?: string[];
    }
}

export const FormInput = ({ errors }: FormInputProps) => {
    const { pending } = useFormStatus();
    return (
        <div>
            <Input
                id="title"
                name="title"
                required
                placeholder='Enter a board title'
                disabled={pending}
            />
            {errors?.title && (
                <div >
                    {errors?.title.map((error: string) => (
                        <p className='text-red-500' key={error}>{error}</p>
                    ))}
                </div>
            )}
        </div>
    )
}   