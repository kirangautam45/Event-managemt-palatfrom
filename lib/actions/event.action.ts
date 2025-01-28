//

'use server'

import { prisma } from '@/lib/prisma'
import { CreateEventType, EventUpdateType } from '@/types'
import { UserRole } from '@prisma/client'
import { getCurrentUser } from './user.action'

// Helper function to check user authorization
async function authorizeUser() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized: Please log in.')
  }
  return user
}

// Create an event
export async function createEventAction(data: CreateEventType) {
  const user = await authorizeUser()

  const { title = '', description = '', date, location } = data

  return prisma.event.create({
    data: {
      title,
      description,
      date: new Date(date),
      location,
      userId: user.id,
    },
  })
}

// Fetch events
export async function getEventsAction() {
  const user = await authorizeUser()

  const filter = user.role === UserRole.ADMIN ? {} : { userId: user.id }

  return prisma.event.findMany({
    where: filter,
    orderBy: { createdAt: 'desc' },
  })
}

// Update an event
export async function updateEventAction(data: EventUpdateType) {
  const user = await authorizeUser()
  const { eventId, title, description, date, location } = data

  const event = await prisma.event.findUnique({ where: { id: eventId } })
  if (!event) {
    throw new Error('Event not found.')
  }

  if (user.role !== UserRole.ADMIN && event.userId !== user.id) {
    throw new Error('Unauthorized to update this event.')
  }

  const updatedData = {
    ...(title && { title }),
    ...(description && { description }),
    ...(location && { location }),
    ...(date && { date: new Date(date) }),
  }

  return prisma.event.update({
    where: { id: eventId },
    data: updatedData,
  })
}

// Delete an event
export async function deleteEventAction(eventId: string) {
  const user = await authorizeUser()

  const event = await prisma.event.findUnique({ where: { id: eventId } })
  if (!event) {
    throw new Error('Event not found.')
  }

  if (user.role !== UserRole.ADMIN && event.userId !== user.id) {
    throw new Error('Unauthorized to delete this event.')
  }

  return prisma.event.delete({ where: { id: eventId } })
}
