'use client'

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
    PopoverClose,
} from '@/components/ui/popover'

import { X } from 'lucide-react'

import { useAction } from '@/hooks/use-action'
import { createBoard } from '@/actions/create-dashboard'

import { FormInput } from './form-input'
import { FormSubmit } from './form-submit'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { FormPicker } from './form-picker'
import { ElementRef, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface FormPopoverProps {
    children: React.ReactNode;
    side?: 'left' | 'right' | 'top' | 'bottom';
    align?: 'start' | 'center' | 'end';
    sideOffset?: number;
}

export const FormPopover = ({
    children,
    side='bottom',
    align='start',
    sideOffset = 0,
}: FormPopoverProps) => {
    const closeRef = useRef<ElementRef<'button'>>(null)
    const router = useRouter()

    const { run, fieldErrors } = useAction(createBoard, {
        onSuccess: (data) => {
            toast.success('Board created successfully')
            closeRef.current?.click();
            router.push(`/board/${data.id}`);
        },
        onError: (error) => {
            console.log('Error creating board')
            toast.error(error)
        }
    
    })

    const onSubmit = (formData: FormData) => { 
        const title = formData.get('title') as string;
        const image = formData.get('image') as string;
        run({ title, image })
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent side={side} align={align} sideOffset={sideOffset} className=' w-80 pt-3'>
                <div className=' text-sm font-medium text-center text-neutral-600 pb-4'>
                    Create new board
                </div>
                <PopoverClose asChild ref={closeRef}>
                    <Button className=' h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600' variant='ghost'>
                        <X className=' h-4 w-4'/>
                    </Button>
                </PopoverClose>
                <form className=' space-y-4' action={onSubmit}>
                    <div className=' space-y-4'>
                        <FormPicker 
                            id='image'
                            errors={fieldErrors}
                        />
                        <FormInput 
                            label='Board Name'
                            id='title'
                            type='text'
                            errors={fieldErrors}
                        />
                    </div>
                    <FormSubmit className='w-full'>
                        Create Board
                    </FormSubmit>
                </form>
            </PopoverContent>
        </Popover>
    )
}