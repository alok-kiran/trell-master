'use client';

import { Draggable } from '@hello-pangea/dnd';
import { Card } from "@prisma/client";
import { X } from "lucide-react";

interface CardItemProps {
    card: Card;
    index: number;
}

export const CardItem = ({
    card,
    index,
}: CardItemProps) => {
    return (
        <Draggable draggableId={card.id} index={index}>
            {(provided) => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    role="button" className=" truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-sm">
                    {card.title}
                </div>
            )}

        </Draggable>
    )
};