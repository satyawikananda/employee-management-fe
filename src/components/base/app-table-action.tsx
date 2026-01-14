"use client"

import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash } from 'lucide-react';

const AppTableActions = ({
  onEdit,
  onDelete,
  onDetail
}: {
  onEdit?: () => void;
  onDelete: () => void;
  onDetail?: () => void;
}) => {
  return (
    <div className='flex flex-row space-x-1'>
      <Button
        variant='outline'
        size='icon'
        className='text-red-500 z-40'
        onClick={onDelete}
      >
        <Trash className='w-4 h-4' />
      </Button>
      {onEdit && (
        <Button
          variant='outline'
          size='icon'
          className='text-blue-500 z-40'
          onClick={onEdit}
        >
          <Pencil className='w-4 h-4' />
        </Button>
      )}
      {onDetail && (
        <Button
          variant='outline'
          size='icon'
          className='text-green-500 z-40'
          onClick={onDetail}
        >
          <Eye className='w-4 h-4' />
        </Button>
      )}
    </div>
  );
};

export default AppTableActions;
