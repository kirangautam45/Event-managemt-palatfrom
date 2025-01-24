'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
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
import { EventFormValues } from '@/types'

const eventSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date'),
  location: z.string().min(3, 'Location must be at least 3 characters'),
})

interface EventFormProps {
  onSubmit: (data: EventFormValues) => void
  editingEvent?: EventFormValues | null
}

const EventForm: React.FC<EventFormProps> = ({ onSubmit, editingEvent }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: editingEvent || {
      id: '',
      title: '',
      description: '',
      date: '',
      location: '',
    },
  })

  return (
    <Card className='mb-6 w-6/12'>
      <CardHeader>
        <CardTitle>{editingEvent ? 'Update Event' : 'Create Event'}</CardTitle>
      </CardHeader>
      <form
        onSubmit={handleSubmit((data) => {
          onSubmit(data)
          reset()
        })}
      >
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
                      placeholder={field}
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
                      placeholder={field}
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
          <Button
            type='submit'
            className='text-16 rounded-lg border  font-semibold text-white bg-blue-500 '
          >
            {editingEvent ? 'Update Event' : 'Create Event'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default EventForm
