import Header from '@/components/Header'
import { authOptions } from '@/lib/auth'
import { useSession } from 'next-auth/react'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = getServerSession(authOptions)

  console.log('Client-side session:', session)

  // If there's no session, redirect the user to login
  if (!session) {
    redirect('/login')
  }

  console.log(session, 'session')
  // Get the user info from the session
  // const user = {
  //   email: session.user?.email ?? '', // Ensure that email exists
  //   // Use role from session or default to USER
  // }

  // console.log(user, 'layout user')

  return (
    <main className='flex h-screen w-full font-inter'>
      <div className='flex size-full flex-col'>
        <div className='root-layout'>
          <div>
            <Header />
          </div>
        </div>
        {children}
      </div>
    </main>
  )
}
