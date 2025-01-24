import Header from '@/components/Header'
import { getCurrentUser } from '@/lib/actions/user.action'
import { UserRole } from '@prisma/client'
import { redirect } from 'next/navigation'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const loggedIn = await getCurrentUser()

  console.log(loggedIn, 'loggedIn')

  const user = {
    email: loggedIn?.email ?? '',

    role: loggedIn?.role ?? UserRole.USER,
  }

  if (!loggedIn) redirect('/login')

  return (
    <main className='flex h-screen w-full font-inter'>
      <div className='flex size-full flex-col'>
        <div className='root-layout'>
          <div>
            <Header user={user} />
          </div>
        </div>
        {children}
      </div>
    </main>
  )
}
