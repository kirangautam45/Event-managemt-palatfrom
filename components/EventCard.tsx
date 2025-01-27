'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { EventFormValues } from '@/types'
import { Calendar as CalendarIcon, MapPin as MapPinIcon } from 'lucide-react'

interface EventCardProps {
  event: EventFormValues
  onEdit: (event: EventFormValues) => void
  onDelete: (id: string) => void
}

const EventCard: React.FC<EventCardProps> = ({ event, onEdit, onDelete }) => {
  return (
    <Card>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-2xl font-bold'>{event.title}</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <p className='text-sm text-gray-500'>Description</p>
          <p className='text-base'>{event.description}</p>
        </div>

        <div className='flex items-center space-x-2'>
          <CalendarIcon className='h-5 w-5 text-gray-400' />
          <p className='text-base'>
            {new Date(event.date).toLocaleDateString()}
          </p>
        </div>

        <div className='flex items-center space-x-2'>
          <MapPinIcon className='h-5 w-5 text-gray-400' />
          <p className='text-base'>{event.location}</p>
        </div>
      </CardContent>{' '}
      <CardFooter className='space-x-2'>
        <Button
          variant='secondary'
          onClick={() => onEdit(event)}
          className='text-16 rounded-lg border  font-semibold text-white bg-blue-500 '
        >
          Edit
        </Button>
        <Button
          variant='destructive'
          onClick={() => onDelete(event.id!)}
          className='text-16 rounded-lg border  font-semibold text-white bg-red-500 '
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}

export default EventCard
