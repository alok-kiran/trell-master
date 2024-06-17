'use client';

import { ListWithCards } from "@/types";
import { List } from "@prisma/client";
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
       <ol className=" flex gap-x-3 h-full">
            {orderedList?.map((list: ListWithCards, index: number) => (
                <ListItem
                    key={list.id}
                    list={list}
                    index={index}
                />
            ))}
            <ListForm />
            <div className=" flex-shrink-0 w-1">
            </div>
       </ol>
    )
};