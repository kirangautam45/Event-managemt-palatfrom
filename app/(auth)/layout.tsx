import eventManger from '@/assets/EventManagement.png'

import Image from 'next/image'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className='flex flex-col lg:flex-row items-center w-full justify-between'>
      <div className='w-full lg:w-[50%] px-10'>{children}</div>
      <div className='w-full lg:w-[50%]'>
        <Image
          src={eventManger}
          loading='lazy'
          className='rounded-l-xl object-contain'
          alt='Auth image'
        />
      </div>
    </main>
  )
}
