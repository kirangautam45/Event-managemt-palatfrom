'use server'

import { prisma } from '@/lib/prisma'
import { CreateEventType, EventUpdateType } from '@/types'

import { UserRole } from '@prisma/client'
import { getCurrentUser } from './user.action'

// Create an event
export async function createEventAction(data: CreateEventType) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized: Please log in.')
  }

  const { title, description, date, location } = data

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
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized: Please log in.')
  }

  return prisma.event.findMany({
    where: user.role === UserRole.ADMIN ? {} : { userId: user.id },
    orderBy: { createdAt: 'desc' },
  })
}

// Update an event
export async function updateEventAction(data: EventUpdateType) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized: Please log in.')
  }

  const { eventId, title, description, date, location } = data

  const event = await prisma.event.findUnique({ where: { id: eventId } })
  if (!event) {
    throw new Error('Event not found.')
  }

  if (user.role !== UserRole.ADMIN && event.userId !== user.id) {
    throw new Error('Unauthorized to update this event.')
  }

  // Handle undefined date
  const updatedData = { title, description, location, date }
  if (date) {
    updatedData.date = new Date(date)
  }

  return prisma.event.update({
    where: { id: eventId },
    data: updatedData,
  })
}

// Delete an event
export async function deleteEventAction(eventId: string) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized: Please log in.')
  }

  const event = await prisma.event.findUnique({ where: { id: eventId } })
  if (!event) {
    throw new Error('Event not found.')
  }

  if (user.role !== UserRole.ADMIN && event.userId !== user.id) {
    throw new Error('Unauthorized to delete this event.')
  }

  return prisma.event.delete({ where: { id: eventId } })
}
