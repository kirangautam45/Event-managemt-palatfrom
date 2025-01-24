import Header from '@/components/Header'
import Provider from '@/components/Provider'
import { getCurrentUser } from '@/lib/actions/user.action'
import { authOptions } from '@/lib/auth'
import { UserRole } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { getSession } from 'next-auth/react'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const sessions = await getSession()
  console.log('Session:', sessions)
  const session = await getServerSession(authOptions)
  const loggedIn = await getCurrentUser()

  console.log(loggedIn, 'loggedIn')
  console.log(session, 'session')

  const user = {
    email: loggedIn?.email ?? '',

    role: loggedIn?.role ?? UserRole.USER,
  }

    if (!loggedIn) redirect('/login')

  return (
    <main className='flex h-screen w-full font-inter'>
      <Provider session={session}>
        <div className='flex size-full flex-col'>
          <div className='root-layout'>
            <div>
              <Header user={user} />
            </div>
          </div>
          {children}
        </div>
      </Provider>
    </main>
  )
}
