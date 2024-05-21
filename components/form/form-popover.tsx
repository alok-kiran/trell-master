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
    const { run, fieldErrors } = useAction(createBoard, {
        onSuccess: () => {
            toast.success('Board created successfully')
        },
        onError: (error) => {
            console.log('Error creating board')
            toast.error(error)
        }
    
    })

    const onSubmit = (formData: FormData) => { 
        const title = formData.get('title') as string;
        run({ title })
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
                <PopoverClose asChild>
                    <Button className=' h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600' variant='ghost'>
                        <X className=' h-4 w-4'/>
                    </Button>
                </PopoverClose>
                <form className=' space-y-4' action={onSubmit}>
                    <div className=' space-y-4'>
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