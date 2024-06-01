'use client'
import {  useEffect, useState } from 'react';
import { unsplash } from "@/lib/unsplash";
import { Check, Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { defaultImages } from '@/constants/images';
import Link from 'next/link';
import { FormErrors } from './form-errors';

interface FormPickerProps {
    id: string;
    errors: Record<string, string[] | undefined>;
}

export const FormPicker: React.FC<FormPickerProps> = ({ id, errors }) => {
    const { pending } = useFormStatus();
    const [images, setImages] = useState<Array<Record<string, any>>>(defaultImages);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

    useEffect(() => {
        const fetchImages =  async () => {
            setLoading(true);
            try {
                const result = await unsplash.photos.getRandom({ collectionIds: ["317099"], count: 10 });
                if(result?.response){
                    const newImages = result.response as Array<Record<string, any>>;
                    setImages(newImages);
                }else{
                    console.log('Error fetching images');
                    setImages([]);
                }
            } catch (error) {
                console.log('Error fetching images');
                setImages(defaultImages);
            }finally{
                setLoading(false);
            }
        };
        //fetchImages();
    }, []);

    if(loading){
        return <div className=' p-6 flex items-center justify-center'>
            <Loader2 className=' h-6 w-6 text-sky-700 animate-spin'/>
        </div>
    }
    return (
        <div className=' relative'>
           <div className=' grid grid-cols-3 gap-2 mb-2'>
            {
                images?.map((image, index) => {
                    return (
                        <div key={image.id} className={cn(
                            'cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted',
                            pending && 'opacity-50 hover:opacity-50 cursor-auto'
                        )}
                        onClick={() => {
                            if(pending) return;
                            setSelectedImageId(image.id);
                        }}
                        >
                            <input 
                                type='radio'
                                id={id}
                                name={id}
                                value={`${image.id}|${image.urls.thumb}|${image.urls.full}|${image.urls.html}|${image.user.name}`}
                                className=' hidden '
                                checked={selectedImageId === image.id}
                                disabled={pending}
                            />
                            <Image 
                                alt='Unsplash image'
                                src={image.urls.thumb}
                                className=' object-cover rounded-sm'
                                fill
                            />
                                                       {
                                selectedImageId === image.id && (
                                    <div className=' absolute inset-y-0 h-full w-full bg-black/30 flex items-center justify-center'>
                                        <Check className=' h-4 w-4 text-white'/>
                                    </div>
                                )
                            }
                        <Link
                            href={image.links.html}
                            target='_blank'
                            className=' opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50'
                        >
                            {image.user.name}
                        </Link>
                        </div>
                    )
                } )
            }
           </div>
           <FormErrors 
                id={id}
                errors={errors}
           />
        </div>
    );
} 