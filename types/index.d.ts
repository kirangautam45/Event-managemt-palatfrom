import { UserRole } from '@prisma/client'

declare type SignUpType = {
  email: string
  password: string
  role: UserRole
}

declare type HearerProps = {
  user: {
    email: string
    role: UserRole
  }
}

declare type LoginType = {
  email: string
  password: string
}

declare type CreateEventType = {
  title: string
  description: string
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
