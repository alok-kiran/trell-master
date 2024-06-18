'use client'

import { ListWithCards } from "@/types";
import ListHeader from "./list-header";
import { ElementRef, useRef, useState } from "react";
import { CardForm } from "./card-from";
import { cn } from "@/lib/utils";
import { CardItem } from "./card-item";

interface ListItemProps {
    list: ListWithCards;
    index: number;
}

const ListItem = ({
    list,
    index,
}: ListItemProps) => {
    const textAreaRef = useRef<ElementRef<'textarea'>>(null);
    const [isEditing, setIsEditing] = useState(false);

    const disableEditing = () => {
        setIsEditing(false);
    };

    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            textAreaRef.current?.focus();
        }, 0);
    };

    return (
        <li className=" shrink-0 h-full w-[272px] select-none">
            <div className=" w-full rounded-md bg-[#f1f2f4] shadow-md pb-2">
                <ListHeader 
                    data={list}
                    onAddCard={enableEditing}
                />
                <ol className={cn(" mx-1 px-1 py-0.5 flex flex-col gap-y-2", 
                    list?.cards.length === 0 ? "mt-2" : "mt-0"
                )}>
                    {
                        list?.cards?.map((card, index) => (
                            <CardItem key={card.id} card={card} index={index}/>
                        ))
                    }
                </ol>
                <CardForm
                    ref={textAreaRef}
                    isEditing={isEditing}
                    enableEditing={enableEditing}
                    disableEditing={disableEditing}
                    listId={list.id}
                />
            </div>
        </li>
    )
}

export default ListItem;