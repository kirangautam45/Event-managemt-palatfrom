import React from 'react'

const Header = () => {
  // const userName = getNameFromEmail(user.email)

  return (
    <header className='justify-between mt-20 py-6 cursor-pointer p-6 flex items-center flex-col'>
      <div>
        <h1 className='text-2xl font-semibold text-gray-800'>
          Welcome to the Event Management Platform
        </h1>
      </div>
    </header>
  )
}

export default Header
