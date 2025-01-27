import { getCurrentUser } from '@/lib/actions/user.action'
import React from 'react'

function getNameFromEmail(email: string): string {
  const username = email.split('@')[0]
  return username.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
}

const Header = async () => {
  const user = await getCurrentUser()
  const userName = user?.email ? getNameFromEmail(user.email) : 'Guest'
  const userRole = user?.role || 'N/A'

  return (
    <header className='flex flex-col items-center justify-center  p-6  mt-10 w-full'>
      <h1 className='text-2xl font-semibold text-gray-800 '>
        Welcome to the Event Management Platform
      </h1>
      <p className='text-xl font-bold text-gray-700 mt-2'>
        Logged in as <span className='text-blue-600'>{userName}</span> with role{' '}
        <span className='text-blue-600'>{userRole}</span>
      </p>
    </header>
  )
}

export default Header
