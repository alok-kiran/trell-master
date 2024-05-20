import { createBoard } from '@/actions/create-board';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/db';
import React from 'react'
import Board from './board';
import { Form } from './form';

async function OrganizationPage() {

  const boards = await db.board.findMany();

  return (
    <div className=' flex flex-col space-y-4'>
      <Form />
     <div className='space-y-2'>
        {boards.map(board => (
        <Board key={board.id} title={board.title} id={board.id} />
        ))}
     </div>
    </div>
  )
}

export default OrganizationPage
