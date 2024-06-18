'use client';

import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { ListWithCards } from "@/types";
import { ListForm } from "./list-form";
import { useEffect, useState } from "react";
import ListItem from "./list-Item";

interface ListContainerProps {
    data: ListWithCards[];
    boardId: string;
}

export const ListContainer = ({
    data,
    boardId,
}: ListContainerProps) => {
    const [orderedList, setOrderedList] = useState<ListWithCards[]>(data);

    useEffect(() => {
        setOrderedList(data);
    }, [data]);

    return (
        <DragDropContext onDragEnd={() => {}}>
            <Droppable droppableId='lists' type='list' direction='horizontal'>
                {(provided) => (
                                  <ol className=" flex gap-x-3 h-full" {...provided.droppableProps} ref={provided.innerRef}>
                                  {orderedList?.map((list: ListWithCards, index: number) => (
                                      <ListItem
                                          key={list.id}
                                          list={list}
                                          index={index}
                                      />
                                  ))}
                                  {provided.placeholder}
                                  <ListForm />
                                  <div className=" flex-shrink-0 w-1">
                                  </div>
                              </ol>
                )}
  
            </Droppable>

        </DragDropContext>
    )
};