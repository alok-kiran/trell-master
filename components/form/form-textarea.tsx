'use client';

import { KeyboardEventHandler, forwardRef } from "react";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { FormErrors } from "./form-errors";
import { useFormStatus } from "react-dom";

interface FormTextareaProps {
    id: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    errors?: Record<string, string[] | undefined> | undefined;
    className?: string;
    onBlur?: () => void;
    onClick?: () => void;
    onKeyDown: KeyboardEventHandler<HTMLTextAreaElement> | undefined;
    defaultValue?: string;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(({
    id,
    label,
    placeholder,
    required,
    disabled,
    errors,
    className,
    onBlur,
    onClick,
    onKeyDown,
    defaultValue,
}, ref) => {
    const { pending } = useFormStatus();
    return (
        <div className=" space-y-2 w-full">
           <div className=" space-y-1 w-full">
                {
                    label && (
                        <label htmlFor={id} className=" text-sm font-semibold text-neutral-700">
                            {label}
                        </label>
                    )
                }
                <Textarea 
                    ref={ref}
                    id={id}
                    name={id}
                    placeholder={placeholder}
                    required={required}
                    disabled={pending || disabled}
                    className={cn("resize-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm", className)}
                    onBlur={onBlur}
                    onClick={onClick}
                    onKeyDown={onKeyDown}
                    defaultValue={defaultValue}
                    aria-describedby={`${id}-error`}
                />
           </div>
           <FormErrors id={id} errors={errors || {}} />
        </div>
    );
});


FormTextarea.displayName = 'FormTextarea';