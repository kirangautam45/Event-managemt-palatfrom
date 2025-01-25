// 'use client'

// import { useState, useEffect } from 'react'
// import EventForm from '@/components/EventForm'
// import EventList from '@/components/EventList'
// import { getEventsAction, deleteEventAction } from '@/lib/actions/event.action'
// import { EventFormValues, getFormValues } from '@/types'

// const HomePage = () => {
//   const [events, setEvents] = useState<EventFormValues[]>([])
//   const [editingEvent, setEditingEvent] = useState<EventFormValues | null>(null)

//   useEffect(() => {
//     async function fetchEvents() {
//       try {
//         const fetchedEvents = await getEventsAction()
//         setEvents(fetchedEvents)
//       } catch (error) {
//         console.error('Error fetching events:', error)
//       }
//     }
//     fetchEvents()
//   }, [])

//   const handleDelete = async (id: string) => {
//     try {
//       await deleteEventAction(id)
//       setEvents((prev) => prev.filter((event) => event.id !== id))
//     } catch (error) {
//       console.error('Error deleting event:', error)
//     }
//   }

//   const handleEdit = (event: EventFormValues) => {
//     setEditingEvent(event)
//   }

//   const handleFormSubmit = (updatedEvent: EventFormValues) => {
//     setEvents((prev) =>
//       updatedEvent.id
//         ? prev.map((event) =>
//             event.id === updatedEvent.id ? updatedEvent : event
//           )
//         : [updatedEvent, ...prev]
//     )
//     setEditingEvent(null)
//   }

//   return (
//     <div className='p-6 flex items-center flex-col'>
//       <h1 className='text-2xl font-bold mb-4'>Event Manager</h1>
//       <EventForm
//         initialValues={editingEvent || undefined}
//         onSubmit={handleFormSubmit}
//       />
//       <EventList events={events} onEdit={handleEdit} onDelete={handleDelete} />
//     </div>
//   )
// }

// export default HomePage

import EventManager from '@/components/EventManager'
import React from 'react'

const Home = () => {
  return <EventManager />
}

export default Home
