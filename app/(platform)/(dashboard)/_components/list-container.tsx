'use client';

import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { ListWithCards } from "@/types";
import { ListForm } from "./list-form";
import { useEffect, useState } from "react";
import ListItem from "./list-Item";
import { useAction } from '@/hooks/use-action';
import { updateListOrder } from '@/actions/update-list-order';
import { toast } from 'sonner';
import { updateCardOrder } from '@/actions/update-card-order';

interface ListContainerProps {
    data: ListWithCards[];
    boardId: string;
}

export const ListContainer = ({
    data,
    boardId,
}: ListContainerProps) => {
    const [orderedList, setOrderedList] = useState<ListWithCards[]>(data);
    const { run: executeUpdateListOrder } = useAction(updateListOrder, {
        onSuccess: () => {
           toast.success('List order updated');
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const { run: executeUpdateCardOrder } = useAction(updateCardOrder, {
        onSuccess: () => {
           toast.success('Card order updated');
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    useEffect(() => {
        setOrderedList(data);
    }, [data]);

    function reorder<T>(list: T[], startIndex: number, endIndex: number){
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    }

    const onDragEnd = (result: any) => {
        const { source, destination, type } = result;
        if (!destination) {
            return;
        }

        if(destination.droppableId === source.droppableId && destination.index === source.index){
            return;
        }

        if (type === 'list') {
            const newListOrder = reorder(orderedList, source.index, destination.index).map((list, index) => ({
                ...list,
                order: index,
            }));
            setOrderedList(newListOrder);
            executeUpdateListOrder({
                boardId,
                items: newListOrder.map((list) => ({
                    id: list.id,
                    title: list.title,
                    order: list.order,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })),
            })
        }

        if (type === "card") {
            let newOrderedData = [...orderedList];
      
            const sourceList = newOrderedData.find(list => list.id === source.droppableId);
            const destList = newOrderedData.find(list => list.id === destination.droppableId);
      
            if (!sourceList || !destList) {
              return;
            }
      
            if (!sourceList.cards) {
              sourceList.cards = [];
            }
      
            if (!destList.cards) {
              destList.cards = [];
            }
      
            if (source.droppableId === destination.droppableId) {
              const reorderedCards = reorder(
                sourceList.cards,
                source.index,
                destination.index,
              );
      
              reorderedCards.forEach((card, idx) => {
                card.order = idx;
              });
      
              sourceList.cards = reorderedCards;
      
              setOrderedList(newOrderedData);
              executeUpdateCardOrder({
                boardId: boardId,
                items: reorderedCards,
              });
            } else {
              const [movedCard] = sourceList.cards.splice(source.index, 1);
      
              movedCard.listId = destination.droppableId;
      
              destList.cards.splice(destination.index, 0, movedCard);
      
              sourceList.cards.forEach((card, idx) => {
                card.order = idx;
              });
      
              destList.cards.forEach((card, idx) => {
                card.order = idx;
              });
      
              setOrderedList(newOrderedData);
              executeUpdateCardOrder({
                boardId: boardId,
                items: destList.cards,
              });
            }
          }

    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
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