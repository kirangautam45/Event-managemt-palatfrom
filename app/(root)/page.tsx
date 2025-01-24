'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  createEventAction,
  deleteEventAction,
  getEventsAction,
  updateEventAction,
} from '@/lib/actions/event.action'

// Zod schema for event validation
const eventSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date'),
  location: z.string().min(3, 'Location must be at least 3 characters'),
})

type EventFormValues = z.infer<typeof eventSchema>

const EventManager = () => {
  const [events, setEvents] = useState<EventFormValues[]>([])

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      id: '',
      title: '',
      description: '',
      date: '',
      location: '',
    },
  })

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

  const onSubmit = async (data: EventFormValues) => {
    try {
      const eventData = {
        title: data.title,
        description: data.description,
        date: data.date,
        location: data.location,
      }

      const updatedEvent = data.id
        ? await updateEventAction({ eventId: data.id, ...eventData })
        : await createEventAction(eventData)

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

      reset()
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

  const handleEdit = (event: EventFormValues) => {
    reset(event)
  }

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Event Manager</h1>

      <Card className='mb-6'>
        <CardHeader>
          <CardTitle>{errors.id ? 'Update Event' : 'Create Event'}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className='space-y-4'>
            {['title', 'description', 'date', 'location'].map((field) => (
              <div key={field}>
                <Controller
                  name={field as keyof EventFormValues}
                  control={control}
                  render={({ field: inputField }) =>
                    field === 'description' ? (
                      <Textarea
                        {...inputField}
                        placeholder={
                          field.charAt(0).toUpperCase() + field.slice(1)
                        }
                        className={
                          errors[field as keyof EventFormValues]
                            ? 'border-red-500'
                            : ''
                        }
                      />
                    ) : (
                      <Input
                        {...inputField}
                        type={field === 'date' ? 'date' : 'text'}
                        placeholder={
                          field.charAt(0).toUpperCase() + field.slice(1)
                        }
                        className={
                          errors[field as keyof EventFormValues]
                            ? 'border-red-500'
                            : ''
                        }
                      />
                    )
                  }
                />
                {errors[field as keyof EventFormValues] && (
                  <p className='text-red-500 text-sm'>
                    {errors[field as keyof EventFormValues]?.message}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button type='submit'>
              {errors.id ? 'Update Event' : 'Create Event'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <CardTitle>{event.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{event.description}</p>
              <p>{new Date(event.date).toLocaleDateString()}</p>
              <p>{event.location}</p>
            </CardContent>
            <CardFooter className='space-x-2'>
              <Button variant='secondary' onClick={() => handleEdit(event)}>
                Edit
              </Button>
              <Button
                variant='destructive'
                onClick={() => handleDelete(event.id!)}
              >
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default EventManager
