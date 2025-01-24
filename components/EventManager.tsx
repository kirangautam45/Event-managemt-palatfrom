'use client'

import { useState, useEffect } from 'react'
import {
  EventFormValues,
  getEventsAction,
  createEventAction,
  updateEventAction,
  deleteEventAction,
} from '@/lib/actions/event.action'
import EventForm from './EventForm'
import EventList from './EventList'

const EventManager = () => {
  const [events, setEvents] = useState<EventFormValues[]>([])
  const [editingEvent, setEditingEvent] = useState<EventFormValues | null>(null)

  useEffect(() => {
    async function fetchEvents() {
      try {
        const fetchedEvents = await getEventsAction()
        setEvents(
          fetchedEvents.map((event) => ({
            ...event,
            date: event.date.toISOString().split('T')[0],
          }))
        )
      } catch (error) {
        console.error('Error fetching events:', error)
      }
    }
    fetchEvents()
  }, [])

  const handleCreateOrUpdate = async (data: EventFormValues) => {
    try {
      const updatedEvent = data.id
        ? await updateEventAction({ eventId: data.id, ...data })
        : await createEventAction(data)

      setEvents((prev) =>
        data.id
          ? prev.map((event) =>
              event.id === updatedEvent.id
                ? {
                    ...updatedEvent,
                    date: updatedEvent.date.toISOString().split('T')[0],
                  }
                : event
            )
          : [
              {
                ...updatedEvent,
                date: updatedEvent.date.toISOString().split('T')[0],
              },
              ...prev,
            ]
      )
      setEditingEvent(null)
    } catch (error) {
      console.error('Error creating/updating event:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteEventAction(id)
      setEvents((prev) => prev.filter((event) => event.id !== id))
    } catch (error) {
      console.error('Error deleting event:', error)
    }
  }

  return (
    <div className='p-6 flex items-center flex-col'>
      <h1 className='text-2xl font-bold mb-4'>Event Manager</h1>
      <EventForm onSubmit={handleCreateOrUpdate} editingEvent={editingEvent} />
      <EventList
        events={events}
        onEdit={setEditingEvent}
        onDelete={handleDelete}
      />
    </div>
  )
}

export default EventManager
