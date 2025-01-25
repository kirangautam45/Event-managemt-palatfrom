import { UserRole } from '@prisma/client'

declare type SignUpType = {
  email: string
  password: string
  role: UserRole
}

declare type HearerProps = {
  user: {
    email: string
  }
}

declare type LoginType = {
  email: string
  password: string
}

declare type CreateEventType = {
  title?: string
  description?: string
  date: Date | string
  location: string
}

declare type EventUpdateType = {
  eventId: string
  title?: string
  description?: string
  date?: Date | string
  location?: string
}

export type EventFormValues = {
  id?: string // Optional for new events, required for updates
  title: string
  description: string
  date: string // ISO date string (e.g., '2024-08-23')
  location: string
}

export interface getFormValues {
  id: string
  createdAt: Date
  updatedAt: Date
  title: string
  description: string
  date: Date
  location: string
  userId: string
}

