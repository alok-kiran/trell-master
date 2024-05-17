import { createBoard } from '@/actions/create-board';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/db';
import React from 'react'

async function OrganizationPage() {

  const boards = await db.board.findMany();

  return (
    <div>
     <form action={createBoard}>
      <input 
        id="title"
        name="title"
        required
        placeholder='Enter a board title'
        className='border-black border p-1'
      />
      <Button type='submit'>
        Create Board
      </Button>
     </form>
     <div className=' space-y-2'>
        {boards.map(board => (
          <div key={board.id}>
            {board.title}
          </div>
        ))}
     </div>
    </div>
  )
}

export default OrganizationPage
