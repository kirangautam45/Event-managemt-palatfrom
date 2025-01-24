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

interface EventCardProps {
  event: EventFormValues
  onEdit: (event: EventFormValues) => void
  onDelete: (id: string) => void
}

const EventCard: React.FC<EventCardProps> = ({ event, onEdit, onDelete }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{event.description}</p>
        <p>{new Date(event.date).toLocaleDateString()}</p>
        <p>{event.location}</p>
      </CardContent>
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
