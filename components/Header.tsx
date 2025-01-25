import React from 'react'
import { HearerProps } from '@/types'

function getNameFromEmail(email: string): string {
  const username = email.split('@')[0]
  return username.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
}

const Header = () => {
  // const userName = getNameFromEmail(user.email)

  return (
    <header className='justify-between mt-20 py-6 cursor-pointer p-6 flex items-center flex-col'>
      <div>
        <h1 className='text-2xl font-semibold text-gray-800'>
          Welcome to the Event Management Platform
        </h1>
        <p className='text-xl font-bold text-gray-700 mt-2'>
          Logged in as <span className='text-blue-600'>help</span> with role{' '}
          <span className='text-blue-600'>Admin</span>
        </p>
      </div>
    </header>
  )
}

export default Header
