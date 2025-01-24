'use client'

import { EventFormValues } from '@/lib/actions/event.action'
import EventCard from './EventCard'

interface EventListProps {
  events: EventFormValues[]
  onEdit: (event: EventFormValues) => void
  onDelete: (id: string) => void
}

const EventList: React.FC<EventListProps> = ({ events, onEdit, onDelete }) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

export default EventList
